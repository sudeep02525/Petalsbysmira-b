import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "petalsbysmira@gmail.com";
    const password = "Sudeep@00";

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
