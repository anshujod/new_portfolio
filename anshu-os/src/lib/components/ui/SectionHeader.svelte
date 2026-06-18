<script lang="ts">
	let {
		path,
		title,
		level = 2,
		live = false
	}: { path: string; title: string; level?: 1 | 2; live?: boolean } = $props();
</script>

<div class="mb-10 flex flex-col gap-3">
	<p class="eyebrow flex items-center gap-2">
		{#if live}<span class="prompt text-signal" aria-hidden="true">▌</span>{/if}{path}
	</p>
	<svelte:element
		this={`h${level}`}
		class="font-display text-[length:var(--text-h2)] font-semibold tracking-[-0.03em] text-ink"
	>
		{title}
	</svelte:element>
</div>

<style>
	/* Marks interactive "live" sections (constellation, terminal) so they don't share
	   the exact eyebrow cadence as the static ones. */
	.prompt {
		animation: blink 1.2s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.prompt {
			animation: none;
		}
	}
</style>
