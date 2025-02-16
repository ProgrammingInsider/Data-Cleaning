"use client"

import CleanDataTableHeader from "@/components/CleanDataTableHeader"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useGlobalContext } from "@/context/context"
import {Props} from '@/utils/types'
import { useEffect } from "react"
import Loading from "./loading"

export default function TablePage({params}:Props) {
  const { expand, setExpand, records, setCleanDataFileId, isCleanDataLoading, schema } = useGlobalContext();
  const tableWidth = Object.keys(schema).length * 200 + 'px';
  

  useEffect(() => {
    const fetchErrorReport = async () => {
        const fileId = await params;
        const { fileid } = fileId;
        if (fileid) {
          setCleanDataFileId(fileid)
        }
    };

    fetchErrorReport();
}, [params]); 

  return (
    <div
      className={`w-full h-screen flex flex-col overflow-x-hidden ${
        expand ? "fixed background inset-0 z-50 top-0 left-0 right-0 bottom-0 overflow-hidden" : "h-full"
      }`}
    >
      {/* Table Header */}
      <CleanDataTableHeader setExpand={setExpand} expand={expand} />

      {/* Scrollable Table Container */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-auto custom-scrollbar relative">

        {isCleanDataLoading && (
          <div className={`absolute top-0 right-0 bottom-0 left-0 inset-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-sm min-w-[${tableWidth}]`}>
            <Loading />
          </div>
        )}

          <div className={`min-w-[${tableWidth}]  ${isCleanDataLoading ? "opacity-100" : ""}`}>
          {records.length > 0 ? (
          <Table className="min-w-full relative">
            <TableHeader>
              <TableRow>
                {records.length > 0 &&
                  Object.keys(records[0]).map((key, index) => (
                    <TableHead key={index} className="w-[100px]">
                      {key}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  {Object.values(record).map((value, i) => (
                    <TableCell key={i} className="font-medium">{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <div className="p-2 rounded-lg text-wrap text-sm w-full mr-auto bg-secondary text-secondary-foreground">
            {isCleanDataLoading || "No records available."}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
