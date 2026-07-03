// In-memory fixed-window rate limiter.
// Returns true when the caller IS rate-limited (matches route.ts usage).
const hits = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 10;            // max requests
const WINDOW_MS = 60_000;    // per 60 seconds

export async function rateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not rate-limited
  }

  entry.count++;
  return entry.count > LIMIT; // true = too many requests
}