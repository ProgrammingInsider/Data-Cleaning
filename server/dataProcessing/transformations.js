export const deleteColumn = (data, column) => {
    return data.map(record => {
        delete record[column];
        return record;
    });
};

export const replaceValue = (data, column, oldValue, newValue) => {
    return data.map(record => {
        if (record[column] === oldValue) {
            record[column] = newValue;
        }
        return record;
    });
};

export const replaceNegativeValues = (data, column, newValue) => {
    return data.map(record => {
        const currentValue = Number(record[column]);
        if (typeof currentValue === "number" && currentValue < 0) {
            record[column] = newValue;
        }
        return record;
    });
};

export const sortRowsAscending = (data, column) => {
    return [...data].sort((a, b) => (a[column] > b[column] ? 1 : -1));
};

export const sortRowsDescending = (data, column) => {
    return [...data].sort((a, b) => (a[column] < b[column] ? 1 : -1));
};
