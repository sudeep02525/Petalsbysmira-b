import express from "express";
const router = express.Router();
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protectUser } from "../middleware/auth.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protectUser, getProfile);

export default router;
