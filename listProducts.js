import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config({ path: "./.env.production" });

const listProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find().limit(10);
    
    console.log("=== Products in DB ===");
    products.forEach(p => {
      console.log(`Name: ${p.name}`);
      console.log(`Category/Occasion: ${p.category} | ${p.occasionTags}`);
      console.log(`Images: ${p.images.length ? p.images[0] : 'None'}`);
      console.log("---");
    });
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listProducts();
