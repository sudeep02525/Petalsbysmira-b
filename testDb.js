import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config({ path: ".env.local" });

const testDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "petalsbysmira@gmail.com";
    const admin = await Admin.findOne({ email });
    console.log("Admin found:", !!admin);
    if (admin) {
      const isMatch = await admin.matchPassword("Sudeep@00");
      console.log("Password matches:", isMatch);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
testDb();
