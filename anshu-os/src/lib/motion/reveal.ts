import type { Action } from 'svelte/action';

export interface RevealOptions {
	y?: number;
	stagger?: number;
	/** CSS selector — animate matching children instead of the node itself */
	children?: string;
}

const reduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// GSAP loads lazily (once) so it stays out of the critical-path bundle.
let gsapModules: Promise<
	[typeof import('gsap'), typeof import('gsap/ScrollTrigger')]
> | null = null;
function loadGsap() {
	gsapModules ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
		([g, st]) => {
			g.gsap.registerPlugin(st.ScrollTrigger);
			return [g, st] as [typeof g, typeof st];
		}
	);
	return gsapModules;
}

/**
 * use:reveal — the one shared scroll-reveal preset.
 * Opacity 0→1, y 24→0, --ease-out, optional stagger over children.
 * Animates once; collapses to nothing under prefers-reduced-motion.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	if (reduced()) return;

	const { y = 24, stagger = 0.06, children } = options;
	const targets: Element[] = children ? [...node.querySelectorAll(children)] : [node];

	// hide synchronously so nothing flashes while gsap loads
	for (const el of targets) {
		(el as HTMLElement).style.opacity = '0';
		(el as HTMLElement).style.transform = `translateY(${y}px)`;
	}

	let destroyed = false;
	let cleanup: (() => void) | undefined;

	loadGsap().then(([{ gsap }]) => {
		if (destroyed) return;
		const tween = gsap.to(targets, {
			opacity: 1,
			y: 0,
			duration: 0.4,
			ease: 'power3.out', // ≈ --ease-out
			stagger,
			scrollTrigger: {
				trigger: node,
				start: 'top 85%',
				once: true
			}
		});
		cleanup = () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	});

	return {
		destroy() {
			destroyed = true;
			cleanup?.();
		}
	};
};
