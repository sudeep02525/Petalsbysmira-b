import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

import Product from "./models/Product.js";
import Category from "./models/Category.js";

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const categoriesData = [
  { name: "The Editions", slug: "the-editions", description: "Curated for those who know their worth.", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" },
  { name: "Men's Luxury Watches", slug: "mens-luxury-watches", description: "Timeless Icons", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop" },
  { name: "Luxury Bags", slug: "luxury-bags", description: "A Lifestyle, Not a Trend", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" }
];

const productsData = [
  // The Editions
  {
    name: "The Panther Cuff",
    sku: "ED-PAN-01",
    description: "Strength in Grace. A statement, not just a jewel.",
    categorySlug: "the-editions",
    price: 85000,
    stock: 5,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505113/petalsbysmira/products/gatr3nmojdqrwejma8wo.jpg"],
    isActive: true,
  },
  {
    name: "Starry Branch Ring",
    sku: "ED-STA-02",
    description: "A Constellation on Your Hand. Crafted with meticulous precision.",
    categorySlug: "the-editions",
    price: 45000,
    stock: 12,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505114/petalsbysmira/products/iab3nwuid9tlti6z0vlg.jpg"],
    isActive: true,
  },
  {
    name: "Diamond Wave Cuff",
    sku: "ED-DIA-03",
    description: "Fluid. Fearless. Forever. Let elegance wrap around you.",
    categorySlug: "the-editions",
    price: 65000,
    stock: 8,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505115/petalsbysmira/products/lp6suxvdmlbmop0nluvn.jpg"],
    isActive: true,
  },
  {
    name: "Emerald Petal Line",
    sku: "ED-EME-04",
    description: "Grace in Every Detail. An emerald signature of timeless beauty.",
    categorySlug: "the-editions",
    price: 95000,
    stock: 3,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505116/petalsbysmira/products/d5loknwmnvkqwrz8dp1e.jpg"],
    isActive: true,
  },
  {
    name: "Royal Bloom Bag",
    sku: "ED-ROY-05",
    description: "A Legacy of Artistry. Carved out of pure golden ambition.",
    categorySlug: "the-editions",
    price: 120000,
    stock: 2,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505117/petalsbysmira/products/nazxhdf5ekn7mdcjxzgb.jpg"],
    isActive: true,
  },

  // Men's Luxury Watches
  {
    name: "Rolex Daytona",
    sku: "WT-DAY-01",
    description: "Icons Never Follow. The ultimate tool watch for those with a passion for driving and speed.",
    categorySlug: "mens-luxury-watches",
    price: 2500000,
    stock: 1,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505117/petalsbysmira/products/fomfg2uhc7v455o89cc0.jpg"],
    isActive: true,
  },
  {
    name: "Rolex Submariner",
    sku: "WT-SUB-02",
    description: "Built for Legends. The reference among divers' watches.",
    categorySlug: "mens-luxury-watches",
    price: 1200000,
    stock: 3,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505118/petalsbysmira/products/y8q5rrexnjfcojn0zd1q.jpg"],
    isActive: true,
  },
  {
    name: "Rolex GMT-Master II",
    sku: "WT-GMT-03",
    description: "Beyond Time. Designed to show the time in two different time zones simultaneously.",
    categorySlug: "mens-luxury-watches",
    price: 1450000,
    stock: 2,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505119/petalsbysmira/products/kef8xfon6hldpggzla6x.jpg"],
    isActive: true,
  },
  {
    name: "Rolex Datejust",
    sku: "WT-DAT-04",
    description: "A Legacy on Your Wrist. The classic watch of reference.",
    categorySlug: "mens-luxury-watches",
    price: 950000,
    stock: 5,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505119/petalsbysmira/products/sijydiczhii0xggjig1e.jpg"],
    isActive: true,
  },
  {
    name: "Rolex Sky-Dweller",
    sku: "WT-SKY-05",
    description: "Master Every Moment. The watch for world travellers.",
    categorySlug: "mens-luxury-watches",
    price: 1800000,
    stock: 1,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505120/petalsbysmira/products/un27ga53pxbz1yklkxdl.jpg"],
    isActive: true,
  },

  // Luxury Bags
  {
    name: "Gucci Ophidia Tote",
    sku: "BG-OPH-01",
    description: "Classic. Iconic. The essence of the house's heritage.",
    categorySlug: "luxury-bags",
    price: 185000,
    stock: 4,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505121/petalsbysmira/products/pool9qdphxu3jbwo1pfl.jpg"],
    isActive: true,
  },
  {
    name: "Gucci GG Marmont",
    sku: "BG-MAR-02",
    description: "Timeless Elegance. Characterized by its softly structured shape.",
    categorySlug: "luxury-bags",
    price: 210000,
    stock: 3,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505121/petalsbysmira/products/jubfqnkh3ubcua0hxxgy.jpg"],
    isActive: true,
  },
  {
    name: "Gucci Bamboo 1947",
    sku: "BG-BAM-03",
    description: "Heritage Reimagined. A symbol of the house's innovative spirit.",
    categorySlug: "luxury-bags",
    price: 320000,
    stock: 2,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505122/petalsbysmira/products/mrdywvca4o6z9ucqaoza.jpg"],
    isActive: true,
  },
  {
    name: "Gucci Jackie 1961",
    sku: "BG-JAC-04",
    description: "Effortless Luxury. Reintroduced with a modern edge.",
    categorySlug: "luxury-bags",
    price: 250000,
    stock: 3,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505123/petalsbysmira/products/coe4uub8v2pzbpd0yayu.jpg"],
    isActive: true,
  },
  {
    name: "Gucci Horsebit 1955",
    sku: "BG-HOR-05",
    description: "Timeless Heritage. A connection to the equestrian world.",
    categorySlug: "luxury-bags",
    price: 275000,
    stock: 4,
    images: ["https://res.cloudinary.com/tbllydoh/image/upload/v1787505124/petalsbysmira/products/v5myvyprnhnuehxpvgkr.jpg"],
    isActive: true,
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected.");

    console.log("Clearing existing products and categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("Inserting categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    
    // Map slugs to ObjectIds
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log("Preparing products...");
    const productsToInsert = productsData.map(product => {
      const categoryId = categoryMap[product.categorySlug];
      const slug = generateSlug(product.name);
      
      // Split description into shortSubtitle and description based on the first period
      const [shortSubtitle, ...restDesc] = product.description.split(".");
      const fullDesc = restDesc.join(".").trim() || shortSubtitle.trim();
      
      return {
        ...product,
        slug: slug,
        shortSubtitle: shortSubtitle.trim(),
        description: fullDesc,
        limitedEdition: true,
        category: categoryId,
      };
    });

    console.log("Inserting products...");
    await Product.insertMany(productsToInsert);

    console.log("Seeding complete! Added", createdCategories.length, "categories and", productsToInsert.length, "products.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedData();
