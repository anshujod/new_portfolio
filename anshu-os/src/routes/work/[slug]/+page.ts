import { error } from '@sveltejs/kit';
import { missionComponent } from '$lib/content/components';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, params }) => {
	const component = await missionComponent(params.slug);
	if (!component) error(404, `mission not found: ${params.slug}`);
	return { ...data, component };
};
