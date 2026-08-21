import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config({ path: "./.env.local" });

const categoryImages = {
  "Rakhi": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", // generic festive
  "Jewellery": "https://images.unsplash.com/photo-1599643478514-4a810f994dd0?q=80&w=600&auto=format&fit=crop",
  "Bangles": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  "Purses": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
  "Kurtas": "https://images.unsplash.com/photo-1583391733958-d15a592476b7?q=80&w=600&auto=format&fit=crop",
  "Sandals": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
  "Gift Hampers": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
  "Fashion Accessories": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
};

const productImages = {
  // Rakhi
  "Emerald Charm Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Golden Thread Traditional Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Om Diamond-Finish Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Silver Plated Swastik Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Kundan Floral Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Rudraksha Beaded Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Rose Gold Minimalist Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Peacock Design Premium Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Evil Eye Protection Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  "Sandalwood Beaded Traditional Rakhi": "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=800&auto=format&fit=crop",
  
  // Hampers
  "Premium Rakhi Thali Set": "https://images.unsplash.com/photo-1605335198083-d9d15dcc3947?q=80&w=800&auto=format&fit=crop",
  "Rakhi & Sweets Deluxe Hamper": "https://images.unsplash.com/photo-1603525281488-842277d70440?q=80&w=800&auto=format&fit=crop",
  "Brother's Grooming Rakhi Hamper": "https://images.unsplash.com/photo-1621607512282-598dc465541e?q=80&w=800&auto=format&fit=crop",
  "Twin Rakhi Chocolate Box": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
  
  // Jewellery
  "Pearl Elegance Pendant Set": "https://images.unsplash.com/photo-1599643478514-4a810f994dd0?q=80&w=800&auto=format&fit=crop",
  "Rose Gold Bracelet Set": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  "Kundan Style Choker": "https://plus.unsplash.com/premium_photo-1681276170683-7062bfeb7c33?q=80&w=800&auto=format&fit=crop",
  "Sapphire-inspired Earrings": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Update Categories
    for (const [name, url] of Object.entries(categoryImages)) {
      await Category.findOneAndUpdate(
        { name },
        { image: url }
      );
    }
    console.log("Categories updated.");

    // Update Products
    for (const [name, url] of Object.entries(productImages)) {
      await Product.findOneAndUpdate(
        { name },
        { images: [url] }
      );
    }
    console.log("Products updated.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
