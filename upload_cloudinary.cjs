const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'tbllydoh', 
  api_key: '849724119316726', 
  api_secret: 'hYuMFqajTiMmO0ADxNFi3iGZ6ac' 
});

const files = [
  'C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\75d1e2c9-b889-43c3-a87b-ed02a1a88829\\story_1_beginning_1788430338061.jpg',
  'C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\75d1e2c9-b889-43c3-a87b-ed02a1a88829\\story_2_philosophy_1788430352171.jpg',
  'C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\75d1e2c9-b889-43c3-a87b-ed02a1a88829\\story_3_details_1788430495332.jpg'
];

async function upload() {
  for (let file of files) {
    try {
      const result = await cloudinary.uploader.upload(file, { folder: 'petalsbysmira/story' });
      console.log(`Uploaded ${file}:\n${result.secure_url}`);
    } catch (e) {
      console.error(e);
    }
  }
}

upload();
