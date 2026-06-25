<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import MissionCard from '$lib/components/work/MissionCard.svelte';

	let { data } = $props();
</script>

<Seo
	title="work"
	description="Deployed missions — production projects: industrial computer vision, real-time messaging, AI products, and auth infrastructure."
/>

<section class="mx-auto max-w-[var(--content-max)] px-6 py-24">
	<SectionHeader path="~/projects" title="Deployed Missions" level={1} />

	<p class="mb-12 max-w-xl text-ink-dim">
		Production software, framed honestly: <span class="font-mono text-[length:var(--text-mono)] text-trace">DEPLOYED</span> means a live demo exists,
		<span class="font-mono text-[length:var(--text-mono)] text-signal">FIELD-TESTED</span> means it ran in a real facility,
		<span class="font-mono text-[length:var(--text-mono)] text-pulse">IN DEVELOPMENT</span> means the repo is public and moving.
	</p>

	<div class="grid gap-5 md:grid-cols-2">
		{#each data.missions as mission, i (mission.slug)}
			<MissionCard {mission} index={i} headingLevel={2} />
		{/each}
	</div>
</section>
