import mongoose from "mongoose";

const demoSnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    tasks: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    goals: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    habits: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    transactions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    lastResetDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DemoSnapshot = mongoose.model(
  "DemoSnapshot",
  demoSnapshotSchema
);

export default DemoSnapshot;
