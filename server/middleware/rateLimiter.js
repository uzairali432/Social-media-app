import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit to 20 requests per window per IP
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6, // small number for login attempts
  message: { message: 'Too many login attempts, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
