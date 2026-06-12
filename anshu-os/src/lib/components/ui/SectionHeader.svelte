<script lang="ts">
	let { path, title, level = 2 }: { path: string; title: string; level?: 1 | 2 } = $props();
</script>

<div class="mb-10 flex flex-col gap-3">
	<p class="eyebrow">{path}</p>
	<svelte:element
		this={`h${level}`}
		class="font-display text-[length:var(--text-h2)] font-semibold tracking-[-0.03em] text-ink"
	>
		{title}
	</svelte:element>
</div>
