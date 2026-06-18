<script lang="ts">
	import Seo from '$lib/components/ui/Seo.svelte';
	import ProgressBar from '$lib/components/log/ProgressBar.svelte';
	import Toc from '$lib/components/log/Toc.svelte';
	import CopyCode from '$lib/components/log/CopyCode.svelte';
	import PostRow from '$lib/components/log/PostRow.svelte';
	import { categoryColor, formatDate } from '$lib/content/types';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const post = $derived(data.post);
	const Content = $derived(data.component);
</script>

<Seo
	title={post.title}
	description={post.summary}
	type="article"
	ogImage="/og/log-{post.slug}.png"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.summary,
		datePublished: post.date,
		author: { '@type': 'Person', name: site.title, url: site.url }
	}}
/>

<ProgressBar />

<div class="mx-auto flex max-w-[var(--content-max)] gap-12 px-6 py-24">
	<article class="min-w-0 flex-1">
		<header class="mx-auto mb-12 max-w-[var(--prose-max)]">
			<p class="eyebrow mb-4">
				~/log/{post.slug}
			</p>
			<h1
				class="font-display text-[length:var(--text-h2)] font-semibold tracking-[-0.03em] text-ink"
			>
				{post.title}
			</h1>
			<p
				class="mt-4 flex flex-wrap items-center gap-4 font-mono text-[length:var(--text-mono)] text-ink-faint"
			>
				<time datetime={post.date}>{formatDate(post.date)}</time>
				<span
					class="rounded-sm border px-1.5 py-0.5"
					style="color: {categoryColor[post.category]}; border-color: color-mix(in srgb, {categoryColor[
						post.category
					]} 35%, transparent)">{post.category}</span
				>
				<span>{post.readingTime} min read</span>
			</p>
		</header>

		<div class="prose mx-auto">
			<Content />
		</div>

		<nav
			class="mx-auto mt-16 flex max-w-[var(--prose-max)] justify-between gap-4 border-t border-hairline/60 pt-8 font-mono text-[length:var(--text-mono)]"
		>
			{#if data.prev}
				<a href="/log/{data.prev.slug}" class="text-ink-dim hover:text-signal"
					>← {data.prev.title}</a
				>
			{:else}<span></span>{/if}
			{#if data.next}
				<a href="/log/{data.next.slug}" class="text-right text-ink-dim hover:text-signal"
					>{data.next.title} →</a
				>
			{/if}
		</nav>

		{#if data.related.length}
			<section class="mx-auto mt-16 max-w-[var(--prose-max)]">
				<p class="eyebrow mb-4">~/related</p>
				<div class="border-t border-hairline/60">
					{#each data.related as rel (rel.slug)}
						<PostRow post={rel} />
					{/each}
				</div>
			</section>
		{/if}
	</article>

	<Toc />
</div>

<CopyCode />
