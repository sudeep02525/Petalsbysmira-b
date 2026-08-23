import express from "express";
const router = express.Router();

import { loginAdmin, forgotPasswordAdmin, resetPasswordAdmin, getAdminProfile, updateAdminProfile, updateAdminPassword } from "../controllers/authController.js";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { 
  getDashboardStats
} from "../controllers/adminController.js";

import { protectAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

// auth
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);
router.put("/profile/password", protectAdmin, updateAdminPassword);

// products (protected)
router.get("/products", protectAdmin, getAdminProducts);
router.post("/products", protectAdmin, upload.array("images", 6), createProduct);
router.put("/products/:id", protectAdmin, upload.array("images", 6), updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

// categories (protected)
router.post("/categories", protectAdmin, upload.single("image"), createCategory);
router.put("/categories/:id", protectAdmin, upload.single("image"), updateCategory);
router.delete("/categories/:id", protectAdmin, deleteCategory);

// dashboard (protected)
router.get("/dashboard", protectAdmin, getDashboardStats);

export default router;
