export const validateRecords = (records, schema) => {
    const issues = [];
    const seenRecords = new Set(); // For duplicate detection
    const rowIssueMap = new Map(); // To track issues with fixed row identifiers

    records.forEach((record, index) => {
        let rowErrors = [];
        let recordKey = JSON.stringify(record); // Unique identifier for each record

        // Check for duplicates
        if (seenRecords.has(recordKey)) {
            rowErrors.push({ issueType: "Duplicate Record", column: null });
        } else {
            seenRecords.add(recordKey);
        }

        for (const key in schema) {
            const expectedType = schema[key];

            // Detect missing fields
            if (!(key in record)) {
                rowErrors.push({ issueType: "Missing Field", column: key });
                continue; // Skip further checks for this key
            }

            const value = record[key];

            // Detect null values separately
            if (value === null || value === "") {
                rowErrors.push({ issueType: "Null Value", column: key });
                continue;
            }

            // Detect data type mismatches
            if (expectedType === "number" && isNaN(value)) {
                rowErrors.push({ issueType: "Invalid Number Format", column: key });
            } else if (expectedType === "date" && isNaN(Date.parse(value))) {
                rowErrors.push({ issueType: "Invalid Date Format", column: key });
            } else if (expectedType === "string" && typeof value !== "string") {
                rowErrors.push({ issueType: `Expected String but found ${typeof value}`, column: key });
            }

            // Additional validation (e.g., preventing negative numbers)
            if (expectedType === "number" && value < 0) {
                rowErrors.push({ issueType: "Negative Number Not Allowed", column: key });
            }
        }

        // Track issues by the unique record key
        if (rowErrors.length > 0) {
            rowIssueMap.set(recordKey, rowErrors);
        }
    });

    // Convert the rowIssueMap to the issues array with row numbers
    rowIssueMap.forEach((errors, key) => {
        // Find the actual row number in the records list
        const rowIndex = records.findIndex(record => JSON.stringify(record) === key);
        if (rowIndex !== -1) {
            issues.push({
                row: rowIndex + 1, // Row number (1-based index)
                errors: errors
            });
        }
    });

    // Return issues array
    return { issues };
};
