'use client'

import {useEffect, useState} from 'react'
import { IoIosClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ColumnDataTypeDefinition from './ColumnDataTypeDefinition';
import {SchemaType, SchemaDefinition} from '@/utils/types'
import { UpdateSchema } from '@/utils/fileActions';

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



const DefineSchema = ({
    setShowOverlay, 
    schemaDefinition,
    setStep
}:{
    setShowOverlay:React.Dispatch<boolean>,
    setRevalidateProjects:React.Dispatch<boolean>,
    revalidateProjects:boolean, 
    schemaDefinition:SchemaType | null,
    setStep:React.Dispatch<number>
}) => {
    const [loading, setLoading] = useState(false);
    const [schemaTypeDefinition, setSchemaTypeDefinition] = useState<SchemaDefinition>({});
    const [fileId, setFileId] = useState<string>("");

    useEffect(() => {
        if(schemaDefinition?.schema_definition){
            // setSchemaTypeDefinition(schemaDefinition.schema_definition);
            setSchemaTypeDefinition(mockResponse.schema_definition);
            setFileId(schemaDefinition.file_id);
        }
        
    }, [schemaDefinition]);

    const handleSave = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if(schemaDefinition){
            await UpdateSchema({file_id:fileId,schema_definition:schemaTypeDefinition});
        }
        setLoading(false);
        setShowOverlay(false);
        setStep(1);
    }

    return (
        <div className='sectionBg full rounded-lg'>
            <div className='flex justify-between items-center mb-10'>
                <h1 className='heading font-bold text-xl'>Schema Type Defintion</h1>
                <IoIosClose className='text-2xl cursor-pointer' onClick={()=>{setShowOverlay(false);setStep(1);}} />
            </div>
            <form onSubmit={handleSave} method='POST' className='gap-8'>
                <div className='flex flex-col gap-8 w-full'>
                    <ColumnDataTypeDefinition SchemaDefinition={schemaTypeDefinition} setSchemaDefinition={setSchemaTypeDefinition} setLoading={setLoading}/>

                    {/* Form Buttons */}
                    <div className='flex justify-end gap-2 mt-5 border-t border-gray-700 pt-5'>
                        <button type='submit' className='primaryBtn flex gap-3 items-center' disabled={loading}>
                            {loading && (
                                <AiOutlineLoading3Quarters className='animate-spin text-xl' />
                            )} Save
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default DefineSchema