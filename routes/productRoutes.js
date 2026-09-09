import express from "express";
const router = express.Router();
import { getProducts, getProductById } from "../controllers/productController.js";
import { checkPrivateAccess } from "../middleware/checkPrivateAccess.js";

router.get("/", checkPrivateAccess, getProducts);
router.get("/:idOrSlug", checkPrivateAccess, getProductById);

export default router;
