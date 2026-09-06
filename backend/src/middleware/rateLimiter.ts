import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { failure } from '../utils/response';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(failure('Too many requests — please try again later'));
  },
});

/** Tighter limiter for auth endpoints */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(failure('Too many login attempts — please wait 15 minutes'));
  },
});
