import { uploadFileToS3 } from "../utils/uploadToS3.js";
import { BadRequestError, UnauthenticatedError, NotFoundError } from '../errors/index.js';
import { queryDb } from "../DB_methods/query.js";
import { generatePresignedUrl } from "../utils/generatePreSignedUrl.js";
import { deleteFileFromS3 } from "../utils/deleteFromS3.js";
import { 
    frequency_penalty, 
    max_completion_tokens, 
    messages, 
    presence_penalty, 
    response_format, 
    temperature, 
    top_p } from "../openAI/schemaDefinition.js";
import openai from "../config/openaiConfig.js";
import { ParseS3File } from "../utils/ParseS3File.js";

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

       // Fetch files from the database
        const userFiles = await queryDb(
            `SELECT file_id FROM files WHERE file_key = ? AND user_id = ?`,
            [fileKey,userId]
        );

        if (userFiles.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No file found for the given user and file ID.",
            });
        }
    
        // const parsedData = await ParseS3File({ fileKey })
        const parsedData = await ParseS3File({fileKey})

        if (!parsedData || Object.keys(parsedData).length === 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Parsed data is invalid or empty" 
            });
        }

        let records;
        if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
            const sheetName = Object.keys(parsedData)[0]; 
            records = parsedData[sheetName];
        } else {
            records = parsedData;
        }

        const firstFiveRows = Array.isArray(records) ? records.slice(0, 1) : [];

        const openAiPayload = {
            model: "gpt-4o-mini",
            messages: await messages(firstFiveRows),
            max_tokens: max_completion_tokens,
            temperature: temperature,
            top_p: top_p,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            response_format: response_format,
        };
        
        const response = await openai.chat.completions.create(openAiPayload);
        const finalResponse = response.choices?.[0]?.message?.content;

        let parsedResponse;
        let schemaDefinition;
        try {
            parsedResponse = typeof finalResponse === "string" ? JSON.parse(finalResponse) : finalResponse;
        } catch (error) {
            console.error("Error parsing response JSON:", error);
        }

        schemaDefinition = parsedResponse?.schema_definition;
        console.log("Before AI actions inserted successfully. ",schemaDefinition);

        if ((schemaDefinition && Object.keys(schemaDefinition).length > 0)) {
            await queryDb(
                `INSERT INTO FileSchemas (file_id, user_id, schema_definition) VALUES (?, ?, ?)`,
                [userFiles[0].file_id, userId, JSON.stringify(schemaDefinition)]
            );

        }else{

            return res.status(200).json({ 
                status: false, 
                message: "The AI could not generate schema for the file.",
            });
        }

        const fileSchemaDefinition = {
            file_id: userFiles[0].file_id,
            schema_definition: schemaDefinition
        }


        return res
                .status(201)
                .json({ 
                    status: true, 
                    message: "Uploaded successfully", 
                    fileSchemaDefinition
                });
    } else {
        return next(new Error("Failed to register user."));
    } 
}

export const getSchema = async(req, res) => {
    const {fileid} = req.query;
    const { userId } = req.user;

    if(!fileid && !userId){
        throw new BadRequestError("Please provide all required information.");
    }

    // Fetch files from the database
    const fetchSchema = await queryDb(
        `SELECT * FROM FileSchemas WHERE file_id = ? AND user_id = ?`,
        [fileid,userId]
    );

    if (fetchSchema.length === 0) {
        return res.status(200).json({ 
            status: false, 
            message: "No schema for this file." 
        });
    }

    return res.status(200).json({
        status:true, 
        result:fetchSchema
    })

}

export const editSchema = async(req, res) => {
    const {file_id, schema_definition} = req.body;
    const { userId } = req.user;

    if(!file_id && !schema_definition && !userId){
        throw new BadRequestError("Please provide all required information.");
    }

    console.log(file_id, schema_definition);
    

    // INSERT USER INTO DATABASE
    const updateSchema = await queryDb(
        `UPDATE FileSchemas SET  schema_definition = ? WHERE file_id = ? AND user_id = ?`,
        [JSON.stringify(schema_definition), file_id, userId]
    );

    console.log(updateSchema);
    
    if(!updateSchema){
        throw new NotFoundError("No schema generated for this file, Please try again later!");
    }
    
    if(updateSchema.changedRows > 0){
        return res.status(200).json({status:true, message:"Schema Updated Successfully"})
    }else{
        return res.status(200).json({status:false, message:"No change you have made."})
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

