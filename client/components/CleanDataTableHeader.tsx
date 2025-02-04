"use client"

import { FaDownload } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { LuShrink } from "react-icons/lu";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";

const CleanDataTableHeader = ({expand,setExpand}:{expand:boolean,setExpand:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [row, setRow] = useState<number | string>(50)

    const handlePagination = (increase: boolean) => {
        setRow(prev => {
            const newValue = increase ? Number(prev) + 50 : Number(prev) - 50;
            return newValue < 0 ? 0 : newValue;
        });
    };
    
  return (
    <header className='flex justify-between items-center sectionBg p-1 px-5 w-full'>
        <div className='flex justify-between items-center gap-1'>
                <span>show:</span>
                <span className='flex justify-between items-center gap-1'>
                <FaAngleLeft onClick={()=>handlePagination(false)} className="cursor-pointer" />
                <input type="text" value={row} onChange={(e)=>setRow(e.target.value)} min={0} className='w-14 bg-transparent border border-gray-400 rounded-md p-1 focus:outline-none' /><FaAngleRight onClick={()=>handlePagination(true)} className="cursor-pointer" />
                </span>
        </div>

        <div className='flex justify-between items-center gap-3'>
            <IoMdShare className="cursor-pointer" />
            <FaDownload className="cursor-pointer" />
            {
                expand
                ?  <LuShrink onClick={()=>setExpand(false)} className="cursor-pointer" />
                :   <LuExpand onClick={()=>setExpand(true)} className="cursor-pointer" />
            }
            <BsThreeDots />
        </div>
    </header>
  )
}

export default CleanDataTableHeader