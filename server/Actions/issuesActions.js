import { calculateAverage, calculateMean, calculateMedian, calculateMode, getRandomValue } from "../Actions/compute.js";

export const removeRowsWithIssues = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const originalRowIndex = index + 1; 
        if (!issuesMap[originalRowIndex]) return true;

        if (action.issueType) {
            return !issuesMap[originalRowIndex].includes(action.issueType); 
        } else {
            return false; 
        }
    });

    return modifiedData;
}

export const removeRowsWithAnyIssue = (modifiedData, issuesMap) => {
    modifiedData = modifiedData.filter((_, index) => !issuesMap[index + 1]);

    return modifiedData;
}

export const removeRowsWithSpecificIssue = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const rowIssues = issuesMap[index + 1] || [];
        return !rowIssues.some(err => err.issueType === action.issueType);
    });

    return modifiedData;
}

export const removeRowsWithColumnIssues = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const rowIssues = issuesMap[index + 1] || [];
        return !rowIssues.some(err => err.column === action.column);
    });

    return modifiedData;
}

export const removeRowsWithSpecificColumnIssue = (modifiedData, issuesMap, action) => {
    modifiedData = modifiedData.filter((_, index) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        // Filter out rows that have the specified issue type in the 'SignupDate' column
        return !rowIssues.some(err => 
            err.column === action.column && err.issueType === action.issueType
        );
    });

    return modifiedData;
}

export const replaceIssueWithValue = (modifiedData, issuesMap , action) => {
    modifiedData = modifiedData.map((record, index) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        // Check if the issue exists in the specified column and matches the target value
        const hasTargetIssue = rowIssues.some(err =>
            err.column === action.column && err.issueType === action.issueType
        );

        if (hasTargetIssue) {
            // Replace the value directly without comparing to targetValue
            record[action.column] = action.newValue;
        }

        return record;
    });

    return modifiedData;
}

export const fillWithAverage = (modifiedData, action) => {
    const avg = calculateAverage(modifiedData, action.column);
    if(!avg) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (value === null || value === "" || isNaN(Number(value))) {
            record[action.column] = avg;
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMean = (modifiedData, action) => {
    const mean = calculateMean(modifiedData, action.column);
    if(!mean) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(mean);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMode = (modifiedData, action) => {
    const mode = calculateMode(modifiedData, action.column);
    if(!mode) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(mode);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithMedian = (modifiedData, action) => {
    const median = calculateMedian(modifiedData, action.column);
    if (!median) return;
    modifiedData = modifiedData.map(record => {
        const value = record[action.column];
        if (record[action.column] === null || record[action.column] === "" || isNaN(Number(value))) {
            record[action.column] = Number(median);
        }
        return record;
    });

    return modifiedData;
}

export const fillWithUpperOrLowerRow = (modifiedData, issuesMap ,action) => {
    modifiedData = modifiedData.map((record, index, arr) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

        // Check for invalid values (using helpers for various column types)
        if (hasTargetIssue && (record[action.column] === null || record[action.column] === "")) {
            let adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? index - 1 : index + 1;

            while (adjacentIndex >= 0 && adjacentIndex < arr.length) {
                const adjacentValue = arr[adjacentIndex][action.column];

                if (adjacentValue !== null && adjacentValue !== "") {
                    record[action.column] = adjacentValue;
                    break;
                }

                adjacentIndex = (action.type === "FILL_WITH_UPPER_ROW") ? adjacentIndex - 1 : adjacentIndex + 1;
            }
        }

        return record;
    });

    return modifiedData;
}

export const fillWithRandom = (modifiedData, issuesMap , action) => {
    modifiedData = modifiedData.map((record, index) => {
        const originalRowIndex = index + 1;
        const rowIssues = issuesMap[originalRowIndex] || [];

        const hasTargetIssue = rowIssues.some(err => err.column === action.column && err.issueType === action.issueType);

        if (hasTargetIssue) {
            const randomValue = getRandomValue(modifiedData, action.column);
            record[action.column] = randomValue !== undefined ? randomValue : record[action.column];
        }

        return record;
    });

    return modifiedData;
}