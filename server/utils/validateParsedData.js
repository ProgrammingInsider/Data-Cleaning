export function validateParsedData(parsedData, schemaDefinition) {
    const issues = [];
    const uniqueValues = {};

    // Initialize unique tracking sets
    Object.keys(schemaDefinition).forEach(column => {
        if (schemaDefinition[column].unique) {
            uniqueValues[column] = new Set();
        }
    });

    parsedData.forEach((row, rowIndex) => {
        const rowErrors = [];

        Object.keys(schemaDefinition).forEach((column) => {
            const value = row[column];
            const schema = schemaDefinition[column];

            if (value === null || value === undefined) {
                rowErrors.push({
                    issueType: "NULL_VALUE",
                    issueDesc: "Null Value Found",
                    column
                });
                return;
            }

            // Uniqueness check
            if (schema.unique) {
                if (uniqueValues[column].has(value)) {
                    rowErrors.push({
                        issueType: "DUPLICATE_VALUE",
                        issueDesc: `Duplicate Value Found (Value: '${value}')`,
                        column
                    });
                } else {
                    uniqueValues[column].add(value);
                }
            }

            if (schema.dataType === "Integer") {
                
                if (!Number.isInteger(value)) {
                    rowErrors.push({
                        issueType: "TYPE_MISMATCH",
                        issueDesc: `Invalid Number Format (Expected: Integer, Found: ${typeof value})`,
                        column
                    });
                } else if (schema.numericSign === "Positive" && value < 0) {
                    rowErrors.push({
                        issueType: "INVALID_VALUE",
                        issueDesc: "Negative Number Not Allowed",
                        column
                    });
                } else if (schema.numericSign === "Negative" && value > 0) {
                    rowErrors.push({
                        issueType: "INVALID_VALUE",
                        issueDesc: "Positive Number Not Allowed",
                        column
                    });
                }
            }

            if (schema.dataType === "Float") {
                const parsedValue = parseFloat(value);
                if (isNaN(parsedValue) || typeof parsedValue !== "number") {
                    rowErrors.push({
                        issueType: "TYPE_MISMATCH",
                        issueDesc: `Invalid Number Format (Expected: Float, Found: ${typeof value})`,
                        column
                    });
                } else if (schema.numericSign === "Positive" && parsedValue < 0) {
                    rowErrors.push({
                        issueType: "INVALID_VALUE",
                        issueDesc: "Negative Number Not Allowed",
                        column
                    });
                } else if (schema.numericSign === "Negative" && parsedValue > 0) {
                    rowErrors.push({
                        issueType: "INVALID_VALUE",
                        issueDesc: "Positive Number Not Allowed",
                        column
                    });
                } else if (schema.precision !== null) {
                    const decimalPlaces = parsedValue.toString().split(".")[1]?.length || 0;
                    if (decimalPlaces > schema.precision) {
                        rowErrors.push({
                            issueType: "INVALID_VALUE",
                            issueDesc: `Exceeded Precision (Expected: ${schema.precision}, Found: ${decimalPlaces} decimal places)`,
                            column
                        });
                    }
                }
            }

            if (schema.dataType === "Email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (typeof value !== "string" || !emailRegex.test(value)) {
                    rowErrors.push({
                        issueType: "INVALID_FORMAT",
                        issueDesc: `Invalid Email Format (Found: ${value})`,
                        column
                    });
                }
            }
            
            if (schema.dataType === "Date") {
                const expectedFormat = schema.format;  // Could be null or a format like "YYYY-MM-DD"
                const expectedSeparator = schema.separator; // Could be null or a separator like "-"
            
                // Extract separator from the actual value (first non-digit character)
                const valueSeparator = value.replace(/\d/g, "")[0]; 
            
                if (expectedFormat && expectedSeparator) {
                    // Strict validation when both format and separator are defined
                    const formatParts = expectedFormat.split(expectedSeparator); // ["YYYY", "MM", "DD"]
                    const valueParts = value.split(valueSeparator); // ["2024", "06", "30"]
            
                    // Validate separator
                    if (expectedSeparator !== valueSeparator) {
                        rowErrors.push({
                            issueType: "INVALID_SEPARATOR",
                            issueDesc: `Invalid Date Separator (Expected: '${expectedSeparator}', Found: '${valueSeparator}')`,
                            column
                        });
                    }
            
                    // Validate format structure
                    if (formatParts.length !== valueParts.length) {
                        rowErrors.push({
                            issueType: "INVALID_FORMAT",
                            issueDesc: `Invalid Date Format (Expected: '${expectedFormat}', Found: '${value}')`,
                            column
                        });
                    }
            
                    // Ensure each part is a number
                    if (!valueParts.every(part => /^\d+$/.test(part))) {
                        rowErrors.push({
                            issueType: "INVALID_VALUE",
                            issueDesc: `Invalid Date Components (Date should contain only numbers with '${expectedSeparator}' separator)`,
                            column
                        });
                    }
            
                } else if (!expectedFormat && expectedSeparator) {
                    // When format is null but separator is defined, allow any format but enforce the separator
                    if (!/^\d{2,4}[\W]\d{1,2}[\W]\d{1,4}$/.test(value)) {
                        rowErrors.push({
                            issueType: "INVALID_DATE",
                            issueDesc: `Invalid Date Format (Any numeric date format is allowed but should use '${expectedSeparator}')`,
                            column
                        });
                    }
                    if (valueSeparator !== expectedSeparator) {
                        rowErrors.push({
                            issueType: "INVALID_SEPARATOR",
                            issueDesc: `Invalid Date Separator (Expected: '${expectedSeparator}', Found: '${valueSeparator}')`,
                            column
                        });
                    }
            
                } else {
                    // When both format and separator are null, allow any valid date format with any separator
                    if (!/^\d{2,4}[\W]\d{1,2}[\W]\d{1,4}$/.test(value)) {
                        rowErrors.push({
                            issueType: "INVALID_DATE",
                            issueDesc: `Invalid Date Format (Any numeric date format is allowed)`,
                            column
                        });
                    }
                }
            }
            
            
        });

        if (rowErrors.length > 0) {
            issues.push({ row: rowIndex + 1, errors: rowErrors });
        }
    });

    return issues ;
}