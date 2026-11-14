import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import {
  loginLimiter,
  registerLimiter,
  resendLimiter,
} from "../middleware/authLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerLimiter, registerUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendLimiter, resendVerification);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
