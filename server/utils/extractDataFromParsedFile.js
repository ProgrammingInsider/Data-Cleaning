export function extractDataFromParsedFile(parsedData) {

    if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
        
        const sheetName = Object.keys(parsedData)[0]; 
        parsedData = parsedData[sheetName];
    } else {
        
        parsedData = parsedData;
    }

    return parsedData;
}
