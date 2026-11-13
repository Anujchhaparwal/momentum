import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, priority } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      priority,
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid task details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating the task",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, priority, completed } = req.body || {};

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }

      updates.title = title.trim();
    }

    if (priority !== undefined) {
      if (typeof priority !== "string") {
        return res.status(400).json({
          message: "Invalid task priority",
        });
      }

      updates.priority = priority;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be a boolean",
        });
      }

      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid updates provided",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task details or task ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while updating the task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while deleting the task",
    });
  }
};