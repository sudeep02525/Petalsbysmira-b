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
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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
    privateAccessToken: { type: String, index: true, sparse: true }, // Hashed token for secure lookup
    privateAccessRawToken: { type: String }, // Raw token stored so admin can copy/WhatsApp link anytime
    privateAccessExpiresAt: { type: Date },
    privateAccessRevoked: { type: Boolean, default: false },
    privateAccessUsedAt: { type: Date },
  },
  { timestamps: true }
);

accessRequestSchema.index({ createdAt: -1 });
accessRequestSchema.index({ status: 1 });
accessRequestSchema.index({ email: 1 });
accessRequestSchema.index({ productId: 1 });

export default mongoose.model("AccessRequest", accessRequestSchema);
