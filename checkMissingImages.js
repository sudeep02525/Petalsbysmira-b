import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config({ path: "./.env.local" });

const checkMissingImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const products = await Product.find({ $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] });
    const categories = await Category.find({ $or: [{ image: null }, { image: "" }, { image: { $exists: false } }] });
    
    console.log(`Missing Product Images: ${products.length}`);
    products.forEach(p => console.log(`- Product: ${p.name}`));
    
    console.log(`\nMissing Category Images: ${categories.length}`);
    categories.forEach(c => console.log(`- Category: ${c.name}`));
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkMissingImages();
