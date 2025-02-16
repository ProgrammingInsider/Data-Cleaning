"use client"

import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GetFile } from "@/utils/fileActions";
import { FaBoxTissue } from "react-icons/fa";
import SmallLoading from "@/components/SmallLoading";
import { useGlobalContext } from "@/context/context"

interface projectType {
    file_id:string;
    original_name:string;
    description:string;
    category:string;
    progress:number;
}

export default function SideMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isIssueOpen, setIsIssueOpen] = useState(true);
    const [active, setActive] = useState<number>(-1);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<projectType[]>([]);
    const { issues,isCleanDataLoading } = useGlobalContext();

    const totalErrors = issues.reduce((sum, issue) => sum + issue.errors.length, 0);

    useEffect(()=>{
        setLoading(true); //change to false to mock later
        const fetchProject = async() => {

        const resp = await GetFile();
        // setProjects(mockProject)
        if(resp?.data.status){
            setProjects(resp.data.result);
        }else{
            setProjects([]);
        }

        setLoading(false);
        }

        fetchProject()
    },[]) 
    
    return (
        <div
            className="w-full h-screen py-4 hover:overflow-y-auto custom-scrollbar"
            style={{
                color: "hsl(var(--sidebar-foreground))",
            }}
        >
            {/* Search Input */}
            <Input
                type="search"
                placeholder="Search..."
                className="w-11/12 px-3 py-5 rounded-lg mb-3 secondaryBg focus:outline-none border-none border border-gray-300 mx-auto"
                onChange={(e) => console.log(e.target.value)}   
            />
            <div>
                {/* Datasets Section */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition"
                >
                    <span className="text-sm para">Datasets&nbsp;({projects.length})</span>
                    {isOpen ? <IoChevronDown /> : <IoChevronForward />}
                </button>

                {/* File List (Collapsible) */}
                {isOpen && (
                    <ul className="mt-2 space-y-2">
                        {
                            loading ?
                            <div className="flex justify-center py-2"><SmallLoading/></div> :
                            projects.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm cursor-pointer transition relative hover:secondaryBg"
                                    style={{
                                        color: "hsl(var(--sidebar-primary-foreground))",
                                    }}
                                    onMouseEnter={() => setActive(index)}
                                    onMouseLeave={() => setActive(-1)}

                                >
                                    <Link href={`/cleandata/${file.file_id}`}>
                                        <span className="flex items-center text-sm gap-2 truncate">
                                            <FaFileAlt />
                                            {file.original_name}
                                        </span>
                                    </Link>
                                    {(active === index) && <div className="absolute right-0 text-sm p-1 rounded-full z-10 sectionBg"><FaPlus/></div>}
                                </li>
                            ))
                        }
                    </ul>
                )}

                <button
                    onClick={() => setIsIssueOpen(!isIssueOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition"
                >
                    <span className="text-sm para">Issues&nbsp;({totalErrors})</span>
                    {isIssueOpen ? <IoChevronDown /> : <IoChevronForward />}
                </button>

                {/* File List (Collapsible) */}
                {isIssueOpen && (
                    <ul className="mt-2 space-y-2 overflow-y-auto">
                        {isCleanDataLoading ? (
                            <div className="flex justify-center py-2"><SmallLoading /></div>
                        ) : (

                            (issues.length > 0)
                            ? (
                                issues.map((eachIssue, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 rounded-lg shadow-sm cursor-pointer transition relative hover:secondaryBg"
                                        style={{ color: "hsl(var(--sidebar-primary-foreground))" }}
                                    >
                                        <Link href={`#row-${eachIssue.row}`}>
                                            <span className="flex items-center text-sm gap-2 truncate font-bold">
                                                <FaBoxTissue />
                                                Row {eachIssue.row}:
                                            </span>
                                        </Link>
                                        <ul className="pl-6 mt-1 text-sm list-disc">
                                            {eachIssue.errors.map((error, errorIndex) => (
                                                <li key={errorIndex}>{error}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))
                            )
                            :
                            <div className={`p-2 rounded-lg text-wrap text-sm max-w-[80%]mr-auto bg-secondary text-secondary-foreground"
                                `}>No Issues Found</div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
