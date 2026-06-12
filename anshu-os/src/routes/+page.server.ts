import { missions, posts } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	missions,
	recentPosts: posts.slice(0, 3)
});
