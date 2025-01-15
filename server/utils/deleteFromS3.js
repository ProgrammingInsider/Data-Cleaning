import s3 from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BadRequestError } from "../errors/index.js";

export const deleteFileFromS3 = async (fileKey) => {
    if (!fileKey) {
        throw new BadRequestError("File key is required.");
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        await s3.send(new DeleteObjectCommand(params));
        return true;
    } catch (error) {
        console.error("File deletion from S3 failed:", error);
        throw new BadRequestError("File deletion from S3 failed.");
    }
};
