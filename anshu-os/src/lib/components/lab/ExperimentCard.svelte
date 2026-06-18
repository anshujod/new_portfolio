<script lang="ts">
	import type { Experiment } from '$lib/data/experiments';
	import { formatDate } from '$lib/content/types';

	let { experiment, lastCommit }: { experiment: Experiment; lastCommit: string | null } =
		$props();

	const statusColor: Record<Experiment['status'], string> = {
		LIVE: 'var(--trace)',
		'IN DEVELOPMENT': 'var(--pulse)',
		PLANNED: 'var(--ink-faint)'
	};
</script>

<article class="flex flex-col rounded-lg border border-hairline bg-panel p-5 transition-all duration-150 hover:border-pulse hover:bg-panel-up hover:shadow-[0_0_0_1px_var(--pulse),0_0_32px_var(--pulse-glow)]">
	<header class="flex items-center justify-between font-mono text-[length:var(--text-mono)] tracking-[0.05em] uppercase">
		<span class="text-ink-faint">exp/{experiment.id}</span>
		<span class="flex items-center gap-1.5 normal-case" style="color: {statusColor[experiment.status]}">
			<span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {statusColor[experiment.status]}"></span>
			{experiment.status.toLowerCase()}
		</span>
	</header>

	<h3 class="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
		{experiment.title}
	</h3>

	<p class="mt-2 text-ink-dim">
		<span class="font-mono text-[length:var(--text-mono)] text-ink-faint">hypothesis:</span>
		{experiment.hypothesis}
	</p>
	<p class="mt-2 text-ink-dim">{experiment.notes}</p>

	<footer class="mt-auto flex flex-wrap items-center gap-4 pt-4 font-mono text-[length:var(--text-mono)]">
		{#if experiment.repo}
			<a href="https://github.com/{experiment.repo}" class="text-signal hover:underline">[ repo ]</a>
			{#if lastCommit}
				<span class="text-trace">last commit: {formatDate(lastCommit)}</span>
			{/if}
		{:else}
			<span class="text-ink-faint">repo: private (for now)</span>
		{/if}
	</footer>
</article>
