import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

export const generatePresignedUrl = async (fileKey) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    });

    // Generate pre-signed URL (valid for 10 minutes)
    return await getSignedUrl(s3, command, { expiresIn: 600 });
};