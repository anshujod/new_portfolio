<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import MissionCard from '$lib/components/work/MissionCard.svelte';
	import PostRow from '$lib/components/log/PostRow.svelte';
	import BootSequence from '$lib/components/system/BootSequence.svelte';
	import Terminal from '$lib/components/system/Terminal.svelte';
	import Changelog from '$lib/components/home/Changelog.svelte';
	import SkillConstellation from '$lib/components/home/SkillConstellation.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { magnetic } from '$lib/motion/magnetic';
	import { site } from '$lib/data/site';
	import { onMount } from 'svelte';

	let { data } = $props();

	const missionTitles = $derived(
		Object.fromEntries(data.missions.map((m) => [m.slug, m.title]))
	);

	// Real local time in Bengaluru — authentic telemetry, not a fake "ONLINE" badge.
	const clockFmt = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Kolkata',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});
	let localTime = $state(clockFmt.format(new Date()));
	onMount(() => {
		const id = setInterval(() => (localTime = clockFmt.format(new Date())), 1000);
		return () => clearInterval(id);
	});

	// Proof signals as label/value pairs — value carries the data color, label stays neutral.
	const signals = site.ticker.map((t) => {
		const [label, ...rest] = t.split(':');
		return { label: label.trim(), value: rest.join(':').trim() };
	});
</script>

<Seo
	title={site.title}
	description="{site.title} — {site.role}. Production full-stack systems, applied computer vision, and an AI lab in public."
/>

<BootSequence />

<!-- Hero -->
<section class="relative flex min-h-[calc(100dvh-3.5rem)] items-center">
	<div class="mx-auto w-full max-w-[var(--content-max)] px-6" use:reveal={{ children: ':scope > *', y: 16, stagger: 0.08 }}>
		<p class="eyebrow mb-6">{site.name} {site.version} — {site.location.toLowerCase()} · <span class="text-trace tabular-nums">{localTime} IST</span></p>

		<h1
			class="font-display text-[length:var(--text-hero)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink"
		>
			ANSHU PRAKASH<br />HINDOYAR
		</h1>

		<p class="mt-5 font-body text-[length:var(--text-h3)] font-medium text-ink-dim">
			{site.role}
		</p>
		<p class="mt-2 max-w-xl font-mono text-[length:var(--text-mono)] text-ink-faint">
			~ {site.tagline}
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-4 font-mono text-[length:var(--text-ui)]">
			<a
				href="/work"
				use:magnetic
				class="group rounded-lg border border-signal bg-signal/10 px-5 py-3 text-ink transition-all duration-150 hover:bg-signal/15 hover:shadow-[0_0_0_1px_var(--signal),0_0_32px_var(--signal-glow)]"
			>
				<span class="text-signal">&gt;</span> view work
			</a>
			<a
				href="/lab"
				use:magnetic
				class="group rounded-lg border border-hairline px-5 py-3 text-ink-dim transition-colors duration-150 hover:border-pulse hover:text-ink"
			>
				<span class="text-pulse">&gt;</span> open lab
			</a>
		</div>

		<!-- One quiet line that frames the concept for anyone who doesn't read the metaphor (the ⌘K cue only shows where a keyboard exists). -->
		<p class="mt-5 font-mono text-[length:var(--text-mono)] text-ink-faint">
			a portfolio that runs like an operating system.<span class="hidden sm:inline"> press <kbd class="rounded border border-hairline px-1.5 py-0.5 text-ink-dim">⌘K</kbd> for the command palette.</span>
		</p>

		<!-- The two links a recruiter reaches for first — kept quiet so they don't fight the CTAs. -->
		<p class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[length:var(--text-mono)] text-ink-faint">
			<a href="/resume.pdf" class="text-ink-dim transition-colors duration-150 hover:text-signal">cat resume.pdf ↗</a>
			<span aria-hidden="true">·</span>
			<a href={site.links.github} class="text-ink-dim transition-colors duration-150 hover:text-signal">github ↗</a>
		</p>

		<dl
			class="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline/60 pt-6 font-mono text-[length:var(--text-mono)]"
		>
			{#each signals as s (s.label)}
				<div class="flex flex-col gap-0.5">
					<dt class="tracking-[0.05em] text-ink-faint uppercase">{s.label}</dt>
					<dd class="text-[length:var(--text-ui)] text-trace tabular-nums">{s.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!-- About — kernel changelog -->
<section id="about" class="bg-substrate">
	<div class="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-gap)]">
		<div use:reveal>
			<SectionHeader path="~/about" title="Kernel Changelog" />
		</div>
		<div use:reveal={{ children: ':scope > div', y: 16 }}>
			<Changelog />
		</div>
	</div>
</section>

<!-- Skills — process constellation -->
<section id="skills" class="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-gap)]">
	<div use:reveal>
		<SectionHeader path="~/skills" title="Process Constellation" live />
	</div>
	<div use:reveal={{ y: 16 }}>
		<SkillConstellation {missionTitles} />
	</div>
</section>

<!-- Missions preview -->
<section class="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-gap)]">
	<div use:reveal>
		<SectionHeader path="~/projects" title="Deployed Missions" />
	</div>
	<div class="grid gap-5 md:grid-cols-2" use:reveal={{ children: ':scope > article' }}>
		{#each data.missions as mission, i (mission.slug)}
			<MissionCard {mission} index={i} />
		{/each}
	</div>
	<p class="mt-8 font-mono text-[length:var(--text-mono)]">
		<a href="/work" class="text-signal hover:underline">[ all missions → ]</a>
	</p>
</section>

<!-- Recent logs -->
<section class="mx-auto max-w-[var(--content-max)] px-6 pb-[var(--section-gap)]">
	<div use:reveal>
		<SectionHeader path="~/logs" title="System Logs" />
	</div>
	<div class="border-t border-hairline/60" use:reveal={{ children: ':scope > a', y: 12 }}>
		{#each data.recentPosts as post (post.slug)}
			<PostRow {post} />
		{/each}
	</div>
	<p class="mt-8 font-mono text-[length:var(--text-mono)]">
		<a href="/log" class="text-signal hover:underline">[ all entries → ]</a>
	</p>
</section>

<!-- Connect — the terminal, for real -->
<section id="connect" class="bg-substrate">
	<div class="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-gap)]">
		<div use:reveal>
			<SectionHeader path="~/contact" title="Open a Channel" live />
		</div>

		<div class="max-w-2xl" use:reveal={{ y: 16 }}>
			<Terminal
				welcome={[
					{ text: 'channel open. try: connect --github · send "hello" · cat resume · help', kind: 'out' }
				]}
				maxHeight="24rem"
			/>

			<!-- the terminal is the experience, the links are the guarantee -->
			<ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[length:var(--text-mono)]">
				<li><a class="text-ink-dim hover:text-signal" href={site.links.github}>github ↗</a></li>
				<li><a class="text-ink-dim hover:text-signal" href={site.links.linkedin}>linkedin ↗</a></li>
				<li><a class="text-ink-dim hover:text-signal" href={site.links.leetcode}>leetcode ↗</a></li>
				<li><a class="text-ink-dim hover:text-signal" href="mailto:{site.email}">{site.email}</a></li>
				<li><a class="text-ink-dim hover:text-signal" href="/resume.pdf">resume.pdf</a></li>
			</ul>
		</div>
	</div>
</section>
