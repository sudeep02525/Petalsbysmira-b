import express from "express";
import rateLimit from "express-rate-limit";
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

const router = express.Router();

// Rate limiter for public access requests (5 requests per 10 minutes per IP)
const requestSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests submitted. Please try again after 10 minutes.",
  },
});

// Public route for customers
router.post("/", requestSubmissionLimiter, createRequest);

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
