import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import sendEmail from "../utils/sendEmail.js";
import verificationEmail from "../utils/verificationEmail.js";
import process from "node:process";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please provide valid name, email and password",
      });
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        message: "Name must be between 2 and 50 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim().length > 254 || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 10 || password.length > 64) {
      return res.status(400).json({
        message: "Password must be between 10 and 64 characters",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number and symbol",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 15 * 60 * 1000,
    });

    try {
      await sendEmail(
        normalizedEmail,
        "Verify Your Momentum Account",
        verificationEmail(name.trim(), verificationUrl)
      );
    } catch (emailError) {
      await User.findByIdAndDelete(newUser._id);

      throw emailError;
    }

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong during registration",
    });
  }

};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    }).select("+verificationToken +verificationTokenExpires");

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      message: "Something went wrong during email verification",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim().length > 254 || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || user.isVerified) {
      return res.status(200).json({
        message: "If an unverified account exists for this email, a new verification link will be sent.",
      });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    await sendEmail(
      normalizedEmail,
      "Verify Your Momentum Account",
      verificationEmail(user.name, verificationUrl)
    );

    return res.status(200).json({
      message: "If an unverified account exists for this email, a new verification link will be sent.",
    });


  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      message: "Something went wrong while resending the verification email",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong during login",
    });
  }
};