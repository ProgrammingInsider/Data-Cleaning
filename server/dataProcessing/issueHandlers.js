export const removeRowsWithIssues = (data, issuesMap, issueType = null) => {
    return data.filter((_, index) => {
        const rowNumber = index + 1;
        if (!issuesMap[rowNumber]) return true;
        if (issueType) {
            return !issuesMap[rowNumber].includes(issueType);
        }
        return false;
    });
};

export const replaceIssueWithValue = (data, issuesMap, column, issueType, newValue) => {
    return data.map((record, index) => {
        const rowNumber = index + 1;
        const rowIssues = issuesMap[rowNumber] || [];
        const hasTargetIssue = rowIssues.some(err => err.column === column && err.issueType === issueType);

        if (hasTargetIssue) {
            record[column] = newValue;
        }
        return record;
    });
};
