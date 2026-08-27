import redisClient from "../config/redis.js";

/*
  Lua script runs inside Redis atomically.

  1. Increment request count
  2. First request -> set expiry
  3. Get remaining TTL
*/

const rateLimitScript = `
  local current = redis.call("INCR", KEYS[1])

  if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end

  local ttl = redis.call("TTL", KEYS[1])

  return {current, ttl}
`;

export const createRateLimiter = ({
  limit,
  windowSeconds,
  prefix,
}) => {
  return async (req, res, next) => {
    try {
      /*
        Authentication middleware already ran,
        so req.user is available.
      */

      const userId = req.user._id.toString();

      const key =
        `ratelimit:${prefix}:${userId}`;

      // Redis unavailable?
      if (!redisClient.isReady) {
        console.warn(
          "Redis unavailable. Rate limiter bypassed."
        );

        return next();
      }

      const result = await redisClient.eval(
        rateLimitScript,
        {
          keys: [key],

          arguments: [
            String(windowSeconds),
          ],
        }
      );

      const currentCount =
        Number(result[0]);

      const ttl =
        Number(result[1]);

      const remaining = Math.max(
        limit - currentCount,
        0
      );

      // Helpful response headers
      res.set(
        "X-RateLimit-Limit",
        String(limit)
      );

      res.set(
        "X-RateLimit-Remaining",
        String(remaining)
      );

      res.set(
        "X-RateLimit-Reset",
        String(Math.max(ttl, 0))
      );

      // Limit crossed
      if (currentCount > limit) {
        return res.status(429).json({
          success: false,

          message:
            "Too many AI itinerary requests. Please try again later.",

          retryAfterSeconds:
            Math.max(ttl, 0),
        });
      }

      next();
    } catch (error) {
      console.error(
        "Rate limiter error:",
        error.message
      );

      /*
        Development-friendly fail-open approach:
        Redis error should not crash the whole app.
      */
      next();
    }
  };
};
export const aiGenerateRateLimiter =
  createRateLimiter({
    limit: 3,

    windowSeconds: 10 * 60,

    prefix: "ai-generate",
  });