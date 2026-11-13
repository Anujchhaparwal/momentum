import express from "express";

import {
  createHabit,
  getHabits,
  toggleHabit,
  deleteHabit,
} from "../controllers/habit.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect every habit route
router.use(authMiddleware);

router.post("/", createHabit);
router.get("/", getHabits);
router.patch("/:id/toggle", toggleHabit);
router.delete("/:id", deleteHabit);

export default router;