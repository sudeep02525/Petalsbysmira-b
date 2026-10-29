import mongoose from "mongoose";

const corporateEnquirySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    budget: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

corporateEnquirySchema.index({ createdAt: -1 });

export default mongoose.model("CorporateEnquiry", corporateEnquirySchema);

