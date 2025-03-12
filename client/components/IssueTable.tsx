'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {IssueCountType} from '@/utils/types'
import { useState } from "react";


function IssueTable({issueTypeCounts}:{issueTypeCounts:IssueCountType[]}) {
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
            {issueTypeCounts
            .map((error,index) => (
            <TableRow key={index}>
                <TableCell className="font-medium w-40">{error.issueType}</TableCell>
                <TableCell>{error.impact}</TableCell>
                <TableCell>{error.totalCount}</TableCell>
                <TableCell className="w-40">{error.affectedPercentage}%</TableCell>
                <TableCell className="text-right flex gap-2 flex-wrap justify-end">
                {
                    error.columns.slice(0,2).map((column,errorIndex) => (
                        <div key={errorIndex} className="rounded-lg bg-red-400 p-1 m-1 inline-block" style={{ verticalAlign: 'middle' }}>
                            {column}{errorIndex !== error.columns.length-1?' ':''}
                        </div>
                ))}
                {
                    ( showModal === index && error.columns.slice(2).map((column,errorIndex) => (
                        <span key={errorIndex}  className="rounded-lg bg-red-400 p-1 m-1 inline-block" style={{ verticalAlign: 'middle' }}>
                            {column}{errorIndex !== error.columns.length-1?' ':''}
                        </span>)
                ))}
                    {(error.columns.length > 2) && 
                    (
                        showModal === index 
                            ? <span key={index} className="rounded-lg primaryBg p-1 m-1 cursor-pointer" onClick={()=>setShowModal(-1)}>show less</span>
                            : <span key={index} className="rounded-lg primaryBg p-1 m-1 cursor-pointer inline-block" style={{ verticalAlign: 'middle' }} onClick={()=>setShowModal(index)}>{(error.columns.slice(3).length + 1) + '+ more'}</span>
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