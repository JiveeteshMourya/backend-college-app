import RateLimit from "express-rate-limit";
import { rateLimiterMiddlewaresText } from "../responseTexts.js";

export const otpLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 '/send-otp' reqs per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: rateLimiterMiddlewaresText.otpLimiter.error,
  },
});
