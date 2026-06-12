import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

// Live last-commit freshness for lab experiment cards. Cached at the edge for
// an hour so GitHub's unauthenticated 60 req/h limit is never a problem.
export const GET: RequestHandler = async ({ url, fetch }) => {
	const repo = url.searchParams.get('repo') ?? '';
	if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return json({ error: 'bad repo' }, { status: 400 });

	try {
		const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
			headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'anshu-os' },
			signal: AbortSignal.timeout(4000)
		});
		if (!res.ok) return json({ repo, lastCommit: null }, { status: 200 });
		const commits = (await res.json()) as { commit?: { committer?: { date?: string } } }[];
		return json(
			{ repo, lastCommit: commits[0]?.commit?.committer?.date ?? null },
			{ headers: { 'Cache-Control': 'public, max-age=3600' } }
		);
	} catch {
		return json({ repo, lastCommit: null }, { status: 200 });
	}
};
