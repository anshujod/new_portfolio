// Client-safe types and tiny helpers — no content imports here, so components
// can use these without dragging the content bundle into the page chunk.

export type MissionStatus = 'DEPLOYED' | 'FIELD-TESTED' | 'IN DEVELOPMENT';

export interface MissionMeta {
	title: string;
	slug: string;
	status: MissionStatus;
	summary: string;
	stack: string[];
	metrics: string[];
	repo?: string;
	demo?: string;
	order: number;
	featured?: boolean;
}

export type PostCategory = 'AI' | 'Engineering' | 'Projects' | 'Career';

export interface PostMeta {
	title: string;
	slug: string;
	date: string;
	category: PostCategory;
	summary: string;
	draft?: boolean;
	readingTime: number;
}

export const categoryColor: Record<PostCategory, string> = {
	AI: 'var(--pulse)',
	Engineering: 'var(--signal)',
	Projects: 'var(--trace)',
	Career: 'var(--ink-dim)'
};

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	});
}
