<script lang="ts">
	import { tick } from 'svelte';
	import ChatMessage from './ChatMessage.svelte';

	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	const suggestions = [
		'What did he build at Tata Steel?',
		'Strongest backend work?',
		'Is he actually good at football analytics yet?'
	];

	let messages = $state<Message[]>([]);
	let input = $state('');
	let streaming = $state(false);
	let errorMsg = $state('');
	let scrollEl: HTMLDivElement | undefined = $state();

	async function scrollDown() {
		await tick();
		scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
	}

	async function ask(question: string) {
		const q = question.trim();
		if (!q || streaming) return;
		input = '';
		errorMsg = '';
		messages.push({ role: 'user', content: q });
		streaming = true;
		scrollDown();

		try {
			const res = await fetch('/api/ask', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// 4-message window — same cap the server enforces
				body: JSON.stringify({ messages: messages.slice(-4) })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({ error: `error ${res.status}` }));
				errorMsg = data.error ?? `error ${res.status}`;
				messages.pop(); // let the user retry the same question
				return;
			}

			messages.push({ role: 'assistant', content: '' });
			const current = messages[messages.length - 1];

			const reader = res.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const events = buffer.split('\n\n');
				buffer = events.pop() ?? '';
				for (const event of events) {
					const data = event.replace(/^data: /, '').trim();
					if (!data || data === '[DONE]') continue;
					try {
						const token = (JSON.parse(data) as { response?: string }).response;
						if (token) {
							current.content += token;
							scrollDown();
						}
					} catch {
						// partial/keepalive lines are fine to skip
					}
				}
			}
		} catch {
			errorMsg = 'connection lost — try again';
		} finally {
			streaming = false;
			scrollDown();
		}
	}
</script>

<div
	class="rounded-xl border border-pulse/30 bg-panel shadow-[0_0_48px_var(--signal-glow)]"
	style="--tw-shadow-color: color-mix(in srgb, var(--pulse) 12%, transparent)"
>
	<div class="flex items-center gap-2 border-b border-hairline/60 px-4 py-3">
		<span class="h-2 w-2 rounded-full bg-pulse"></span>
		<span class="font-mono text-[length:var(--text-mono)] text-ink-dim">ask-about-me · rag over resume + case studies + logs</span>
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -- scrollable region must be keyboard-focusable (axe: scrollable-region-focusable) -->
	<div
		bind:this={scrollEl}
		class="flex max-h-96 min-h-48 flex-col gap-4 overflow-y-auto p-4"
		aria-live="polite"
		role="log"
		aria-label="Chat transcript"
		tabindex="0"
	>
		{#if messages.length === 0}
			<p class="text-ink-faint">
				A retrieval pipeline over everything on this site. Ask it something — it answers only from
				what's indexed, and says so when it doesn't know.
			</p>
		{/if}
		{#each messages as message, i (i)}
			<ChatMessage
				role={message.role}
				content={message.content}
				streaming={streaming && i === messages.length - 1 && message.role === 'assistant'}
			/>
		{/each}
		{#if errorMsg}
			<p class="font-mono text-[length:var(--text-mono)] text-alert">! {errorMsg}</p>
		{/if}
	</div>

	{#if messages.length === 0}
		<div class="flex flex-wrap gap-2 px-4 pb-3">
			{#each suggestions as suggestion (suggestion)}
				<button
					class="rounded border border-pulse/35 px-2.5 py-1 font-mono text-[length:var(--text-mono)] text-pulse transition-colors duration-150 hover:bg-pulse/10"
					onclick={() => ask(suggestion)}
				>
					{suggestion}
				</button>
			{/each}
		</div>
	{/if}

	<form
		class="flex gap-2 border-t border-hairline/60 p-3"
		onsubmit={(e) => {
			e.preventDefault();
			ask(input);
		}}
	>
		<input
			bind:value={input}
			placeholder={streaming ? 'thinking…' : 'ask about anshu'}
			disabled={streaming}
			maxlength={500}
			class="w-full rounded-lg border border-hairline bg-substrate px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus:border-pulse focus:outline-none disabled:opacity-60"
			aria-label="Ask a question about Anshu"
		/>
		<button
			type="submit"
			disabled={streaming || !input.trim()}
			class="rounded-lg border border-pulse/40 px-4 font-mono text-[length:var(--text-mono)] text-pulse transition-colors duration-150 hover:bg-pulse/10 disabled:cursor-not-allowed disabled:opacity-40"
		>
			send
		</button>
	</form>
</div>
