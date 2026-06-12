<script lang="ts">
	import Seo from '$lib/components/ui/Seo.svelte';
	import CopyCode from '$lib/components/log/CopyCode.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const mission = $derived(data.mission);
	const Content = $derived(data.component);
</script>

<Seo
	title={mission.title}
	description={mission.summary}
	type="article"
	ogImage="/og/work-{mission.slug}.png"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: mission.title,
		description: mission.summary,
		programmingLanguage: mission.stack,
		codeRepository: mission.repo,
		author: { '@type': 'Person', name: site.title, url: site.url }
	}}
/>

<article class="mx-auto max-w-[var(--content-max)] px-6 py-24">
	<header class="mb-12 max-w-[var(--prose-max)]">
		<p class="eyebrow mb-4">~/work/{mission.slug} · {mission.status}</p>
		<h1
			class="font-display text-[length:var(--text-h2)] font-semibold tracking-[-0.03em] text-ink"
		>
			{mission.title}
		</h1>
		<p class="mt-3 text-ink-dim">{mission.summary}</p>

		<div class="mt-6 flex flex-wrap gap-2">
			{#each mission.stack as tech (tech)}
				<span
					class="rounded border border-hairline bg-panel px-2 py-1 font-mono text-[length:var(--text-mono)] text-ink-dim"
					>{tech.toLowerCase()}</span
				>
			{/each}
		</div>

		<div class="mt-6 flex gap-4 font-mono text-[length:var(--text-mono)]">
			{#if mission.repo}
				<a href={mission.repo} class="text-signal hover:underline">[ github ]</a>
			{/if}
			{#if mission.demo}
				<a href={mission.demo} class="text-signal hover:underline">[ live demo ↗ ]</a>
			{/if}
			<a href="/work" class="text-ink-faint hover:text-signal">[ ← all missions ]</a>
		</div>
	</header>

	<div class="prose">
		<Content />
	</div>
</article>

<CopyCode />
