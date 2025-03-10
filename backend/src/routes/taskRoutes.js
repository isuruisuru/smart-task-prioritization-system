import express from "express";
import { createTask, getTask, getTasks } from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router  = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);

export default router;