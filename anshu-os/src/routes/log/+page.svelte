<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import PostRow from '$lib/components/log/PostRow.svelte';
	import type { PostCategory } from '$lib/content/types';

	let { data } = $props();

	const categories: PostCategory[] = ['AI', 'Engineering', 'Projects', 'Career'];
	let filter = $state<PostCategory | null>(null);

	const visible = $derived(
		filter ? data.posts.filter((p) => p.category === filter) : data.posts
	);
</script>

<Seo
	title="log"
	description="System logs — engineering notes on applied AI, full-stack systems, and building in public."
/>

<section class="mx-auto max-w-[var(--content-max)] px-6 py-24">
	<SectionHeader path="~/logs" title="System Logs" level={1} />

	<div class="mb-8 flex flex-wrap gap-2 font-mono text-[length:var(--text-mono)]">
		<button
			class="rounded border px-2.5 py-1 transition-colors duration-150 {filter === null
				? 'border-signal text-signal'
				: 'border-hairline text-ink-faint hover:text-ink-dim'}"
			onclick={() => (filter = null)}>all</button
		>
		{#each categories as cat (cat)}
			<button
				class="rounded border px-2.5 py-1 transition-colors duration-150 {filter === cat
					? 'border-signal text-signal'
					: 'border-hairline text-ink-faint hover:text-ink-dim'}"
				onclick={() => (filter = filter === cat ? null : cat)}>{cat.toLowerCase()}</button
			>
		{/each}
	</div>

	<div class="border-t border-hairline/60">
		{#each visible as post (post.slug)}
			<PostRow {post} />
		{:else}
			<p class="px-2 py-8 font-mono text-[length:var(--text-mono)] text-ink-faint">
				&gt; no entries match — <button class="text-signal" onclick={() => (filter = null)}>clear filter</button>
			</p>
		{/each}
	</div>

	<p class="mt-8 font-mono text-[length:var(--text-mono)] text-ink-faint">
		<a href="/log/rss.xml" class="hover:text-signal">[ rss ]</a>
	</p>
</section>
