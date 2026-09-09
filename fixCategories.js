import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";

const run = async () => {
  await connectDB();

  // Clear existing categories
  await Category.deleteMany({});
  console.log("🧹 Cleared old categories");

  // Create new luxury categories
  const categories = [
    { name: "High Jewelry", slug: "high-jewelry", displayOrder: 1 },
    { name: "Fine Necklaces", slug: "fine-necklaces", displayOrder: 2 },
    { name: "Rings & Bands", slug: "rings-bands", displayOrder: 3 },
    { name: "Bracelets", slug: "bracelets", displayOrder: 4 },
    { name: "Earrings", slug: "earrings", displayOrder: 5 },
    { name: "Bridal & Engagement", slug: "bridal-engagement", displayOrder: 6 },
  ];

  for (const cat of categories) {
    await Category.create(cat);
    console.log(`✅ Category created: ${cat.name}`);
  }

  console.log("💎 Luxury categories update complete");
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
