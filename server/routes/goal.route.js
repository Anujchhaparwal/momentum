import express from "express";

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect every goal route
router.use(authMiddleware);

router.post("/", createGoal);
router.get("/", getGoals);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;