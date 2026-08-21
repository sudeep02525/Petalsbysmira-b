import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

const categoriesData = [
  { name: "Rakhi", slug: "rakhi", displayOrder: 1 },
  { name: "Jewellery", slug: "jewellery", displayOrder: 2 },
  { name: "Bangles", slug: "bangles", displayOrder: 3 },
  { name: "Purses", slug: "purses", displayOrder: 4 },
  { name: "Kurtas", slug: "kurtas", displayOrder: 5 },
  { name: "Sandals", slug: "sandals", displayOrder: 6 },
  { name: "Gift Hampers", slug: "gift-hampers", displayOrder: 7 },
  { name: "Fashion Accessories", slug: "fashion-accessories", displayOrder: 8 }
];

const productsData = [
  // 12 Rakhi
  {
    name: "Royal Pearl Rakhi",
    slug: "royal-pearl-rakhi",
    sku: "PBS-RK-001",
    description: "An elegantly crafted Rakhi featuring premium pearl-inspired detailing. A sophisticated way to celebrate the bond of love.",
    shortDescription: "Elegant pearl-detailed premium Rakhi.",
    price: 399,
    discountPrice: 299,
    categorySlug: "rakhi",
    stock: 50,
    occasionTags: ["Rakhi", "Festive", "Brother-Sister"],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Emerald Charm Rakhi",
    slug: "emerald-charm-rakhi",
    sku: "PBS-RK-002",
    description: "A beautiful Rakhi featuring a rich emerald-colored central stone surrounded by delicate detailing.",
    shortDescription: "Rakhi with emerald-colored stone detailing.",
    price: 499,
    discountPrice: 349,
    categorySlug: "rakhi",
    stock: 40,
    occasionTags: ["Rakhi", "Festive"],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Golden Thread Traditional Rakhi",
    slug: "golden-thread-traditional-rakhi",
    sku: "PBS-RK-003",
    description: "A classic traditional Rakhi with high-quality golden threads and minimal auspicious motifs.",
    shortDescription: "Classic traditional golden thread Rakhi.",
    price: 199,
    discountPrice: null,
    categorySlug: "rakhi",
    stock: 100,
    occasionTags: ["Rakhi", "Festive", "Traditional"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Kids Superhero Rakhi",
    slug: "kids-superhero-rakhi",
    sku: "PBS-RK-004",
    description: "A fun and vibrant Rakhi designed specifically for kids, featuring popular superhero motifs.",
    shortDescription: "Fun superhero themed Rakhi for kids.",
    price: 149,
    discountPrice: 129,
    categorySlug: "rakhi",
    stock: 80,
    occasionTags: ["Rakhi", "Kids", "Festive"],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Om Diamond-Finish Rakhi",
    slug: "om-diamond-finish-rakhi",
    sku: "PBS-RK-005",
    description: "A spiritual Om Rakhi with a stunning diamond-like finish and soft silk threads.",
    shortDescription: "Spiritual Om Rakhi with premium finish.",
    price: 599,
    discountPrice: 499,
    categorySlug: "rakhi",
    stock: 30,
    occasionTags: ["Rakhi", "Festive", "Spiritual"],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Silver Plated Swastik Rakhi",
    slug: "silver-plated-swastik-rakhi",
    sku: "PBS-RK-006",
    description: "An auspicious Swastik design Rakhi with a premium silver-plated finish for a luxurious look.",
    shortDescription: "Auspicious Swastik Rakhi in silver finish.",
    price: 699,
    discountPrice: 549,
    categorySlug: "rakhi",
    stock: 25,
    occasionTags: ["Rakhi", "Festive", "Spiritual"],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Kundan Floral Rakhi",
    slug: "kundan-floral-rakhi",
    sku: "PBS-RK-007",
    description: "A breathtaking Rakhi featuring Kundan-style floral arrangements on a premium woven thread.",
    shortDescription: "Kundan-style floral designer Rakhi.",
    price: 799,
    discountPrice: null,
    categorySlug: "rakhi",
    stock: 20,
    occasionTags: ["Rakhi", "Festive", "Designer"],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Rudraksha Beaded Rakhi",
    slug: "rudraksha-beaded-rakhi",
    sku: "PBS-RK-008",
    description: "A traditional Rakhi featuring authentic-looking Rudraksha beads strung on a strong red thread.",
    shortDescription: "Traditional Rudraksha beaded Rakhi.",
    price: 249,
    discountPrice: 199,
    categorySlug: "rakhi",
    stock: 60,
    occasionTags: ["Rakhi", "Festive", "Traditional"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Rose Gold Minimalist Rakhi",
    slug: "rose-gold-minimalist-rakhi",
    sku: "PBS-RK-009",
    description: "A modern, minimalist Rakhi finished in elegant rose gold tones for a contemporary look.",
    shortDescription: "Modern rose gold finished minimalist Rakhi.",
    price: 449,
    discountPrice: null,
    categorySlug: "rakhi",
    stock: 45,
    occasionTags: ["Rakhi", "Festive", "Modern"],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Peacock Design Premium Rakhi",
    slug: "peacock-design-premium-rakhi",
    sku: "PBS-RK-010",
    description: "An intricate peacock motif Rakhi showcasing vibrant enamel work and premium finishing.",
    shortDescription: "Intricate peacock motif premium Rakhi.",
    price: 899,
    discountPrice: 799,
    categorySlug: "rakhi",
    stock: 15,
    occasionTags: ["Rakhi", "Festive", "Premium"],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Evil Eye Protection Rakhi",
    slug: "evil-eye-protection-rakhi",
    sku: "PBS-RK-011",
    description: "A stylish Rakhi featuring an evil eye bead to protect your brother from negative energies.",
    shortDescription: "Stylish evil eye protection Rakhi.",
    price: 349,
    discountPrice: 299,
    categorySlug: "rakhi",
    stock: 55,
    occasionTags: ["Rakhi", "Festive", "Modern"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Sandalwood Beaded Traditional Rakhi",
    slug: "sandalwood-beaded-traditional-rakhi",
    sku: "PBS-RK-012",
    description: "A highly traditional Rakhi made with fragrant sandalwood-inspired beads on a holy thread.",
    shortDescription: "Traditional sandalwood beaded Rakhi.",
    price: 299,
    discountPrice: null,
    categorySlug: "rakhi",
    stock: 70,
    occasionTags: ["Rakhi", "Festive", "Traditional"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  },

  // 4 Rakhi Hampers
  {
    name: "Premium Rakhi Thali Set",
    slug: "premium-rakhi-thali-set",
    sku: "PBS-RH-001",
    description: "A complete festive set containing a beautifully decorated Thali, a premium Rakhi, and traditional roli-chawal containers.",
    shortDescription: "Complete festive Rakhi Thali set.",
    price: 1499,
    discountPrice: 1299,
    categorySlug: "gift-hampers",
    stock: 15,
    occasionTags: ["Rakhi", "Gift", "Festive"],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Rakhi & Sweets Deluxe Hamper",
    slug: "rakhi-sweets-deluxe-hamper",
    sku: "PBS-RH-002",
    description: "A curated deluxe box featuring two elegant Rakhis alongside a premium assortment of festive sweets and chocolates.",
    shortDescription: "Deluxe box with Rakhis and sweets.",
    price: 1999,
    discountPrice: 1799,
    categorySlug: "gift-hampers",
    stock: 20,
    occasionTags: ["Rakhi", "Gift", "Festive"],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Brother's Grooming Rakhi Hamper",
    slug: "brothers-grooming-rakhi-hamper",
    sku: "PBS-RH-003",
    description: "The perfect modern gift for your brother, containing a stylish Rakhi and premium men's grooming essentials.",
    shortDescription: "Modern grooming gift hamper for brothers.",
    price: 2499,
    discountPrice: 2199,
    categorySlug: "gift-hampers",
    stock: 10,
    occasionTags: ["Rakhi", "Gift", "Modern"],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Twin Rakhi Chocolate Box",
    slug: "twin-rakhi-chocolate-box",
    sku: "PBS-RH-004",
    description: "A sweet celebration box featuring a pair of matching Rakhis and a selection of gourmet chocolates.",
    shortDescription: "Pair of Rakhis with gourmet chocolates.",
    price: 999,
    discountPrice: null,
    categorySlug: "gift-hampers",
    stock: 30,
    occasionTags: ["Rakhi", "Gift", "Festive"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  },

  // 4 Jewellery
  {
    name: "Pearl Elegance Pendant Set",
    slug: "pearl-elegance-pendant-set",
    sku: "PBS-JW-001",
    description: "A stunning fashion jewellery set featuring a delicate pendant and matching earrings with beautiful pearl-inspired detailing.",
    shortDescription: "Elegant pearl-detailed pendant and earrings set.",
    price: 1299,
    discountPrice: 999,
    categorySlug: "jewellery",
    stock: 25,
    occasionTags: ["Birthday", "Anniversary", "Gift"],
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Rose Gold Bracelet Set",
    slug: "rose-gold-bracelet-set",
    sku: "PBS-JW-002",
    description: "A set of elegant, stackable bracelets featuring a premium rose gold-tone finish and subtle stone detailing.",
    shortDescription: "Stackable elegant rose gold-tone bracelets.",
    price: 899,
    discountPrice: 749,
    categorySlug: "jewellery",
    stock: 35,
    occasionTags: ["Birthday", "Gift", "Fashion"],
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
  },
  {
    name: "Kundan Style Choker",
    slug: "kundan-style-choker",
    sku: "PBS-JW-003",
    description: "A majestic Kundan-style fashion choker necklace designed to add royal elegance to your festive wardrobe.",
    shortDescription: "Majestic Kundan-style fashion choker.",
    price: 2499,
    discountPrice: 2199,
    categorySlug: "jewellery",
    stock: 12,
    occasionTags: ["Wedding", "Festive", "Gift"],
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
  },
  {
    name: "Sapphire-inspired Earrings",
    slug: "sapphire-inspired-earrings",
    sku: "PBS-JW-004",
    description: "Dazzling fashion earrings featuring deep blue sapphire-inspired center stones surrounded by sparkling accents.",
    shortDescription: "Dazzling blue stone fashion earrings.",
    price: 799,
    discountPrice: null,
    categorySlug: "jewellery",
    stock: 40,
    occasionTags: ["Birthday", "Gift", "Fashion"],
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  }
];

const runSeed = async () => {
  try {
    await connectDB();
    console.log("🌸 Connected to Database");

    // 1. Sync Categories
    for (const cat of categoriesData) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Created Category: ${cat.name}`);
      }
    }
    
    // Fetch all categories for reference mapping
    const dbCategories = await Category.find({});
    const categoryMap = {};
    dbCategories.forEach(c => {
      categoryMap[c.slug] = c._id;
    });

    // 2. Seed Products
    let createdCount = 0;
    let updatedCount = 0;

    for (const prodData of productsData) {
      const { categorySlug, ...productFields } = prodData;
      
      const categoryId = categoryMap[categorySlug];
      if (!categoryId) {
        console.error(`❌ Category not found for slug: ${categorySlug}`);
        continue;
      }

      const existingProduct = await Product.findOne({
        $or: [{ sku: productFields.sku }, { slug: productFields.slug }]
      });

      if (existingProduct) {
        // Update it
        Object.assign(existingProduct, productFields);
        existingProduct.category = categoryId;
        // Don't overwrite existing images if they are already populated
        // Since we are skipping image generation for now, just ensure it's saved
        await existingProduct.save();
        updatedCount++;
        console.log(`🔄 Updated Product: ${productFields.name}`);
      } else {
        // Create it
        await Product.create({
          ...productFields,
          category: categoryId,
          images: [], // Left empty per user instruction to skip image gen
        });
        createdCount++;
        console.log(`✅ Created Product: ${productFields.name}`);
      }
    }

    console.log(`\n🎉 Seeding Complete!`);
    console.log(`Created: ${createdCount} products`);
    console.log(`Updated: ${updatedCount} products`);
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

runSeed();
