import { uploadFileToS3 } from "../utils/uploadToS3.js";
import { BadRequestError, ConventionError, UnauthenticatedError, NoContentError, ForbiddenError } from '../errors/index.js';
import { queryDb } from "../DB_methods/query.js";
import { generatePresignedUrl } from "../utils/generatePreSignedUrl.js";
import { deleteFileFromS3 } from "../utils/deleteFromS3.js";

export const UploadFile = async(req,res,next) => {
    const { userId } = req.user;
    const { category, description } = req.body;

    if(!category || !description){
        throw new BadRequestError("Please provide all required information.");
    }

    const { 
        fileKey, 
        originalName, 
        fileType, 
        fileSize } = await uploadFileToS3(req,'file');

    // INSERT USER INTO DATABASE
    const newFile = await queryDb(
        `INSERT INTO files (user_id, original_name, category, description, file_key, file_type, file_size)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, originalName, category, description, fileKey, fileType, fileSize]
    );

    if (newFile.affectedRows) {
        return res
                .status(201)
                .json({ 
                    status: true, 
                    message: "Uploaded successfully" 
                });
    } else {
        return next(new Error("Failed to register user."));
    } 
}

export const getUserFiles = async (req, res) => {
    const { userId } = req.user;

    // Fetch files from the database
    const userFiles = await queryDb(
        `SELECT file_id, original_name, category, description, progress FROM files WHERE user_id = ? ORDER BY uploaded_at DESC`,
        [userId]
    );

    if (userFiles.length === 0) {
        return res.status(200).json({ 
            status: false, 
            message: "No file uploaded yet" 
        });
    }

    return res.status(200).json({ 
        status: true, 
        message: "Fetched successfully", 
        result:userFiles 
    });

    // Generate pre-signed URLs for each file
    // const filesWithUrls = await Promise.all(
    //     userFiles.map(async (file) => ({
    //         fileId: file.id,
    //         originalName: file.original_name,
    //         category: file.category,
    //         description: file.description,
    //         fileType: file.file_type,
    //         fileSize: file.file_size,
    //         fileUrl: await generatePresignedUrl(file.file_key),
    //     }))
    // );

    // res.status(200).json({ files: filesWithUrls });
};

export const deleteFile = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    const file = await queryDb(`SELECT * FROM files WHERE file_id = ?`, [id]);

    if (!file.length) {
        throw new BadRequestError("File not found.");
    }

    if (file[0].user_id !== userId) {
        throw new UnauthenticatedError("Unauthorized");
    }

    await deleteFileFromS3(file[0].file_key);

    await queryDb(`DELETE FROM files WHERE file_id = ?`, [id]);

    res
        .status(200)
        .json({ 
            status: true, 
            message: "The file was deleted successfully."
        });
};

