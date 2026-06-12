<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	let {
		title,
		description,
		type = 'website',
		ogImage = '/og/default.png',
		jsonLd
	}: {
		title: string;
		description: string;
		type?: 'website' | 'article';
		ogImage?: string;
		jsonLd?: Record<string, unknown>;
	} = $props();

	const canonical = $derived(site.url + page.url.pathname);
	const fullTitle = $derived(`${title} · ${site.name}`);
	const ogImageUrl = $derived(site.url + ogImage);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
	{/if}
</svelte:head>
