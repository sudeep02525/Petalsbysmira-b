import express from "express";
import {
  getFaqs,
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route: GET /faqs
router.get("/", getFaqs);

export default router;

// Admin routes: /admin/faqs
export const adminFaqRouter = express.Router();
adminFaqRouter.get("/", protectAdmin, listFaqs);
adminFaqRouter.post("/", protectAdmin, createFaq);
adminFaqRouter.put("/:id", protectAdmin, updateFaq);
adminFaqRouter.delete("/:id", protectAdmin, deleteFaq);

