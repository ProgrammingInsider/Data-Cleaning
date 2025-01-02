export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { IoFilterSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Sweepo | Project Dashboard",
  description: "Manage your projects effortlessly with Sweepo's Dashboard. View, edit, or delete your projects and track your content at a glance.",
};

interface projectType {
  id:string;
  fileName:string;
  description:string;
  category:string;
}

const projectsData: projectType[] = [
  {
      id:"abc123",
      fileName: "Trip.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Machine Learning"
  },

  {
      id:"abc123",
      fileName: "Analytics.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Analytics"
  },

  {
      id:"abc123",
      fileName: "Research.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Machine Learning"
  },

  {
      id:"abc123",
      fileName: "Students.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Analytics"
  },
]


const Dashboard = async() => {
  
  return (
    <div className="background p-10 rounded-lg w-10/12 min-h-screen mb-20 sm:w-full">
      <header className="secondaryBg w-full h-20 flex justify-between items-center px-3 rounded-lg">
        <h1 className="text-2xl font-bold">Projects</h1>
        
        <div className="flex gap-4 items-center">
          <form>
            <input type="text" className="input w-40" placeholder="Search projects" />
          </form>
          <IoFilterSharp className="text-2xl cursor-pointer" />
          <button className="primaryBtn flex gap-1 items-center"><IoMdAdd className="text-xl" />New Projects</button>
        </div>
      </header>
      <main className="grid grid-cols-6 mt-4 gap-4">
        {
          projectsData.map((project,index)=>{
            return (
              <ProjectCard key={index} project={project}/>
            )
          })
        }
      </main>
    </div>
  );
  
};

export default Dashboard;