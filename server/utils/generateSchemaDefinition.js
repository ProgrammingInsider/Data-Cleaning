export const generateSchemaDefinition = (parsedData) => {
    const firstRow = parsedData[0]; 
  
    const schemaDefinition = {};
  
    Object.keys(firstRow).forEach((column,index) => {
      const value = firstRow[column];
      const dataType = determineDataType(value);
      const separator = dataType === "Date" ? detectDateSeparator(value) : null;

      const schema = {
        dataType: dataType,
        unique: index === 0 || column === "Email",
        numericSign: dataType === "Integer" || dataType === "Float" ? determineNumericSign(value) : null,
        precision: dataType === "Float" ? determinePrecision(value) : null,
        format: dataType === "Date" ? determineDateFormat(value) : null,
        desc: index === 0 ? "Unique identifier for this dataset" : `Represents ${column}`,
        separator: separator
      };
      
      schemaDefinition[column] = schema;
    });
  
    return schemaDefinition

  };
  
  // Determine data type based on the value
  const determineDataType = (value) => {
    if (typeof value === "string") {

      if (value.includes("@")) {
        return "Email";
      }

    const parsedDate = Date.parse(value);
        if (!isNaN(parsedDate)) {
        return "Date";
    }

      return "String";
    }
    
    if (typeof value === "number") {
      return Number.isInteger(value) ? "Integer" : "Float";
    }
    
    if (value instanceof Date || !isNaN(Date.parse(value))) {
      return "Date";
    }
  
    return "String"; 
  };
  
  // Determine numeric sign (positive, negative, or null)
  const determineNumericSign = (value) => {
    if (typeof value === "number") {
      return value > 0 ? "Positive" : value < 0 ? "Negative" : null;
    }
    return null;
  };
  
  // Determine precision for numbers (float precision)
  const determinePrecision = (value) => {
    if (typeof value === "number" && !Number.isInteger(value)) {
      return value.toString().split(".")[1].length;
    }
    return null;
  };
  
  // Determine date format if value is a date
  const determineDateFormat = (value) => {
    if (value instanceof Date || !isNaN(Date.parse(value))) {
      const date = new Date(value);
      return "YYYY-MM-DD"; // Default format for simplicity
    }
    return null;
  };


  // Detect the separator used in a date string
const detectDateSeparator = (value) => {
    if (typeof value !== "string") return null;
  
    const separators = ["-", "/", "."];
    for (const separator of separators) {
      if (value.includes(separator)) {
        return separator;
      }
    }
    return null;
  };