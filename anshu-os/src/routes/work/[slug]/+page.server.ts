import { error } from '@sveltejs/kit';
import { missions } from '$lib/content';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => missions.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	const mission = missions.find((m) => m.slug === params.slug);
	if (!mission) error(404, `mission not found: ${params.slug}`);
	return { mission };
};
