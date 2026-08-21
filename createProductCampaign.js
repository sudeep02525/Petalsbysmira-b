import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Campaign from "./models/Campaign.js";

dotenv.config({ path: "./.env.local" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get the products we just updated
    const pearl = await Product.findOne({ name: "Royal Pearl Rakhi" });
    const superhero = await Product.findOne({ name: "Kids Superhero Rakhi" });
    
    if (!pearl || !superhero) {
      console.log("Products not found!");
      process.exit(1);
    }

    const pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const campaign = new Campaign({
      title: "Raksha Bandhan Exclusive",
      subtitle: "Shop our premium Rakhi collection",
      description: "Handcrafted with love for the special bond.",
      startDate: pastMonth,
      endDate: nextMonth,
      status: "active",
      priority: 100,
      cta: {
        enabled: true,
        text: "View All Rakhis",
        link: "/shop?occasion=rakhi"
      },
      images: [
        {
          url: pearl.images[0],
          alt: pearl.name,
          title: pearl.name,
          link: `/product/${pearl.slug}`,
          displayOrder: 1,
          enabled: true
        },
        {
          url: superhero.images[0],
          alt: superhero.name,
          title: superhero.name,
          link: `/product/${superhero.slug}`,
          displayOrder: 2,
          enabled: true
        }
      ]
    });

    await campaign.save();
    console.log("Successfully created campaign with actual website products and Cloudinary URLs!");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
