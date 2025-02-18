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
import { useEffect, useRef } from "react"
import Loading from "./loading"

export default function TablePage({params}:Props) {
  const { expand, setExpand, records, setCleanDataFileId, isCleanDataLoading, schema, issues, selectedRow } = useGlobalContext();
  const tableWidth = Object.keys(schema).length * 200 + 'px';
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    if (selectedRow !== null && tableContainerRef.current) {
      const rowElement = document.getElementById(`row-${selectedRow}`);
      if (rowElement && tableContainerRef.current) {
        // Get the position of the row relative to the table container
        const container = tableContainerRef.current;
        const rowOffset = rowElement.offsetTop;
        const containerHeight = container.clientHeight;
        const rowHeight = rowElement.clientHeight;

        // Adjust the scroll position so the row appears in the middle
        container.scrollTo({
          top: rowOffset - containerHeight / 2 + rowHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedRow]);

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
      className={`w-full h-full flex flex-col ${
        expand ? "fixed background inset-0 z-50 top-0 left-0 right-0 bottom-0 overflow-hidden" : "h-full"
      }`}
    >
      {/* Table Header */}
      <CleanDataTableHeader setExpand={setExpand} expand={expand} />

      {/* Scrollable Table Container */}
      <div  
        ref={tableContainerRef} 
        className={`w-full h-screen overflow-y-auto overflow-x-auto  relative custom-scrollbar`}
      >

        {isCleanDataLoading && (
          <div className={`absolute top-0 right-0 bottom-0 left-0 inset-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-sm min-w-[${tableWidth}]`}>
            <Loading />
          </div>
        )}

          <div 
          className={`max-w-[${tableWidth}] ${isCleanDataLoading ? "opacity-100" : ""}`}
          >
          {records.length > 0 ? (
          <Table className="min-w-full relative">
            <TableHeader className="mr-auto bg-secondary text-secondary-foreground">
              <TableRow>
                <TableHead>Row</TableHead>
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
                <TableRow 
                  key={index} 
                  id={`row-${index}`}
                  className={`${selectedRow === (index + 1) ? "animate-blink bg-blue-400" : ""}`}
                >
                  <TableCell className="w-3">{index + 1}</TableCell>

                  {Object.entries(record).map(([key, value], i) => {
                    // Find issues for the current row
                    const rowIssues = issues.find(issue => issue.row === index + 1);
                    
                    // Extract column names from error messages
                    const errorColumns = rowIssues 
                      ? rowIssues.errors.map(error => error.split(": ")[1])
                      : [];
                
                    return (
                      <TableCell 
                        key={i} 
                        className={`text-nowrap ${errorColumns.includes(key) ? "bg-red-600 border border-gray-300" : ""} font-medium`}
                      >
                        {String(value)}
                      </TableCell>
                    );
                  })}
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
