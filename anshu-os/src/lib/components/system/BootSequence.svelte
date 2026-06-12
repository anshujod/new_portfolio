<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/data/site';

	const BOOT_KEY = 'anshu-os-booted';

	const bootLines = [
		`${site.name.toUpperCase()} ${site.version}  —  ${site.location.toLowerCase()}`,
		'> mounting /systems/fullstack ............ OK',
		'> loading vision module (YOLOv10) ........ OK',
		'> warming llm runtime .................... OK',
		'> indexing 500+ solved problems .......... OK',
		'> status: ONLINE'
	];

	let show = $state(false);
	let visibleCount = $state(0);
	let leaving = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function finish() {
		if (leaving) return;
		leaving = true;
		timers.forEach(clearTimeout);
		sessionStorage.setItem(BOOT_KEY, '1');
		// let the exit transition play, then unmount
		timers.push(setTimeout(() => (show = false), 450));
	}

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced || sessionStorage.getItem(BOOT_KEY)) return;

		show = true;
		// ~320ms per line ≈ 1.9s of log, finish by 2.4s total
		bootLines.forEach((_, i) => {
			timers.push(setTimeout(() => (visibleCount = i + 1), 200 + i * 320));
		});
		timers.push(setTimeout(finish, 200 + bootLines.length * 320 + 350));

		return () => timers.forEach(clearTimeout);
	});
</script>

<svelte:window onkeydown={() => show && finish()} />

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[60] flex items-center bg-void transition-[opacity,transform] duration-[400ms]"
		style="transition-timing-function: var(--ease-inout); {leaving
			? 'opacity: 0; transform: translateY(-2rem)'
			: ''}"
		onclick={finish}
		aria-hidden="true"
	>
		<div class="scanline" class:paused={leaving}></div>

		<div class="mx-auto w-full max-w-xl px-6 font-mono text-[length:var(--text-mono)]">
			{#each bootLines.slice(0, visibleCount) as line, i (i)}
				<p class="boot-line {i === bootLines.length - 1 ? 'text-trace' : 'text-ink-dim'}">
					{line}
				</p>
			{/each}
			<p class="mt-6 text-ink-faint">press any key to skip</p>
		</div>
	</div>
{/if}

<style>
	.boot-line {
		animation: boot-in 150ms var(--ease-out);
	}

	@keyframes boot-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.scanline {
		position: absolute;
		inset-inline: 0;
		top: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--trace), transparent);
		opacity: 0.5;
		animation: sweep 2.2s var(--ease-inout) 1 forwards;
	}

	.scanline.paused {
		display: none;
	}

	@keyframes sweep {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(100vh);
		}
	}
</style>
