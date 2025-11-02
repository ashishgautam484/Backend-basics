import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";
dotenv.config(); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log("Cloudinary ENV:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY ? "✅ key found" : "❌ missing");


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(! localFilePath) return null
        //upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded succesfully

        // Remove local file after successful upload
       if (fs.existsSync(localFilePath)) {
         fs.unlinkSync(localFilePath)
        }
        return response;
    }
    
    catch (error) {
        console.error("Cloudinary upload failed:", error.message)

        // Remove temp file if still exists
        if (fs.existsSync(localFilePath)) {
         fs.unlinkSync(localFilePath)
        }

        return null //remove the temporary saved file at local server as upload operation got failed
    }
}
export {uploadOnCloudinary}

// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));