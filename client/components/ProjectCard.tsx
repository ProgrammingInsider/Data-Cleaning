import Link from 'next/link';
import React from 'react'
import { FaGear } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";

interface projectType {
    id:string;
    fileName:string;
    description:string;
    category:string;
  }

const ProjectCard = ({project}:{project:projectType}) => {
    const {id,fileName,description,category} = project;
  return (
    <div className='secondaryBg col-span-6 md:col-span-3 lg:col-span-2 p-2 rounded-lg'>
        <div className='flex gap-3 items-center justify-between mb-3'>
            <h1 className='text-2xl font-bold'>{fileName}</h1>
            {
                (category === "Machine Learning" && <FaGear title='Machine learning' />) ||
                (category === "Analytics" && <SiGoogleanalytics title='Analytics' />)
            }
        </div>
        <p className="text-sm cardPara mb-6">
            {description}
        </p>

        <Link href={`${id}`} className='underline primary font-bold'>View Details</Link>
    </div>
  )
}

export default ProjectCard