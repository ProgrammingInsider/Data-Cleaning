'use client'

import {startTransition, useActionState, useEffect, useState} from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { UploadFile } from '@/utils/fileActions';

type categoriesType = {
    category:string;
}

const categories: categoriesType[]  = [
    {category:"Machine Learning"},
    {category:"Analytics"},
    {category:"Artificial Intellegence"},
    {category:"Research"}
]

const initialState : {message: string | null, isCreated: boolean, errors?: Record<string, string[] | undefined>,} = {
    message: null,
    isCreated: false,
    errors:{},
  }

const Upload = ({setShowOverlay, setRevalidateProjects,revalidateProjects}:{setShowOverlay:React.Dispatch<boolean>, setRevalidateProjects:React.Dispatch<boolean>,revalidateProjects:boolean}) => {
    const [showCategory, setShowCategory] = useState(false);
    const [category, setCategory] = useState('');
    const [desc, setDesc] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [showSuccessMessage,setShowSuccessMessage] = useState(false);
    const [state, formAction] = useActionState(UploadFile, initialState);
    const [loading, setLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
            e.preventDefault();
        
            const formData = new FormData(e.currentTarget as HTMLFormElement);
        
            setLoading(true);
            if(uploadedFile){
                startTransition(() => {
                formAction(formData);
                setLoading(false);
                setRevalidateProjects(!revalidateProjects);
                setUploadedFile(null)
                });
            }else{
                setFileError("File upload cannot be empty. Only CSV or Excel files are allowed.");    
            }
            
        }

        useEffect(() => {
            if (state?.message) {
                setTimeout(() => {
                    // formAction({ message: null, isCreated: false, errors: {} });
                }, 5000); 
            }
        }, [state, formAction]);

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            
            if(["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file?.type || '')){
                setFileError("");
                if (file) {
                    setUploadedFile(file);
                }
            }else{
                setFileError("Only CSV or Excel files are allowed.");
            }
            
        };

        useEffect(() => {
            if (state?.message) {
                setShowSuccessMessage(true); 
                setCategory('');
                setDesc('');
                setUploadedFile(null);
        
                const timeout = setTimeout(() => {
                    setShowSuccessMessage(false); 
                }, 5000);
        
                return () => clearTimeout(timeout); 
            }
        }, [state?.message, state?.errors?.root]);
        
        

    return (
        <div className='sectionBg w-11/12 max-w-2xl p-6 rounded-lg my-11'>
            <div className='flex justify-between items-center mb-10'>
                <h1 className='heading font-bold text-xl'> Upload Data</h1>
                <IoIosClose className='text-2xl cursor-pointer' onClick={()=>{setShowOverlay(false)}} />
            </div>
                {showSuccessMessage && state?.message && (
                    <div className="flex gap-2">
                        <p className="success-message text-green-500 mb-4 font-bold">
                            {state.message}
                        </p>
                    </div>
                )}
            { showSuccessMessage && state?.errors?.root && <>
                <div className="flex gap-2">
                    <p className="error-message font-bold mb-4 text-sm">
                        {state?.errors?.root}
                    </p>
                </div>
            </>}
            <form onSubmit={handleSubmit} method='POST' className='grid grid-cols-2 gap-8'>
                <div className='flex flex-col col-span-2 sm:col-span-1'>
                    <p className='heading text-sm flex gap-1 items-center font-bold'><FaFileAlt className='text-green-500' /> Upload File (CSV, Excel)</p>
                    <label htmlFor='file' className='flex flex-col gap-2 justify-center items-center border-2 border-dashed border-gray-500 h-36 rounded-md mt-7 cursor-pointer'>
                        <FiUpload className='font-bold text-6xl primary' />
                        <p className='text-base font-bold heading'>Click to select files</p>
                    <input type='file' className='hidden' name='file' id='file' onChange={handleFileChange} />
                    </label>
                    {(state.errors?.file || fileError) && (
                        <p className="error-message mb-2">{state.errors?.file || fileError}</p>
                    )}
                    <ul className='inputBg relative rounded-md px-1 mt-6'>
                        <div className='flex justify-between items-center cursor-pointer p-2' onClick={()=>setShowCategory(!showCategory)}>
                            <li className='text-base heading' >{category || 'Select Category'}</li>
                            <IoIosArrowDown />
                        </div>
                        {
                            showCategory && (
                                <ul className='secondaryBg p-1 absolute w-full'>
                                    {
                                        categories.map((eachCategory, index)=>{
                                            return (
                                                <li 
                                                onClick={()=>{setCategory(eachCategory.category);setShowCategory(false)}}
                                                key={index}
                                                className='p-1 text-base
                                                cursor-pointer
                                                hover:sectionBg'

                                                >
                                                    {eachCategory.category}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            )
                        }
                    </ul>
                    <input type='text' className='hidden' name='category' id='category' value={category} />
                    {state.errors && state.errors.category && (
                        <p className="error-message mb-2">{state.errors.category}</p>
                    )}
                </div>
                <div className='col-span-2 sm:col-span-1'>
                    <div>
                        <label className='heading font-bold text-lg inline-block mb-2'>Project Description</label>
                        <textarea name='description' rows={2} placeholder='Enter project description' className='w-full inputBg p-2 rounded-md' value={desc} onChange={(e)=>{setDesc(e.target.value)}}>
                        </textarea>
                        {state.errors && state.errors.description && (
                            <p className="error-message mb-2">{state.errors.description}</p>
                        )}
                    </div>
                    <div>
                        <label className='heading font-bold text-lg inline-block mb-2 mt-3'>Uploaded Files</label>
                        <div className='inputBg min-h-32 p-2 rounded-md pt-4'>
                            {uploadedFile ? (
                                <div className='flex justify-between items-center sectionBg p-2 rounded-sm text-left border-b-2 border-green-500'>
                                    <p className='text-sm font-bold'>{uploadedFile.name}</p>
                                    <IoIosClose className='text-2xl cursor-pointer' onClick={()=>{setUploadedFile(null)}} />
                                </div>
                            ) : (
                                <p className='text-center'>No files uploaded yet</p>
                            )}
                        </div>
                    </div>
                    <div className='flex justify-end gap-2 mt-5'>
                        <button className='secondaryBtn' onClick={()=>{setShowOverlay(false)}}>Cancel</button>
                        <button type='submit' className='primaryBtn flex gap-3 items-center' disabled={loading}>
                            {loading ? (
                                <AiOutlineLoading3Quarters className='animate-spin text-xl' />
                            ) : (
                                <FiUpload className='font-bold text-xl' />
                            )}
                            Upload
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Upload