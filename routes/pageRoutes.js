import express from "express";
import {
  getPageBySlug,
  listPages,
  getAdminPageBySlug,
  upsertPage,
} from "../controllers/pageController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route: GET /pages/:slug
router.get("/:slug", getPageBySlug);

export default router;

// Admin routes: /admin/pages
export const adminPageRouter = express.Router();
adminPageRouter.get("/", protectAdmin, listPages);
adminPageRouter.get("/:slug", protectAdmin, getAdminPageBySlug);
adminPageRouter.put("/:slug", protectAdmin, upsertPage);
