import Product from "../models/Product.js";
import AccessRequest from "../models/AccessRequest.js";

// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, lowStock, totalRequests, newRequests] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock"),
      AccessRequest.countDocuments(),
      AccessRequest.countDocuments({ status: "New" }),
    ]);

    res.json({
      totalProducts,
      lowStockProducts: lowStock,
      totalRequests,
      newRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDashboardStats };
