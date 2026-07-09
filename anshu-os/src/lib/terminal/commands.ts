import { site } from '$lib/data/site';
import { overclock } from '$lib/stores/overclock.svelte';

export type LineKind = 'cmd' | 'out' | 'err' | 'accent';

export interface TerminalLine {
	text: string;
	kind?: LineKind;
}

export interface CommandContext {
	navigate: (path: string) => void;
	openExternal: (url: string) => void;
	clear: () => void;
	/** append a line to the transcript immediately (for long-running commands) */
	print: (line: TerminalLine) => void;
	/** replace the text of the last printed line (for streaming output) */
	update: (text: string) => void;
}

export interface Command {
	name: string;
	description: string;
	/** completions for the first argument */
	argOptions?: string[];
	run: (args: string[], ctx: CommandContext) => TerminalLine[] | Promise<TerminalLine[]>;
}

const out = (text: string): TerminalLine => ({ text, kind: 'out' });
const err = (text: string): TerminalLine => ({ text, kind: 'err' });
const accent = (text: string): TerminalLine => ({ text, kind: 'accent' });

const connectTargets: Record<string, string> = {
	'--github': site.links.github,
	'--linkedin': site.links.linkedin,
	'--leetcode': site.links.leetcode,
	'--mail': `mailto:${site.email}`
};

