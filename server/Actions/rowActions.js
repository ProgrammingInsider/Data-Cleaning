export const replaceRow = (modifiedData, action) => {
    modifiedData = modifiedData.map((record, index) => {
        const originalRowIndex = index + 1;
        if (originalRowIndex === action.rowNumber) {  
            return { ...record, ...action.newValues };
        }
        return record;
    });

    return modifiedData;
}

export const deleteDuplicateRow = (modifiedData, action) => {
    const seen = new Set();
    modifiedData = modifiedData.filter(record => {
        const key = record[action.column];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return modifiedData;
}

export const keepOnlyUniqueRows = (modifiedData, action) => {
    const countMap = {};
    modifiedData.forEach(record => {
        countMap[record[action.column]] = (countMap[record[action.column]] || 0) + 1;
    });
    modifiedData = modifiedData.filter(record => countMap[record[action.column]] === 1);

    return modifiedData;
}

export const deleteRowsWhereValueEquals  = (modifiedData, action) => {
    modifiedData = modifiedData.filter(record => record[action.column] !== action.value);

    return modifiedData;
}
            
export const deleteRowsWhereValueLessThan = (modifiedData, action) => {
    modifiedData = modifiedData.filter(record => Number(record[action.column]) >= action.value);

    return modifiedData;
}

export const deleteRowsWhereValueGreaterThan = (modifiedData, action) => {
    modifiedData = modifiedData.filter(record => Number(record[action.column]) <= action.value);

    return modifiedData;
}

export const deleteRowsWithNegativeValues = (modifiedData) => {
    modifiedData = modifiedData.filter(record =>
        Object.values(record).every(value => Number(value) >= 0 || isNaN(Number(value)))
    );

    return modifiedData;
}

export const deleteRowsWhereValueNotInRange = (modifiedData, action) => {
    modifiedData = modifiedData.filter(record =>
        Number(record[action.column]) >= action.minValue &&
        Number(record[action.column]) <= action.maxValue
    );

    return modifiedData;
}

export const limitRows = (modifiedData, action) => {
    modifiedData = modifiedData.slice(0, action.count);

    return modifiedData;
}

export const removeEmptyRows = (modifiedData) => {
    modifiedData = modifiedData.filter(record => Object.values(record).some(value => value !== "" && value !== null));

    return modifiedData;
}
    
export const removeRowsWithNulls = (modifiedData) => {
    modifiedData = modifiedData.filter(record => !Object.values(record).includes(null));

    return modifiedData;
}