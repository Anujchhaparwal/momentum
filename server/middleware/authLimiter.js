import rateLimit from "express-rate-limit";

const createAuthLimiter = (limit) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    message: {
      message: "Too many requests. Please try again after 15 minutes.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });

export const loginLimiter = createAuthLimiter(5);
export const registerLimiter = createAuthLimiter(5);
export const resendLimiter = createAuthLimiter(3);
