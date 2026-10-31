import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "diamond" },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Brand
    brandName: { type: String, default: "Petals by Smira" },
    logoUrl: { type: String, default: "/logo.jpg" },
    faviconUrl: { type: String, default: "/fabicon.png" },

    // Contact
    phone: { type: String, default: "+91 99206 88099" },
    whatsappNumber: { type: String, default: "919920688099" },
    email: { type: String, default: "petalsbysmira@gmail.com" },
    address: { type: String, default: "Mumbai, Maharashtra, India" },

    // Social Links
    instagramUrl: { type: String, default: "https://instagram.com/petalsbysmira" },
    facebookUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },

    // Announcement Top Bar
    announcementEnabled: { type: Boolean, default: false },
    announcementText: { type: String, default: "Complimentary delivery across India" },

    // Private Access Banner Text
    privateBannerText: { type: String, default: "Private Access Active" },

    // Homepage Hero Section
    heroImageUrl: { type: String, default: "/image.jpg" },
    heroLine1: { type: String, default: "Not everything" },
    heroLine2: { type: String, default: "extraordinary comes" },
    heroLine3: { type: String, default: "with a price tag." },
    heroSubLine1: { type: String, default: "Luxury Editions from ₹4,999 to ₹1,00,000" },
    heroSubLine2: { type: String, default: "Access is limited." },
    heroCta1Label: { type: String, default: "EXPLORE THE EDITIONS" },
    heroCta1Href: { type: String, default: "/editions" },
    heroCta2Label: { type: String, default: "REQUEST ACCESS" },
    heroCta2Href: { type: String, default: "/request-access" },
    heroQuote: { type: String, default: "A statement, not just a jewel." },

    // Homepage Feature Strip (4 items)
    features: {
      type: [featureSchema],
      default: [
        { icon: "diamond", title: "Curated Luxury", subtitle: "Handpicked for you" },
        { icon: "gem", title: "Limited Editions", subtitle: "Not for everyone" },
        { icon: "shield", title: "Private Access", subtitle: "Exclusively yours" },
        { icon: "gift", title: "Personal Experience", subtitle: "Curated with care" },
      ],
    },

    // Homepage Closing Quote
    closingQuote: { type: String, default: "Because your worth has no price tag." },

    // Collections order
    collectionOrder: {
      type: [String],
      default: ["the-editions", "mens-luxury-watches", "luxury-bags"],
    },

    // Product Page Labels & Trust
    priceLabel: { type: String, default: "Exclusive Price" },
    priceOnRequestLabel: { type: String, default: "Price on Request" },
    productCtaLabel: { type: String, default: "Enquire to Purchase" },
    productTrustLines: {
      type: [String],
      default: [
        "Personal Consultation Included",
        "Insured Priority Delivery",
        "Certificate of Authenticity",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
