import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" }, // e.g. "A beautiful blend of emerald stones..."

    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null }, // sale price, null if no discount

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String, default: "" },

    images: [{ type: String }], // cloudinary URLs, first one = main image

    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },

    occasionTags: [{ type: String }], // e.g. ["Rakhi", "Birthday", "Anniversary"]

    weight: { type: Number }, // in kg
    dimensions: {
      length: { type: Number }, // in cm
      width: { type: Number }, // in cm
      height: { type: Number } // in cm
    },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // New Luxury Showcase Fields
    shortSubtitle: { type: String, default: "" },
    limitedEdition: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    requestAccessEnabled: { type: Boolean, default: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