export const commands: Command[] = [
	{
		name: 'help',
		description: 'list available commands',
		run: () => [
			out('available commands:'),
			...registry().map((c) => out(`  ${c.name.padEnd(10)} ${c.description}`)),
			out(''),
			out('tab completes · ↑↓ recalls history')
		]
	},
	{
		name: 'open',
		description: 'open a section — open work | lab | log | home',
		argOptions: ['work', 'lab', 'log', 'home'],
		run: (args, ctx) => {
			const target = args[0];
			const paths: Record<string, string> = { work: '/work', lab: '/lab', log: '/log', home: '/' };
			if (!target || !(target in paths)) return [err(`usage: open <work|lab|log|home>`)];
			ctx.navigate(paths[target]);
			return [accent(`→ mounting ${paths[target]}`)];
		}
	},
	{
		name: 'ls',
		description: 'list subsystems',
		run: () => [out('work/   lab/   log/   connect/   resume.pdf')]
	},
	{
		name: 'connect',
		description: 'open a channel — connect --github | --linkedin | --leetcode | --mail',
		argOptions: Object.keys(connectTargets),
		run: (args, ctx) => {
			const flag = args[0];
			if (!flag || !(flag in connectTargets))
				return [err('usage: connect --github | --linkedin | --leetcode | --mail')];
			ctx.openExternal(connectTargets[flag]);
			return [accent(`→ opening channel ${flag.replace('--', '')}`)];
		}
	},
	{
		name: 'send',
		description: 'send a message — send "your message"',
		run: (args, ctx) => {
			const message = args.join(' ').trim();
			if (!message) return [err('usage: send "your message"')];
			ctx.openExternal(
				`mailto:${site.email}?subject=${encodeURIComponent('ping from anshu.os')}&body=${encodeURIComponent(message)}`
			);
			return [accent('→ opening transmission channel (mail client)')];
		}
	},
	{
		name: 'cat',
		description: 'cat resume — download the PDF',
		argOptions: ['resume'],
		run: (args, ctx) => {
			if (args[0] !== 'resume' && args[0] !== 'resume.pdf')
				return [err(`cat: ${args[0] ?? ''}: no such file`)];
			ctx.openExternal('/resume.pdf');
			return [accent('→ streaming resume.pdf')];
		}
	},
	{
		name: 'status',
		description: 'system status',
		run: () => [
			out(`${site.name} ${site.version} — ${site.location.toLowerCase()}`),
			out(`role:    ${site.role.toLowerCase()}`),
			accent('status:  ONLINE')
		]
	},
	{
		name: 'whoami',
		description: 'identify the operator',
		run: () => [
			out('anshu — electronics student turned full-stack shipper,'),
			out('turned computer-vision engineer, currently going deep'),
			out('on llms and agents. the trajectory is the point.')
		]
	},
	{
		name: 'ask',
		description: 'query the rag bot — ask what stack does anshu use?',
		run: async (args, ctx) => {
			const question = args.join(' ').trim();
			if (!question) return [err('usage: ask <question about anshu>')];
			ctx.print(accent('→ retrieving from index…'));
			try {
				const res = await fetch('/api/ask', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: [{ role: 'user', content: question }] })
				});
				if (!res.ok) {
					const data = await res.json().catch(() => ({ error: `error ${res.status}` }));
					return [err(String(data.error ?? `error ${res.status}`))];
				}
				ctx.print(out(''));
				let answer = '';
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
								answer += token;
								ctx.update(answer);
							}
						} catch {
							// partial/keepalive lines are fine to skip
						}
					}
				}
				return answer ? [] : [err('empty response — try the chat on /lab')];
			} catch {
				return [err('connection lost — try again, or use the chat on /lab')];
			}
		}
	},
	{
		name: 'neofetch',
		description: 'system information',
		run: () => {
			const uptimeYears = Math.floor(
				(Date.now() - new Date('2003-10-11').getTime()) / (365.25 * 24 * 3600 * 1000)
			);
			const art = [
				'      ▄▀▄      ',
				'     ▄▀ ▀▄     ',
				'    ▄▀▄▄▄▀▄    ',
				'   ▄▀     ▀▄   ',
				'  ▀▀▀     ▀▀▀  ',
				'               ',
				'               ',
				'               ',
				'               '
			];
			const info = [
				`anshu@os`,
				`─────────────────────────────`,
				`os:      ${site.name} ${site.version} (${site.location.toLowerCase()})`,
				`kernel:  B.E. ECE (ramaiah) — self-taught userland`,
				`uptime:  ${uptimeYears} years, zero unplanned reboots`,
				`shell:   full-stack — MERN · sveltekit · react native`,
				`gpu:     yolov10 + bytetrack (field-tested at tata steel)`,
				`llm:     rag · agents · qlora — this terminal has 'ask'`,
				`editor:  vim (still inside, send help)`
			];
			return [
				out(''),
				...art.map((a, i) => out(`${a}${info[i] ?? ''}`)),
				accent(`  status:  ONLINE — open to interesting work`),
				out('')
			];
		}
	},
	{
		name: 'uptime',
		description: 'how long this system has been running',
		run: () => {
			const days = Math.floor((Date.now() - new Date('2003-10-11').getTime()) / 86400000);
			return [
				out(`up ${days} days — load average: shipping, learning, 500+ dsa problems`),
				accent('no downtime scheduled.')
			];
		}
	},
	{
		name: 'fortune',
		description: 'lessons learned the hard way',
		run: () => {
			const fortunes = [
				'hard frames are worth more than easy frames. — tata steel dataset log',
				'most of the accuracy gains came from the data, not the model.',
				'make the client idempotent instead of trusting delivery semantics. — chatify postmortem',
				'RPS, not accuracy — reward calibration, not confidence. — world cup engine',
				'the happy path is a weekend. presence, reconnection and abuse resistance are the project.',
				'understatement beats overstatement. every claim on this site is downloadable.',
				'the tournament is the test set no one has.',
				'understand the layer below the one you work in. — ECE first principles'
			];
			return [out(fortunes[Math.floor(Math.random() * fortunes.length)])];
		}
	},
	{
		name: 'clear',
		description: 'clear the terminal',
		run: (_args, ctx) => {
			ctx.clear();
			return [];
		}
	},
	{
		name: 'sudo',
		description: 'escalate privileges',
		argOptions: ['hire-me', 'overclock'],
		run: (args) => {
			const target = args.join(' ');
			if (target === 'hire-me')
				return [
					accent('privilege escalation approved.'),
					out(`forwarding to ${site.email} — or just: connect --mail`)
				];
			if (target === 'overclock') {
				overclock.on = !overclock.on;
				return overclock.on
					? [
							accent('⚡ OVERCLOCK ENGAGED — particle field thermal limits removed.'),
							out('(the konami code does this too. sudo overclock again to cool down.)')
						]
					: [out('overclock disengaged — thermals nominal.')];
			}
			return [err('anshu is not in the sudoers file. this incident will be reported.')];
		}
	},
	{
		name: 'vim',
		description: 'a mistake',
		run: () => [err('no exit. ever.')]
	},
	{
		name: 'rm',
		description: 'destructive. denied.',
		run: (args) =>
			args.join(' ').includes('-rf')
				? [err('rm: permission denied — this OS took 6 phases to build.')]
				: [err('rm: nothing here is disposable')]
	},
	{
		name: 'ping',
		description: 'latency check',
		run: () => [accent('pong — 0.4ms (it helps that everything is prerendered)')]
	},
	{
		name: 'coffee',
		description: 'brew something',
		run: () => [err("418 i'm a teapot — but the dev is definitely caffeinated")]
	},
	{
		name: 'exit',
		description: 'leave the terminal',
		run: () => [out('there is no exit from anshu.os — only Esc, and even that is temporary.')]
	},
	{
		name: 'theme',
		description: 'theme --light, if you dare',
		argOptions: ['--light'],
		run: (args) =>
			args[0] === '--light'
				? [err('light mode not found. this OS runs in the dark.')]
				: [out('usage: theme --light')]
	}
];

export function registry(): Command[] {
	return commands;
}

export function find(name: string): Command | undefined {
	return commands.find((c) => c.name === name);
}

/** Tab completion: command names, then first-arg options. */
export function complete(input: string): string | null {
	const parts = input.split(/\s+/);
	if (parts.length <= 1) {
		const matches = commands.filter((c) => c.name.startsWith(parts[0] ?? ''));
		return matches.length === 1 ? matches[0].name + ' ' : null;
	}
	const cmd = find(parts[0]);
	const last = parts[parts.length - 1];
	const matches = cmd?.argOptions?.filter((o) => o.startsWith(last)) ?? [];
	return matches.length === 1
		? [...parts.slice(0, -1), matches[0]].join(' ')
		: null;
}
