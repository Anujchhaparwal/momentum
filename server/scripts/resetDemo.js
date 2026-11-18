import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import resetDemoData from "../utils/resetDemoData.js";

const runReset = async () => {
  try {
    await connectDB();
    await resetDemoData();
  } catch (error) {
    console.error("Demo account reset failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runReset();
