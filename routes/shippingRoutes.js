import express from "express";
import { calculateRates } from "../controllers/shippingController.js";

const router = express.Router();

router.post("/rates", calculateRates);

export default router;
