import "../config/loadEnv.js";
import mongoose from "mongoose";
import SiteSettings from "../models/SiteSettings.js";

const DEFAULT_SETTINGS = {
  brandName: "Petals by Smira",
  logoUrl: "/logo.jpg",
  faviconUrl: "/fabicon.png",
  phone: "+91 99206 88099",
  whatsappNumber: "919920688099",
  email: "petalsbysmira@gmail.com",
  address: "Mumbai, Maharashtra, India",
  instagramUrl: "https://instagram.com/petalsbysmira",
  facebookUrl: "",
  twitterUrl: "",
  announcementEnabled: false,
  announcementText: "Complimentary delivery across India",
  privateBannerText: "Private Access Active",
  heroImageUrl: "/image.jpg",
  heroLine1: "Not everything",
  heroLine2: "extraordinary comes",
  heroLine3: "with a price tag.",
  heroSubLine1: "Luxury Editions from ₹4,999 to ₹1,00,000",
  heroSubLine2: "Access is limited.",
  heroCta1Label: "EXPLORE THE EDITIONS",
  heroCta1Href: "/editions",
  heroCta2Label: "REQUEST ACCESS",
  heroCta2Href: "/request-access",
  heroQuote: "A statement, not just a jewel.",
  features: [
    { icon: "diamond", title: "Curated Luxury", subtitle: "Handpicked for you" },
    { icon: "gem", title: "Limited Editions", subtitle: "Not for everyone" },
    { icon: "shield", title: "Private Access", subtitle: "Exclusively yours" },
    { icon: "gift", title: "Personal Experience", subtitle: "Curated with care" },
  ],
  closingQuote: "Because your worth has no price tag.",
  collectionOrder: ["the-editions", "mens-luxury-watches", "luxury-bags"],
  priceLabel: "Exclusive Price",
  priceOnRequestLabel: "Price on Request",
  productCtaLabel: "Enquire to Purchase",
  productTrustLines: [
    "Personal Consultation Included",
    "Insured Priority Delivery",
    "Certificate of Authenticity",
  ],
};

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in environment variables.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
      console.log("Created initial default SiteSettings document.");
    } else {
      console.log("SiteSettings document already exists.");
    }

    console.log("Seed complete:", settings._id);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();

