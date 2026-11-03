import "../config/loadEnv.js";
import mongoose from "mongoose";
import SiteSettings from "../models/SiteSettings.js";
import Page from "../models/Page.js";
import Faq from "../models/Faq.js";

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

const DEFAULT_PAGES = [
  {
    slug: "our-story",
    title: "The Story",
    subtitle: "A Legacy of Exclusivity",
    heroImageUrl: "/image.jpg",
    isPublished: true,
    sections: [
      {
        type: "imageText",
        order: 0,
        number: "01",
        subheading: "The Beginning",
        heading: "Born from a desire for the extraordinary.",
        body: "Petals by Smira began with a simple philosophy: true luxury is quiet, exclusive, and timeless. In a world of mass production, we sought to curate pieces that speak to those who understand the value of rarity.",
        imageUrl: "https://res.cloudinary.com/tbllydoh/image/upload/v1788430564/petalsbysmira/story/jnirts88cjirunfzqjxo.jpg",
      },
      {
        type: "imageText",
        order: 1,
        number: "02",
        subheading: "Our Philosophy",
        heading: "Luxury is an experience, not just a transaction.",
        body: "We believe that acquiring a luxury piece should be as memorable as wearing it. This is why we operate on a private access model. Our collections are not merely sold; they are placed with individuals who appreciate their heritage.",
        imageUrl: "https://res.cloudinary.com/tbllydoh/image/upload/v1788430565/petalsbysmira/story/wpuv1zkryubcbejipq9h.jpg",
      },
      {
        type: "imageText",
        order: 2,
        number: "03",
        subheading: "Craftsmanship",
        heading: "Attention to detail in every facet.",
        body: "Every piece in The Editions has been rigorously selected for its design, quality, and legacy. From the cut of the stones to the precision of the mechanics, we settle for nothing less than perfection.",
        imageUrl: "https://res.cloudinary.com/tbllydoh/image/upload/v1788430567/petalsbysmira/story/dpeig8s0t7neyd6z9afp.jpg",
      },
      {
        type: "text",
        order: 3,
        heading: "Our Promise",
        subheading: "",
        body: "A personal and private experience, exclusively for you.",
      },
    ],
    seo: {
      title: "Our Story",
      description: "The heritage, craftsmanship, and philosophy behind Petals by Smira's exclusive luxury collections.",
    },
  },
  {
    slug: "experience",
    title: "The Petals Experience",
    subtitle: "Luxury, curated differently.",
    heroImageUrl: "",
    isPublished: true,
    sections: [
      {
        type: "step",
        order: 0,
        number: "01",
        heading: "Discover",
        body: "Explore carefully curated collections ranging from exceptional jewellery pieces to limited edition luxury watches and bags.",
      },
      {
        type: "step",
        order: 1,
        number: "02",
        heading: "Explore",
        body: "Discover the details and craftsmanship behind every piece. We provide extensive editorial details to help you appreciate the true value of our collection.",
      },
      {
        type: "step",
        order: 2,
        number: "03",
        heading: "Private Access",
        body: "Request access to selected editions. Rather than a standard cart experience, we prioritize personal connection for every acquisition.",
      },
      {
        type: "step",
        order: 3,
        number: "04",
        heading: "Personal Assistance",
        body: "Connect directly with the Petals by Smira team. Once your request is received, our concierges will reach out to finalize the details securely and privately.",
      },
      {
        type: "step",
        order: 4,
        number: "05",
        heading: "Limited Collections",
        body: "Discover pieces created for a select audience. Many of our editions are highly limited, ensuring your piece remains as exclusive as the day it was acquired.",
      },
    ],
    seo: {
      title: "The Experience",
      description: "Luxury, curated differently. Discover the Petals by Smira private access experience.",
    },
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "Discretion & Trust",
    heroImageUrl: "",
    isPublished: true,
    sections: [
      {
        type: "richText",
        order: 0,
        heading: "1. Our Commitment to Confidentiality",
        body: "At Petals by Smira, discretion and protection of personal dignity are fundamental to the luxury experience. We uphold rigorous confidentiality protocols regarding your personal identity, consultation history, and acquisition details.",
      },
      {
        type: "richText",
        order: 1,
        heading: "2. Information We Collect",
        body: "When you submit an access request, book a consultation, or acquire a piece, we collect:\n• Contact coordinates (full name, verified email, direct telephone number).\n• Delivery and recipient instructions for confidential gifting.\n• Bespoke design specifications, sizing parameters, and private consultation notes.\n• Technical diagnostics (such as secure cookie tokens used for encrypted private access sessions).",
      },
      {
        type: "richText",
        order: 2,
        heading: "3. Purpose of Data Processing",
        body: "Your data is solely used to:\n• Authenticate eligibility and issue temporary encrypted private access links.\n• Deliver concierge customer service and coordinate secure white-glove transport.\n• Fulfill statutory tax compliance and warranty registration for fine jewellery creations.\n\nWe never sell, rent, or trade your personal information to third-party commercial marketing networks.",
      },
      {
        type: "richText",
        order: 3,
        heading: "4. Security Measures",
        body: "All sensitive communications, token credentials, and client archives are protected by industry-grade encryption (TLS 1.3, SHA-256 hashed private tokens, and restricted admin role authorizations).",
      },
      {
        type: "richText",
        order: 4,
        heading: "5. Contacting the Data Protection Officer",
        body: "If you wish to review, update, or request the deletion of your records, you may write directly to our private concierge at concierge@petalsbysmira.in.",
      },
    ],
    seo: {
      title: "Privacy Policy",
      description: "Learn how Petals by Smira protects your personal data and confidentiality.",
    },
  },
  {
    slug: "terms",
    title: "Terms of Service",
    subtitle: "Maison Protocols",
    heroImageUrl: "",
    isPublished: true,
    sections: [
      {
        type: "richText",
        order: 0,
        heading: "1. Acceptance of Terms",
        body: "By accessing Petals by Smira websites, requesting private access, or ordering our bespoke luxury creations, you agree to be bound by these Maison Terms of Service.",
      },
      {
        type: "richText",
        order: 1,
        heading: "2. Private Access Model & Invitations",
        body: "Private access invitations and pricing previews are extended at the sole discretion of Petals by Smira. Access credentials and private pricing tokens are non-transferable and valid for the specific duration indicated (typically 24 hours). The Maison reserves the right to revoke access at any time.",
      },
      {
        type: "richText",
        order: 2,
        heading: "3. Bespoke Commissions & Authenticity",
        body: "Each handcrafted piece is created using artisan metalwork, fine alloys, and ethically sourced stones. Minor variations in setting nuance reflect handcrafted authenticity. Each piece is issued with an individual serial-stamped Certificate of Authenticity.",
      },
      {
        type: "richText",
        order: 3,
        heading: "4. Orders, Payment & Fulfillment",
        body: "All prices are quoted in Indian Rupees (INR) unless otherwise specified. For high-value pieces and custom commissions, full clearance of funds or verified concierge advance deposit is required prior to artisan dispatch. Deliveries are executed via secure transit with adult verification.",
      },
      {
        type: "richText",
        order: 4,
        heading: "5. Intellectual Property",
        body: "All imagery, jewellery silhouettes, trademark signatures, packaging aesthetics, and text on this site are the exclusive intellectual property of Petals by Smira. Any reproduction or unauthorized commercial exploitation is strictly prohibited.",
      },
    ],
    seo: {
      title: "Terms of Service",
      description: "Terms governing private access, commissions, acquisitions, and certificates of authenticity at Petals by Smira.",
    },
  },
];

