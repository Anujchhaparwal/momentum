import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const seedDemo = async () => {
  try {
    await connectDB();

    const existingDemo = await User.findOne({
      $or: [
        { isDemo: true },
        { email: "demo@momentum.local" },
      ],
    });
    if (existingDemo) {
      console.log("Demo account already exists.");
      return;
    }

    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    await User.create({
      name: "Momentum Demo",
      email: "demo@momentum.local",
      password: hashedPassword,
      isVerified: true,
      isDemo: true,
    });

    console.log("Demo account created successfully.");
  } catch (error) {
    console.error("Demo account creation failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDemo();
