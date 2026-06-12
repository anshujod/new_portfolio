<script lang="ts">
	import { onMount } from 'svelte';
	import skillsData from '$lib/data/skills.json';

	let { missionTitles = {} }: { missionTitles?: Record<string, string> } = $props();

	interface Skill {
		id: string;
		label: string;
		domain: string;
		depth: number;
		tools: string[];
		projects: string[];
	}

	interface Node extends Skill {
		x: number;
		y: number;
		vx: number;
		vy: number;
		r: number;
		seed: number;
	}

	const skills = skillsData as Skill[];

	const domainLabel: Record<string, string> = {
		languages: 'languages',
		web: 'web',
		'ml-vision': 'ml & vision',
		data: 'data',
		cloud: 'cloud'
	};

	// color encodes domain — purple stays exclusive to the AI cluster
	const domainColor: Record<string, string> = {
		languages: '#98A0B8',
		web: '#4D7CFF',
		'ml-vision': '#B86EFF',
		data: '#41E2D8',
		cloud: '#E8EAF2'
	};

	const domains = [...new Set(skills.map((s) => s.domain))];

	// edges between skills that co-occur in a mission
	const edges: [number, number][] = [];
	for (let i = 0; i < skills.length; i++)
		for (let j = i + 1; j < skills.length; j++)
			if (skills[i].projects.some((p) => skills[j].projects.includes(p))) edges.push([i, j]);

	const missionTitle = (slug: string) => missionTitles[slug] ?? slug;

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let wrapEl: HTMLDivElement | undefined = $state();
	let listMode = $state(false);
	let selected = $state<Skill | null>(null);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			listMode = true;
			return;
		}
		if (!canvasEl || !wrapEl) return;

		const canvas = canvasEl;
		const ctx = canvas.getContext('2d')!;
		const dpr = Math.min(devicePixelRatio, 2);
		let width = 0;
		const height = 460;

		const nodes: Node[] = skills.map((s, i) => ({
			...s,
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			r: 4 + s.depth * 2.5,
			seed: i * 1.7
		}));

		const clusterCenter = (domain: string) => {
			const i = domains.indexOf(domain);
			return {
				x: ((i + 0.5) / domains.length) * width,
				y: height * (i % 2 === 0 ? 0.42 : 0.58)
			};
		};

		function layout() {
			width = wrapEl!.clientWidth;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.height = `${height}px`;
			for (const n of nodes) {
				const c = clusterCenter(n.domain);
				n.x = c.x + (Math.random() - 0.5) * 80;
				n.y = c.y + (Math.random() - 0.5) * 80;
			}
		}
		layout();

		let hovered: Node | null = null;
		let t = 0;
		let raf = 0;
		let running = false;

		function step() {
			t += 0.01;
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				// repulsion
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d2 = Math.max(dx * dx + dy * dy, 60);
					const f = 900 / d2;
					const inv = 1 / Math.sqrt(d2);
					a.vx += dx * inv * f;
					a.vy += dy * inv * f;
					b.vx -= dx * inv * f;
					b.vy -= dy * inv * f;
				}
				// cluster gravity + wander
				const c = clusterCenter(a.domain);
				a.vx += (c.x - a.x) * 0.004 + Math.sin(t + a.seed) * 0.02;
				a.vy += (c.y - a.y) * 0.006 + Math.cos(t * 0.8 + a.seed) * 0.02;
			}
			// edge springs
			for (const [i, j] of edges) {
				const a = nodes[i];
				const b = nodes[j];
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const d = Math.hypot(dx, dy) || 1;
				const f = (d - 80) * 0.0015;
				a.vx += (dx / d) * f;
				a.vy += (dy / d) * f;
				b.vx -= (dx / d) * f;
				b.vy -= (dy / d) * f;
			}
			for (const n of nodes) {
				n.vx *= 0.9;
				n.vy *= 0.9;
				// margin keeps the text labels inside the canvas, not just the dots
				n.x = Math.max(n.r + 44, Math.min(width - n.r - 44, n.x + n.vx));
				n.y = Math.max(n.r + 14, Math.min(height - n.r - 22, n.y + n.vy));
			}
		}

		function draw() {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);

			for (const [i, j] of edges) {
				const lit = hovered && (nodes[i] === hovered || nodes[j] === hovered);
				ctx.strokeStyle = lit ? 'rgba(77,124,255,0.55)' : 'rgba(35,39,56,0.9)';
				ctx.lineWidth = lit ? 1.2 : 0.75;
				ctx.beginPath();
				ctx.moveTo(nodes[i].x, nodes[i].y);
				ctx.lineTo(nodes[j].x, nodes[j].y);
				ctx.stroke();
			}

			for (const n of nodes) {
				const lit = hovered === n;
				ctx.fillStyle = domainColor[n.domain];
				ctx.globalAlpha = lit ? 1 : 0.75;
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r + (lit ? 1.5 : 0), 0, Math.PI * 2);
				ctx.fill();
				if (lit) {
					ctx.globalAlpha = 0.2;
					ctx.beginPath();
					ctx.arc(n.x, n.y, n.r + 8, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.globalAlpha = lit ? 1 : 0.6;
				ctx.fillStyle = lit ? '#E8EAF2' : '#98A0B8';
				ctx.font = '10px "JetBrains Mono", monospace';
				ctx.textAlign = 'center';
				ctx.fillText(n.label.toLowerCase(), n.x, n.y + n.r + 13);
				ctx.globalAlpha = 1;
			}
		}

		function loop() {
			step();
			draw();
			raf = requestAnimationFrame(loop);
		}

		// only burn frames while the section is on screen
		const io = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !running) {
				running = true;
				raf = requestAnimationFrame(loop);
			} else if (!entry.isIntersecting && running) {
				running = false;
				cancelAnimationFrame(raf);
			}
		});
		io.observe(canvas);

		const hit = (e: PointerEvent): Node | null => {
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			let best: Node | null = null;
			let bestD = Infinity;
			for (const n of nodes) {
				const d = Math.hypot(n.x - x, n.y - y);
				if (d < n.r + 10 && d < bestD) {
					best = n;
					bestD = d;
				}
			}
			return best;
		};

		const onMove = (e: PointerEvent) => {
			hovered = hit(e);
			canvas.style.cursor = hovered ? 'pointer' : 'default';
			if (hovered) selected = hovered;
		};
		const onClick = (e: PointerEvent) => {
			const n = hit(e);
			if (n) selected = n;
		};
		canvas.addEventListener('pointermove', onMove);
		canvas.addEventListener('pointerdown', onClick);

		const ro = new ResizeObserver(layout);
		ro.observe(wrapEl);

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			ro.disconnect();
			canvas.removeEventListener('pointermove', onMove);
			canvas.removeEventListener('pointerdown', onClick);
		};
	});