const DEFAULT_FAQS = [
  {
    category: "Private Access & Exclusivity",
    question: "Why are prices not visible publicly for certain pieces?",
    answer: "Petals by Smira operates on a private access model for limited edition and high-jewellery creations. By requesting private access, qualified patrons receive a secure 24-hour invitation to view exclusive pricing, acquire pieces, and access personalized concierge service.",
    order: 1,
    isPublished: true,
  },
  {
    category: "Private Access & Exclusivity",
    question: "How long does it take to receive private access approval?",
    answer: "Our private client concierge reviews each request individually. Invitations are typically dispatched via email within 2 to 4 business hours.",
    order: 2,
    isPublished: true,
  },
  {
    category: "Private Access & Exclusivity",
    question: "Can private access be shared with colleagues or family?",
    answer: "Each private access link is unique to your private invitation and remains valid for 24 hours. We kindly ask that members of your circle submit their own request for access.",
    order: 3,
    isPublished: true,
  },
  {
    category: "Bespoke Commissions",
    question: "Do you offer personalized packaging for corporate or wedding occasions?",
    answer: "Yes. Our bespoke atelier designs custom debossed presentation boxes, engraved personal initials, and custom-written wax-sealed calligraphy notes for VIP gifts and milestone celebrations.",
    order: 1,
    isPublished: true,
  },
  {
    category: "Bespoke Commissions",
    question: "What is the lead time for bespoke editions?",
    answer: "Curated gift assortments require 5 to 7 business days, while custom-commissioned fine jewellery designs require 2 to 3 weeks depending on the complexity of handcrafting.",
    order: 2,
    isPublished: true,
  },
  {
    category: "Delivery & Authentication",
    question: "How are orders securely transported?",
    answer: "All shipments are delivered via insured high-security white-glove couriers with mandatory OTP and signature verification upon handover.",
    order: 1,
    isPublished: true,
  },
  {
    category: "Delivery & Authentication",
    question: "Are Petals by Smira creations certified?",
    answer: "Every jewel is accompanied by a registered Certificate of Authenticity specifying craftsmanship hallmarks, premium alloy purity, and gemstone specifications.",
    order: 2,
    isPublished: true,
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in environment variables.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. SiteSettings
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
      console.log("Created initial default SiteSettings document.");
    } else {
      console.log("SiteSettings document already exists.");
    }

    // 2. Pages
    for (const pageData of DEFAULT_PAGES) {
      await Page.findOneAndUpdate({ slug: pageData.slug }, pageData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(`Page synced: ${pageData.slug}`);
    }

    // 3. FAQs
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
      await Faq.insertMany(DEFAULT_FAQS);
      console.log(`Inserted ${DEFAULT_FAQS.length} FAQs.`);
    } else {
      console.log(`FAQs already exist (${faqCount} found).`);
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
