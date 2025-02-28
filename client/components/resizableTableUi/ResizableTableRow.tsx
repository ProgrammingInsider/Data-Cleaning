import {useState, useEffect} from 'react'
import {RecordType} from '@/utils/types'
import { useGlobalContext } from '@/context/context';
import { useHoverTooltip } from '@/hooks/useHoverTooltip';
import { Tooltip } from "@/components/workstationUi/Tooltip";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";


interface ResizableTableRowProps {
    row: RecordType;
    rowIndex: number;
    columnWidths: Record<string, number>;
    rowHeights: Record<number, number>;
    handleColumnResize: (e: React.MouseEvent, key: string) => void;
    handleRowResize: (e: React.MouseEvent, rowIndex: number) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
  }

const ResizableTableRow = ({
    row,
    rowIndex,
    columnWidths,
    rowHeights,
    handleColumnResize,
    handleRowResize,
    containerRef
  }: ResizableTableRowProps) => {
    // const [data, setData] = useState<RecordType>({});
    // const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedRow, setEditedRow] = useState<RecordType>(row);
    const [editCell, setEditCell] = useState<string>();
    const {selectedRow, issues} = useGlobalContext()
    const { hoveredRowIndex, cursorPosition, isTooltipAbove, handleMouseMove, handleMouseLeave } = useHoverTooltip();
    const rowIssues = issues.find((issue) => issue.row === rowIndex + 1);
    const errorColumns = rowIssues ? rowIssues.errors.map((error) => error.column) : [];
    

    // const handleEdit = () => {
    //     setData(row)
    // };

    useEffect(() => {
        setEditedRow(row);
    }, [row]);
    

  return (
        <div
            key={rowIndex}
            style={{ height: `${rowHeights[rowIndex]}px` }}
            id={`row-${rowIndex}`}
            onMouseMove={(e) => handleMouseMove(e, rowIndex, containerRef)}
            onMouseLeave={handleMouseLeave}
            className={`flex relative 
                ${(rowIndex % 2 === 0 && selectedRow !== rowIndex + 1 ) ? 'sectionBg' : 'background'} 
                ${selectedRow === rowIndex + 1 ? "animate-blink bg-blue-400" : ""}`}
        >
            <div
                key={rowIndex}
                className="px-2 py-1 background sticky left-0 z-20 border-b border-gray-500/20"
                style={{ width: `${columnWidths["rowNumber"]}px`, minWidth: "50px" }}
            >
                {rowIndex + 1}
                <span
                    className="absolute right-0 top-0 bottom-0 w-px cursor-ew-resize bg-gray-500/20"
                    onMouseDown={(e) => handleColumnResize(e, "rowNumber")}
                    ></span>
            </div>
                {Object.keys(row).map((key) => (
                <div
                    key={key}
                    className={`relative px-2 py-1 z-10 text-nowrap ${errorColumns.includes(key) ? "bg-red-600/60" : ""} font-medium`}
                    style={{ width: `${columnWidths[key]}px`, minWidth: "50px" }}
                >
                    {hoveredRowIndex === rowIndex && rowIssues && editCell === "" && (
                        <Tooltip issues={rowIssues.errors} cursorPosition={cursorPosition} isTooltipAbove={isTooltipAbove} />
                    )}
                    
                    <div  className='w-full h-full flex  gap-1'>
                        <input
                        type="text"
                        className={`w-full h-full bg-transparent outline-none z-10 text-sm font-normal ${editCell === key ? "border border-gray-400 pl-2":"col-span-3"}`}
                        // value={data ? (row as RecordType)[key] as string || "Null" : data[key] as string}
                        // onChange={() => handleEdit()}
                        value={editedRow[key] !== undefined ? String(editedRow[key]) : "Null"}
                        onChange={(e) => setEditedRow({ ...editedRow, [key]: e.target.value })}
                        disabled={editCell === key}
                        onClick={()=>setEditCell(key)}
                        />

                        { (editCell === key) && <span className='col-span-1 flex gap-1 w-10'>
                            <IoCheckmarkSharp className='text-green-700 hover:text-green-400  cursor-pointer text-4xl font-bold max-w-5' />
                            <IoClose  onClick={() => {setEditedRow(row); setEditCell("");}} className='text-red-700 hover:text-red-400 cursor-pointer text-4xl max-w-5' />
                        </span>}
                    </div>

                    {/* Body Cell Resize Handle so you can drag from any cell border */}
                    <span
                    className="absolute right-0 top-0 bottom-0 w-px cursor-ew-resize bg-gray-500/20"
                    onMouseDown={(e) => handleColumnResize(e, key)}
                    ></span>
                </div>
                ))}
                {/* Row Resize Handle covers full width at the bottom of the row */}
                <span
                className="absolute left-0 right-0 bottom-0 h-px cursor-ns-resize bg-gray-500/20"
                onMouseDown={(e) => handleRowResize(e, rowIndex)}
                ></span>
        </div>
  )
}

export default ResizableTableRow