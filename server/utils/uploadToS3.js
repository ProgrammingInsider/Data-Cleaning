import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import { BadRequestError } from "../errors/index.js";

const allowedTypes = ["csv", "xls", "xlsx"];
const maxFileSize = 100 * 1024 * 1024; // 100MB

export const uploadFileToS3 = async (req, fieldName) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new BadRequestError("No files were uploaded.");
    }

    const uploadedFile = req.files[fieldName];
    const fileSize = uploadedFile.size;
    const fileExt = path.extname(uploadedFile.name).substring(1).toLowerCase();

    if (fileSize > maxFileSize) {
        throw new BadRequestError("File size exceeds the limit (100MB max).");
    }

    if (!allowedTypes.includes(fileExt)) {
        throw new BadRequestError("Invalid file type. Only CSV and Excel files are allowed.");
    }

    const uniqueFileName = `${fileExt}/${uuidv4()}-${uploadedFile.name}`;

    // Read file from temporary storage
    const fileData = fs.readFileSync(uploadedFile.tempFilePath);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: fileData,
        ContentType: uploadedFile.mimetype || "application/octet-stream",
    };

    try {
        await s3.send(new PutObjectCommand(params));
        return {
            fileKey: uniqueFileName,
            originalName: uploadedFile.name,
            fileType: fileExt,
            fileSize: fileSize,
        };
    } catch (error) {
        console.error("File upload to S3 failed:", error);
        throw new BadRequestError("File upload to S3 failed.");
    }
};
