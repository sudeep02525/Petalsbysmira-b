import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config({ path: ".env.local" });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const email = "petalsbysmira@gmail.com";
    const password = "Sudeep@00";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin ${email} already exists. Updating password...`);
      existingAdmin.password = password; // The pre-save hook handles hashing
      await existingAdmin.save();
      console.log("Password updated successfully.");
    } else {
      console.log(`Creating admin ${email}...`);
      await Admin.create({
        name: "Super Admin",
        email: email,
        password: password, // The pre-save hook handles hashing
        role: "superadmin"
      });
      console.log("Admin created successfully.");
    }

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
