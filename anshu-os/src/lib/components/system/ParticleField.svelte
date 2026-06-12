<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { FieldHandle } from '$lib/three/field';

	// 7% ambient everywhere; dims to 3% inside the blog reader.
	const opacity = $derived(/^\/log\/./.test(page.url.pathname) ? 0.03 : 0.07);

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let mode = $state<'none' | 'webgl' | 'static'>('none');

	// Coarse-pointer fallback: draw the field once, no WebGL, no animation.
	function drawStatic(canvas: HTMLCanvasElement) {
		const dpr = Math.min(devicePixelRatio, 1.5);
		canvas.width = innerWidth * dpr;
		canvas.height = innerHeight * dpr;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);

		const pts = Array.from({ length: 140 }, () => ({
			x: Math.random() * innerWidth,
			y: Math.random() * innerHeight
		}));
		ctx.strokeStyle = 'rgba(77, 124, 255, 0.35)';
		ctx.lineWidth = 0.5;
		for (let i = 0; i < pts.length; i++)
			for (let j = i + 1; j < pts.length; j++) {
				const dx = pts[i].x - pts[j].x;
				const dy = pts[i].y - pts[j].y;
				if (dx * dx + dy * dy < 90 * 90) {
					ctx.beginPath();
					ctx.moveTo(pts[i].x, pts[i].y);
					ctx.lineTo(pts[j].x, pts[j].y);
					ctx.stroke();
				}
			}
		ctx.fillStyle = 'rgba(130, 145, 200, 0.8)';
		for (const p of pts) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		if (matchMedia('(pointer: coarse)').matches) {
			mode = 'static';
			queueMicrotask(() => canvasEl && drawStatic(canvasEl));
			return;
		}

		mode = 'webgl';
		let handle: FieldHandle | undefined;
		let cancelled = false;
		// three.js loads lazily after first paint — never in the critical path
		const start = async () => {
			const { createField } = await import('$lib/three/field');
			if (!cancelled && canvasEl) handle = createField(canvasEl);
		};
		if ('requestIdleCallback' in window) requestIdleCallback(() => start());
		else setTimeout(start, 250);

		return () => {
			cancelled = true;
			handle?.destroy();
		};
	});
</script>

{#if mode !== 'none'}
	<canvas
		bind:this={canvasEl}
		class="pointer-events-none fixed inset-0 -z-10 h-full w-full transition-opacity duration-700"
		style="opacity: {opacity}"
		aria-hidden="true"
	></canvas>
{/if}
