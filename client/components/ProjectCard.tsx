'use client'

// import Link from 'next/link';
import {useState} from 'react'
import { FaGear } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";
import ProjectDetail from './ProjectDetail';
import {projectType} from '../utils/types'
import Progress from './Progress';
import ProgressStatus from './ProgressStatus';


const ProjectCard = ({project, setRevalidateProjects, revalidateProjects}:{project:projectType, setRevalidateProjects:React.Dispatch<boolean>,revalidateProjects:boolean}) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
    const {original_name,description,category,progress} = project;

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
      
        <div className='flex flex-col justify-between items-center'>
          <Progress progress={progress} />
          <div className='w-full flex justify-between items-center'>
            <ProgressStatus progress={progress} />
            <button className='hover:underline primary font-bold' onClick={()=>setShowDetail(true)}>View Details &nbsp;</button>
          </div>
        </div>

        {showDetail && <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-scroll pt-40 sm:pt-10 md:pt-0 custom-scrollbar"
        >
            <ProjectDetail project={project} setShowDetail={setShowDetail} showDetail={showDetail} setRevalidateProjects={setRevalidateProjects} revalidateProjects={revalidateProjects} />
        </div>

        }

    </div>
  )
}

export default ProjectCard