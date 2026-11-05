import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerification,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;