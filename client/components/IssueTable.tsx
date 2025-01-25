'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {ErrorDetectionType} from '@/utils/types'
import { useState } from "react";


function IssueTable({errorDetection}:{errorDetection:ErrorDetectionType[]}) {
    const [showModal, setShowModal] = useState(-1);
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Issue Type</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Affected %</TableHead>
            <TableHead className="text-right">Columns</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {errorDetection
            .filter(error => error.DetectionStatus === 1)
            .filter(error => error.HowManyDetected > 0) 
            .map((error,index) => (
            <TableRow key={index}>
                <TableCell className="font-medium w-40">{error.DataInconsistency}</TableCell>
                <TableCell>{error.ImpactLevel}</TableCell>
                <TableCell>{error.HowManyDetected}</TableCell>
                <TableCell className="w-40">{error.AffectedPercentage}</TableCell>
                <TableCell className="text-right flex gap-2 flex-wrap justify-end">
                {
                    error.FieldColumnName.slice(0,2).map((column,errorIndex) => (
                        <div key={errorIndex} className="rounded-lg bg-red-400 p-1 m-1 inline-block" style={{ verticalAlign: 'middle' }}>
                            {column}{errorIndex !== error.FieldColumnName.length-1?' ':''}
                        </div>
                ))}
                {
                    ( showModal === index && error.FieldColumnName.slice(2).map((column,errorIndex) => (
                        <span key={errorIndex} className="rounded-lg bg-red-400 p-1 m-1 inline-block" style={{ verticalAlign: 'middle' }}>
                            {column}{errorIndex !== error.FieldColumnName.length-1?' ':''}
                        </span>)
                ))}
                    {(error.FieldColumnName.length > 2) && 
                    (
                        showModal === index 
                            ? <span key={index} className="rounded-lg primaryBg p-1 m-1 cursor-pointer" onClick={()=>setShowModal(-1)}>show less</span>
                            : <span key={index} className="rounded-lg primaryBg p-1 m-1 cursor-pointer inline-block" style={{ verticalAlign: 'middle' }} onClick={()=>setShowModal(index)}>{(error.FieldColumnName.slice(3).length + 1) + '+ more'}</span>
                    )
                    }
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    )
}

export default IssueTable;