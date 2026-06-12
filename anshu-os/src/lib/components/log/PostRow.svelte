<script lang="ts">
	import { categoryColor, formatDate, type PostMeta } from '$lib/content/types';

	let { post }: { post: PostMeta } = $props();
</script>

<a
	href="/log/{post.slug}"
	class="group flex flex-col gap-1 border-b border-hairline/60 px-2 py-4 transition-colors duration-150 hover:bg-panel sm:flex-row sm:items-baseline sm:gap-6"
>
	<time
		datetime={post.date}
		class="shrink-0 font-mono text-[length:var(--text-mono)] text-ink-faint sm:w-28"
		>{formatDate(post.date)}</time
	>
	<span class="flex-1 font-medium text-ink transition-colors duration-150 group-hover:text-signal"
		>{post.title}</span
	>
	<span class="flex shrink-0 items-center gap-4 font-mono text-[length:var(--text-mono)]">
		<span
			class="rounded-sm border px-1.5 py-0.5"
			style="color: {categoryColor[post.category]}; border-color: color-mix(in srgb, {categoryColor[
				post.category
			]} 35%, transparent)">{post.category}</span
		>
		<span class="text-ink-faint">{post.readingTime} min</span>
	</span>
</a>
