import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// @route POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // payment verified successfully
    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.statusHistory.push({ status: "confirmed", note: "Payment received" });
    order.orderStatus = "confirmed";
    await order.save();

    // reduce stock now that payment is confirmed
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    if (order.couponCode) {
      await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } });
    }

    res.json({ message: "Payment verified successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { verifyPayment };
