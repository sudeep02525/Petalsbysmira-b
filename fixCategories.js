import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const run = async () => {
  try {
    const { default: Category } = await import("./models/Category.js");
    const { default: Product } = await import("./models/Product.js");

    await mongoose.connect(process.env.MONGO_URI);

    // 1. Create categories
    await Category.deleteMany({});
    
    const catsData = [
      { name: "The Editions", slug: "the-editions", description: "Curated for those who know their worth.", isActive: true, displayOrder: 1 },
      { name: "Men's Luxury Watches", slug: "mens-luxury-watches", description: "Timeless Icons", isActive: true, displayOrder: 2 },
      { name: "Luxury Bags", slug: "luxury-bags", description: "A Lifestyle, Not a Trend", isActive: true, displayOrder: 3 }
    ];

    const createdCats = await Category.insertMany(catsData);
    console.log("Created categories:", createdCats.map(c => c.name));

    const editionsCat = createdCats.find(c => c.slug === "the-editions");
    const watchesCat = createdCats.find(c => c.slug === "mens-luxury-watches");
    const bagsCat = createdCats.find(c => c.slug === "luxury-bags");

    // 2. Update products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);

    for (let p of products) {
      if (p.name.includes("Cuff") || p.name.includes("Ring") || p.name.includes("Petal") || p.name.includes("Bloom Bag")) {
        p.category = editionsCat._id;
      } else if (p.name.includes("Rolex")) {
        p.category = watchesCat._id;
      } else if (p.name.includes("Gucci")) {
        p.category = bagsCat._id;
      }
      
      // Make sure all products are active and featured so they show up!
      p.isActive = true;
      p.isFeatured = true;
      await p.save();
    }

    console.log("Products successfully linked to new categories!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
