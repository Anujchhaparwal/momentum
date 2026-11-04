import "dotenv/config";
import process from "node:process";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/v1/auth", authRouter);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Momentum backend is running!",
  });
});

// Connect database and start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Momentum server running on port ${PORT}`);
  });
};

startServer();
