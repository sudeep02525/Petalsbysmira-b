const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('products').updateMany({}, { $set: { isFeatured: true } });
  console.log('Updated ' + result.modifiedCount + ' products');
  process.exit(0);
}).catch(console.error);
