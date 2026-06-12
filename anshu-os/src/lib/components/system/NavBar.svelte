<script lang="ts">
	import { page } from '$app/state';
	import { site, nav } from '$lib/data/site';
	import { palette } from '$lib/terminal/palette.svelte';

	const crumb = $derived(
		page.url.pathname === '/' ? '~' : page.url.pathname.replace(/\/$/, '')
	);
</script>

<header
	class="fixed inset-x-0 top-0 z-40 border-b border-hairline/60 bg-void/70 backdrop-blur-md"
>
	<div class="mx-auto flex h-14 max-w-[var(--content-max)] items-center justify-between px-6">
		<a href="/" class="group flex items-baseline gap-2 font-mono text-[length:var(--text-mono)]">
			<span class="text-ink transition-colors duration-150 group-hover:text-signal"
				>{site.name}</span
			>
			<span class="hidden text-ink-faint sm:inline">▸</span>
			<span class="hidden text-ink-dim sm:inline">{crumb}</span>
		</a>

		<nav aria-label="Primary" class="flex items-center gap-0.5 font-mono text-[length:var(--text-mono)] sm:gap-1">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="rounded px-1.5 py-1.5 text-ink-dim transition-colors duration-150 hover:bg-panel hover:text-ink sm:px-3"
					class:!text-signal={page.url.pathname.startsWith(item.href) && item.href !== '/#connect'}
				>
					{item.label}
				</a>
			{/each}
			<button
				class="ml-3 hidden cursor-pointer items-center gap-1 rounded border border-hairline px-2 py-1 text-ink-faint transition-colors duration-150 hover:border-signal hover:text-signal sm:flex"
				title="Open command palette"
				onclick={() => (palette.open = true)}
			>
				⌘K
			</button>
		</nav>
	</div>
</header>
