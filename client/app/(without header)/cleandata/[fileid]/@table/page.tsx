// TablePage.tsx
"use client";

import CleanDataTableHeader from "@/components/CleanDataTableHeader";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGlobalContext } from "@/context/context";
import { useHoverTooltip } from "@/hooks/useHoverTooltip";
import { TableDataRow } from "@/components/workstationUi/TableDataRow";
import { LoadingOverlay } from "@/components/workstationUi/LoadingOverlay";
import { useEffect, useRef, useState } from "react";
import { Props } from "@/utils/types";

export default function TablePage({ params }: Props) {
  const { expand, setExpand, records, setCleanDataFileId, isCleanDataLoading, schema, issues, selectedRow } = useGlobalContext();
  const tableWidth = Object.keys(schema).length * 5 + "px";
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { hoveredRowIndex, cursorPosition, isTooltipAbove, handleMouseMove, handleMouseLeave } = useHoverTooltip();
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    setDataTypes(schema);
  }, [schema]);

  const handleChange = (key: string, value: string) => {
    setDataTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
                    <TableHead key={index} className="sticky top-0 z-10 w-[100px] text-center">
                      {key}
                      <p className="italic font-normal">
                        <select
                          value={dataTypes[key]} // Correctly bind the selected value
                          onChange={(e) => handleChange(key, e.target.value)} // Update state on change
                          className="text-gray-500 bg-secondary rounded-md px-2 py-1 focus:outline-none"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="boolean">Boolean</option>
                        </select>
                      </p>
                    </TableHead>
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