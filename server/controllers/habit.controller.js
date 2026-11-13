
import Habit from "../models/Habit.js";

const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const getYesterday = () => {
  const [year, month, day] = getToday().split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day - 1));

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

export const createHabit = async (req, res) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Habit title is required",
      });
    }

    const newHabit = await Habit.create({
      title: title.trim(),
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Habit created successfully",
      habit: newHabit,
    });
  } catch (error) {
    console.error("Create habit error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid habit details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating the habit",
    });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    const today = getToday();
    const yesterday = getYesterday();

    for (const habit of habits) {
      if (habit.lastCompletedDate === today) {
        continue;
      }

      const shouldResetStreak = habit.lastCompletedDate !== yesterday;

      const needsUpdate =
        habit.completed || (shouldResetStreak && habit.streak !== 0);

      if (!needsUpdate) {
        continue;
      }

      habit.completed = false;

      if (shouldResetStreak) {
        habit.streak = 0;
      }

      await habit.save();
    }

    return res.status(200).json({
      count: habits.length,
      habits,
    });
  } catch (error) {
    console.error("Get habits error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching habits",
    });
  }
};


export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const today = getToday();
    const yesterday = getYesterday();

    // Undo today's completion
    if (habit.completed && habit.lastCompletedDate === today) {
      habit.completed = false;
      habit.streak = Math.max(0, habit.streak - 1);
    } else {
      // Check whether yesterday was completed
      if (habit.lastCompletedDate === today) {
        // Rechecking after undoing today's completion
        habit.streak += 1;
      } else if (habit.lastCompletedDate === yesterday) {
        // Continuing a consecutive-day streak
        habit.streak += 1;
      } else {
        // First completion or a broken streak
        habit.streak = 1;
      }

      habit.completed = true;
      habit.lastCompletedDate = today;
    }

    await habit.save();

    return res.status(200).json({
      message: habit.completed
        ? "Habit marked as completed"
        : "Habit marked as incomplete",
      habit,
    });
  } catch (error) {
    console.error("Toggle habit error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid habit ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while updating the habit",
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const deletedHabit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    return res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error("Delete habit error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid habit ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while deleting the habit",
    });
  }
};