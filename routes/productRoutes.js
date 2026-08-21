import express from "express";
const router = express.Router();
import { getProducts, getProductById } from "../controllers/productController.js";

router.get("/", getProducts);
router.get("/:idOrSlug", getProductById);

export default router;
