import rateLimit from "express-rate-limit";

// Rate limiter for fetching video presigned URLs
// 30 requests per minute keyed by the authenticated user's ID
export const videoUrlRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each user to 30 requests per windowMs
  keyGenerator: (req) => {
    // Specifically throttle by user ID to prevent distributed script-scraping
    // Fallback to a hardcoded string to avoid req.ip trust proxy crashing (ERR_ERL_KEY_GEN_IPV6)
    return req.user && req.user._id ? req.user._id.toString() : "unauthenticated";
  },
  message: {
    success: false,
    message: "Too many video requests from this user, please try again after a minute.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
