import { json } from '@sveltejs/kit';
import { retrieve, indexMode, conciseAnswer, type Chunk } from '$lib/server/rag/retrieve';
import { rateLimit } from '$lib/server/ratelimit';
import type { RequestHandler } from './$types';

export const prerender = false;

/** Minimal Workers AI binding surface — adapter types leave platform.env unknown. */
interface AiBinding {
	run(
		model: string,
		options: Record<string, unknown>
	): Promise<ReadableStream<Uint8Array> | Record<string, unknown>>;
}

const MAX_MESSAGES = 4; // context window sent to the model
const MAX_MESSAGE_CHARS = 500;
const MAX_TOKENS = 700;
const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';

const systemPrompt = (context: string) =>
	`You are the "Ask About Me" assistant on Anshu Prakash Hindoyar's portfolio (ANSHU.OS).
Answer questions about Anshu — his background, skills, tech stack, projects, and experience — using the context below.
Rules:
- Ground every answer in the context. If a specific fact isn't there, say you don't know and point them to his projects or skills. Never invent specifics.
- When asked what he knows, his tech stack, or to list his technologies or projects, give a COMPLETE answer from the context — name every relevant item, grouped sensibly. Don't be vague or give only a couple of examples.
- For other questions, keep it concise (2-4 sentences).
- Plain text only, no markdown headings; short bullet lists are fine for enumerations.
- Be honest about what is in progress vs. shipped; understatement beats overstatement.
- Politely decline off-topic requests (general coding help, news, anything not about Anshu) in one sentence.

Context:
${context}`;

interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

const sse = (data: string) => `data: ${data}\n\n`;

/** No-LLM fallback: answer straight from the retrieved context. Used in dev, and
 *  in production if the Workers AI binding is missing or the model call fails — so
 *  the user still gets accurate indexed info instead of an error. */
function fallbackStream(query: string, chunks: Chunk[]): ReadableStream<Uint8Array> {
	const answer = conciseAnswer(query, chunks);
	const words = answer.split(/(?<= )/);
	const encoder = new TextEncoder();
	let i = 0;
	return new ReadableStream({
		async pull(controller) {
			if (i < words.length) {
				controller.enqueue(encoder.encode(sse(JSON.stringify({ response: words[i++] }))));
				await new Promise((r) => setTimeout(r, 8));
			} else {
				controller.enqueue(encoder.encode(sse('[DONE]')));
				controller.close();
			}
		}
	});
}

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	let ip = 'unknown';
	try {
		ip = request.headers.get('cf-connecting-ip') ?? getClientAddress();
	} catch {
		// prerender analysis / dev edge cases
	}

	const limit = rateLimit(ip);
	if (!limit.allowed) {
		return json(
			{ error: `rate limited — try again in ${limit.retryAfterSeconds}s` },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	let body: { messages?: ChatMessage[] };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid json' }, { status: 400 });
	}

	const messages = (body.messages ?? [])
		.filter(
			(m): m is ChatMessage =>
				(m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string'
		)
		.slice(-MAX_MESSAGES)
		.map((m) => ({ ...m, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

	const lastUser = [...messages].reverse().find((m) => m.role === 'user');
	if (!lastUser) return json({ error: 'no user message' }, { status: 400 });

	const ai = (platform?.env as { AI?: AiBinding } | undefined)?.AI;

	// embed the query only when the index was built with vectors
	let queryVector: number[] | undefined;
	if (ai && indexMode === 'vector') {
		try {
			const res = (await ai.run(EMBED_MODEL, { text: [lastUser.content] })) as {
				data?: number[][];
			};
			queryVector = res.data?.[0];
		} catch {
			// fall through to BM25
		}
	}

	const chunks = retrieve(lastUser.content, queryVector);
	const context = chunks.map((c) => `[${c.source}]\n${c.text}`).join('\n\n');

	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-store',
		Connection: 'keep-alive'
	};

	if (!ai) return new Response(fallbackStream(lastUser.content, chunks), { headers });

	try {
		const stream = (await ai.run(CHAT_MODEL, {
			messages: [{ role: 'system', content: systemPrompt(context) }, ...messages],
			stream: true,
			max_tokens: MAX_TOKENS
		})) as ReadableStream<Uint8Array>;
		return new Response(stream, { headers });
	} catch {
		// model hiccup — degrade to the indexed answer rather than erroring out
		return new Response(fallbackStream(lastUser.content, chunks), { headers });
	}
};
