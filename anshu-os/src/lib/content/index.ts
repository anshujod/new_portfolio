// Content metadata — eager globs over frontmatter only. This module is meant
// for server load functions and build-time endpoints (rss, sitemap); page
// components receive this data via `load` so none of it lands in client JS.

import type { MissionMeta, PostMeta } from './types';

export * from './types';

const missionMeta = import.meta.glob<Record<string, unknown>>('/src/content/work/*.svx', {
	eager: true,
	import: 'metadata'
});
const postMeta = import.meta.glob<Record<string, unknown>>('/src/content/log/*.svx', {
	eager: true,
	import: 'metadata'
});
const postSources = import.meta.glob<string>('/src/content/log/*.svx', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const slugOf = (path: string) => path.split('/').pop()!.replace('.svx', '');

const wordsPerMinute = 220;
const readingTimeOf = (path: string) => {
	const words = (postSources[path] ?? '').split(/\s+/).length;
	return Math.max(1, Math.round(words / wordsPerMinute));
};

export const missions: MissionMeta[] = Object.entries(missionMeta)
	.map(([path, meta]) => ({ ...(meta as Omit<MissionMeta, 'slug'>), slug: slugOf(path) }))
	.sort((a, b) => a.order - b.order);

export const posts: PostMeta[] = Object.entries(postMeta)
	.map(([path, meta]) => ({
		...(meta as Omit<PostMeta, 'slug' | 'readingTime'>),
		slug: slugOf(path),
		readingTime: readingTimeOf(path)
	}))
	.filter((p) => !p.draft)
	.sort((a, b) => +new Date(b.date) - +new Date(a.date));
