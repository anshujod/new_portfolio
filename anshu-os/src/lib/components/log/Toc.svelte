<script lang="ts">
	// Sticky table of contents, built from the rendered article's h2/h3 ids.
	import { onMount } from 'svelte';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	let headings = $state<Heading[]>([]);
	let activeId = $state('');

	onMount(() => {
		const nodes = Array.from(
			document.querySelectorAll<HTMLHeadingElement>('.prose h2[id], .prose h3[id]')
		);
		headings = nodes.map((n) => ({
			id: n.id,
			text: n.textContent ?? '',
			level: n.tagName === 'H2' ? 2 : 3
		}));

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeId = entry.target.id;
				}
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);
		nodes.forEach((n) => observer.observe(n));
		return () => observer.disconnect();
	});
</script>

{#if headings.length > 1}
	<nav
		class="sticky top-24 hidden max-h-[70vh] w-56 shrink-0 overflow-y-auto xl:block"
		aria-label="Table of contents"
	>
		<p class="eyebrow mb-4">~/toc</p>
		<ul class="space-y-2 font-mono text-[length:var(--text-mono)]">
			{#each headings as h (h.id)}
				<li class={h.level === 3 ? 'pl-4' : ''}>
					<a
						href="#{h.id}"
						class="block transition-colors duration-150 {activeId === h.id
							? 'text-signal'
							: 'text-ink-faint hover:text-ink-dim'}"
					>
						{h.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
