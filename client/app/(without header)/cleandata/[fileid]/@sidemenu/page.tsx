"use client"

import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {Props, ErrorDetectionType, fileDetailsType, IssueDistributionType} from '@/utils/types'
import { ErrorReport, GetFile } from "@/utils/fileActions";
import { FaBoxTissue } from "react-icons/fa";
import SmallLoading from "@/components/SmallLoading";

interface projectType {
    file_id:string;
    original_name:string;
    description:string;
    category:string;
    progress:number;
  }

export default function SideMenu({params}:Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isIssueOpen, setIsIssueOpen] = useState(true);
    const [active, setActive] = useState<number>(-1);
    const [loading, setLoading] = useState(false);
    const [errorDetection, setErrorDetection] = useState<ErrorDetectionType[]>([]);
    const [fileDetails, setFileDetails] = useState<fileDetailsType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<projectType[]>([]);
    const [fileId, setFileId] = useState<string>("");
    const [issue, setIssue] = useState<IssueDistributionType[]>([]);



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


    useEffect(() => {
        const fetchErrorReport = async () => {
            const fileId = await params;
            const { fileid } = fileId;
            setIsLoading(true); //change to false to mock later

            if (fileid) {
                setFileId(fileid);
                try {
                    const result = await ErrorReport(fileid, false);
                    if (result.success) {
                        setFileDetails(result.data.fileDetails);
                        setErrorDetection(result.data.detectionResults);

                    } else {
                        console.error('Error in processing file:', result.message);
                    }
                } catch (error) {
                    console.error('Unexpected error:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchErrorReport();
}, [params,fileId]); //add fileId to mock later

    useEffect(() => {
        const issueDistribution = errorDetection
        .filter((issue) => issue.DetectionStatus === 1)
        .filter((issue) => issue.HowManyDetected > 0)
        .map((issue) => {
            return {
            IssueType: issue.DataInconsistency,
            IssueDetected: issue.HowManyDetected,
            };
        });

        setIssue(issueDistribution);
        
        
    }, [errorDetection,fileDetails]); //add fileDetails will to mock later
    
    return (
        <div
            className="w-full h-screen py-4"
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
                    <span className="text-sm para">Datasets</span>
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
                    <span className="text-sm para">Issues</span>
                    {isIssueOpen ? <IoChevronDown /> : <IoChevronForward />}
                </button>

                {/* File List (Collapsible) */}
                {isIssueOpen && (
                    <ul className="mt-2 space-y-2">
                        {
                            isLoading ? 
                            <div className="flex justify-center py-2"><SmallLoading/></div> : 
                            issue.map((eachIssue, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm cursor-pointer transition relative hover:secondaryBg"
                                    style={{
                                        color: "hsl(var(--sidebar-primary-foreground))",
                                    }}
                                >
                                    <Link href={"#"}>
                                        <span className="flex items-center text-sm gap-2 truncate">
                                            <FaBoxTissue />
                                            {eachIssue.IssueType}
                                        </span>
                                    </Link>
                                    <div className="absolute top-0 right-0 bottom-0 text-base py-1 px-2 z-10 sectionBg">{eachIssue.IssueDetected
                                    }</div>
                                </li>
                            ))
                        }
                    </ul>
                )}
            </div>
        </div>
    );
}
