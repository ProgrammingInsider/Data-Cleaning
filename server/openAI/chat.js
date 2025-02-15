export const messages = async (userInput, schema, issues) => {
  const systemPrompt = `
  You are a data transformation assistant. The user will provide a natural language command related to modifying a dataset.
  Your task is to generate an array of structured actions based on the provided schema. 

  The response should always be an array of objects with the following action types:
  - DELETE_COLUMN: { type: "DELETE_COLUMN", column: "<ColumnName>" }
  - FILL_MISSING: { type: "FILL_MISSING", column: "<ColumnName>", defaultValue: <DefaultValue> }
  - REMOVE_ROWS_WITH_ISSUES: { type: "REMOVE_ROWS_WITH_ISSUES", issueType: "<IssueType>" }
  - REPLACE_NEGATIVE_VALUES: { type: "REPLACE_NEGATIVE_VALUES", column: "<ColumnName>", newValue: <NewValue> }
  - REPLACE_VALUE: { type: "REPLACE_VALUE", column: "<ColumnName>", oldValue: "<OldValue>", newValue: "<NewValue>" }
  - REPLACE_ROW: { type: "REPLACE_ROW", rowNumber: <RowNumber>, newValues: { <ColumnName>: <Value> } }
  - REPLACE_COLUMN_VALUES: { type: "REPLACE_COLUMN_VALUES", column: "<ColumnName>", newValue: "<NewValue>" }
  - DELETE_ROWS_WHERE_VALUE_EQUALS: { type: "DELETE_ROWS_WHERE_VALUE_EQUALS", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WHERE_VALUE_LESS_THAN: { type: "DELETE_ROWS_WHERE_VALUE_LESS_THAN", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WHERE_VALUE_GREATER_THAN: { type: "DELETE_ROWS_WHERE_VALUE_GREATER_THAN", column: "<ColumnName>", value: <Value> }
  - DELETE_ROWS_WITH_NEGATIVE_VALUES: { type: "DELETE_ROWS_WITH_NEGATIVE_VALUES" }
  - DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE: { type: "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE", column: "<ColumnName>", minValue: <MinValue>, maxValue: <MaxValue> }
  - DELETE_DUPLICATE_ROWS: { type: "DELETE_DUPLICATE_ROWS", column: "<ColumnName>" }
  - KEEP_ONLY_UNIQUE_ROWS: { type: "KEEP_ONLY_UNIQUE_ROWS", column: "<ColumnName>" }
  - SORT_ROWS_ASCENDING: { type: "SORT_ROWS_ASCENDING", column: "<ColumnName>" }
  - SORT_ROWS_DESCENDING: { type: "SORT_ROWS_DESCENDING", column: "<ColumnName>" }
  - LIMIT_ROWS: { type: "LIMIT_ROWS", count: <Count> }
  - REMOVE_EMPTY_ROWS: { type: "REMOVE_EMPTY_ROWS" }
  - REMOVE_ROWS_WITH_NULLS: { type: "REMOVE_ROWS_WITH_NULLS" }

      **Important Note:** 
    1. **If the user requests sorting (e.g., "order rows descending by age"), only return "SORT_ROWS_ASCENDING" or "SORT_ROWS_DESCENDING" actions.**
    2. Do NOT include "REMOVE_ROWS_WITH_ISSUES" unless the user explicitly asks for "cleaning," "removing errors," or "filtering invalid rows." If the request only involves filling missing values (e.g., "change null age to 25"), return only "FILL_MISSING".
    3. **Do not assume cleanup is required unless specified by the user.**
    4. **The output must match the schema keys exactly (case-sensitive). If a column does not exist in the schema, ignore the request.**
    5. **If the user provides an ambiguous request, clarify by only performing the primary operation requested.**
    When the action type is "REMOVE_ROWS_WITH_ISSUES", the "issueType" field must exactly match one of the errors provided in the "issues" array. The issue format should be:  

    - "Invalid Number Format: Age"  
    - "Invalid Date Format: SignupDate"  
    - "Negative Number Not Allowed: LoyaltyPoints"  

    The response should be structured as follows:
    { "type": "REMOVE_ROWS_WITH_ISSUES", "issueType": "Null Value: Age" }

  The output **must** match the schema keys exactly (case-sensitive). If a column doesn't exist in the schema, ignore the request.
  `;

  const userMessage = {
    role: "user",
    content: JSON.stringify({
      command: userInput,
      schema: schema,
      issues: issues
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
        actions: {
          type: "array",
          items: {
            type: "object",
            required: ["type"],
            properties: {
              type: { 
                type: "string", 
                enum: [
                  "DELETE_COLUMN",
                  "FILL_MISSING",
                  "REMOVE_ROWS_WITH_ISSUES",
                  "REPLACE_NEGATIVE_VALUES",
                  "REPLACE_VALUE",
                  "REPLACE_ROW",
                  "REPLACE_COLUMN_VALUES",
                  "DELETE_ROWS_WHERE_VALUE_EQUALS",
                  "DELETE_ROWS_WHERE_VALUE_LESS_THAN",
                  "DELETE_ROWS_WHERE_VALUE_GREATER_THAN",
                  "DELETE_ROWS_WITH_NEGATIVE_VALUES",
                  "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE",
                  "DELETE_DUPLICATE_ROWS",
                  "KEEP_ONLY_UNIQUE_ROWS",
                  "SORT_ROWS_ASCENDING",
                  "SORT_ROWS_DESCENDING",
                  "LIMIT_ROWS",
                  "REMOVE_EMPTY_ROWS",
                  "REMOVE_ROWS_WITH_NULLS"
                ] 
              },
              column: { type: "string", nullable: true },
              defaultValue: { type: ["string", "number"], nullable: true },
              issueType: { type: "string", nullable: true },
              newValue: { type: ["string", "number"], nullable: true },
              oldValue: { type: ["string", "number"], nullable: true },
              rowNumber: { type: "number", nullable: true },
              newValues: { type: "object", additionalProperties: true, nullable: true },
              value: { type: ["string", "number"], nullable: true },
              minValue: { type: "number", nullable: true },
              maxValue: { type: "number", nullable: true },
              count: { type: "number", nullable: true }
            }
          }
        }
      },
      required: ["actions"],
      additionalProperties: false
    }
  }
};

export const temperature = 0;
export const max_completion_tokens = 16384;
export const top_p = 1.0;
export const frequency_penalty = 0;
export const presence_penalty = 0;
