import { queryDb } from "../DB_methods/query.js";
import { generatedSchema } from "../utils/generateSchema.js";
import { manipulateData } from "../utils/manipulateData .js";
import { ParseS3File } from "../utils/ParseS3File.js";
import { validateRecords } from "../utils/validateRecords.js";
import { 
    frequency_penalty, 
    max_completion_tokens, 
    messages, 
    presence_penalty, 
    response_format, 
    temperature, 
    top_p } from "../openAI/chat.js";
import openai from "../config/openaiConfig.js";
import BadRequestError from "../errors/bad-request.js";

export const CleanData = async (req, res) => {
    const { userId } = req.user;
    const { fileId, chat } = req.body;
    
    // Fetch files from the database
    const userFiles = await queryDb(
        `SELECT file_id, file_key, original_name, category, description, progress, previous_response, file_schema FROM files WHERE file_id = ? AND user_id = ?`,
        [fileId,userId]
    );


    // Fetch issues from the database
    const fileIssues = await queryDb(
        `SELECT row_index, errors FROM issues WHERE file_id = ?`,
        [fileId]
    );
    

    if (userFiles.length === 0) {
        return res.status(404).json({
            status: false,
            message: "No file found for the given user and file ID.",
        });
    }

    const fileKey = userFiles[0].file_key;

    const parsedData = await ParseS3File({ fileKey })

    if (!parsedData || Object.keys(parsedData).length === 0) {
        return res.status(400).json({ 
            status: false, 
            message: "Parsed data is invalid or empty" 
        });
    }

    let records;
    let schema;
    let issues;
    let aiResponse;
    
    if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
        // Excel case: Extract the first sheet
        const sheetName = Object.keys(parsedData)[0]; 
        records = parsedData[sheetName];
    } else {
        // CSV/JSON case: Use parsedData directly
        records = parsedData;
    }

    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ 
            status: false, 
            message: "No valid data found" 
        });
    }

    // Construct schema dynamically from the first record
    const firstRecord = records[0];

    if (!userFiles[0].file_schema || Object.keys(userFiles[0].file_schema).length === 0){
        schema = generatedSchema(firstRecord);
        
        // Update the database with the schema
        await queryDb(
            `UPDATE files 
            SET file_schema = ? 
            WHERE file_id = ? AND user_id = ?`,
            [JSON.stringify(schema), fileId, userId]
        );
    }else{
        schema = JSON.parse(userFiles[0].file_schema);
        if (typeof userFiles[0].file_schema === "string") {
            schema = JSON.parse(userFiles[0].file_schema);
        } else {
            schema = userFiles[0].file_schema; 
        }
    }
    
    if (!fileIssues || fileIssues.length === 0) {
        issues = validateRecords(records, schema);
        const insertValues = issues.issues.map(issue => [
            fileId, 
            userId, 
            issue.row, 
            JSON.stringify(issue.errors)
        ]);
        await queryDb(
            `INSERT INTO issues (file_id, user_id, row_index, errors)
                VALUES ?`,
            [insertValues]
        );
    }else {
        issues = fileIssues.map(issue => ({
            row: issue.row_index,
            errors: issue.errors
        }));
    }

    if(chat){
        const openAiPayload = {
            model: "gpt-4o-mini",
            messages: await messages(chat, schema, issues),
            max_tokens: max_completion_tokens,
            temperature: temperature,
            top_p: top_p,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            response_format: response_format,
        };
        
         // Send request to OpenAI
        const response = await openai.chat.completions.create(openAiPayload);

        const finalResponse = response.choices?.[0]?.message?.content;

        // Parse JSON if needed
        let parsedResponse;
        try {
            parsedResponse = typeof finalResponse === "string" ? JSON.parse(finalResponse) : finalResponse;
        } catch (error) {
            console.error("Error parsing response JSON:", error);
        }

        // Extract actions
        aiResponse = parsedResponse?.actions;
        console.log("Before AI actions inserted successfully. ",aiResponse);

        if ((aiResponse && aiResponse.length > 0 && aiResponse[0].title && aiResponse[0].title !== "")) {

            for (const action of aiResponse) {
                const existingAction = await queryDb(
                    `SELECT * FROM actions WHERE file_id = ? AND user_id = ? AND JSON_CONTAINS(action_details, ?)`,
                    [fileId, userId, JSON.stringify(action)]
                );
        
                if (existingAction.length === 0) {
                    await queryDb(
                        `INSERT INTO actions (file_id, user_id, title, response, chat, action_type, action_details) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [fileId, userId, action.title, action.response, chat, action.type, JSON.stringify(action)]
                    );
                }
            }
        
            console.log("AI actions inserted successfully. ",aiResponse);
        }else{

            return res.status(200).json({ 
                status: false, 
                message: "The AI could not generate a meaningful response. Please try rephrasing or providing more details for better understanding.",
            });
        }
        
        
    }
    

    // const actions = [
    //     { type: "DELETE_COLUMN", column: "LoyaltyPoints" },
    //     { type: "FILL_MISSING", column: "Age", defaultValue: 20 },
    //     { type: "REMOVE_ROWS_WITH_ISSUES", issueType: "Null Value: Age" },
    //     { type: "REPLACE_NEGATIVE_VALUES", column: "Age", newValue: 20 },
    //     { type: "REPLACE_VALUE", column: "Name", oldValue: "", newValue: "Amanuel" },
    //     { 
    //         type: "REPLACE_ROW", 
    //         rowNumber: 2, 
    //         newValues: { Name: "Alice", Age: 35, City: "San Francisco" } 
    //     },
    //     {
    //         type: "REPLACE_COLUMN_VALUES",
    //         column: "City",
    //         newValue: "Unknown"
    //     },
    //     {
    //         type: "DELETE_ROWS_WHERE_VALUE_EQUALS",
    //         column: "Age",
    //         value: -1
    //     },
    //     {
    //         type: "DELETE_ROWS_WHERE_VALUE_LESS_THAN",
    //         column: "Age",
    //         value: 18
    //     },
    //     {
    //         type: "DELETE_ROWS_WHERE_VALUE_GREATER_THAN",
    //         column: "Salary",
    //         value: 100000
    //     },
    //     {
    //         type: "DELETE_ROWS_WITH_NEGATIVE_VALUES"
    //     },
    //     {
    //         type: "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE",
    //         column: "Age",
    //         minValue: 20,
    //         maxValue: 60
    //     },
    //     {
    //         type: "DELETE_DUPLICATE_ROWS",
    //         column: "Email"
    //     },
    //     {
    //         type: "KEEP_ONLY_UNIQUE_ROWS",
    //         column: "CustomerID"
    //     },
    //     {
    //         type: "SORT_ROWS_ASCENDING",
    //         column: "Age"
    //     },
    //     {
    //         type: "SORT_ROWS_DESCENDING",
    //         column: "Salary"
    //     },
    //     {
    //         type: "LIMIT_ROWS",
    //         count: 100
    //     },
    //     {
    //         type: "REMOVE_EMPTY_ROWS"
    //     },
    //     {
    //         type: "REMOVE_ROWS_WITH_NULLS"
    //     },
            
        // // Remove rows based on issues
        // { type: "REMOVE_ROWS_WITH_ANY_ISSUE" },
        // { type: "REMOVE_ROWS_WITH_SPECIFIC_ISSUE", issueType: "Null Value" },
        // { type: "REMOVE_ROWS_WITH_COLUMN_ISSUES", column: "Age" },
        // { type: "REMOVE_ROWS_WITH_SPECIFIC_COLUMN_ISSUE", column: "Email", issueType: "Invalid Format" },

        // // Replace specific issue values
        // { type: "REPLACE_ISSUE_WITH_VALUE", column: "Status", targetValue: "Unknown", newValue: "Pending" },

        // // Fill missing values using different strategies
        // { type: "FILL_WITH_AVERAGE", column: "Salary" },
        // { type: "FILL_WITH_MEAN", column: "Score" },
        // { type: "FILL_WITH_MODE", column: "Category" },
        // { type: "FILL_WITH_UPPER_ROW", column: "Location" },
        // { type: "FILL_WITH_LOWER_ROW", column: "Department" },
        // { type: "FILL_WITH_RANDOM", column: "Product" }

    // ];

    // const actions = [
    //     { type: "DELETE_COLUMN", column: "LoyaltyPoints" },
    //     { type: "REMOVE_ROWS_WITH_ISSUES", issueType: "Null Value", column: "Age" },
    // ];
    

    // Fetch actions from the database
    const fileActions = await queryDb(
        `SELECT * FROM actions WHERE file_id = ? AND user_id = ? ORDER BY created_at ASC`,
        [fileId,userId]
    );

    // if(fileActions && fileActions.length > 0){
        const actions = fileActions.map(action => action.action_details);
            records = manipulateData(records, actions, issues);
            issues = validateRecords(records, generatedSchema(records[0]));
            schema = generatedSchema(records[0]);


    //     if (JSON.stringify(fileIssues) !== JSON.stringify(issues)) {
    //         // Step 1: Delete existing issues for the file_id and user_id
    //         await queryDb(
    //             `DELETE FROM issues WHERE file_id = ? AND user_id = ?`,
    //             [fileId, userId]
    //         );
        
    //         // Step 2: Prepare the batch insert query
    //         const insertValues = issues.issues.map(issue => [
    //             fileId, 
    //             userId, 
    //             issue.row, 
    //             JSON.stringify(issue.errors)
    //         ]);
        
    //         // Step 3: Perform the batch insert in one query
    //         // await queryDb(
    //         //     `INSERT INTO issues (file_id, user_id, row_index, errors)
    //         //      VALUES ?`,
    //         //     [insertValues]
    //         // );
    //         if (!fileIssues && fileIssues.length === 0) {
    //             await queryDb(
    //                 `INSERT INTO issues (file_id, user_id, row_index, errors)
    //                  VALUES ?`,
    //                 [insertValues]
    //             );
    //         } else {
    //             console.log('No issues to insert');
    //         }
            
    //     // }
        
        
    // }

    return res.status(200).json({ 
        status: true, 
        message: "Fetched successfully",
        length: records.length,
        schema,
        records,
        issues:issues.issues,
        actions:fileActions
    });
}

export const FetchActions = async(req, res) => {
    const { userId } = req.user;
    const { fileId } = req.query;

    // Fetch actions from the database
    const fileActions = await queryDb(
        `SELECT * FROM actions WHERE file_id = ? AND user_id = ? ORDER BY created_at DESC`,
        [fileId,userId]
    );

    if (fileActions.length === 0) {
        return res.status(404).json({
            status: false,
            message: "No actions are found for the given user and file ID.",
        });
    }

    return res.status(200).json({ 
        status: true, 
        message: "Actions Fetched successfully",
        length: fileActions.length,
        actions:fileActions,
    });
}


export const DeleteActions = async(req, res) => {
    const { userId } = req.user;
    const { fileId, actionId } = req.query;

    // Fetch actions from the database
   if(!fileId || !actionId || !userId){
        await BadRequestError("File ID, Action ID and User ID are required");
   }

    await queryDb(
        `DELETE FROM actions WHERE file_id = ? AND user_id = ? AND action_id = ?`,
        [fileId,userId,actionId]
    );
    

    return res.status(200).json({ 
        status: true, 
        message: "Actions deleted successfully"
    });

}

export const DeleteAllActions = async(req, res) => {
    const { userId } = req.user;
    const { fileId } = req.query;

    // Fetch actions from the database
    await queryDb(
        `DELETE FROM actions WHERE file_id = ? AND user_id = ?`,
        [fileId,userId]
    );

    return res.status(200).json({ 
        status: true, 
        message: "All Actions deleted successfully"
    });

}
