import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  validateToken,
  generatePrivateAccess,
  resendPrivateAccess,
  revokePrivateAccess,
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
router.post("/:id/generate-link", protectAdmin, generatePrivateAccess);
router.post("/:id/resend", protectAdmin, resendPrivateAccess);
router.post("/:id/revoke", protectAdmin, revokePrivateAccess);

// Public route for token validation
router.get("/private-access/validate/:token", validateToken);

export default router;
