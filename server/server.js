import "dotenv/config";
import process from "node:process";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import { verifyEmailConnection } from "./utils/sendEmail.js";
import taskRouter from "./routes/task.route.js";
import goalRouter from "./routes/goal.route.js";
import habitRouter from "./routes/habit.route.js";
import transactionRouter from "./routes/transaction.route.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

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
  await connectDB();
  await verifyEmailConnection();


  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Momentum server running on port ${PORT}`);
  });
};

startServer();
