<script lang="ts">
	import { changelog } from '$lib/data/changelog';

	let openVersion = $state<string | null>(null);
</script>

<div class="relative border-l border-hairline pl-6">
	{#each changelog as entry (entry.version)}
		{@const open = openVersion === entry.version}
		<div class="relative pb-6 last:pb-0">
			<span
				class="absolute top-1.5 -left-[1.85rem] h-2.5 w-2.5 rounded-full border transition-colors duration-150 {open
					? 'border-signal bg-signal'
					: 'border-hairline bg-substrate'}"
			></span>

			<button
				class="group flex w-full flex-col gap-x-6 gap-y-0.5 text-left font-mono text-[length:var(--text-mono)] sm:flex-row sm:items-baseline"
				onclick={() => (openVersion = open ? null : entry.version)}
				aria-expanded={open}
			>
				<span class="w-20 shrink-0 text-ink-faint">{entry.version}</span>
				<span
					class="w-56 shrink-0 transition-colors duration-150 {open
						? 'text-signal'
						: 'text-ink group-hover:text-signal'}">{entry.label}</span
				>
				<span class="text-ink-dim">— {entry.summary}</span>
				{#if entry.badges}
					{#each entry.badges as badge (badge)}
						<span
							class="mt-1 w-fit rounded-sm border border-trace/35 px-1.5 py-0.5 text-[0.6875rem] text-trace sm:mt-0"
							>[{badge}]</span
						>
					{/each}
				{/if}
			</button>

			{#if open}
				<p class="mt-2 max-w-xl pl-0 text-ink-dim sm:pl-26">
					{entry.detail}
				</p>
			{/if}
		</div>
	{/each}
</div>
