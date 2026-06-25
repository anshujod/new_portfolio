export interface ChangelogEntry {
	version: string;
	label: string;
	summary: string;
	detail: string;
	badges?: string[];
}

// The About section — the honest arc, as a kernel changelog.
export const changelog: ChangelogEntry[] = [
	{
		version: 'v2022.0',
		label: 'flashed first kernel',
		summary: 'B.E. ECE, Ramaiah Institute of Technology',
		detail:
			'Electronics and communication first — signal processing, embedded systems, and the habit of understanding the layer below the one you work in.'
	},
	{
		version: 'v2023.x',
		label: 'learned to ship',
		summary: 'MERN stack, DSA grind begins',
		detail:
			'Full-stack JavaScript end to end, plus the start of a long problem-solving streak — 500+ problems and a 1657 LeetCode rating since.',
		badges: ['leetcode 1657']
	},
	{
		version: 'v2025.3',
		label: 'vision module online',
		summary: 'Tata Steel: YOLOv10, ByteTrack, 15k-image dataset',
		detail:
			'Applied computer vision in a running steel plant — people detection and counting on live CCTV. The real lesson was dataset iteration; see the case study.',
		badges: ['field-tested']
	},
	{
		version: 'v2025.x',
		label: 'products in the wild',
		summary: 'Chatify, ThumbnailGen, auth systems',
		detail:
			'Three MERN products built and deployed: real-time messaging, an AI image product, and an auth layer good enough to reuse everywhere since.'
	},
	{
		version: 'v2026.1',
		label: 'production mode',
		summary: 'Azilora Technologies — full-stack engineering intern',
		detail:
			'Four-month internship (Jan–Apr 2026): full-stack engineering on production software with real users — shipped, supported, and maintained 20+ features for 200+ active users.',
		badges: ['Jan–Apr 2026']
	},
	{
		version: 'v2026.x',
		label: 'current branch',
		summary: 'LLMs, agents, retrieval — see /lab',
		detail:
			'Going deep on language models: retrieval pipelines, agent architectures, and applied ML — including a World Cup 2026 prediction engine, now shipped as a mission. The lab tracks what is still in progress.',
		badges: ['in development']
	}
];
