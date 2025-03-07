export const messages = async (parsedData) => {
  
  const systemPrompt = `
  Here is an example of a schema definition for a structured data file. Based on the provided parsed data, determine the **overall schema definition** for all columns.
  
  - **Analyze all rows together** to infer the correct data type.
  - If a column contains a mix of numbers and strings, classify it as **"All"**.
  - If a column contains valid **date values**, classify it as **"Date"**. If multiple formats exist, choose the most frequent valid format.
  - If a column has both valid and invalid dates, infer based on **valid** ones and ignore incorrect values.
  
  Your response should follow **this exact format**:

  {
    "schema_definition": {
      "ColumnName1": { "dataType": "String", "unique": false, "numericSign": null, "precision": null, "format": null, desc: null },
      "ColumnName2": { "dataType": "Number", "unique": false, "numericSign": "Positive", "precision": 2, "format": null, desc: null },
      "SignupDate": { "dataType": "Date", "unique": false, "numericSign": null, "precision": null, "format": "YYYY-MM-DD", desc: null }
    }
  }

  desc: property is just to describe the column shortly. If you don't understand the column purpose leave it null. But if it is familiar with you fill it with very short description.
`;

  const userMessage = {
    role: "user",
    content: JSON.stringify({
      command: parsedData,
      // schema: schema,
    }),
  };

  const messagesArray = [
    { role: "system", content: systemPrompt },
    userMessage,
  ].filter(Boolean);

  return messagesArray;
};


export const response_format = {
  type: "json_schema",
  json_schema: {
    name: "structured_data_actions",
    schema: {
      type: "object",
      properties: {
        schema_definition: {
          type: "object",
          items: {
            type: "object",
            required: ["dataType","unique","numericSign","precision","format"],
            properties: {
              dataType: { 
                type: "string", 
                enum: ["String", "Integer", "Float", "Email", "Boolean", "Date", "All"] 
              },
              unique: { 
                type: "boolean", 
                enum: [true,false] 
              },
              numericSign: { 
                type: ["string", "null"], 
                enum: ["Positive","Negative",null] 
              },
              precision: { 
                type: ["number", "null"], 
                enum: [0, 1,2,3,4,5,null] 
              },
              format: { 
                type: "string", 
                enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD", null] 
              },
              desc: { 
                type: ["string", "null"], 
              },
            }
          }
        }
      },
      required: ["schema_definition"],
      additionalProperties: false
    }
  }
};

export const temperature = 0;
export const max_tokens = 16384;
export const top_p = 1.0;
export const frequency_penalty = 0;
export const presence_penalty = 0;