</script>

<div bind:this={wrapEl} class="relative">
	{#if !listMode}
		<canvas bind:this={canvasEl} class="w-full" aria-hidden="true"></canvas>

		<!-- inspect panel -->
		<div
			class="mt-4 min-h-32 rounded-lg border border-hairline bg-panel p-4 font-mono text-[length:var(--text-mono)] lg:absolute lg:top-4 lg:right-0 lg:mt-0 lg:w-72"
		>
			{#if selected}
				<p class="text-ink-faint">$ inspect {selected.id}</p>
				<p class="mt-2 text-ink">
					{selected.label}
					<span style="color: {domainColor[selected.domain]}">· {domainLabel[selected.domain]}</span>
				</p>
				<p class="mt-1 text-ink-dim">
					depth: <span class="text-trace">{'▰'.repeat(selected.depth)}{'▱'.repeat(3 - selected.depth)}</span>
				</p>
				{#if selected.tools.length}
					<p class="mt-1 text-ink-dim">tools: {selected.tools.join(', ')}</p>
				{/if}
				{#if selected.projects.length}
					<p class="mt-2 text-ink-faint">used in:</p>
					<ul>
						{#each selected.projects as slug (slug)}
							<li>
								<a href="/work/{slug}" class="text-signal hover:underline">→ {missionTitle(slug)}</a>
							</li>
						{/each}
					</ul>
				{/if}
			{:else}
				<p class="text-ink-faint">$ inspect <span class="animate-pulse">▍</span></p>
				<p class="mt-2 text-ink-dim">hover a node to inspect the module</p>
			{/if}
		</div>
	{/if}

	<!-- accessible fallback: same data, structured list (replaces canvas under reduced motion) -->
	<div class={listMode ? '' : 'sr-only'}>
		{#each domains as domain (domain)}
			<div class="mb-6">
				<h3 class="eyebrow mb-2">{domainLabel[domain]}</h3>
				<ul class="space-y-1 font-mono text-[length:var(--text-mono)] text-ink-dim">
					{#each skills.filter((s) => s.domain === domain) as skill (skill.id)}
						<li>
							{skill.label} — depth {skill.depth}/3
							{#if skill.projects.length}
								· used in
								{#each skill.projects as slug, i (slug)}
									<a href="/work/{slug}" class="text-signal hover:underline">{missionTitle(slug)}</a>{i < skill.projects.length - 1 ? ', ' : ''}
								{/each}
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>
