export const manipulateData = (parsedData, actions, issues) => {
    let modifiedData = [...parsedData];

    // Convert issues array to a row-based map for quick lookups
    const issuesMap = {};
    issues.forEach(({ row, errors }) => {
        issuesMap[row] = errors;
    });

    actions.forEach(action => {
        switch (action.type) {
            case "DELETE_COLUMN":
                modifiedData = modifiedData.map(record => {
                    delete record[action.column];
                    return record;
                });
                break;

            case "FILL_MISSING":
                modifiedData = modifiedData.map(record => {
                    if (record[action.column] === null || record[action.column] === "") {
                        record[action.column] = action.defaultValue;
                    }
                    return record;
                });
                break;

            case "REMOVE_ROWS_WITH_ISSUES":
                modifiedData = modifiedData.filter((_, index) => {
                    const rowNumber = index + 1; // Match 1-based row index
                    if (!issuesMap[rowNumber]) return true; // No issues, keep the row

                    if (action.issueType) {
                        return !issuesMap[rowNumber].includes(action.issueType); // Remove only specific issue type
                    } else {
                        return false; // Remove any row with issues
                    }
                });
                break;

            case "REPLACE_VALUE":
                modifiedData = modifiedData.map(record => {
                    if (record[action.column] === action.oldValue) {
                        record[action.column] = action.newValue;
                    }
                    return record;
                });
                break;
            
            case "REPLACE_NEGATIVE_VALUES":
                modifiedData = modifiedData.map(record => {
                    const currentValue = Number(record[action.column])
                    if (typeof currentValue === "number" && currentValue < 0) {
                        record[action.column] = action.newValue;
                    }
                    return record;
                });
                break;

            case "REPLACE_ROW":
                modifiedData = modifiedData.map((record, index) => {
                    if (index + 1 === action.rowNumber) {  // Match row number (1-based index)
                        return { ...record, ...action.newValues }; // Replace entire row with new values
                    }
                    return record;
                });
                break;

            case "REPLACE_COLUMN_VALUES":
                modifiedData = modifiedData.map(record => {
                    record[action.column] = action.newValue;
                    return record;
                });
                break;

            case "DELETE_ROWS_WHERE_VALUE_EQUALS":
                modifiedData = modifiedData.filter(record => record[action.column] !== action.value);
                break;
            
            case "DELETE_ROWS_WHERE_VALUE_LESS_THAN":
                modifiedData = modifiedData.filter(record => Number(record[action.column]) >= action.value);
                break;

            // Delete rows where a column value is GREATER THAN a specific number
            case "DELETE_ROWS_WHERE_VALUE_GREATER_THAN":
                modifiedData = modifiedData.filter(record => Number(record[action.column]) <= action.value);
                break;

            // Delete rows where ANY column has a negative value
            case "DELETE_ROWS_WITH_NEGATIVE_VALUES":
                modifiedData = modifiedData.filter(record =>
                    Object.values(record).every(value => Number(value) >= 0 || isNaN(Number(value)))
                );
                break;

            // Delete rows where a column's value is OUTSIDE a specific range (less than min OR greater than max)
            case "DELETE_ROWS_WHERE_VALUE_NOT_IN_RANGE":
                modifiedData = modifiedData.filter(record =>
                    Number(record[action.column]) >= action.minValue &&
                    Number(record[action.column]) <= action.maxValue
                );
                break;

                case "DELETE_DUPLICATE_ROWS":
                    const seen = new Set();
                    modifiedData = modifiedData.filter(record => {
                        const key = record[action.column];
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    break;
    
                case "KEEP_ONLY_UNIQUE_ROWS":
                    const countMap = {};
                    modifiedData.forEach(record => {
                        countMap[record[action.column]] = (countMap[record[action.column]] || 0) + 1;
                    });
                    modifiedData = modifiedData.filter(record => countMap[record[action.column]] === 1);
                    break;
    
                case "SORT_ROWS_ASCENDING":
                    modifiedData.sort((a, b) => (a[action.column] > b[action.column] ? 1 : -1));
                    break;
    
                case "SORT_ROWS_DESCENDING":
                    modifiedData.sort((a, b) => (a[action.column] < b[action.column] ? 1 : -1));
                    break;
    
                case "LIMIT_ROWS":
                    modifiedData = modifiedData.slice(0, action.count);
                    break;
    
                case "REMOVE_EMPTY_ROWS":
                    modifiedData = modifiedData.filter(record => Object.values(record).some(value => value !== "" && value !== null));
                    break;
    
                case "REMOVE_ROWS_WITH_NULLS":
                    modifiedData = modifiedData.filter(record => !Object.values(record).includes(null));
                    break;
    

            default:
                console.warn(`Unknown action: ${action.type}`);
                break;
        }
    });

    return modifiedData;
};
