import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Goal title is required",
      });
    }

    const newGoal = await Goal.create({
      title: title.trim(),
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Goal created successfully",
      goal: newGoal,
    });
  } catch (error) {
    console.error("Create goal error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid goal details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating the goal",
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: goals.length,
      goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching goals",
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { title, progress } = req.body || {};

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Goal title cannot be empty",
        });
      }

      updates.title = title.trim();
    }

    if (progress !== undefined) {
      if (
        typeof progress !== "number" ||
        !Number.isFinite(progress) ||
        progress < 0 ||
        progress > 100
      ) {
        return res.status(400).json({
          message: "Progress must be a number between 0 and 100",
        });
      }

      updates.progress = progress;
      updates.completed = progress === 100;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid updates provided",
      });
    }

    const updatedGoal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid goal details or goal ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while updating the goal",
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid goal ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while deleting the goal",
    });
  }
};