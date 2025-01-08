'use client'

import { IoFilterSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import ProjectCard from "@/components/ProjectCard";
import { useState, useEffect, useRef } from "react";
import Upload from "@/components/Upload";

interface projectType {
  id:string;
  fileName:string;
  description:string;
  category:string;
  progress:number;
}

const projectsData: projectType[] = [
  {
      id:"abc123",
      fileName: "Trip.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Machine Learning",
      progress: 44,
  },

  {
      id:"abc123",
      fileName: "Analytics.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Analytics",
      progress: 9,
  },

  {
      id:"abc123",
      fileName: "Research.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Machine Learning",
      progress: 95,
  },

  {
      id:"abc123",
      fileName: "Students.xslx",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
      category: "Analytics",
      progress: 100,
  },

  {
    id:"abc123",
    fileName: "Trip.xslx",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
    category: "Machine Learning",
    progress: 44,
},

{
    id:"abc123",
    fileName: "Analytics.xslx",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
    category: "Analytics",
    progress: 9,
},

{
    id:"abc123",
    fileName: "Research.xslx",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
    category: "Machine Learning",
    progress: 95,
},

{
    id:"abc123",
    fileName: "Students.xslx",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium dolorem unde necessitatibus quisquam explicabo quidem non inventore dolores vel?",
    category: "Analytics",
    progress: 100,
},
]


const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [viewCategory, setViewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setViewCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Filter projects by search term
  const filteredProjects = projectsData.filter((project) =>
    project.fileName.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory ? project.category === selectedCategory : true)
  );
  
  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
      <header className="secondaryBg w-full h-20 flex justify-between items-center px-3 rounded-lg">
        <h1 className="text-2xl font-bold">Projects</h1>
        
          <div className="flex sm:flex-row gap-4 items-center">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="input w-10 sm:w-40"
                placeholder="Search projects"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <div className="relative" ref={dropdownRef}>
              <IoFilterSharp className="text-2xl cursor-pointer" onClick={()=>setViewCategory(!viewCategory)} />
                {
                  viewCategory && (
                    <ul className="absolute top-full background py-4 px-2 w-40 rounded-lg flex flex-col" >
                      <li 
                        className={`border-b hover:secondaryBg cursor-pointer text-sm px-1 py-2 rounded-sm ${
                          selectedCategory === "Machine Learning" ? "font-bold primary secondaryBg" : "heading"
                        }`}
                        onClick={() => setSelectedCategory("Machine Learning")}
                      >
                          Machine Learning
                      </li>
                      <li 
                        className={`border-b hover:opacity-75 cursor-pointer text-sm px-1 py-2 rounded-sm ${
                          selectedCategory === "Analytics" ? "font-bold primary secondaryBg" : "heading"
                        }`}
                        onClick={() => setSelectedCategory("Analytics")}
                      >
                        Analytics
                      </li>
                      <li
                        className="heading hover:opacity-75 cursor-pointer bg-red-500 text-sm px-1 py-2 rounded-sm"
                        onClick={() => setSelectedCategory(null)}
                      >
                        Reset Filter
                      </li>
                    </ul>
                  )
                }
            </div>
            <button className="primaryBtn flex gap-1 items-center text-sm" onClick={()=>setShowOverlay(true)}><IoMdAdd className="text-xl" /><span className="hidden sm:block">New project</span></button>
          </div>
      </header>
      <main className="grid grid-cols-6 mt-4 gap-4">
        {/* {
          projectsData.map((project,index)=>{
            return (
              <ProjectCard key={index} project={project}/>
            )
          })
        } */}
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <p className="col-span-6 text-center text-gray-500">No projects found.</p>
        )}
      </main>
       {/* The Overlay Div */}
       {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-scroll pt-40 sm:pt-10 md:pt-0 custom-scrollbar"
          // onClick={() => setShowOverlay(false)} 
        >
            <Upload setShowOverlay={setShowOverlay} />
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;