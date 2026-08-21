import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import * as shiprocketService from "../services/shiprocketService.js";

// @route GET /api/admin/orders?status=placed&page=1&limit=20
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate("user", "name email phone").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/orders/:id/status
// body: { status, note, trackingId }
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingId } = req.body;
    const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    if (trackingId) order.trackingId = trackingId;
    order.statusHistory.push({ status, note: note || "" });

    // restock if cancelled and was already paid/confirmed
    if (status === "cancelled" && ["confirmed", "shipped"].includes(order.orderStatus)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalProducts, lowStock] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ["placed", "confirmed"] } }),
      Product.countDocuments({ isActive: true }),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock"),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      lowStockProducts: lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/orders/:id/shiprocket/sync
const syncToShiprocket = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Format for Shiprocket
    const payload = {
      order_id: order.orderNumber,
      order_date: order.createdAt,
      pickup_location: "Primary", // Configure in Shiprocket
      billing_customer_name: order.shippingAddress.fullName,
      billing_last_name: "",
      billing_address: order.shippingAddress.addressLine1,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.guestEmail || "customer@petalsbysmira.com",
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: order.totalAmount,
      length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions
    };

    const response = await shiprocketService.createOrder(payload);
    
    order.shipping.shipmentId = response.shipment_id?.toString();
    order.shiprocketSyncStatus = "created";
    
    // Sometimes Shiprocket returns awb right away if auto-assign is on
    if (response.awb_code) {
      order.shipping.awbCode = response.awb_code;
      order.shiprocketSyncStatus = "awb_assigned";
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/orders/:id/shiprocket/awb
const assignAWB = async (req, res) => {
  try {
    const { courierId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order || !order.shipping.shipmentId) {
      return res.status(400).json({ message: "Shipment ID not found" });
    }

    const response = await shiprocketService.assignAWB(order.shipping.shipmentId, courierId);
    if (response.awb_assign_status === 1) {
      order.shipping.awbCode = response.response.data.awb_code;
      order.shipping.courierName = response.response.data.courier_name;
      order.shipping.courierId = response.response.data.courier_company_id;
      order.shiprocketSyncStatus = "awb_assigned";
      await order.save();
    } else {
      throw new Error("Failed to assign AWB");
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/orders/:id/shiprocket/pickup
const requestPickup = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.shipping.shipmentId) {
      return res.status(400).json({ message: "Shipment ID not found" });
    }

    const response = await shiprocketService.requestPickup(order.shipping.shipmentId);
    if (response.pickup_status === 1) {
      order.shipping.pickupScheduledAt = new Date();
      order.shiprocketSyncStatus = "pickup_scheduled";
      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/orders/:id/shiprocket/label
const generateLabel = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.shipping.shipmentId) {
      return res.status(400).json({ message: "Shipment ID not found" });
    }

    const response = await shiprocketService.generateLabel(order.shipping.shipmentId);
    if (response.label_created === 1) {
      order.shipping.labelUrl = response.label_url;
      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/orders/:id/shiprocket/manifest
const generateManifest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.shipping.shipmentId) {
      return res.status(400).json({ message: "Shipment ID not found" });
    }

    const response = await shiprocketService.generateManifest(order.shipping.shipmentId);
    if (response.status === 1) {
      order.shipping.manifestUrl = response.manifest_url;
      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Using the User model to fetch all registered customers
    const [customers, total] = await Promise.all([
      User.find({}).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments({}),
    ]);

    res.json({ customers, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllCustomers, getAllOrders, getOrderById, updateOrderStatus, getDashboardStats, syncToShiprocket, assignAWB, requestPickup, generateLabel, generateManifest };
