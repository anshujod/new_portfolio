<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { parse } from '$lib/terminal/parser';
	import { History } from '$lib/terminal/history';
	import { find, complete, type TerminalLine } from '$lib/terminal/commands';

	let {
		welcome = [],
		autofocus = false,
		maxHeight = '20rem',
		onnavigated
	}: {
		welcome?: TerminalLine[];
		autofocus?: boolean;
		maxHeight?: string;
		onnavigated?: () => void;
	} = $props();

	// svelte-ignore state_referenced_locally -- welcome intentionally seeds the transcript once
	let lines = $state<TerminalLine[]>([...welcome]);
	let input = $state('');
	let busy = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();
	let scrollEl: HTMLDivElement | undefined = $state();

	const history = new History();

	const ctx = {
		navigate: (path: string) => {
			goto(path);
			onnavigated?.();
		},
		openExternal: (url: string) => {
			if (url.startsWith('mailto:') || url.startsWith('/')) window.location.href = url;
			else window.open(url, '_blank', 'noopener');
		},
		clear: () => {
			lines = [];
		},
		print: (line: TerminalLine) => {
			lines.push(line);
			scrollToBottom();
		},
		update: (text: string) => {
			if (lines.length) lines[lines.length - 1].text = text;
			scrollToBottom();
		}
	};

	async function scrollToBottom() {
		await tick();
		scrollEl?.scrollTo({ top: scrollEl.scrollHeight });
	}

	async function submit() {
		const raw = input;
		input = '';
		lines.push({ text: raw, kind: 'cmd' });
		const { name, args } = parse(raw);
		if (name) {
			history.push(raw);
			const cmd = find(name);
			if (cmd) {
				const result = cmd.run(args, ctx);
				if (result instanceof Promise) {
					busy = true;
					try {
						lines.push(...(await result));
					} finally {
						busy = false;
						inputEl?.focus();
					}
				} else {
					lines.push(...result);
				}
			} else
				lines.push({
					text: `${name}: command not found — try 'help'`,
					kind: 'err'
				});
		}
		scrollToBottom();
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (!busy) submit();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			input = history.up(input);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			input = history.down();
		} else if (e.key === 'Tab') {
			e.preventDefault();
			const completed = complete(input);
			if (completed) input = completed;
		}
	}

	export function focus() {
		inputEl?.focus();
	}

	$effect(() => {
		if (autofocus) inputEl?.focus({ preventScroll: true });
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="flex flex-col rounded-xl border border-hairline bg-panel font-mono text-[length:var(--text-mono)]"
	onclick={() => inputEl?.focus()}
>
	<div class="flex items-center gap-1.5 border-b border-hairline/60 px-4 py-2.5">
		<span class="h-2.5 w-2.5 rounded-full bg-alert/60"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-trace/40"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-signal/40"></span>
		<span class="ml-3 text-ink-faint">anshu@os — terminal</span>
	</div>

	<div bind:this={scrollEl} class="overflow-y-auto p-4" style="max-height: {maxHeight}">
		{#each lines as line, i (i)}
			{#if line.kind === 'cmd'}
				<p class="mt-2 text-ink"><span class="text-ink-faint">anshu@os:~$</span> {line.text}</p>
			{:else if line.kind === 'err'}
				<p class="whitespace-pre-wrap text-alert">{line.text}</p>
			{:else if line.kind === 'accent'}
				<p class="whitespace-pre-wrap text-trace">{line.text}</p>
			{:else}
				<p class="whitespace-pre-wrap text-ink-dim">{line.text}</p>
			{/if}
		{/each}

		<div class="mt-2 flex items-center gap-2">
			<span class="shrink-0 text-ink-faint">anshu@os:~$</span>
			<input
				bind:this={inputEl}
				bind:value={input}
				{onkeydown}
				disabled={busy}
				placeholder={busy ? 'working…' : ''}
				class="w-full bg-transparent text-ink caret-trace outline-none placeholder:text-ink-faint disabled:opacity-60"
				spellcheck="false"
				autocomplete="off"
				autocapitalize="off"
				aria-label="Terminal input"
			/>
		</div>
	</div>
</div>
