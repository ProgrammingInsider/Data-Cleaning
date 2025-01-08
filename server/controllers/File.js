import { uploadFileToS3 } from "../utils/uploadToS3";

export const UploadFile = async(req,res) => {
    const { userId } = req.user;

    const { imageUrl, publicId } = await uploadFileToS3(
        req,
        'imageUrl',
        'products'
    );
    res.json("Uploaded successfully");    
}