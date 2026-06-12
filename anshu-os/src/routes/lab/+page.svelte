<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import AskAnshu from '$lib/components/lab/AskAnshu.svelte';
	import ExperimentCard from '$lib/components/lab/ExperimentCard.svelte';

	let { data } = $props();

	// svelte-ignore state_referenced_locally -- build-time freshness seeds the live values once
	let freshness = $state({ ...data.freshness });

	// re-check commit freshness live (edge-cached 1h) — build-time data is the fallback
	onMount(() => {
		for (const e of data.experiments) {
			if (!e.repo) continue;
			fetch(`/api/github?repo=${encodeURIComponent(e.repo)}`)
				.then((r) => (r.ok ? r.json() : null))
				.then((d) => {
					if (d?.lastCommit) freshness[e.id] = d.lastCommit;
				})
				.catch(() => {});
		}
	});
</script>

<Seo
	title="lab"
	description="AI Lab — a live RAG chatbot you can interrogate, plus in-progress research: football prediction models and agent experiments."
/>

<section class="mx-auto max-w-[var(--content-max)] px-6 py-24">
	<SectionHeader path="~/lab/experiments" title="AI Lab" level={1} />

	<p class="mb-10 max-w-xl text-ink-dim">
		Two kinds of entries live here: <span class="font-mono text-[length:var(--text-mono)] text-trace">deployed experiments</span> you can poke at right now, and
		<span class="font-mono text-[length:var(--text-mono)] text-pulse">active research</span> shown with its real status. Nothing on this page claims to be more done than it is.
	</p>

	<div class="max-w-2xl">
		<AskAnshu />
	</div>

	<h2 class="eyebrow mt-16 mb-6">~/lab/log</h2>
	<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each data.experiments as experiment (experiment.id)}
			<ExperimentCard {experiment} lastCommit={freshness[experiment.id] ?? null} />
		{/each}
	</div>
</section>
