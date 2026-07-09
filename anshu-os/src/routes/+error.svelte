<script lang="ts">
	import { page } from '$app/state';
	import Terminal from '$lib/components/system/Terminal.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import type { TerminalLine } from '$lib/terminal/commands';

	const is404 = $derived(page.status === 404);
	const path = $derived(page.url.pathname);

	const welcome = $derived<TerminalLine[]>([
		{ text: `*** KERNEL PANIC — ${is404 ? 'VFS' : 'FAULT'} ***`, kind: 'err' },
		{
			text: is404
				? `segfault: unable to mount ${path} — page not found (errno 404)`
				: `unhandled exception at ${path} (errno ${page.status})`,
			kind: 'err'
		},
		{ text: '', kind: 'out' },
		{ text: 'call trace:', kind: 'out' },
		{ text: `  [<anshu.os>] router_resolve+0x${page.status}/0xfff`, kind: 'out' },
		{ text: `  [<anshu.os>] vfs_lookup("${path}")  ← EIP`, kind: 'out' },
		{ text: '  [<anshu.os>] handle_request+0x1a/0x2e', kind: 'out' },
		{ text: '', kind: 'out' },
		{ text: 'system is still ONLINE. recovery options:', kind: 'accent' },
		{ text: "  open home · open work · open lab · help", kind: 'accent' }
	]);
</script>

<Seo title="{page.status} — kernel panic" description="Page not found on anshu.os" />

<section class="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center px-4 py-16">
	<p class="font-mono text-[length:var(--text-mono)] text-ink-faint">
		anshu.os — crash handler
	</p>
	<h1 class="mt-2 font-mono text-4xl font-bold tracking-tight text-alert sm:text-5xl">
		{page.status}
	</h1>
	<p class="mt-3 max-w-prose text-ink-dim">
		{#if is404}
			This page was paged out and never paged back in. The rest of the system is fine — use the
			terminal below to get back somewhere real.
		{:else}
			Something crashed on our side. The terminal below still works — try again from there.
		{/if}
	</p>

	<div class="mt-8">
		<Terminal {welcome} autofocus maxHeight="24rem" />
	</div>

	<p class="mt-6 font-mono text-[length:var(--text-mono)] text-ink-faint">
		or take the safe path: <a href="/" class="text-signal hover:underline">return to /</a>
	</p>
</section>
