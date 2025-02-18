"use client"

import { useGlobalContext } from "@/context/context"
import { DeleteAction, DeleteAllAction } from "@/utils/cleanDataActions";
import { IoClose } from "react-icons/io5";
import {Action} from "../utils/types"

const CleanDataMainHeader = () => {
    const {actions, isCleanDataLoading, refreshWorkstation, setRefreshWorkstation, cleanDataFileId} = useGlobalContext();

    const handleUndo = async(actionId:string) => {
        const response = await DeleteAction(cleanDataFileId,actionId);

        if(response){
            const {data} = response;

            if(data.status){
                setRefreshWorkstation(!refreshWorkstation)
            }
        }
    }

    const handleAllUndo = async() => {
        
        const response = await DeleteAllAction(cleanDataFileId);

        if(response){
            const {data} = response;

            if(data.status){
                setRefreshWorkstation(!refreshWorkstation)
            }
        }
    }

    // Filter unique chats
    const uniqueChats = actions?.reduce<Action[]>((acc, action) => {
        if (!acc.some(item => item.chat === action.chat)) {
            acc.push(action);
        }
        return acc;
    }, []);
    
  return (
    <header className='flex justify-between items-center sectionBg p-1 px-5 w-full h-10 border-b border-gray-300'>
        <button className="p-2 rounded-lg max-w-[80%] bg-secondary text-secondary-foreground text-nowrap text-sm text-bold mr-5 hover:underline" onClick={handleAllUndo}>
            Undo All&nbsp;({uniqueChats.length})
        </button>
        <div className="flex flex-nowrap w-full gap-2 hover:overflow-x-auto custom-scrollbar">
        {
            uniqueChats?.length > 0 ? uniqueChats.map((action, index) => (
                <div className="flex gap-1"  key={index}>
                    <div
                        className={`p-1 rounded-lg flex items-center gap-1 text-nowrap text-sm w-auto ${
                            action.chat !== null 
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "mr-auto bg-secondary text-secondary-foreground"
                        }`}
                    >
                        <div className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer" onClick={()=>handleUndo(action.action_id)}><IoClose/></div>{action.chat}
                    </div>
                </div>
            ))
            : <div className={`p-2 rounded-lg text-wrap text-sm max-w-[80%]mr-auto bg-secondary text-secondary-foreground"
            }`}
            >
                {isCleanDataLoading || "No Action taken"}
            </div>
        }
        </div>
    </header>
  )
}

export default CleanDataMainHeader