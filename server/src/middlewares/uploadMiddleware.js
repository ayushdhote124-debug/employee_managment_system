import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Store file in memory for direct upload to Cloudinary)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Helper function to upload base64 image string to Cloudinary
 * @param {string} base64Image
 * @param {string} folderName 
 * @returns {Promise<string>} Secure URL of uploaded image
 */
export const uploadToCloudinary = async (base64Image, folderName = 'attendance_selfies') => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folderName,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Image upload failed');
  }
};