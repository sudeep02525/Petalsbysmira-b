import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const run = async () => {
  try {
    const { default: cloudinary } = await import("./config/cloudinary.js");
    const { default: Product } = await import("./models/Product.js");

    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Upload images to Cloudinary
    console.log("Uploading Pearl Rakhi...");
    const pearlRes = await cloudinary.uploader.upload(
      "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\131ee987-ab37-4d59-ba39-66f5ec571f79\\royal_pearl_rakhi_1787331846078.jpg",
      { folder: "petalsbysmira_products" }
    );
    
    console.log("Uploading Kids Superhero Rakhi...");
    const superheroRes = await cloudinary.uploader.upload(
      "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\131ee987-ab37-4d59-ba39-66f5ec571f79\\kids_superhero_rakhi_1787331902966.jpg",
      { folder: "petalsbysmira_products" }
    );

    // 2. Update products in DB
    console.log("Updating Products...");
    
    await Product.findOneAndUpdate(
      { name: "Royal Pearl Rakhi" },
      { images: [pearlRes.secure_url] }
    );
    
    await Product.findOneAndUpdate(
      { name: "Kids Superhero Rakhi" },
      { images: [superheroRes.secure_url] }
    );
    
    console.log("Successfully uploaded to Cloudinary and linked to products in DB.");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
