import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

import fs from "fs";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const updateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    
    for (let product of products) {
      let needsUpdate = false;
      
      // Add realistic luxury descriptions based on product name
      if (!product.shortDescription || product.shortDescription.trim() === "") {
        product.shortDescription = `Experience the timeless elegance of the ${product.name}. A masterpiece of modern craftsmanship designed for the discerning individual.`;
        needsUpdate = true;
      }
      
      if (!product.description || product.description.trim() === "") {
        product.description = `The ${product.name} represents the pinnacle of luxury and exclusivity. Meticulously crafted by master artisans, this exceptional piece combines heritage techniques with contemporary vision. Every detail has been carefully considered to create a statement of power and sophistication. Perfect for elevating any collection, it stands as a testament to uncompromising quality and refined taste.`;
        needsUpdate = true;
      }

      if (!product.shortSubtitle || product.shortSubtitle.trim() === "") {
        product.shortSubtitle = "A statement of power and elegance.";
        needsUpdate = true;
      }

      // Add a dummy private price if not set, e.g., 20% off
      if (!product.privatePrice) {
         product.privatePrice = Math.floor(product.price * 0.8);
         needsUpdate = true;
      }

      if (needsUpdate) {
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log("Finished updating products.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating products:", error);
    process.exit(1);
  }
};

updateProducts();
