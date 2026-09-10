/**
 * Client-Side Burst Rate Limiter
 * SEC-002: Prevents automated script flooding and browser thread starvation
 */

class BurstRateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 20, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Attempts to consume 1 request token.
   * Returns true if request is allowed, false if rate limit is exceeded.
   */
  public tryAcquire(): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    // Prune expired timestamps
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      const oldest = this.timestamps[0];
      const retryAfter = Math.ceil((this.windowMs - (now - oldest)) / 1000);
      return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
    }

    this.timestamps.push(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  public reset(): void {
    this.timestamps = [];
  }
}

export const inpaintingRateLimiter = new BurstRateLimiter(30, 60 * 1000);
