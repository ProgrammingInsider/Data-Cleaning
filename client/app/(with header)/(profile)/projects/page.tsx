'use client'


import { useState, useEffect, useRef } from "react";
import ProjectCard from "@/components/ProjectCard";
import { GetFile } from "@/utils/fileActions";
import Loading from "./loading";
import Header from "@/components/dashboardUi/Header";
import Modals from "@/components/dashboardUi/Modals";
import { projectType } from "@/utils/types";


const Dashboard = () => {
  const [search, setSearch] = useState<string>("");
  const [viewCategory, setViewCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [revalidateProjects, setRevalidateProjects] = useState<boolean>(false);
  const [projects, setProjects] = useState<projectType[]>([]);
  const [step, setStep] = useState<number>(1);
  
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
      
      {/* Header */}
      <Header 
        search={search} 
        setSearch={setSearch}
        dropdownRef={dropdownRef}
        viewCategory={viewCategory}
        setViewCategory={setViewCategory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setShowOverlay={setShowOverlay}
      />

      {/* Project Lists */}
      <main className="grid grid-cols-6 mt-4 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => <ProjectCard key={project.file_id} project={project} setRevalidateProjects={setRevalidateProjects} revalidateProjects={revalidateProjects} />)
        ) : (
          <p className="col-span-6 text-center text-gray-500">{loading ? <Loading/>:"No projects found."}</p>
        )}
      </main>
       {/* The Overlay Div */}
      {showOverlay && (
    
        <Modals 
          setShowOverlay={setShowOverlay}
          step={step} 
          setStep={setStep}
          revalidateProjects={revalidateProjects}
          setRevalidateProjects={setRevalidateProjects}
        />
      )}
    </div>
  );
  
};

export default Dashboard;