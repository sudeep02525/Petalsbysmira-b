import SiteSettings from "../models/SiteSettings.js";

// Default settings used as singleton fallback
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

// @route GET /api/site-settings
// @desc Get public site settings (Singleton)
export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ message: "Server error fetching site settings" });
  }
};

// @route PUT /api/site-settings (or /api/admin/site-settings)
// @desc Update site settings (Admin only)
export const updateSiteSettings = async (req, res) => {
  try {
    const updates = req.body;
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULT_SETTINGS, ...updates });
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json({
      message: "Site settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ message: error.message || "Failed to update site settings" });
  }
};

