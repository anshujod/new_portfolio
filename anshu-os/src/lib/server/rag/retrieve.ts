import index from './chunks.json';

export interface Chunk {
	source: string;
	text: string;
	vector?: number[];
}

interface RagIndex {
	mode: 'vector' | 'lexical';
	chunks: Chunk[];
}

const rag = index as RagIndex;

// --- BM25 (lexical fallback — also the dev-mode path, no embeddings needed) ---

const K1 = 1.5;
const B = 0.75;

const tokenize = (s: string) => s.toLowerCase().match(/[a-z0-9+#]+/g) ?? [];

interface Bm25State {
	docs: { tf: Map<string, number>; len: number }[];
	df: Map<string, number>;
	avgdl: number;
}

let bm25: Bm25State | null = null;

function buildBm25(): Bm25State {
	const docs = rag.chunks.map((c) => {
		const tokens = tokenize(`${c.source} ${c.text}`);
		const tf = new Map<string, number>();
		for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
		return { tf, len: tokens.length };
	});
	const df = new Map<string, number>();
	for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
	const avgdl = docs.reduce((s, d) => s + d.len, 0) / docs.length;
	return { docs, df, avgdl };
}

function bm25Scores(query: string): number[] {
	bm25 ??= buildBm25();
	const { docs, df, avgdl } = bm25;
	const n = docs.length;
	const scores = new Array<number>(n).fill(0);
	for (const term of new Set(tokenize(query))) {
		const docFreq = df.get(term);
		if (!docFreq) continue;
		const idf = Math.log(1 + (n - docFreq + 0.5) / (docFreq + 0.5));
		for (let i = 0; i < n; i++) {
			const tf = docs[i].tf.get(term) ?? 0;
			if (!tf) continue;
			scores[i] += (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * docs[i].len) / avgdl));
		}
	}
	return scores;
}

// --- cosine (vector mode, query embedded by the caller via Workers AI) ---

function cosineScores(queryVector: number[]): number[] {
	return rag.chunks.map((c) => {
		if (!c.vector) return 0;
		let dot = 0,
			a = 0,
			b = 0;
		for (let i = 0; i < queryVector.length; i++) {
			dot += queryVector[i] * c.vector[i];
			a += queryVector[i] ** 2;
			b += c.vector[i] ** 2;
		}
		return dot / (Math.sqrt(a) * Math.sqrt(b) || 1);
	});
}

export const indexMode = rag.mode;

/**
 * Top-k chunks for a query. Pass `queryVector` (from bge-base-en-v1.5) when the
 * index is vector mode and an AI binding is available; otherwise BM25 is used.
 */
export function retrieve(query: string, queryVector?: number[], k = 6): Chunk[] {
	const scores =
		rag.mode === 'vector' && queryVector ? cosineScores(queryVector) : bm25Scores(query);
	return scores
		.map((score, i) => ({ score, i }))
		.sort((a, b) => b.score - a.score)
		.slice(0, k)
		.filter((s) => s.score > 0)
		.map((s) => rag.chunks[s.i]);
}

const STOP = new Set(
	'a an the is are was were be been am being of to in on for and or but with as at by from this that these those it its he she his her him they them you your our do does did can could would should will what which who whom when where why how about into over under out up off so just also more most any all me my his'.split(
		' '
	)
);

/**
 * No-LLM fallback answer: pull the most query-relevant sentences from the top
 * chunks (idf-weighted) so the reply stays on point instead of dumping whole
 * chunks. Broad "list everything / tech stack" questions return the full top chunk.
 */
export function conciseAnswer(query: string, chunks: Chunk[]): string {
	if (!chunks.length)
		return "I couldn't find that in what's indexed about Anshu — try asking about his tech stack, his projects, or his experience.";

	// enumeration intent → a whole chunk is the right level of detail
	if (
		/\b(all|every|everything|full|list|stacks?|tech|technolog\w*|skills?|frameworks?|languages?|tools?)\b/i.test(
			query
		)
	)
		return chunks[0].text;

	const state = (bm25 ??= buildBm25());
	const n = state.docs.length;
	const idf = (t: string) => {
		const dfc = state.df.get(t) ?? 0;
		return Math.log(1 + (n - dfc + 0.5) / (dfc + 0.5));
	};
	const qterms = [...new Set(tokenize(query))].filter((t) => t.length > 1 && !STOP.has(t));

	const scored: { s: string; score: number }[] = [];
	for (const c of chunks.slice(0, 3)) {
		for (const raw of c.text.split(/(?<=[.!?])\s+/)) {
			const s = raw.trim();
			if (s.length < 20) continue;
			const toks = new Set(tokenize(s));
			let score = 0;
			for (const t of qterms) if (toks.has(t)) score += idf(t);
			if (score > 0) scored.push({ s, score });
		}
	}
	scored.sort((a, b) => b.score - a.score);
	const picked = scored.slice(0, 2).map((x) => x.s);
	return picked.length
		? picked.join(' ')
		: chunks[0].text.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
}
