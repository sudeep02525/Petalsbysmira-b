import express from "express";
const router = express.Router();

import { loginAdmin, forgotPasswordAdmin, resetPasswordAdmin, getAdminProfile, updateAdminProfile, updateAdminPassword } from "../controllers/authController.js";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { 
  getAllOrders, getOrderById, updateOrderStatus, getDashboardStats,
  syncToShiprocket, assignAWB, requestPickup, generateLabel, generateManifest,
  getAllCustomers
} from "../controllers/adminController.js";
import { 
  getAdminCampaigns, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign, 
  getCampaignById 
} from "../controllers/campaignController.js";

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

// campaigns
router.get("/campaigns", protectAdmin, getAdminCampaigns);
router.get("/campaigns/:id", protectAdmin, getCampaignById);
router.post("/campaigns", protectAdmin, upload.array("images", 20), createCampaign);
router.put("/campaigns/:id", protectAdmin, upload.array("images", 20), updateCampaign);
router.delete("/campaigns/:id", protectAdmin, deleteCampaign);

// categories (protected)
router.post("/categories", protectAdmin, upload.single("image"), createCategory);
router.put("/categories/:id", protectAdmin, upload.single("image"), updateCategory);
router.delete("/categories/:id", protectAdmin, deleteCategory);

// orders (protected)
router.get("/orders", protectAdmin, getAllOrders);
router.get("/orders/:id", protectAdmin, getOrderById);
router.put("/orders/:id/status", protectAdmin, updateOrderStatus);

// shiprocket fulfillment
router.post("/orders/:id/shiprocket/sync", protectAdmin, syncToShiprocket);
router.post("/orders/:id/shiprocket/awb", protectAdmin, assignAWB);
router.post("/orders/:id/shiprocket/pickup", protectAdmin, requestPickup);
router.post("/orders/:id/shiprocket/label", protectAdmin, generateLabel);
router.post("/orders/:id/shiprocket/manifest", protectAdmin, generateManifest);

// dashboard (protected)
router.get("/dashboard", protectAdmin, getDashboardStats);

// customers
router.get("/customers", protectAdmin, getAllCustomers);

export default router;
