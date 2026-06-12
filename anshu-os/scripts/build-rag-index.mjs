// Build the static RAG index: chunk content → (optionally) embed → chunks.json
//
// Two modes:
//  - vector:  if CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN are set, chunks are
//             embedded with Workers AI bge-base-en-v1.5 and retrieval is cosine.
//  - lexical: no credentials needed — runtime falls back to BM25 over the same
//             chunks. At this corpus size (<100 chunks) lexical retrieval holds up.
//
// Run: node scripts/build-rag-index.mjs   (wired into `npm run build`)

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/lib/server/rag/chunks.json');
const MAX_CHUNK_CHARS = 900; // ≈ 200–250 tokens

const sources = [
	{ dir: 'src/content/rag', kind: 'profile' },
	{ dir: 'src/content/work', kind: 'case study' },
	{ dir: 'src/content/log', kind: 'blog post' }
];

function clean(markdown) {
	return markdown
		.replace(/^---\n[\s\S]*?\n---\n/, '') // frontmatter
		.replace(/<!--[\s\S]*?-->/g, '') // html comments (incl. TODO notes — keep them out of the bot)
		.replace(/```[\s\S]*?```/g, '') // code blocks
		.replace(/\{@html[\s\S]*?\}/g, '')
		.replace(/[*_`>#]+/g, (m) => (m.startsWith('#') ? m : ''))
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // links → text
}

function titleOf(markdown, fallback) {
	const m = markdown.match(/^---\n[\s\S]*?title:\s*["']?(.+?)["']?\n[\s\S]*?---/);
	return m ? m[1] : fallback;
}

function chunkDocument(text, title, kind) {
	const sections = text.split(/\n(?=## )/);
	const chunks = [];
	for (const section of sections) {
		const heading = section.match(/^## (.+)/)?.[1]?.trim();
		const body = section.replace(/^## .+\n?/, '').trim();
		if (!body) continue;

		const paragraphs = body.split(/\n\n+/);
		let current = '';
		const flush = () => {
			if (current.trim().length > 40) {
				chunks.push({
					source: `${kind}: ${title}${heading ? ` — ${heading}` : ''}`,
					text: current.trim().replace(/\s+/g, ' ')
				});
			}
			current = '';
		};
		for (const p of paragraphs) {
			if (current.length + p.length > MAX_CHUNK_CHARS) flush();
			current += (current ? '\n\n' : '') + p;
		}
		flush();
	}
	return chunks;
}

async function embedAll(texts) {
	const account = process.env.CLOUDFLARE_ACCOUNT_ID;
	const token = process.env.CLOUDFLARE_API_TOKEN;
	if (!account || !token) return null;

	const url = `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/baai/bge-base-en-v1.5`;
	const vectors = [];
	for (let i = 0; i < texts.length; i += 50) {
		const batch = texts.slice(i, i + 50);
		const res = await fetch(url, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: batch })
		});
		if (!res.ok) throw new Error(`embedding failed: ${res.status} ${await res.text()}`);
		const json = await res.json();
		vectors.push(...json.result.data);
	}
	return vectors;
}

const chunks = [];
for (const { dir, kind } of sources) {
	for (const file of readdirSync(join(root, dir)).sort()) {
		if (!/\.(md|svx)$/.test(file)) continue;
		const raw = readFileSync(join(root, dir, file), 'utf8');
		const title = titleOf(raw, file.replace(/\.(md|svx)$/, ''));
		chunks.push(...chunkDocument(clean(raw), title, kind));
	}
}

const vectors = await embedAll(chunks.map((c) => c.text));
const index = {
	mode: vectors ? 'vector' : 'lexical',
	builtAt: new Date().toISOString(),
	chunks: chunks.map((c, i) => (vectors ? { ...c, vector: vectors[i] } : c))
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(index));
console.log(
	`rag index: ${chunks.length} chunks (${index.mode} mode) → src/lib/server/rag/chunks.json`
);
