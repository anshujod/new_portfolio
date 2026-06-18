<script lang="ts">
	import type { MissionMeta } from '$lib/content/types';

	let {
		mission,
		index,
		headingLevel = 3
	}: { mission: MissionMeta; index: number; headingLevel?: 2 | 3 } = $props();

	const missionId = $derived(`MISSION-${String(index + 1).padStart(2, '0')}`);

	const statusDot: Record<MissionMeta['status'], string> = {
		DEPLOYED: 'var(--trace)',
		'FIELD-TESTED': 'var(--signal)',
		'IN DEVELOPMENT': 'var(--pulse)'
	};
	const statusLabel: Record<MissionMeta['status'], string> = {
		DEPLOYED: 'live',
		'FIELD-TESTED': 'field',
		'IN DEVELOPMENT': 'wip'
	};
</script>

<article
	class="group relative flex flex-col rounded-lg border border-hairline bg-panel p-6 transition-all duration-150 hover:bg-panel-up hover:shadow-[0_0_0_1px_var(--signal),0_0_32px_var(--signal-glow)]"
	class:md:col-span-2={mission.featured}
	class:!border-transparent={mission.featured}
>
	{#if mission.featured}
		<!-- The one sanctioned signal→pulse gradient ring: marks the lead mission. -->
		<div class="gradient-ring pointer-events-none absolute inset-0 rounded-lg" aria-hidden="true"></div>
	{/if}

	<header
		class="flex items-center justify-between font-mono text-[length:var(--text-mono)] tracking-[0.05em] text-ink-faint uppercase"
	>
		<span>{missionId} · {mission.status}</span>
		<span class="flex items-center gap-1.5 normal-case">
			<span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {statusDot[mission.status]}"
			></span>
			{statusLabel[mission.status]}
		</span>
	</header>

	<svelte:element
		this={`h${headingLevel}`}
		class="mt-4 font-display text-[length:var(--text-h3)] font-semibold tracking-[-0.02em] text-ink"
	>
		<a href="/work/{mission.slug}" class="outline-none after:absolute after:inset-0">
			{mission.title}
		</a>
	</svelte:element>
	<p class="mt-1 text-ink-dim">{mission.summary}</p>

	<p class="mt-4 font-mono text-[length:var(--text-mono)] text-ink-faint">
		── {mission.stack.map((s) => s.toLowerCase()).join(' · ')} ──
	</p>

	<ul class="mt-3 space-y-1 font-mono text-[length:var(--text-mono)] text-ink-dim">
		{#each mission.metrics as metric (metric)}
			<li><span class="text-ink-faint">▸</span> <span class="text-trace">{metric}</span></li>
		{/each}
	</ul>

	<footer class="mt-auto flex gap-4 pt-6 font-mono text-[length:var(--text-mono)]">
		<span class="text-signal transition-colors duration-150 group-hover:text-ink"
			>[ case study ]</span
		>
		{#if mission.repo}
			<a
				href={mission.repo}
				class="relative z-10 text-ink-faint transition-colors duration-150 hover:text-signal"
				>[ github ]</a
			>
		{/if}
		{#if mission.demo}
			<a
				href={mission.demo}
				class="relative z-10 text-ink-faint transition-colors duration-150 hover:text-signal"
				>[ ↗ ]</a
			>
		{/if}
	</footer>
</article>

<style>
	/* 1px gradient ring via mask compositing — paints only the border, never fills. */
	.gradient-ring {
		padding: 1px;
		background: linear-gradient(135deg, var(--signal), var(--pulse));
		/* mask fill colour is an opacity primitive only (never rendered); a documented
		   opaque token keeps it out of palette-drift detection. */
		-webkit-mask:
			linear-gradient(var(--ink) 0 0) content-box,
			linear-gradient(var(--ink) 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(var(--ink) 0 0) content-box,
			linear-gradient(var(--ink) 0 0);
		mask-composite: exclude;
	}
</style>
