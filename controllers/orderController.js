import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import razorpayInstance from "../config/razorpay.js";
import generateOrderNumber from "../utils/generateOrderNumber.js";
import * as shiprocketService from "../services/shiprocketService.js";

const SHIPPING_CHARGE = 0; // set flat rate or free shipping as needed

// @route POST /api/orders
// body: { items: [{productId, quantity}], shippingAddress, paymentMethod, couponCode, guestEmail, notes }
// Creates the order in DB (paymentStatus=pending). If razorpay, also returns razorpay order to open checkout.
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      guestEmail,
      notes,
    } = req.body;

    if (!items?.length)
      return res.status(400).json({ message: "Cart is empty" });
    if (!shippingAddress)
      return res.status(400).json({ message: "Shipping address is required" });
    if (!["razorpay", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // build order items from DB (never trust price from frontend)
    let itemsTotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res
          .status(400)
          .json({ message: `Product unavailable: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
      const price = product.discountPrice || product.price;
      itemsTotal += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price,
        quantity: item.quantity,
      });
    }

    // apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });
      if (
        coupon &&
        new Date() <= coupon.validTill &&
        itemsTotal >= coupon.minOrderValue
      ) {
        if (
          coupon.usageLimit === null ||
          coupon.usedCount < coupon.usageLimit
        ) {
          discount =
            coupon.discountType === "percentage"
              ? Math.min(
                  (itemsTotal * coupon.discountValue) / 100,
                  coupon.maxDiscount || Infinity,
                )
              : coupon.discountValue;
        }
      }
    }

    const totalAmount = Math.max(itemsTotal + SHIPPING_CHARGE - discount, 0);
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user?._id || undefined,
      guestEmail: req.user ? undefined : guestEmail,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingCharge: SHIPPING_CHARGE,
      discount,
      couponCode: discount > 0 ? couponCode.toUpperCase() : undefined,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "placed",
      statusHistory: [{ status: "placed", note: "Order created" }],
      notes,
    });

    // COD: reduce stock immediately, order is confirmed
    if (paymentMethod === "cod") {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
      if (discount > 0)
        await Coupon.updateOne(
          { code: order.couponCode },
          { $inc: { usedCount: 1 } },
        );
      return res.status(201).json({ order });
    }

    // Razorpay: create a razorpay order and return it, stock reduced only after payment verified
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt: order.orderNumber,
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      order,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/track/:orderNumber
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Fetch real-time tracking if AWB exists
    if (order.shipping?.awbCode) {
      try {
        const trackingData = await shiprocketService.getTracking(order.shipping.awbCode);
        order.shiprocketTracking = trackingData.tracking_data;
      } catch (err) {
        console.error("Failed to fetch shiprocket tracking:", err.message);
      }
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, trackOrder, getMyOrders };
