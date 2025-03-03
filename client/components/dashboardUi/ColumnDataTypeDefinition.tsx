import React from 'react';
import {schemaTypeDefintion, SchemaDefinition} from '@/utils/types'

const mockResponse = {
    "file_id": "6913a04c-f7ba-11ef-a625-0e10fb0c69fb",
    "schema_definition": {
        "Id": {
            "dataType": "Number",
            "unique": false,
            "numericSign": "Positive",
            "precision": 0,
            "format": null
        },
        "Plate_Number": {
            "dataType": "Number",
            "unique": false,
            "numericSign": "Positive",
            "precision": 0,
            "format": null
        },
        "Fleet_Name": {
            "dataType": "String",
            "unique": false,
            "numericSign": null,
            "precision": null,
            "format": null
        },
        "Total_Price": {
            "dataType": "Number",
            "unique": false,
            "numericSign": "Positive",
            "precision": 3,
            "format": null
        },
        "Departure_Location": {
            "dataType": "String",
            "unique": false,
            "numericSign": null,
            "precision": null,
            "format": null
        },
        "Arrival_Location": {
            "dataType": "String",
            "unique": false,
            "numericSign": null,
            "precision": null,
            "format": null
        },
        "Level": {
            "dataType": "Number",
            "unique": false,
            "numericSign": "Positive",
            "precision": 0,
            "format": null
        },
        "Date_Time": {
            "dataType": "Date",
            "unique": false,
            "numericSign": null,
            "precision": null,
            "format": "YYYY-MM-DD HH:MM:SS AM/PM"
        },
        "Seat_Number": {
            "dataType": "Number",
            "unique": false,
            "numericSign": "Positive",
            "precision": 0,
            "format": null
        },
        "registration_date": {
            "dataType": "Date",
            "unique": false,
            "numericSign": null,
            "precision": null,
            "format": "YYYY-MM-DD"
        }
    }
}

const ColumnDataTypeDefinition = ({
    SchemaDefinition,
    setSchemaDefinition,
    setLoading
}: {
    SchemaDefinition: SchemaDefinition;
    setSchemaDefinition: React.Dispatch<React.SetStateAction<SchemaDefinition>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    // Function to update SchemaDefinition when a value changes
    const handleChange = (key: string, field: keyof schemaTypeDefintion, value: string | boolean | null) => {
        setLoading(true);
        setSchemaDefinition((prevSchema) => ({
            ...prevSchema,
            [key]: {
                ...prevSchema[key],
                [field]: value,
            },
        }));

        setLoading(false)
    };

    return (
        <div className="w-full dataTypeColumnContainer">
            {Object.keys(mockResponse.schema_definition).map((key, index) => {
                const columnData = SchemaDefinition[key];

                return (
                    <div className="flex gap-2 w-full bg-blue py-6 border-t border-gray-700" key={index}>
                        <div className="w-auto p-4 rounded-lg">
                            <h4 className="mb-2 text-sm font-semibold para text-nowrap">Column</h4>
                            <h4 className="mb-2 text-base font-semibold heading">{key}</h4>
                        </div>

                        <div className="flex gap-2 flex-wrap w-full">
                            {/* Column Type */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Column Type:</h4>
                                <select
                                    value={columnData.dataType}
                                    onChange={(e) => handleChange(key, "dataType", e.target.value)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none"
                                >
                                    <option value="String">String</option>
                                    <option value="Number">Number</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                    <option value="All">Allow all types</option>
                                </select>
                            </div>

                            {/* Numeric Sign Constraint */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Numeric Sign:</h4>
                                <select
                                    value={columnData.numericSign || "null"}
                                    onChange={(e) => handleChange(key, "numericSign", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Number") && (columnData.dataType !== "All")}
                                >
                                    <option value="Positive">Positive Only</option>
                                    <option value="Negative">Negative Only</option>
                                    <option value="null">No Constraint</option>
                                </select>
                            </div>

                            {/* Precision */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Precision:</h4>
                                <select
                                    value={columnData.precision || "null"}
                                    onChange={(e) => handleChange(key, "precision", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Number") && (columnData.dataType !== "All")}
                                >
                                    <option value="null">No Limit</option>
                                    <option value={0}>0 (Whole numbers only)</option>
                                    <option value={1}>1 decimal place</option>
                                    <option value={2}>2 decimal places</option>
                                    <option value={3}>3 decimal places</option>
                                    <option value={4}>4 decimal places</option>
                                    <option value={5}>5 decimal places</option>
                                </select>
                            </div>

                            {/* Uniqueness Constraint */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Uniqueness:</h4>
                                <select
                                    value={columnData.unique ? "Unique" : "Non-Unique"}
                                    onChange={(e) => handleChange(key, "unique", e.target.value === "Unique")}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none"
                                >
                                    <option value="null">Non-Unique (Duplicates permitted)</option>
                                    <option value="Unique">Unique (No duplicates allowed)</option>
                                </select>
                            </div>

                            {/* Date Format */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Date Format:</h4>
                                <select
                                    value={columnData.format || "null"}
                                    onChange={(e) => handleChange(key, "format", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Date") && (columnData.dataType !== "All")}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                    <option value="null">Allow all formats</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ColumnDataTypeDefinition;

