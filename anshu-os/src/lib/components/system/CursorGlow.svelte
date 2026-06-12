<script lang="ts">
	import { onMount } from 'svelte';

	let glowEl: HTMLDivElement | undefined = $state();
	let active = $state(false);

	onMount(() => {
		if (
			matchMedia('(prefers-reduced-motion: reduce)').matches ||
			matchMedia('(pointer: coarse)').matches
		)
			return;

		active = true;
		let raf = 0;
		let x = innerWidth / 2;
		let y = innerHeight / 2;
		let tx = x;
		let ty = y;

		const onMove = (e: PointerEvent) => {
			tx = e.clientX;
			ty = e.clientY;
		};

		const loop = () => {
			x += (tx - x) * 0.12;
			y += (ty - y) * 0.12;
			if (glowEl) glowEl.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
			raf = requestAnimationFrame(loop);
		};

		window.addEventListener('pointermove', onMove, { passive: true });
		raf = requestAnimationFrame(loop);
		return () => {
			window.removeEventListener('pointermove', onMove);
			cancelAnimationFrame(raf);
		};
	});
</script>

{#if active}
	<div
		bind:this={glowEl}
		class="pointer-events-none fixed top-0 left-0 -z-10 h-[600px] w-[600px]"
		style="background: radial-gradient(circle, var(--signal-glow) 0%, transparent 60%); opacity: 0.5"
		aria-hidden="true"
	></div>
{/if}
