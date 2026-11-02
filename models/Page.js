import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "imageText", "step", "card", "richText"],
      default: "text",
    },
    order: { type: Number, default: 0 },
    number: { type: String, default: "" }, // "01"
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    body: { type: String, default: "" }, // markdown / plain text
    imageUrl: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    sections: { type: [sectionSchema], default: [] },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      ogImageUrl: { type: String, default: "" },
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Page", pageSchema);

