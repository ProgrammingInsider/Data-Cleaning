'use client'
import { useEffect, useState } from 'react';
import { CardHeader, CardDescription, CardTitle } from '../ui/card'
import { GetSchema } from '@/utils/errorDetectionActions'
import {SchemaType} from '@/utils/types'
import { Table, TableHeader, TableBody, TableHead, TableRow , TableCell} from '../ui/table';


const SchemaDefinitionTable = ({fileId}:{fileId:string}) => {
  
  const [schema, setSchema] = useState<SchemaType>();
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(()=>{
    setLoading(true);
    const fetchSchema = async() => {
      const resp = await GetSchema(fileId);
      setSchema(resp.result[0]);
      setLoading(false);
    }
    if(fileId){
      fetchSchema();
    }
  },[fileId]);

    if (!schema || loading) {
        return <p>Loading...</p>;
    }
    
    if(schema.schema_definition === null){
        return <p>No schema found.</p>;
    }

  

  return (
    <div>
      <CardHeader>
          <CardTitle>Schema Definition</CardTitle>
          <CardDescription>The detail definitions for columns</CardDescription>
          <CardDescription>{schema.awareness}</CardDescription>
        </CardHeader>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Column</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Uniqueness</TableHead>
            <TableHead>Sign</TableHead>
            <TableHead>Precision</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Separator</TableHead>
            <TableHead>Description</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
       {Object.entries(schema.schema_definition)
       .filter(([key]) => key !== "originalRowIndex")
       .map(([key, value], index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-40">{key}</TableCell>
              <TableCell>{value.dataType}</TableCell>
              <TableCell>{value.unique ? 'Yes' : 'No'}</TableCell>
              <TableCell>{value.numericSign || <span className='text-gray-400 italic'>undefined</span>}</TableCell>
              <TableCell>{value.precision || <span className='text-gray-400 italic'>undefined</span>}</TableCell>
              <TableCell>{value.format || <span className='text-gray-400 italic'>undefined</span>}</TableCell>
              <TableCell>{value.separator || <span className='text-gray-400 italic'>undefined</span>}</TableCell>
              <TableCell>{value.desc || <span className='text-gray-400 italic'>undefined</span>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
    </div>
  )
}

export default SchemaDefinitionTable