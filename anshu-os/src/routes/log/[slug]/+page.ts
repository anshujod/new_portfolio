import { error } from '@sveltejs/kit';
import { postComponent } from '$lib/content/components';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, params }) => {
	const component = await postComponent(params.slug);
	if (!component) error(404, `log entry not found: ${params.slug}`);
	return { ...data, component };
};
