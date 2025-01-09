// import s3 from "../config/s3.js";
// import { BadRequestError } from "../errors/index.js";
// import path from "path";
// import { v4 as uuidv4 } from "uuid"; 

// // Allowed file types
// const allowedTypes = ["csv", "xls", "xlsx"];
// const maxFileSize = 100 * 1024 * 1024; // 100MB

// export const uploadFileToS3 = async (req, fieldName) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     throw new BadRequestError("No files were uploaded.");
//   }

//   const uploadedFile = req.files[fieldName];
//   const fileSize = uploadedFile.size;
//   const fileExt = path.extname(uploadedFile.name).substring(1).toLowerCase();

//   if (fileSize > maxFileSize) {
//     throw new BadRequestError("File size exceeds the limit (5MB max).");
//   }

//   if (!allowedTypes.includes(fileExt)) {
//     throw new BadRequestError("Invalid file type. Only CSV and Excel files are allowed.");
//   }

//   // Generate unique file name
//   const uniqueFileName = `${fileExt}/${uuidv4()}-${uploadedFile.name}`;

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: uniqueFileName,
//     Body: uploadedFile.data,
//     ContentType: uploadedFile.mimetype,
//   };

//   try {
//     const result = await s3.upload(params).promise();
//     return {
//       fileUrl: result.Location,
//       fileKey: result.Key,
//       originalName:uploadedFile.name,
//       fileType:fileExt,
//       fileSize:fileSize
//     };
//   } catch (error) {
//     console.error("File upload to S3 failed:", error);
//     throw new BadRequestError("File upload to S3 failed.");
//   }
// };


import s3 from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BadRequestError } from "../errors/index.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Allowed file types
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

    // Generate unique file name
    const uniqueFileName = `${fileExt}/${uuidv4()}-${uploadedFile.name}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        Body: uploadedFile.data,
        ContentType: uploadedFile.mimetype,
    };

    try {
        await s3.send(new PutObjectCommand(params));
        return {
            fileKey: uniqueFileName,
            originalName: uploadedFile.name,
            fileType: fileExt,
            fileSize: fileSize
        };
    } catch (error) {
        console.error("File upload to S3 failed:", error);
        throw new BadRequestError("File upload to S3 failed.");
    }
};
