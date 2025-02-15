// export const validateRecords = (records, schema) => {
//     const issues = [];
//     const seenRecords = new Set(); // For duplicate detection

//     records.forEach((record, index) => {
//         let rowErrors = [];
//         let recordKey = JSON.stringify(record); // Convert record to string for uniqueness check

//         // Check for duplicates
//         if (seenRecords.has(recordKey)) {
//             rowErrors.push("Duplicate record found");
//         } else {
//             seenRecords.add(recordKey);
//         }

//         for (const key in schema) {
//             const expectedType = schema[key];

//             // Detect missing fields
//             if (!(key in record)) {
//                 rowErrors.push(`Missing field: ${key}`);
//                 continue; // Skip further checks for this key
//             }

//             const value = record[key];

//             // Detect null values separately
//             if (value === null || value === "") {
//                 rowErrors.push(`Null or empty value: ${key}`);
//                 continue;
//             }

//             // Detect data type mismatches
//             if (expectedType === "number" && isNaN(value)) {
//                 rowErrors.push(`Invalid number format: ${key}`);
//             } else if (expectedType === "date" && isNaN(Date.parse(value))) {
//                 rowErrors.push(`Invalid date format: ${key}`);
//             } else if (expectedType === "string" && typeof value !== "string") {
//                 rowErrors.push(`Expected string but found ${typeof value}: ${key}`);
//             }

//             // Additional rules (example: price should not be negative)
//             if (expectedType === "number" && value < 0) {
//                 rowErrors.push(`Negative number not allowed: ${key}`);
//             }
//         }

//         // Append errors to issues array if any
//         if (rowErrors.length > 0) {
//             issues.push({
//                 row: index + 1, // Row number (1-based index)
//                 errors: rowErrors
//             });
//         }
//     });

//     return issues;
// };


export const validateRecords = (records, schema) => {
    const issues = [];
    const seenRecords = new Set(); // For duplicate detection

    records.forEach((record, index) => {
        let rowErrors = [];
        let recordKey = JSON.stringify(record); // Convert record to string for uniqueness check

        // Check for duplicates
        if (seenRecords.has(recordKey)) {
            rowErrors.push("Duplicate Record");
        } else {
            seenRecords.add(recordKey);
        }

        for (const key in schema) {
            const expectedType = schema[key];

            // Detect missing fields
            if (!(key in record)) {
                rowErrors.push(`Missing Field: ${key}`);
                continue; // Skip further checks for this key
            }

            const value = record[key];

            // Detect null values separately
            if (value === null || value === "") {
                rowErrors.push(`Null Value: ${key}`);
                continue;
            }

            // Detect data type mismatches
            if (expectedType === "number" && isNaN(value)) {
                rowErrors.push(`Invalid Number Format: ${key}`);
            } else if (expectedType === "date" && isNaN(Date.parse(value))) {
                rowErrors.push(`Invalid Date Format: ${key}`);
            } else if (expectedType === "string" && typeof value !== "string") {
                rowErrors.push(`Expected String but found ${typeof value}: ${key}`);
            }

            // Additional validation (e.g., preventing negative numbers)
            if (expectedType === "number" && value < 0) {
                rowErrors.push(`Negative Number Not Allowed: ${key}`);
            }
        }

        // Append errors to issues array if any
        if (rowErrors.length > 0) {
            issues.push({
                row: index + 1, // Row number (1-based index)
                errors: rowErrors
            });
        }
    });

    return issues;
};
