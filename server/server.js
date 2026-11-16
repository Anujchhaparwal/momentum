import "dotenv/config";
import process from "node:process";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import { verifyEmailConnection } from "./utils/sendEmail.js";
import taskRouter from "./routes/task.route.js";
import goalRouter from "./routes/goal.route.js";
import habitRouter from "./routes/habit.route.js";
import transactionRouter from "./routes/transaction.route.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/goals", goalRouter);
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/transactions", transactionRouter);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Momentum backend is running!",
  });
});

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Email connection check should not block server startup
    try {
      await verifyEmailConnection();
    } catch (error) {
      console.error("Email connection failed:", error.message);
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Momentum server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
