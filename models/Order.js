import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot at order time
    image: { type: String },
    price: { type: Number, required: true }, // price at order time
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g. PBS-000123
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null if guest checkout
    guestEmail: { type: String },

    items: [orderItemSchema],
    shippingAddress: addressSchema,

    itemsTotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    totalAmount: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    statusHistory: [
      {
        status: { type: String },
        note: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    trackingId: { type: String, default: "" },
    notes: { type: String, default: "" }, // e.g. gift message

    shipping: {
      provider: { type: String, default: "shiprocket" },
      courierName: { type: String },
      courierId: { type: Number },
      awbCode: { type: String },
      shipmentId: { type: String },
      trackingUrl: { type: String },
      status: { type: String },
      shippingCost: { type: Number },
      labelUrl: { type: String },
      manifestUrl: { type: String },
      pickupScheduledAt: { type: Date }
    },

    shiprocketSyncStatus: {
      type: String,
      enum: ["not_created", "created", "awb_assigned", "pickup_scheduled", "shipped", "delivered", "cancelled", "failed"],
      default: "not_created"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
