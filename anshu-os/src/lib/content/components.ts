// Lazy component loaders — each .svx compiles to its own chunk, fetched only
// when its page is visited. Keeps rendered article HTML out of shared bundles.

import type { Component } from 'svelte';

interface SvxModule {
	default: Component;
}

const missionLoaders = import.meta.glob<SvxModule>('/src/content/work/*.svx');
const postLoaders = import.meta.glob<SvxModule>('/src/content/log/*.svx');

export async function missionComponent(slug: string): Promise<Component | undefined> {
	return (await missionLoaders[`/src/content/work/${slug}.svx`]?.())?.default;
}

export async function postComponent(slug: string): Promise<Component | undefined> {
	return (await postLoaders[`/src/content/log/${slug}.svx`]?.())?.default;
}
