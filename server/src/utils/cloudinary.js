import { v2 as cloudinary } from 'cloudinary'
import AppError from './appError.js';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) throw new AppError(400, "File path is required for upload")
            const response = await cloudinary.uploader.upload(localFilePath,{
                folder: "eventbook",
                resource_type: "image"
            })
            console.log("cloudinary response ==>", response)
            return response.url;
        
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new AppError(500, "Error uploading file to Cloudinary");
    }
}

export default uploadToCloudinary