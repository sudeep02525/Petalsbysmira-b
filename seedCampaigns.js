import mongoose from "mongoose";
import dotenv from "dotenv";
import Campaign from "./models/Campaign.js";

dotenv.config({ path: "./.env.production" }); // Use appropriate env file

const seedCampaigns = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    await Campaign.deleteMany();
    console.log("Cleared existing campaigns...");

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);
    
    const pastMonth = new Date();
    pastMonth.setMonth(now.getMonth() - 1);
    
    const futureDate1 = new Date();
    futureDate1.setMonth(now.getMonth() + 2);
    const futureDate2 = new Date();
    futureDate2.setMonth(now.getMonth() + 3);

    const campaigns = [
      {
        title: "Raksha Bandhan Special",
        subtitle: "Celebrate the eternal bond of love",
        description: "Gift your sibling our luxurious hampers curated with premium sweets, dry fruits, and elegant Rakhis.",
        cta: { enabled: true, text: "Shop Rakhi Collection", link: "/shop?occasion=rakhi" },
        startDate: pastMonth, // Currently Active
        endDate: nextMonth,
        status: "active",
        priority: 100,
        displayOrder: 1,
        images: [
          { url: "https://images.unsplash.com/photo-1603525281488-842277d70440?q=80&w=1200&auto=format&fit=crop", alt: "Rakhi Hamper", title: "Premium Rakhi Hamper", link: "/shop?occasion=rakhi", displayOrder: 1, enabled: true },
          { url: "https://images.unsplash.com/photo-1629858739959-1eab7685dc49?q=80&w=1200&auto=format&fit=crop", alt: "Elegant Rakhi", title: "Elegant Designer Rakhi", link: "/shop?occasion=rakhi", displayOrder: 2, enabled: true },
          { url: "https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1200&auto=format&fit=crop", alt: "Dry Fruits Box", title: "Luxury Dry Fruits Box", link: "/shop?occasion=rakhi", displayOrder: 3, enabled: true },
          { url: "https://images.unsplash.com/photo-1605335198083-d9d15dcc3947?q=80&w=1200&auto=format&fit=crop", alt: "Sweets", title: "Festive Mithai", link: "/shop?occasion=rakhi", displayOrder: 4, enabled: true }
        ]
      },
      {
        title: "Diwali Grandeur",
        subtitle: "Illuminate their hearts with luxury",
        description: "Make this Diwali unforgettable with our exclusive gifting collection featuring premium diyas, exotic dry fruits, and artisanal sweets.",
        cta: { enabled: true, text: "Explore Diwali Gifts", link: "/shop?occasion=diwali" },
        startDate: futureDate1, // Upcoming
        endDate: futureDate2,
        status: "active",
        priority: 90,
        displayOrder: 2,
        images: [
          { url: "https://images.unsplash.com/photo-1572504951460-70588a4b63e6?q=80&w=1200&auto=format&fit=crop", alt: "Diwali Diyas", title: "Artisanal Diyas", link: "/shop?occasion=diwali", displayOrder: 1, enabled: true },
          { url: "https://images.unsplash.com/photo-1603813735164-325dbde747eb?q=80&w=1200&auto=format&fit=crop", alt: "Diwali Hamper", title: "Grand Diwali Hamper", link: "/shop?occasion=diwali", displayOrder: 2, enabled: true },
          { url: "https://images.unsplash.com/photo-1605300062775-680459a9a3b6?q=80&w=1200&auto=format&fit=crop", alt: "Luxury Sweets", title: "Premium Sweets Collection", link: "/shop?occasion=diwali", displayOrder: 3, enabled: true }
        ]
      },
      {
        title: "Valentine's Romance",
        subtitle: "Express love with elegance",
        description: "Curated romantic gifts, fresh roses, and artisanal chocolates for your special someone.",
        cta: { enabled: true, text: "Shop Romance", link: "/shop?occasion=valentines" },
        startDate: new Date(now.getFullYear(), 1, 1), // Feb 1
        endDate: new Date(now.getFullYear(), 1, 15), // Feb 15
        status: "active",
        priority: 80,
        displayOrder: 3,
        images: [
          { url: "https://images.unsplash.com/photo-1546502208-81d149d52bd7?q=80&w=1200&auto=format&fit=crop", alt: "Red Roses", title: "Luxury Rose Box", link: "/shop?occasion=valentines", displayOrder: 1, enabled: true },
          { url: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1200&auto=format&fit=crop", alt: "Chocolates", title: "Artisanal Chocolates", link: "/shop?occasion=valentines", displayOrder: 2, enabled: true },
          { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop", alt: "Valentine Gift", title: "Romantic Gifting", link: "/shop?occasion=valentines", displayOrder: 3, enabled: true },
          { url: "https://images.unsplash.com/photo-1533227268428-f9ed0900f9bf?q=80&w=1200&auto=format&fit=crop", alt: "Couple Gift", title: "For the Couple", link: "/shop?occasion=valentines", displayOrder: 4, enabled: true }
        ]
      }
    ];

    await Campaign.insertMany(campaigns);
    console.log("Campaigns seeded successfully!");
    
    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

seedCampaigns();
