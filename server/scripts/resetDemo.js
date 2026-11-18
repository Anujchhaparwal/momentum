
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";
import Transaction from "../models/Transaction.js";
import DemoSnapshot from "../models/DemoSnapshot.js";

const resetDemo = async () => {
  try {
    await connectDB();

    const demoUser = await User.findOne({ isDemo: true });

    if (!demoUser) {
      throw new Error("Demo account not found.");
    }

    const snapshot = await DemoSnapshot.findOne({
      user: demoUser._id,
    }).lean();

    if (!snapshot) {
      throw new Error("Demo snapshot not found. Reset cancelled.");
    }

    const userId = demoUser._id;

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await Task.deleteMany({ user: userId }, { session });
        await Goal.deleteMany({ user: userId }, { session });
        await Habit.deleteMany({ user: userId }, { session });
        await Transaction.deleteMany({ user: userId }, { session });

        await Task.insertMany(snapshot.tasks || [], { session });
        await Goal.insertMany(snapshot.goals || [], { session });
        await Habit.insertMany(snapshot.habits || [], { session });
        await Transaction.insertMany(snapshot.transactions || [], { session });
      });

      console.log("Demo account reset successfully.");
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error("Demo account reset failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

resetDemo();
