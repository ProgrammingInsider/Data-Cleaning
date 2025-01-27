import openai from "../config/openaiConfig.js";
import { queryDb } from "../DB_methods/query.js";
import { ParseS3File } from "../utils/ParseS3File.js";
import { 
    frequency_penalty, 
    max_completion_tokens, 
    messages, 
    presence_penalty, 
    response_format, 
    temperature, 
    top_p } from "../openAI/errorDetection.js";

export const ErrorDetection = async (req, res) => {
    const { userId } = req.user;
    const { fileId } = req.body;
    
    // Fetch files from the database
    const userFiles = await queryDb(
        `SELECT file_id, file_key, original_name, category, description, progress FROM files WHERE file_id = ? AND user_id = ?`,
        [fileId,userId]
    );

    if (userFiles.length === 0) {
        return res
                .status(200)
                .json({ 
                    status: false, 
                    message: "No file uploaded yet" 
                });
    }

    const fileKey = userFiles[0].file_key;
    
    const parsedData = await ParseS3File({ fileKey })

    if (!parsedData) {
        return res.status(400).json({ 
            status: false, 
            message: "Parsed data is invalid or empty" 
        });
    }
    
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: await messages(parsedData),
        max_tokens: max_completion_tokens,
        temperature: temperature,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        response_format: response_format,
    })

    // Log the response for debugging
    // console.log("OpenAI Response:", JSON.stringify(response, null, 2));


     // Validate OpenAI response
    const result = response?.choices?.[0]?.message?.content
    if (!result) {
        return res.status(500).json({ 
            status: false, 
            message: "Failed to retrieve a valid response from OpenAI" 
        });
    }

    // response.data.choices[0].message
    return res.status(200).json({ 
        status: true, 
        message: "Fetched successfully", 
        fileDetails: userFiles, 
        detectionResults:  JSON.parse(result).DataInconsistencies
    });
}
