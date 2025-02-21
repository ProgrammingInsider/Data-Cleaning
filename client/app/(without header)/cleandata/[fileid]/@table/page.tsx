// "use client"

// import CleanDataTableHeader from "@/components/CleanDataTableHeader"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import { useGlobalContext } from "@/context/context"
// import { Props } from '@/utils/types'
// import { useState, useEffect, useRef } from "react"
// import Loading from "./loading"

// export default function TablePage({ params }: Props) {
//   const { expand, setExpand, records, setCleanDataFileId, isCleanDataLoading, schema, issues, selectedRow } = useGlobalContext();
//   const tableWidth = Object.keys(schema).length * 200 + 'px';
//   const tableContainerRef = useRef<HTMLDivElement>(null);
//   const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
//   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
//   const [isTooltipAbove, setIsTooltipAbove] = useState(false);
//   const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

//   const handleMouseMove = (e: React.MouseEvent, index: number) => {
//     // Clear any existing timeout
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//     }

//     // Set a new timeout for delayed hover effect
//     const timeout = setTimeout(() => {
//       const offsetX = 30;
//       const offsetY = 30;

//       if (tableContainerRef.current) {
//         const containerRect = tableContainerRef.current.getBoundingClientRect();
//         const tooltipWidth = 400;
//         const tooltipHeight = 100;

//         let x = e.clientX + offsetX;
//         let y = e.clientY + offsetY;
//         let tooltipAbove = false;

//         if (x + tooltipWidth > containerRect.right) {
//           x = e.clientX - tooltipWidth - offsetX;
//         }

//         if (y + tooltipHeight > containerRect.bottom) {
//           y = e.clientY - tooltipHeight - offsetY;
//           tooltipAbove = true;
//         }

//         setCursorPosition({ x, y });
//         setIsTooltipAbove(tooltipAbove);
//         setHoveredRowIndex(index); // Show tooltip after delay
//       }
//     }, 500); // 500ms delay before showing the floating component

//     setHoverTimeout(timeout);
//   };

//   const handleMouseLeave = () => {
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout); // Clear timeout on mouse leave
//     }
//     setHoveredRowIndex(null); // Hide the floating component
//   };

//   // const handleMouseMove = (e: React.MouseEvent, index: number) => {
//   //   const offsetX = 30;
//   //   const offsetY = 30;
  
//   //   if (tableContainerRef.current) {
//   //     const containerRect = tableContainerRef.current.getBoundingClientRect();
//   //     const tooltipWidth = 400; // Estimated width of the floating container
//   //     const tooltipHeight = 100; // Estimated height of the floating container
  
//   //     let x = e.clientX + offsetX;
//   //     let y = e.clientY + offsetY;
//   //     let tooltipAbove = false;
  
//   //     // Adjust X if the tooltip overflows the right edge
//   //     if (x + tooltipWidth > containerRect.right) {
//   //       x = e.clientX - tooltipWidth - offsetX;
//   //     }
  
//   //     // Adjust Y if the tooltip overflows the bottom edge
//   //     if (y + tooltipHeight > containerRect.bottom) {
//   //       y = e.clientY - tooltipHeight - offsetY;
//   //       tooltipAbove = true;
//   //     }
  
//   //     setCursorPosition({ x, y });
//   //     setIsTooltipAbove(tooltipAbove);
//   //   }
  
//   //   setHoveredRowIndex(index);
//   // };
  

//   // const handleMouseLeave = () => {
//   //   setHoveredRowIndex(null);
//   // };

//   useEffect(() => {
//     if (selectedRow !== null && tableContainerRef.current) {
//       const rowElement = document.getElementById(`row-${selectedRow}`);
//       if (rowElement && tableContainerRef.current) {
//         const container = tableContainerRef.current;
//         const rowOffset = rowElement.offsetTop;
//         const containerHeight = container.clientHeight;
//         const rowHeight = rowElement.clientHeight;

//         container.scrollTo({
//           top: rowOffset - containerHeight / 2 + rowHeight / 2,
//           behavior: "smooth",
//         });
//       }
//     }
//   }, [selectedRow]);

//   useEffect(() => {
//     const fetchErrorReport = async () => {
//       const fileId = await params;
//       const { fileid } = fileId;
//       if (fileid) {
//         setCleanDataFileId(fileid);
//       }
//     };

//     fetchErrorReport();
//   }, [params]);

//   return (
//     <div className={`w-full h-full flex flex-col ${expand ? "fixed background inset-0 z-50 top-0 left-0 right-0 bottom-0 overflow-hidden" : "h-full"}`}>
//       <CleanDataTableHeader setExpand={setExpand} expand={expand} />

//       <div ref={tableContainerRef} className="w-full h-screen overflow-y-auto overflow-x-auto relative custom-scrollbar">
//         {isCleanDataLoading && (
//           <div className={`absolute top-0 right-0 bottom-0 left-0 inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm min-w-[${tableWidth}]`}>
//             <Loading />
//           </div>
//         )}

