<script lang="ts">
	import Terminal from './Terminal.svelte';
	import { palette } from '$lib/terminal/palette.svelte';
	import type { TerminalLine } from '$lib/terminal/commands';

	const welcome: TerminalLine[] = [
		{ text: 'anshu.os command palette — type help for commands', kind: 'out' }
	];

	function onkeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			palette.open = !palette.open;
		} else if (e.key === '`' && !typing && !palette.open) {
			e.preventDefault();
			palette.open = true;
		} else if (e.key === 'Escape' && palette.open) {
			palette.open = false;
		}
	}
</script>

<svelte:window {onkeydown} />

{#if palette.open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-start justify-center bg-void/60 px-4 pt-[18vh] backdrop-blur-sm"
		onclick={(e) => {
			if (e.target === e.currentTarget) palette.open = false;
		}}
		role="dialog"
		aria-modal="true"
		aria-label="Command palette"
		tabindex="-1"
	>
		<div class="w-full max-w-2xl shadow-[0_0_0_1px_var(--signal),0_0_48px_var(--signal-glow)] rounded-xl">
			<Terminal {welcome} autofocus maxHeight="40vh" onnavigated={() => (palette.open = false)} />
		</div>
	</div>
{/if}
