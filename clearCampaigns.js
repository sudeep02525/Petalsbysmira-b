import mongoose from "mongoose";
import dotenv from "dotenv";
import Campaign from "./models/Campaign.js";

dotenv.config({ path: "./.env.production" });

const clearCampaigns = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Campaign.deleteMany();
    console.log("All campaigns deleted successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

clearCampaigns();
