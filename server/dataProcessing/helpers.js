export const calculateAverage = (data, column) => {
    const nums = data.map(record => parseFloat(record[column])).filter(val => !isNaN(val));
    return nums.reduce((sum, val) => sum + val, 0) / nums.length;
};

export const calculateMode = (data, column) => {
    const counts = {};
    data.forEach(record => {
        const val = record[column];
        if (val !== null && val !== undefined) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

export const calculateMedian = (data, column) => {
    const numericValues = data.map(record => Number(record[column])).filter(value => !isNaN(value)).sort((a, b) => a - b);
    const length = numericValues.length;
    if (length === 0) return null;
    const mid = Math.floor(length / 2);
    return length % 2 === 0 ? (numericValues[mid - 1] + numericValues[mid]) / 2 : numericValues[mid];
};

export const getRandomValue = (data, column) => {
    const validValues = data.map(record => record[column]).filter(val => val !== null && val !== undefined);
    return validValues[Math.floor(Math.random() * validValues.length)];
};
