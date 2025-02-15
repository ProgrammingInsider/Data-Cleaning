
export const generatedSchema = (firstRecord) => {

    const schema = {};
    
        
        for (const key in firstRecord) {
            const value = firstRecord[key];
            
            if (!isNaN(value) && value !== "" && value !== null) {
                schema[key] = "number";
            } else if (Date.parse(value)) {
                schema[key] = "date";
            } else {
                schema[key] = "string";
            }
        }

        return schema;
}