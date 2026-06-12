import { site } from '$lib/data/site';

export type LineKind = 'cmd' | 'out' | 'err' | 'accent';

export interface TerminalLine {
	text: string;
	kind?: LineKind;
}

export interface CommandContext {
	navigate: (path: string) => void;
	openExternal: (url: string) => void;
	clear: () => void;
}

export interface Command {
	name: string;
	description: string;
	/** completions for the first argument */
	argOptions?: string[];
	run: (args: string[], ctx: CommandContext) => TerminalLine[];
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
			...site.ticker.map((t) => out(`metric:  ${t}`)),
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
		run: (args) =>
			args.join(' ') === 'hire-me'
				? [
						accent('privilege escalation approved.'),
						out(`forwarding to ${site.email} — or just: connect --mail`)
					]
				: [err('anshu is not in the sudoers file. this incident will be reported.')]
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
