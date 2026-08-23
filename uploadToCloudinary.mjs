import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: 'tbllydoh',
  api_key: '849724119316726',
  api_secret: 'hYuMFqajTiMmO0ADxNFi3iGZ6ac'
});

const localDir = 'C:\\Petals-by-smira\\petalsbysmira-f\\public\\images\\products';
const seedFile = 'C:\\Petals-by-smira\\Petalsbysmira-b\\seedLuxuryProducts.js';

const imagesToUpload = [
  'edition_1.jpg', 'edition_2.jpg', 'edition_3.jpg', 'edition_4.jpg', 'edition_5.jpg',
  'watch_1.jpg', 'watch_2.jpg', 'watch_3.jpg', 'watch_4.jpg', 'watch_5.jpg',
  'bag_1.jpg', 'bag_2.jpg', 'bag_3.jpg', 'bag_4.jpg', 'bag_5.jpg'
];

async function run() {
  try {
    let seedContent = fs.readFileSync(seedFile, 'utf8');
    
    for (const file of imagesToUpload) {
      const filePath = path.join(localDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${file} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'petalsbysmira/products'
        });
        
        const localPattern = `"/images/products/${file}"`;
        const secureUrl = `"${result.secure_url}"`;
        
        seedContent = seedContent.replace(localPattern, secureUrl);
        console.log(`Updated link for ${file} -> ${result.secure_url}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    }
    
    fs.writeFileSync(seedFile, seedContent);
    console.log('Successfully updated seedLuxuryProducts.js with Cloudinary URLs.');
    
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
  }
}

run();
