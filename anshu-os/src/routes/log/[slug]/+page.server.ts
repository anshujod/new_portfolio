import { error } from '@sveltejs/kit';
import { posts } from '$lib/content';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => posts.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const index = posts.findIndex((p) => p.slug === params.slug);
	if (index === -1) error(404, `log entry not found: ${params.slug}`);

	const post = posts[index];
	return {
		post,
		// posts are sorted newest-first, so "prev" is the older entry
		prev: posts[index + 1] ?? null,
		next: posts[index - 1] ?? null,
		related: posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)
	};
};
