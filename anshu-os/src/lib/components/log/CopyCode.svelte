<script lang="ts">
	// Renderless: injects a copy button into every .prose pre.shiki on the page.
	import { onMount } from 'svelte';

	onMount(() => {
		const buttons: HTMLButtonElement[] = [];
		for (const pre of document.querySelectorAll<HTMLPreElement>('.prose pre')) {
			const button = document.createElement('button');
			button.className = 'code-copy';
			button.textContent = 'copy';
			button.addEventListener('click', async () => {
				await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? '');
				button.textContent = 'copied';
				setTimeout(() => (button.textContent = 'copy'), 1500);
			});
			pre.appendChild(button);
			buttons.push(button);
		}
		return () => buttons.forEach((b) => b.remove());
	});
</script>
