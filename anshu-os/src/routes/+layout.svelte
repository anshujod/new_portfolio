<script lang="ts">
	import '../styles/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/system/NavBar.svelte';
	import Footer from '$lib/components/system/Footer.svelte';
	import CommandPalette from '$lib/components/system/CommandPalette.svelte';
	import ParticleField from '$lib/components/system/ParticleField.svelte';
	import CursorGlow from '$lib/components/system/CursorGlow.svelte';
	import { onNavigate } from '$app/navigation';
	import { site } from '$lib/data/site';

	let { children } = $props();

	// 250ms scanline wipe between routes, via the View Transitions API.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const personJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.title,
		jobTitle: site.role,
		url: site.url,
		email: site.email,
		sameAs: [site.links.github, site.links.linkedin, site.links.leetcode]
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title="{site.name} — system logs" href="/log/rss.xml" />
	{@html `<script type="application/ld+json">${personJsonLd}<\/script>`}
</svelte:head>

<a
	href="#main"
	class="sr-only z-[70] rounded-lg border border-signal bg-panel px-4 py-2 font-mono text-[length:var(--text-mono)] text-signal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	skip to content
</a>

<ParticleField />
<CursorGlow />

<NavBar />

<main id="main" class="pt-14">
	{@render children()}
</main>

<Footer />

<CommandPalette />
