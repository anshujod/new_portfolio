import { missions, posts } from '$lib/content';
import { site } from '$lib/data/site';

export const prerender = true;

export function GET() {
	const staticPaths = ['/', '/work', '/lab', '/log'];
	const paths = [
		...staticPaths,
		...missions.map((m) => `/work/${m.slug}`),
		...posts.map((p) => `/log/${p.slug}`)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
