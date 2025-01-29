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
        `SELECT file_id, file_key, original_name, category, description, progress, previous_response FROM files WHERE file_id = ? AND user_id = ?`,
        [fileId,userId]
    );

    if (userFiles.length === 0) {
        return res.status(404).json({
            status: false,
            message: "No file found for the given user and file ID.",
        });
    }

    const fileKey = userFiles[0].file_key;
    const previousResponse = userFiles[0].previous_response;
    
    const parsedData = await ParseS3File({ fileKey })

    if (!parsedData || Object.keys(parsedData).length === 0) {
        return res.status(400).json({ 
            status: false, 
            message: "Parsed data is invalid or empty" 
        });
    }

    // Prepare OpenAI request payload
    const openAiPayload = {
        model: "gpt-4o-mini",
        messages: await messages(parsedData, previousResponse),
        max_tokens: max_completion_tokens,
        temperature: temperature,
        top_p: top_p,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        response_format: response_format,
    };
    
     // Send request to OpenAI
    const response = await openai.chat.completions.create(openAiPayload);

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

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(result);
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Failed to parse OpenAI response.",
            error: err.message,
        });
    }

    // Check if DataInconsistencies are present
    if (!parsedResponse?.DataInconsistencies) {
        return res.status(500).json({
            status: false,
            message: "The OpenAI response does not contain 'DataInconsistencies'.",
        });
    }

     // Update the database with the current response
    await queryDb(
        `UPDATE files 
        SET previous_response = ? 
        WHERE file_id = ? AND user_id = ?`,
        [JSON.stringify(parsedResponse), fileId, userId]
    );
    
    

    // response.data.choices[0].message
    return res.status(200).json({ 
        status: true, 
        message: "Fetched successfully", 
        fileDetails: userFiles, 
        detectionResults:  parsedResponse.DataInconsistencies,
    });
}
