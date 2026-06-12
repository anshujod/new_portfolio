// Build-time OG images: satori → resvg → static/og/*.png (1200×630).
// One per mission and post, plus a default card. Run before vite build.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'static/og');
mkdirSync(OUT, { recursive: true });

const clash = readFileSync(join(root, 'scripts/fonts/clash-display-600.ttf'));
const mono = readFileSync(join(root, 'scripts/fonts/jetbrains-mono-400.ttf'));

const palette = {
	void: '#050507',
	panel: '#10121A',
	hairline: '#232738',
	ink: '#E8EAF2',
	inkFaint: '#4A4F63',
	signal: '#4D7CFF',
	pulse: '#B86EFF',
	trace: '#41E2D8'
};

const el = (type, style, children) => ({ type, props: { style, children } });

function card({ path, title, accent }) {
	return el(
		'div',
		{
			width: '100%',
			height: '100%',
			display: 'flex',
			background: palette.void,
			padding: 48
		},
		el(
			'div',
			{
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: palette.panel,
				border: `1px solid ${palette.hairline}`,
				borderRadius: 16,
				padding: 56
			},
			[
				el(
					'div',
					{
						fontFamily: 'JetBrains Mono',
						fontSize: 26,
						letterSpacing: 2,
						color: palette.inkFaint,
						textTransform: 'uppercase'
					},
					path
				),
				el(
					'div',
					{
						fontFamily: 'Clash Display',
						fontSize: title.length > 60 ? 56 : 68,
						lineHeight: 1.1,
						letterSpacing: -2,
						color: palette.ink,
						maxWidth: 980
					},
					title
				),
				el('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
					el('div', { width: 64, height: 4, background: accent, borderRadius: 2 }),
					el(
						'div',
						{ fontFamily: 'JetBrains Mono', fontSize: 26, color: palette.inkFaint },
						'anshu.os — full-stack engineer / applied ai'
					)
				])
			]
		)
	);
}

async function render(name, props) {
	const svg = await satori(card(props), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Clash Display', data: clash, weight: 600, style: 'normal' },
			{ name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' }
		]
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
	writeFileSync(join(OUT, `${name}.png`), png);
}

const frontmatter = (file) => {
	const raw = readFileSync(file, 'utf8');
	return raw.match(/^---\n[\s\S]*?title:\s*["']?(.+?)["']?\n[\s\S]*?---/)?.[1] ?? null;
};

const jobs = [
	render('default', {
		path: '~/anshu.os',
		title: 'Anshu Prakash Hindoyar',
		accent: palette.signal
	})
];

for (const file of readdirSync(join(root, 'src/content/work')).sort()) {
	if (!file.endsWith('.svx')) continue;
	const slug = file.replace('.svx', '');
	const title = frontmatter(join(root, 'src/content/work', file)) ?? slug;
	jobs.push(render(`work-${slug}`, { path: `~/work/${slug}`, title, accent: palette.signal }));
}

for (const file of readdirSync(join(root, 'src/content/log')).sort()) {
	if (!file.endsWith('.svx')) continue;
	const slug = file.replace('.svx', '');
	const title = frontmatter(join(root, 'src/content/log', file)) ?? slug;
	jobs.push(render(`log-${slug}`, { path: `~/log/${slug}`, title, accent: palette.pulse }));
}

await Promise.all(jobs);
console.log(`og images: ${jobs.length} cards → static/og/`);
