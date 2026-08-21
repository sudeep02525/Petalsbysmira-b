import express from "express";
const router = express.Router();
import { getCategories } from "../controllers/categoryController.js";

router.get("/", getCategories);

export default router;
