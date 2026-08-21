import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "petalsbysmira",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1200, height: 1200, crop: "limit", quality: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
});

export default upload;
