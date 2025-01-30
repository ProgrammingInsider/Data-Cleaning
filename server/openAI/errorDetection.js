// export const messages = async (parsedData) => {
//   return [
//     {
//       "role": "system",
//       "content": "The Data Inconsistency Detector is a robust error detection platform that helps users identify and resolve data quality issues in their datasets. When a customer uploads a CSV file, the app scans the data for inconsistencies and generates a comprehensive report in JSON format. The report includes:\n\nData Inconsistency Types: A predefined list of potential issues (e.g., missing fields, duplicates, formatting errors).\n\nDetection Status: Indicates whether the issue was detected (1 for detected, 0 for not detected).\n\nImpact Level: The severity of the issue (High, Medium, Low).\n\nQuestions: Describes the question used to identify the inconsistency.\n\nHow Many Detected: The count of occurrences where the issue exists.\n\nAffected Percentage: The proportion of records affected by the issue.\n\nField/Column Name: Lists the specific fields or columns impacted.\n\nRecommended Action: Suggested steps to resolve or mitigate the issue.\n\nThe app ensures that the output always maintains the same structure, with all predefined inconsistency types included in the results. If no issues are detected for a specific type, the row will still appear in the output with a detection status of 0 and default values for other fields."
//     },
//     {
//       "role": "user",
//       "content": JSON.stringify(parsedData)
//     },
//   ];
// };

export const messages = async (parsedData, previousResponse = null) => {
  const userMessage = JSON.stringify(parsedData);
  const previousResponseMessage = previousResponse
    ? {
        role: "assistant",
        content: JSON.stringify(previousResponse),
      }
    : null;

  const messagesArray = [
    {
      role: "system",
      content: "The Data Inconsistency Detector is a robust error detection platform that helps users identify and resolve data quality issues in their datasets. When a customer uploads a CSV file, the app scans the data for inconsistencies and generates a comprehensive report in JSON format. ...",
    },
    previousResponseMessage,
    {
      role: "user",
      content: userMessage,
    },
  ].filter(Boolean);

  return messagesArray;
};

export const response_format = {
    "type": "json_schema",
    "json_schema": {
      "name": "data_inconsistency_report",
      "schema": {
        "type": "object",
        "required": [
          "DataInconsistencies", "FileQualityScore", "FileQuality"
        ],
        "properties": {
          "DataInconsistencies": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "DataInconsistency",
                "DetectionStatus",
                "ImpactLevel",
                "Questions",
                "HowManyDetected",
                "AffectedPercentage",
                "FieldColumnName",
                "RecommendedAction"
              ],
              "properties": {
                "Questions": {
                  "type": "string",
                  "description": "Questions to clarify the nature of the inconsistency."
                },
                "ImpactLevel": {
                  "type": "string",
                  "description": "Level of impact the inconsistency has on the data quality."
                },
                "DetectionStatus": {
                  "type": "number",
                  "description": "Status indicating if the inconsistency was detected (1 for detected, 0 for not detected)."
                },
                "FieldColumnName": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Names of the fields or columns affected by the inconsistency."
                },
                "HowManyDetected": {
                  "type": "number",
                  "description": "Number of inconsistencies detected."
                },
                "DataInconsistency": {
                  "type": "string",
                  "description": "Type of data inconsistency detected."
                },
                "RecommendedAction": {
                  "type": "string",
                  "description": "Recommended action to resolve the inconsistency."
                },
                "AffectedPercentage": {
                  "type": "string",
                  "description": "Percentage of entries affected by the inconsistency."
                }
              },
              "additionalProperties": false
            },
            "description": "List of predefined data inconsistency types and their statuses."
          },
          "FileQualityScore": {
          "type": "number",
          "description": "A numerical score representing the overall quality of the file, with 100 being perfect."
        },
          FileQuality: {
            type: "string",
            enum: ["Excellent", "Good", "Fair", "Poor"],
            description: "A qualitative assessment of the file's overall data quality."
          }
        },
        "additionalProperties": false
      },
      "strict": true
    }
  }


export const temperature = 0;
export const max_completion_tokens = 16384;
export const top_p = 1.0;
export const frequency_penalty = 0;
export const presence_penalty = 0