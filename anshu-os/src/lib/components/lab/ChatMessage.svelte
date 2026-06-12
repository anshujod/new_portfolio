<script lang="ts">
	let {
		role,
		content,
		streaming = false
	}: { role: 'user' | 'assistant'; content: string; streaming?: boolean } = $props();
</script>

{#if role === 'user'}
	<div class="flex justify-end">
		<p
			class="max-w-[85%] rounded-lg rounded-br-sm border border-hairline bg-panel-up px-3.5 py-2 text-ink"
		>
			{content}
		</p>
	</div>
{:else}
	<div class="flex gap-2.5">
		<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pulse" aria-hidden="true"></span>
		<p class="max-w-[85%] whitespace-pre-wrap text-ink-dim">
			{content}{#if streaming}<span class="animate-pulse text-pulse">▍</span>{/if}
		</p>
	</div>
{/if}