//         <div className={`max-w-[${tableWidth}] ${isCleanDataLoading ? "opacity-100" : ""}`}>
//           {records.length > 0 ? (
//             <Table className="min-w-full relative">
//               <TableHeader className="sticky top-0 mr-auto bg-secondary text-secondary-foreground">
//                 <TableRow>
//                   <TableHead className="sticky top-0 z-10"></TableHead>
//                   {records.length > 0 &&
//                     Object.keys(records[0]).map((key, index) => (
//                       <TableHead key={index} className="sticky top-0 z-10 w-[100px]">
//                         {key}
//                       </TableHead>
//                     ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {records.map((record, index) => (
//                   <TableRow
//                     key={index}
//                     id={`row-${index}`}
//                     onMouseMove={(e) => handleMouseMove(e, index)}
//                     onMouseLeave={handleMouseLeave}
//                     className={`w-full relative ${selectedRow === index + 1 ? "animate-blink bg-blue-400" : ""}`}
//                   >
//                     <TableCell className="w-3 sticky left-0 z-40 bg-secondary">{index + 1}</TableCell>

//                     {Object.entries(record).map(([key, value], i) => {
//                       const rowIssues = issues.find(issue => issue.row === index + 1);
//                       const errorColumns = rowIssues ? rowIssues.errors.map(error => error.split(": ")[1]) : [];

//                       return (
//                         <TableCell
//                           key={i}
//                           className={`z-10 text-nowrap ${errorColumns.includes(key) ? "bg-red-600/60" : ""} font-medium`}
//                         >
//                           {String(value)}

//                           {(hoveredRowIndex === index && rowIssues) && (
//                             <ul
//                               className={`fixed border border-gray-300 rounded-lg p-2 font-light text-sm z-40 transition-opacity duration-150 ease-in-out flex flex-col bg-secondary/55 text-secondary-foreground ${
//                                 isTooltipAbove ? "before:bottom-[-5px]" : "before:top-[-5px]"
//                               } before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border-l before:border-t before:border-gray-300 before:rotate-45`}
//                               style={{
//                                 top: `${cursorPosition.y}px`,
//                                 left: `${cursorPosition.x}px`,
//                                 whiteSpace: 'nowrap',
//                                 opacity: hoveredRowIndex === index ? 1 : 0,
//                                 pointerEvents: 'auto',
//                               }}
//                             >
//                               <h4>({rowIssues?.errors.length}) Issues in this row</h4>
//                               {issues.find(issue => issue.row === hoveredRowIndex + 1)?.errors.map((error, idx) => (
//                                 <li key={idx} className="ml-4 list-disc">On column <b>{error.split(":")[1]}:&nbsp;</b>{error.split(":")[0]}</li>
//                               ))}
//                             </ul>
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="p-2 rounded-lg text-wrap text-sm w-full mr-auto bg-secondary text-secondary-foreground">
//               {isCleanDataLoading || "No records available."}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// TablePage.tsx
"use client";

import CleanDataTableHeader from "@/components/CleanDataTableHeader";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGlobalContext } from "@/context/context";
import { useHoverTooltip } from "@/hooks/useHoverTooltip";
import { TableDataRow } from "@/components/workstationUi/TableDataRow";
import { LoadingOverlay } from "@/components/workstationUi/LoadingOverlay";
import { useEffect, useRef } from "react";
import { Props } from "@/utils/types";

export default function TablePage({ params }: Props) {
  const { expand, setExpand, records, setCleanDataFileId, isCleanDataLoading, schema, issues, selectedRow } = useGlobalContext();
  const tableWidth = Object.keys(schema).length * 200 + "px";
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { hoveredRowIndex, cursorPosition, isTooltipAbove, handleMouseMove, handleMouseLeave } = useHoverTooltip();

  useEffect(() => {
    if (selectedRow !== null && tableContainerRef.current) {
      const rowElement = document.getElementById(`row-${selectedRow}`);
      if (rowElement && tableContainerRef.current) {
        const container = tableContainerRef.current;
        const rowOffset = rowElement.offsetTop;
        const containerHeight = container.clientHeight;
        const rowHeight = rowElement.clientHeight;

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
      if (fileid) setCleanDataFileId(fileid);
    };
  
    fetchErrorReport();
  }, [params, setCleanDataFileId]);
  

  return (
    <div className={`w-full h-full flex flex-col ${expand ? "fixed background inset-0 z-50 overflow-hidden" : "h-full"}`}>
      <CleanDataTableHeader setExpand={setExpand} expand={expand} />

      <div ref={tableContainerRef} className="w-full h-screen overflow-y-auto overflow-x-auto relative custom-scrollbar">
        <LoadingOverlay isLoading={isCleanDataLoading} tableWidth={tableWidth} />

        <div className={`max-w-[${tableWidth}] ${isCleanDataLoading ? "opacity-100" : ""}`}>
          {records.length > 0 ? (
            <Table className="min-w-full relative">
              <TableHeader className="sticky top-0 mr-auto bg-secondary text-secondary-foreground">
                <TableRow>
                  <TableHead className="sticky top-0 z-10"></TableHead>
                  {Object.keys(records[0]).map((key, index) => (
                    <TableHead key={index} className="sticky top-0 z-10 w-[100px]">{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableDataRow
                    key={index}
                    record={record}
                    index={index}
                    issues={issues}
                    selectedRow={selectedRow}
                    handleMouseMove={(e: React.MouseEvent) => handleMouseMove(e, index, tableContainerRef)}
                    handleMouseLeave={handleMouseLeave}
                    hoveredRowIndex={hoveredRowIndex}
                    cursorPosition={cursorPosition}
                    isTooltipAbove={isTooltipAbove}
                  />
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