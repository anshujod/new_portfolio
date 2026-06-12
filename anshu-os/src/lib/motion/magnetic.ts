import type { Action } from 'svelte/action';

/**
 * use:magnetic — primary buttons lean ≤6px toward the cursor (blueprint §8.3).
 * No-op on coarse pointers and under prefers-reduced-motion.
 */
export const magnetic: Action<HTMLElement, { strength?: number } | undefined> = (
	node,
	options = {}
) => {
	if (
		matchMedia('(prefers-reduced-motion: reduce)').matches ||
		matchMedia('(pointer: coarse)').matches
	)
		return;

	const strength = options.strength ?? 6;
	node.style.transition = 'transform 160ms var(--ease-out)';

	function onMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		const x = Math.max(-strength, Math.min(strength, dx * 0.15));
		const y = Math.max(-strength, Math.min(strength, dy * 0.15));
		node.style.transform = `translate(${x}px, ${y}px)`;
	}

	function onLeave() {
		node.style.transform = 'translate(0, 0)';
	}

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
};
