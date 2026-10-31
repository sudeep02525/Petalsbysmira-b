import express from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route to fetch site settings
router.get("/", getSiteSettings);

// Protected admin route to update site settings
router.put("/", protectAdmin, updateSiteSettings);

export default router;
