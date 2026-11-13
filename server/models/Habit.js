import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
      minlength: [1, "Habit title cannot be empty"],
      maxlength: [100, "Habit title cannot exceed 100 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, "Streak cannot be negative"],
    },
    lastCompletedDate: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
