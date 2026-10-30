import "./config/loadEnv.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('products').updateMany({}, { $set: { isFeatured: true } });
  console.log('Updated ' + result.modifiedCount + ' products');
  process.exit(0);
}).catch(console.error);
