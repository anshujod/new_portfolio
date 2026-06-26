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

// document frequencies over chunk TEXT only (no source labels) — used by the
// fallback's idf so a word like "study" isn't diluted by every "case study:" label
let textDf: Map<string, number> | null = null;
function buildTextDf(): Map<string, number> {
	const m = new Map<string, number>();
	for (const c of rag.chunks) for (const t of new Set(tokenize(c.text))) m.set(t, (m.get(t) ?? 0) + 1);
	return m;
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
	'a an the is are was were be been am being of to in on for and or but with as at by from this that these those it its he she his her him they them you your our do does did can could would should will what which who whom when where why how about into over under out up off so just also more most any all me my his have has had having anshu anshus know knows get got make made want need there then than too very really actually like ever tell'.split(
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

	const sentencesOf = (text: string) =>
		text
			.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
			.map((s) => s.trim())
			.filter((s) => s.length >= 20);

	// tech-stack / skills questions → the canonical Skills chunk (the complete list),
	// which BM25 length-normalisation can otherwise rank below shorter chunks
	if (/\b(tech|technolog\w*|skills?|stacks?|frameworks?|languages?|tools?)\b/i.test(query)) {
		const skills = chunks.find((c) => /skills and tech stack/i.test(c.source));
		if (skills) return skills.text;
	}

	const tdf = (textDf ??= buildTextDf());
	const n = rag.chunks.length;
	const idf = (t: string) => {
		const dfc = tdf.get(t) ?? 0;
		return Math.log(1 + (n - dfc + 0.5) / (dfc + 0.5));
	};
	const qterms = [...new Set(tokenize(query))].filter((t) => t.length > 1 && !STOP.has(t));
	const sentenceScore = (s: string) => {
		const toks = new Set(tokenize(s));
		let v = 0;
		for (const t of qterms) if (toks.has(t)) v += idf(t);
		return v;
	};

	// answer from the single chunk with the strongest matching sentence, so the reply
	// stays coherent instead of stitching unrelated chunks together
	let best = { ci: 0, score: -1 };
	chunks.forEach((c, ci) => {
		for (const s of sentencesOf(c.text)) {
			const sc = sentenceScore(s);
			if (sc > best.score) best = { ci, score: sc };
		}
	});

	// below a relevance floor the match is only common/filler words — don't guess
	if (best.score < Math.log(5))
		return "I don't have anything on that. I can only answer questions about Anshu — his work, projects, skills, and background. Try asking about his tech stack, the World Cup engine, the Quiz App, or his experience.";

	// the 1–2 most query-relevant sentences from the best chunk, in original order
	const sents = sentencesOf(chunks[best.ci].text);
	return sents
		.map((s, idx) => ({ s, idx, v: sentenceScore(s) }))
		.filter((x) => x.v > 0)
		.sort((a, b) => b.v - a.v)
		.slice(0, 2)
		.sort((a, b) => a.idx - b.idx)
		.map((x) => x.s)
		.join(' ');
}
