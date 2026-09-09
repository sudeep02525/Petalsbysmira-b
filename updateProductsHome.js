import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('products').updateMany({}, { $set: { isFeatured: true } });
  console.log('Updated ' + result.modifiedCount + ' products');
  process.exit(0);
}).catch(console.error);
