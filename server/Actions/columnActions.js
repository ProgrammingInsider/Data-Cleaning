export const deleteColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        delete record[action.column];
        return record;
    });

    return modifiedData;
}

export const fillMissing = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record[action.column] === null || record[action.column] === "") {
            record[action.column] = action.defaultValue;
        }
        return record;
    });

    return modifiedData;
}

export const replaceValue = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record[action.column] === action.oldValue) {
            record[action.column] = action.newValue;
        }
        return record;
    });

    return modifiedData;
}
                    
export const replaceNegativeValues = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const currentValue = Number(record[action.column])
        if (typeof currentValue === "number" && currentValue < 0) {
            record[action.column] = action.newValue;
        }
        return record;
    });

    return modifiedData;
}

export const replaceColumnValues = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        record[action.column] = action.newValue;
        return record;
    });

    return modifiedData;
}

export const sortRowsAscending = (modifiedData, action) => {
    modifiedData.sort((a, b) => (a[action.column] > b[action.column] ? 1 : -1));

    return modifiedData;
}
    
export const sortRowsDescending = (modifiedData, action) => {
    modifiedData.sort((a, b) => (a[action.column] < b[action.column] ? 1 : -1));

    return modifiedData;
}

export const additionToColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const additionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(additionAmount)) {
            record[action.column] = value + additionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const subtractionFromColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const subtractionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(subtractionAmount)) {
            record[action.column] = value - subtractionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const multiplicationColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const multiplicationAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(multiplicationAmount)) {
            record[action.column] = value * multiplicationAmount;
        }
        return record;
    });

    return modifiedData;
}

export const divisionColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        const divisionAmount = Number(action.by);
        if (!isNaN(value) && !isNaN(divisionAmount) && divisionAmount !== 0) {
            record[action.column] = value / divisionAmount;
        }
        return record;
    });

    return modifiedData;
}

export const additionMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const sum = action.targetColumn.reduce((acc, col) => {
            const value = Number(record[col]);
            return !isNaN(value) ? acc + value : acc;
        }, 0);
        return { ...record, [action.update]: sum };
    });

    return modifiedData;
}

export const substractionMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const difference = action.targetColumn.reduce((acc, col, index) => {
            const value = Number(record[col]);
            return !isNaN(value) ? (index === 0 ? value : acc - value) : acc;
        }, 0);
        return { ...record, [action.update]: difference };
    });

    return modifiedData;
}

export const multiplicationMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const product = action.targetColumn.reduce((acc, col) => {
            const value = Number(record[col]);
            return !isNaN(value) ? acc * value : acc;
        }, 1);
        return { ...record, [action.update]: product };
    });

    return modifiedData;
}


export const divideMultipleColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const quotient = action.targetColumn.reduce((acc, col, index) => {
            const value = Number(record[col]);
            return (!isNaN(value) && value !== 0) 
                ? (index === 0 ? value : acc / value) 
                : acc;
        }, null);
        return { ...record, [action.update]: quotient };
    });

    return modifiedData;
}

export const renameColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        if (record.hasOwnProperty(action.from)) {
            return {
                ...record,
                [action.to]: record[action.from],
                ...((({ [action.from]: _, ...rest }) => rest)(record))
            };
        }
        return record;
    });

    return modifiedData;
}

export const roundColumn = (modifiedData, action) => {
    modifiedData = modifiedData.map(record => {
        const value = Number(record[action.column]);
        if (!isNaN(value)) {
            const roundAmount = action.by || 0;
            const factor = Math.pow(10, roundAmount);
            record[action.column] = Math.round(value * factor) / factor;
        }
        return record;
    });

    return modifiedData;
}