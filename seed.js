// Run this ONCE to create the first admin account: node seed.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";

const run = async () => {
  await connectDB();

  // 1. Create default admin (if not exists)
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: "Petals by Smira Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "superadmin",
    });
    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log("ℹ️  Admin already exists, skipping");
  }

  // 2. Create default categories (matching the website reference)
  const categories = [
    { name: "Korean Jewellery", slug: "korean-jewellery", displayOrder: 1 },
    { name: "Pendant Sets", slug: "pendant-sets", displayOrder: 2 },
    { name: "Bangles", slug: "bangles", displayOrder: 3 },
    { name: "Bracelets", slug: "bracelets", displayOrder: 4 },
    { name: "Luxury Purses", slug: "luxury-purses", displayOrder: 5 },
    { name: "Premium Kurtas", slug: "premium-kurtas", displayOrder: 6 },
    { name: "Elegant Sandals", slug: "elegant-sandals", displayOrder: 7 },
    { name: "Curated Hampers", slug: "curated-hampers", displayOrder: 8 },
  ];

  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      console.log(`✅ Category created: ${cat.name}`);
    }
  }

  console.log("🌸 Seed complete");
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
