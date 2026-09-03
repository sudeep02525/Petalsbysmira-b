import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./.env.local" });

cloudinary.config({
  cloud_name: 'tbllydoh',
  api_key: '849724119316726',
  api_secret: 'hYuMFqajTiMmO0ADxNFi3iGZ6ac'
});

const run = async () => {
  try {
    const { default: Category } = await import("./models/Category.js");
    const { default: Product } = await import("./models/Product.js");
    await mongoose.connect(process.env.MONGO_URI);
    
    const filesToUpload = [
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_watch_1_1787812972242.jpg",
        type: "watch", name: "Premium Watch 1"
      },
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_watch_2_1787813080134.jpg",
        type: "watch", name: "Premium Watch 2"
      },
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_bag_1_1787813098282.jpg",
        type: "bag", name: "Premium Bag 1"
      },
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_bag_2_1787813112404.jpg",
        type: "bag", name: "Premium Bag 2"
      },
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_jewelry_1_1787814366503.jpg",
        type: "jewelry", name: "Premium Jewelry 1"
      },
      {
        path: "C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\082dfd51-11af-4af0-8928-31860f55bfde\\premium_jewelry_2_1787814381275.jpg",
        type: "jewelry", name: "Premium Jewelry 2"
      }
    ];

    const uploadedUrls = {};

    console.log("Uploading files to Cloudinary...");
    for (const file of filesToUpload) {
      console.log(`Uploading ${file.name}...`);
      const res = await cloudinary.uploader.upload(file.path, {
        folder: "petalsbysmira/products"
      });
      if (!uploadedUrls[file.type]) uploadedUrls[file.type] = [];
      uploadedUrls[file.type].push(res.secure_url);
    }

    console.log("Updating products in DB...");
    const products = await Product.find({}).populate('category');

    for (const p of products) {
      const categoryName = p.category?.name || "";
      let newImages = [];
      
      if (categoryName.toLowerCase().includes("watch")) {
        newImages = [uploadedUrls["watch"][Math.floor(Math.random() * uploadedUrls["watch"].length)]];
      } else if (categoryName.toLowerCase().includes("bag")) {
        newImages = [uploadedUrls["bag"][Math.floor(Math.random() * uploadedUrls["bag"].length)]];
      } else {
        newImages = [uploadedUrls["jewelry"][Math.floor(Math.random() * uploadedUrls["jewelry"].length)]];
      }

      p.images = newImages;
      await p.save();
      console.log(`Updated ${p.name} with new image.`);
    }

    console.log("Successfully assigned Cloudinary premium images to all products.");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
