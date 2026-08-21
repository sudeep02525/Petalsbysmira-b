import express from "express";
const router = express.Router();
import {
  createOrder,
  trackOrder,
  getMyOrders,
} from "../controllers/orderController.js";
import { protectUser } from "../middleware/auth.js";

// optional auth: attach req.user if token present, but allow guest checkout too
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return protectUser(req, res, next);
  }
  next();
};

router.post("/", optionalAuth, createOrder);
router.get("/track/:orderNumber", trackOrder);
router.get("/my", protectUser, getMyOrders);

export default router;
