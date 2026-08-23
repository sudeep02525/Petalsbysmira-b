import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferredContactMethod: {
      type: String,
      enum: ["Phone", "WhatsApp", "Email"],
      default: "Phone",
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "In Discussion",
        "Access Granted",
        "Closed",
        "Rejected",
      ],
      default: "New",
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

accessRequestSchema.index({ createdAt: -1 });
accessRequestSchema.index({ status: 1 });
accessRequestSchema.index({ email: 1 });
accessRequestSchema.index({ productId: 1 });

export default mongoose.model("AccessRequest", accessRequestSchema);
