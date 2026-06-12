<script lang="ts">
	import { site } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-hairline/60 bg-substrate">
	<div
		class="mx-auto flex max-w-[var(--content-max)] flex-col gap-4 px-6 py-10 font-mono text-[length:var(--text-mono)] text-ink-faint sm:flex-row sm:items-center sm:justify-between"
	>
		<p>
			<span class="text-ink-dim">{site.name}</span>
			{site.version} — {site.location.toLowerCase()}
		</p>
		<nav aria-label="Social" class="flex gap-5">
			<a class="transition-colors duration-150 hover:text-signal" href={site.links.github}
				>github</a
			>
			<a class="transition-colors duration-150 hover:text-signal" href={site.links.linkedin}
				>linkedin</a
			>
			<a class="transition-colors duration-150 hover:text-signal" href={site.links.leetcode}
				>leetcode</a
			>
			<a class="transition-colors duration-150 hover:text-signal" href="mailto:{site.email}"
				>mail</a
			>
		</nav>
		<p>© {year} · built, not generated</p>
	</div>
</footer>
