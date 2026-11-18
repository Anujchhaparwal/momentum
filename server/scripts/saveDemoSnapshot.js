import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";
import Transaction from "../models/Transaction.js";
import DemoSnapshot from "../models/DemoSnapshot.js";

const saveDemoSnapshot = async () => {
  try {
    await connectDB();

    const demoUser = await User.findOne({ isDemo: true });

    if (!demoUser) {
      throw new Error("Demo account not found.");
    }

    const userId = demoUser._id;

    const [tasks, goals, habits, transactions] = await Promise.all([
      Task.find({ user: userId }).lean(),
      Goal.find({ user: userId }).lean(),
      Habit.find({ user: userId }).lean(),
      Transaction.find({ user: userId }).lean(),
    ]);

    await DemoSnapshot.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        tasks,
        goals,
        habits,
        transactions,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log("Demo snapshot saved successfully.");
    console.log(`Tasks: ${tasks.length}`);
    console.log(`Goals: ${goals.length}`);
    console.log(`Habits: ${habits.length}`);
    console.log(`Transactions: ${transactions.length}`);
  } catch (error) {
    console.error("Failed to save demo snapshot:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

saveDemoSnapshot();
