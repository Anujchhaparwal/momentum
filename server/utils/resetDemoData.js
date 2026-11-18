import mongoose from "mongoose";

import User from "../models/User.js";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";
import Transaction from "../models/Transaction.js";
import DemoSnapshot from "../models/DemoSnapshot.js";

const resetDemoData = async (resetDate) => {
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

  const session = await mongoose.startSession();
  let resetPerformed = false;

  try {
    await session.withTransaction(async () => {
      // Claim this reset date to prevent duplicate resets.
      const claim = await DemoSnapshot.updateOne(
        {
          _id: snapshot._id,
          lastResetDate: { $ne: resetDate },
        },
        {
          $set: { lastResetDate: resetDate },
        },
        { session }
      );

      if (claim.modifiedCount !== 1) {
        return;
      }

      // Remove the current demo data.
      await Task.deleteMany({ user: demoUser._id }, { session });
      await Goal.deleteMany({ user: demoUser._id }, { session });
      await Habit.deleteMany({ user: demoUser._id }, { session });
      await Transaction.deleteMany({ user: demoUser._id }, { session });

      // Restore the saved snapshot.
      await Task.insertMany(snapshot.tasks || [], { session });
      await Goal.insertMany(snapshot.goals || [], { session });
      await Habit.insertMany(snapshot.habits || [], { session });
      await Transaction.insertMany(snapshot.transactions || [], { session });

      resetPerformed = true;
    });

    if (resetPerformed) {
      console.log("Demo account reset successfully.");
    } else {
      console.log(`Demo account already reset for ${resetDate}.`);
    }

    return resetPerformed;
  } finally {
    await session.endSession();
  }
};

export default resetDemoData;
