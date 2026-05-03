import { Request, Response, NextFunction, RequestHandler } from "express";

interface BucketState {
  tokens: number;
  lastRefillMs: number;
}

interface TokenBucketOptions {
  capacity: number;
  refillTokens: number;
  refillIntervalMs: number;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
  mode?: "limit" | "throttle";
  maxThrottleMs?: number;
  message?: string;
}

const DEFAULT_KEY_GENERATOR = (req: Request) =>
  req.ip || req.socket.remoteAddress || "unknown";

const getRetryAfterMs = (
  tokens: number,
  refillTokens: number,
  refillIntervalMs: number
) => {
  const tokensPerMs = refillTokens / refillIntervalMs;
  if (tokensPerMs <= 0) return refillIntervalMs;
  const missingTokens = Math.max(0, 1 - tokens);
  return Math.ceil(missingTokens / tokensPerMs);
};

const createTokenBucketLimiter = ({
  capacity,
  refillTokens,
  refillIntervalMs,
  keyGenerator = DEFAULT_KEY_GENERATOR,
  skip,
  mode = "throttle",
  maxThrottleMs = 2000,
  message = "Too many requests. Please try again later.",
}: TokenBucketOptions): RequestHandler => {
  const buckets = new Map<string, BucketState>();
  const gcIntervalMs = Math.max(refillIntervalMs * 5, 60_000);

  const refill = (bucket: BucketState, nowMs: number) => {
    const elapsed = nowMs - bucket.lastRefillMs;
    if (elapsed <= 0) return;

    const tokensPerMs = refillTokens / refillIntervalMs;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * tokensPerMs);
    bucket.lastRefillMs = nowMs;
  };

  setInterval(() => {
    const nowMs = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (nowMs - bucket.lastRefillMs > gcIntervalMs) {
        buckets.delete(key);
      }
    }
  }, gcIntervalMs).unref();

  const send429 = (res: Response, retryAfterMs: number) => {
    res.setHeader("Retry-After", Math.max(1, Math.ceil(retryAfterMs / 1000)));
    res.status(429).json({ message });
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    if (skip?.(req)) {
      next();
      return;
    }

    const key = keyGenerator(req);
    const nowMs = Date.now();

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: capacity, lastRefillMs: nowMs };
      buckets.set(key, bucket);
    }

    refill(bucket, nowMs);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      next();
      return;
    }

    const retryAfterMs = getRetryAfterMs(
      bucket.tokens,
      refillTokens,
      refillIntervalMs
    );

    if (mode === "throttle") {
      const delayMs = Math.min(retryAfterMs, maxThrottleMs);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));

      const afterDelay = Date.now();
      refill(bucket, afterDelay);
      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        next();
        return;
      }
    }

    send429(res, retryAfterMs);
  };
};

export const globalApiThrottle = createTokenBucketLimiter({
  capacity: 120,
  refillTokens: 120,
  refillIntervalMs: 60_000,
  mode: "throttle",
  maxThrottleMs: 1500,
  message: "High traffic detected. Please retry in a moment.",
  skip: (req) =>
    !!process.env.INTERNAL_SERVICE_KEY &&
    req.headers["x-internal-key"] === process.env.INTERNAL_SERVICE_KEY,
});

