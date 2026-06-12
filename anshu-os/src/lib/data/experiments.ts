export type ExperimentStatus = 'LIVE' | 'IN DEVELOPMENT' | 'PLANNED';

export interface Experiment {
	id: string;
	title: string;
	status: ExperimentStatus;
	hypothesis: string;
	notes: string;
	/** "owner/name" — enables last-commit freshness via /api/github */
	repo: string | null;
}

// TODO(anshu): fill in real repo slugs when the repos are public — cards show
// "repo: private (for now)" until then, which is the honest state.
export const experiments: Experiment[] = [
	{
		id: 'ask-about-me',
		title: 'Ask About Me — RAG chatbot',
		status: 'LIVE',
		hypothesis:
			'A portfolio that can answer questions about its owner is a better demo of retrieval engineering than a paragraph claiming retrieval engineering.',
		notes:
			'Build-time chunked index over resume, case studies and posts; cosine or BM25 retrieval; Llama 3.1 8B on Workers AI; IP rate limiting. It is the chat box above.',
		repo: null
	},
	{
		id: 'wc26-engine',
		title: 'World Cup 2026 prediction engine',
		status: 'IN DEVELOPMENT',
		hypothesis:
			'An ensemble of Poisson, XGBoost, LightGBM and Elo models, run through 10,000-tournament Monte Carlo simulation, can produce calibrated championship probabilities.',
		notes:
			'Squad ingestion pipeline and simulation dashboard are running; validation against real tournament outcomes is the open question — which is why this is a lab entry, not a mission.',
		repo: null
	},
	{
		id: 'agents',
		title: 'Agent experiments',
		status: 'PLANNED',
		hypothesis:
			'Tool-using LLM agents can automate the boring half of football-data curation (fetching, reconciling, flagging anomalies) with a human approving diffs.',
		notes: 'Next in the queue once the prediction engine ships its first validated cycle.',
		repo: null
	}
];
