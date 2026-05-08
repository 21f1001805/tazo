import { Request, Response, NextFunction, RequestHandler } from "express";

interface BucketState {
  tokens: number;
  lastRefillMs: number;
}

interface TokenBucketOptions {
  capacity: number;
  refillTokens: number;
  refillIntervalMs: number;
  message?: string;
}

const createTokenBucketLimiter = ({
  capacity,
  refillTokens,
  refillIntervalMs,
  message = "Too many requests. Please try again later.",
}: TokenBucketOptions): RequestHandler => {
  const buckets = new Map<string, BucketState>();
  const tokensPerMs = refillTokens / refillIntervalMs;
  const gcIntervalMs = Math.max(refillIntervalMs * 5, 60_000);

  setInterval(() => {
    const nowMs = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (nowMs - bucket.lastRefillMs > gcIntervalMs) buckets.delete(key);
    }
  }, gcIntervalMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const nowMs = Date.now();
    const key = req.ip || "unknown";

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: capacity, lastRefillMs: nowMs };
      buckets.set(key, bucket);
    }

    const elapsed = nowMs - bucket.lastRefillMs;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * tokensPerMs);
    bucket.lastRefillMs = nowMs;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return next();
    }

    const retryAfterSec = Math.max(1, Math.ceil((1 - bucket.tokens) / tokensPerMs / 1000));
    res.setHeader("Retry-After", retryAfterSec.toString());
    return res.status(429).json({ message });
  };
};

export const globalApiThrottle = createTokenBucketLimiter({
  capacity: 120,
  refillTokens: 120,
  refillIntervalMs: 60_000,
  message: "High traffic detected. Please retry in a moment.",
});