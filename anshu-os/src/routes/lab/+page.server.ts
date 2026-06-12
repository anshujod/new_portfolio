import { experiments } from '$lib/data/experiments';
import type { PageServerLoad } from './$types';

// Last-commit dates are fetched at build time (page is prerendered); the
// /api/github endpoint re-checks at runtime for live freshness.
export const load: PageServerLoad = async ({ fetch }) => {
	const freshness: Record<string, string | null> = {};

	await Promise.all(
		experiments
			.filter((e) => e.repo)
			.map(async (e) => {
				try {
					const res = await fetch(`https://api.github.com/repos/${e.repo}/commits?per_page=1`, {
						headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'anshu-os' },
						signal: AbortSignal.timeout(4000)
					});
					if (!res.ok) throw new Error(String(res.status));
					const commits = (await res.json()) as { commit?: { committer?: { date?: string } } }[];
					freshness[e.id] = commits[0]?.commit?.committer?.date ?? null;
				} catch {
					freshness[e.id] = null;
				}
			})
	);

	return { experiments, freshness };
};
