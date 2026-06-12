import { posts } from '$lib/content';
import { site } from '$lib/data/site';

export const prerender = true;

const escapeXml = (s: string) =>
	s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function GET() {
	const items = posts
		.map(
			(p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site.url}/log/${p.slug}</link>
      <guid isPermaLink="true">${site.url}/log/${p.slug}</guid>
      <description>${escapeXml(p.summary)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${p.category}</category>
    </item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name} — system logs</title>
    <link>${site.url}/log</link>
    <description>Engineering notes by ${site.title} — applied AI, full-stack systems, building in public.</description>
    <language>en</language>
    <atom:link href="${site.url}/log/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
