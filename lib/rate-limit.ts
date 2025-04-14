export interface RateLimiterOptions {
  interval: number
  uniqueTokenPerInterval: number
}

export interface RateLimiter {
  check: (limit: number, token: string) => Promise<void>
}

// Simple in-memory rate limiter
// In production, this should be replaced with a Redis-based implementation
export function rateLimit(options: RateLimiterOptions): RateLimiter {
  const { interval, uniqueTokenPerInterval } = options

  // Store for rate limiting
  const tokenCache = new Map<string, number[]>()

  // Clean up old entries periodically
  setInterval(() => {
    const now = Date.now()
    for (const [token, timestamps] of tokenCache.entries()) {
      const validTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)
      if (validTimestamps.length > 0) {
        tokenCache.set(token, validTimestamps)
      } else {
        tokenCache.delete(token)
      }
    }
  }, interval)

  return {
    check: (limit: number, token: string) => {
      const now = Date.now()
      const timestamps = tokenCache.get(token) || []
      const validTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)

      if (validTimestamps.length >= limit) {
        return Promise.reject(new Error("Rate limit exceeded"))
      }

      tokenCache.set(token, [...validTimestamps, now])
      return Promise.resolve()
    },
  }
}
