import Link from 'next/link';
import React from 'react'
import { FaGear } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";

interface projectType {
  file_id:string;
  original_name:string;
  description:string;
  category:string;
  progress:number;
}


const ProjectCard = ({project}:{project:projectType}) => {
    const {file_id,original_name,description,category,progress} = project;
    const progressNumber = Number(progress);

    let progressStatus = '';
    let progressStyle = '';
    switch (true) {
        case progress <= 10:
            progressStatus = 'Planning';
            progressStyle = "planning";
            break;
        case progress > 10 && progress <= 90:
            progressStatus = 'In Progress';
            progressStyle = "inProgress";
            break;
        case progress > 90 && progress < 100:
            progressStatus = 'In Review';
            progressStyle = "inReview";
            break;
        case progress === 100:
            progressStatus = 'Completed';
            progressStyle = "completed";
            break;
        default:
            progressStatus = 'Unknown';
            break;
    }
  return (
    <div className='secondaryBg col-span-6 md:col-span-3 lg:col-span-2 px-4 py-6 rounded-lg'>
        <div className='flex gap-3 items-center justify-between mb-3'>
            <h1 className='heading text-2xl font-bold inline-block mb-2 truncate w-full'>{original_name}</h1>
            {
                (category === "Machine Learning" && <FaGear title='Machine learning' />) ||
                (category === "Analytics" && <SiGoogleanalytics title='Analytics' />)
            }
        </div>
        <p className="text-sm cardPara mb-6">
            {description}
        </p>
        <div className='mb-6'>
          <div className='flex justify-between items-center'>
            <h4>Progress</h4>
            <h4>{progress}%</h4>
          </div>
          <div className='h-1 w-full relative progressBg'>
            <div 
              className={`absolute top-0 left-0 w-[${progressNumber}%] h-full progressCount`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className='flex justify-between items-center'>

          <button className={`text-black font-medium text-sm py-1 px-2 inProgress rounded-lg ${progressStyle}`}>
            {progressStatus}
          </button>
          <Link href={`${file_id}`} className='hover:underline primary font-bold'>View Details &nbsp;</Link>
        </div>

    </div>
  )
}

export default ProjectCard