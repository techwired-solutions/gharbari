/**
 * Minimal in-memory sliding-window rate limiter for public POST endpoints.
 *
 * This resets whenever the serverless function cold-starts, so it isn't a
 * strong guarantee on Vercel — treat it as one layer of defense alongside
 * the honeypot field and fill-time check in lib/validation.ts, not a
 * substitute for a real service (Upstash, Vercel Firewall, etc.) if abuse
 * becomes a real problem.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function isRateLimited(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function requestKeyFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
