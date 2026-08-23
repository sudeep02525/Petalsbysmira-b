import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
} from "../controllers/requestController.js";
import { protectAdmin } from "../middleware/auth.js";
// assuming rate limit could be added here later if needed

const router = express.Router();

// Public route for customers
router.post("/", createRequest);

// Protected admin routes
router.get("/", protectAdmin, getRequests);
router.get("/:id", protectAdmin, getRequestById);
router.put("/:id", protectAdmin, updateRequest);

export default router;
