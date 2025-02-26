import { calculateAverage, calculateMode, calculateMedian, getRandomValue } from './helpers.js';
import { deleteColumn, replaceValue, replaceNegativeValues, sortRowsAscending, sortRowsDescending } from './actions.js';
import { removeRowsWithIssues, replaceIssueWithValue } from './issueHandlers.js';

export const manipulateData = (parsedData, actions, issues) => {
    let modifiedData = [...parsedData];

    const issuesArray = issues || [];
    const issuesMap = {};
    if (Array.isArray(issuesArray)) {
        issuesArray.forEach(({ row, errors }) => {
            issuesMap[row] = errors;
        });
    } else {
        console.warn("No issues found or issues is not in the expected format:", issues);
    }

    actions.forEach(action => {
        switch (action.type) {
            case "DELETE_COLUMN":
                modifiedData = deleteColumn(modifiedData, action.column);
                break;

            case "REPLACE_VALUE":
                modifiedData = replaceValue(modifiedData, action.column, action.oldValue, action.newValue);
                break;

            case "REPLACE_NEGATIVE_VALUES":
                modifiedData = replaceNegativeValues(modifiedData, action.column, action.newValue);
                break;

            case "SORT_ROWS_ASCENDING":
                modifiedData = sortRowsAscending(modifiedData, action.column);
                break;

            case "SORT_ROWS_DESCENDING":
                modifiedData = sortRowsDescending(modifiedData, action.column);
                break;

            case "REMOVE_ROWS_WITH_ISSUES":
                modifiedData = removeRowsWithIssues(modifiedData, issuesMap, action.issueType);
                break;

            case "REPLACE_ISSUE_WITH_VALUE":
                modifiedData = replaceIssueWithValue(modifiedData, issuesMap, action.column, action.issueType, action.newValue);
                break;

            case "FILL_WITH_AVERAGE":
                const avg = calculateAverage(modifiedData, action.column);
                if (avg) {
                    modifiedData = modifiedData.map(record => {
                        if (!record[action.column] || isNaN(Number(record[action.column]))) {
                            record[action.column] = avg;
                        }
                        return record;
                    });
                }
                break;

            default:
                console.warn(`Unhandled action type: ${action.type}`);
        }
    });

    return modifiedData;
};
