import mongoose from "mongoose";

const campaignImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  alt: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [campaignImageSchema],
    cta: {
      enabled: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: "Shop Now",
      },
      link: {
        type: String,
        default: "/shop",
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    priority: {
      type: Number,
      default: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
