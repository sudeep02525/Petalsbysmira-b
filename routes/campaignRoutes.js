import express from "express";
import { getActiveCampaigns } from "../controllers/campaignController.js";

const router = express.Router();

// @route GET /api/campaigns/active
// @desc Get active campaigns for the frontend
router.get("/active", getActiveCampaigns);

export default router;
