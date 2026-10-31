import "dotenv/config";
import express from "express";
import cors from "cors";
import process from "node:process";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Momentum backend is running!"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Momentum server running on port ${PORT}`);
});
