<script lang="ts">
	import { overclock } from '$lib/stores/overclock.svelte';

	const SEQUENCE = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a'
	];

	let progress = 0;
	let toast = $state('');
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	function showToast(text: string) {
		toast = text;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toast = ''), 4000);
	}

	function onkeydown(e: KeyboardEvent) {
		// don't intercept typing in the terminal, chat or any form field
		const target = e.target as HTMLElement | null;
		if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;

		progress = e.key === SEQUENCE[progress] ? progress + 1 : e.key === SEQUENCE[0] ? 1 : 0;
		if (progress === SEQUENCE.length) {
			progress = 0;
			overclock.on = !overclock.on;
			showToast(
				overclock.on
					? '⚡ OVERCLOCK ENGAGED — thermal limits removed'
					: 'overclock disengaged — thermals nominal'
			);
		}
	}
</script>

<svelte:window {onkeydown} />

{#if toast}
	<div
		class="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-lg border border-trace/50 bg-panel px-4 py-2.5 font-mono text-[length:var(--text-mono)] text-trace shadow-[0_0_32px_rgba(77,124,255,0.25)]"
		role="status"
	>
		{toast}
	</div>
{/if}
