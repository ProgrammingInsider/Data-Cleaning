'use client'

import { IoFilterSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import Upload from "@/components/Upload";
import ProjectCard from "@/components/ProjectCard";
import { GetFile } from "@/utils/fileActions";
import Loading from "./loading";


interface projectType {
  file_id:string;
  original_name:string;
  description:string;
  category:string;
  progress:number;
}


const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [viewCategory, setViewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revalidateProjects, setRevalidateProjects] = useState(false);
  const [projects, setProjects] = useState<projectType[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setLoading(true);
    const fetchProject = async() => {

      const resp = await GetFile();
      
      if(resp?.data.status){
        setProjects(resp.data.result);
      }else{
        setProjects([]);
      }

      setLoading(false);
      }

      fetchProject()
  },[revalidateProjects])

  

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
  const filteredProjects = projects.filter((project) => {
    if (projects.length > 0) {
      return (
        project.original_name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory ? project.category === selectedCategory : true)
      );
    }
    return false;
  });  
  
  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
        <h1 className="text-2xl font-bold mb-3">Projects</h1>
      <header className="secondaryBg w-full h-15 flex justify-center sm:justify-end items-center py-3 px-6 rounded-lg">
          <div className="flex sm:flex-row gap-4 items-center">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="input sm:max-w-30"
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
            <button className="primaryBtn primaryBtnTxt flex gap-1 items-center text-sm" onClick={()=>setShowOverlay(true)}><IoMdAdd className="text-xl" /><span className="hidden sm:block">New project</span></button>
          </div>
      </header>
      <main className="grid grid-cols-6 mt-4 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => <ProjectCard key={project.file_id} project={project} setRevalidateProjects={setRevalidateProjects} revalidateProjects={revalidateProjects} />)
        ) : (
          <p className="col-span-6 text-center text-gray-500">{loading ? <Loading/>:"No projects found."}</p>
        )}
      </main>
       {/* The Overlay Div */}
       {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-scroll pt-40 sm:pt-10 md:pt-0 custom-scrollbar"
        >
            <Upload setShowOverlay={setShowOverlay} setRevalidateProjects={setRevalidateProjects} revalidateProjects={revalidateProjects} />
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;