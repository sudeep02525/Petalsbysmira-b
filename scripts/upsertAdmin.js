import "../config/loadEnv.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = process.env.ADMIN_EMAIL || "petalsbysmira@gmail.com";
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      console.error("❌ Error: process.env.ADMIN_PASSWORD must be provided.");
      process.exit(1);
    }

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({
        name: "Petals by Smira Admin",
        email: email,
        password: password,
        role: "superadmin"
      });
      await admin.save();
      console.log(`✅ Admin created: ${email}`);
    } else {
      // If admin exists, just ensure password is correct
      admin.password = password;
      await admin.save();
      console.log(`✅ Admin password updated for: ${email}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

run();
