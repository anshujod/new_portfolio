import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';

// One highlighter instance for the whole build — code is colored at build time,
// zero client JS for syntax highlighting.
const highlighter = await createHighlighter({
	themes: ['vesper'],
	langs: ['ts', 'js', 'svelte', 'python', 'bash', 'json', 'yaml', 'css', 'html']
});

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.svx'],
			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					highlight: {
						highlighter: (code, lang) => {
							const html = escapeSvelte(
								highlighter.codeToHtml(code, {
									lang: lang ?? 'text',
									theme: 'vesper',
									// vesper's translucent comment grey fails WCAG AA on --panel
									colorReplacements: { '#8b8b8b94': '#7d83a0' }
								})
							);
							return `{@html \`${html}\`}`;
						}
					},
					rehypePlugins: [rehypeSlug]
				})
			],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter()
		})
	]
});
