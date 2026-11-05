import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerification,
} from "../controllers/auth.controller.js";
import authLimiter from "../middleware/authLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);

export default router;