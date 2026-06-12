export const site = {
	name: 'anshu.os',
	version: 'v2026.6',
	title: 'Anshu Prakash Hindoyar',
	role: 'Full-Stack Engineer / Applied AI',
	tagline: 'ships production software · trains vision models · building toward autonomous systems',
	location: 'Bengaluru, IN',
	url: 'https://anshu.dev',
	email: 'anshuprakash55@gmail.com',
	links: {
		github: 'https://github.com/anshujod',
		linkedin: 'https://www.linkedin.com/in/anshu-prakash-hindoyar-496a641b9/',
		leetcode: 'https://leetcode.com/anshujod'
	},
	ticker: ['leetcode: 1657', 'users served: 200+', 'dataset curated: 15,000 imgs']
} as const;

export const nav = [
	{ label: '/work', href: '/work' },
	{ label: '/lab', href: '/lab' },
	{ label: '/log', href: '/log' },
	{ label: '/connect', href: '/#connect' }
] as const;
