// Sliding-window rate limiter, in-memory per isolate. Good enough as a first
// gate on a free-tier edge function — a determined abuser meets the token caps
// next. (The blueprint's Arcjet pattern, minus the dependency.)

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

	if (recent.length >= MAX_REQUESTS) {
		hits.set(ip, recent);
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)
		};
	}

	recent.push(now);
	hits.set(ip, recent);

	// keep the map from growing unbounded
	if (hits.size > 5000) {
		for (const [key, times] of hits) {
			if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
		}
	}

	return { allowed: true, retryAfterSeconds: 0 };
}
