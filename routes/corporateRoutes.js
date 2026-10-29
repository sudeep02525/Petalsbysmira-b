import express from "express";
import rateLimit from "express-rate-limit";
import CorporateEnquiry from "../models/CorporateEnquiry.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", limiter, async (req, res) => {
  try {
    const { companyName, contactName, email, phone, quantity, budget, message } = req.body;
    if (!companyName || !contactName || !email || !phone || !quantity || !budget || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const doc = await CorporateEnquiry.create({
      companyName,
      contactName,
      email,
      phone,
      quantity: Number(quantity),
      budget,
      message,
    });
    const io = req.app.get("io");
    if (io) io.emit("newCorporateEnquiry", { id: doc._id });
    res.status(201).json({
      message: "Enquiry received. Our specialist will contact you within 24 hours.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin list
router.get("/", protectAdmin, async (req, res) => {
  try {
    const list = await CorporateEnquiry.find().sort({ createdAt: -1 }).limit(200);
    res.json({ enquiries: list, total: list.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

