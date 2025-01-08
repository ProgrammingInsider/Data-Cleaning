'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import { LuLayoutDashboard } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { FaBarsStaggered } from "react-icons/fa6";
import { GoProjectSymlink } from "react-icons/go";
import { FaDatabase } from "react-icons/fa6";
import { useGlobalContext } from '@/context/context';

const SideMenu = () => {
    const[isMenuHide, setIsMenuHide] = useState<boolean>(false);
    const {user} = useGlobalContext();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setIsMenuHide(true);
            } else {
                setIsMenuHide(false);
            }
        };
    
        handleResize();
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

  return (
    <div className='flex flex-col justify-between relative min-h-screen'>
        <nav className={`h-full flex flex-col absolute sm:relative background ${isMenuHide ? 'items-center w-14 px-0' :'w-60 max-w-60 px-3'}`}>
            <header 
            className={`flex items-center mb-1 heading font-bold text-lg py-2 px-3 rounded-lg cursor-pointer hover:secondaryBtnText ${isMenuHide ? 'justify-center' :'justify-end'}`} onClick={()=>setIsMenuHide(!isMenuHide)}>
                <FaBarsStaggered />
            </header>
            <div className={`flex items-center sectionBg rounded-md h-12 border border-gray-700 px-6 mb-5 ${isMenuHide ? 'hidden' :'block'}`}>
                <p className='text-center heading font-semibold'>{user?.firstName}&nbsp;{user?.lastName}</p>
            </div>
            <Link 
            href={'/projects'} 
            className={`sideMenuLink ${isMenuHide ? 'justify-center  py-1 px-1' :'justify-normal'}`}>
                <GoProjectSymlink />
                <h1 className={`${isMenuHide ? 'hidden' :'block'}`}>Projects</h1>
            </Link>
            <Link 
            href={'#'} 
            className={`sideMenuLink ${isMenuHide ? 'justify-center  py-1 px-1' :'justify-normal'}`}>
                <LuLayoutDashboard />
                <h1 className={`${isMenuHide ? 'hidden' :'block'}`}>Dashboard</h1>
            </Link>
            <Link 
                href={'#'} 
                className={`sideMenuLink ${isMenuHide ? 'justify-center  py-1 px-1' :'justify-normal'}`}>
                <FaDatabase />
                <h1 className={`${isMenuHide ? 'hidden' :'block'}`}>Datasets</h1>
            </Link>
            <Link 
                href={'#'} 
                className={`sideMenuLink ${isMenuHide ? 'justify-center  py-1 px-1' :'justify-normal'}`}>
                <TbReportSearch />
                <span className={`${isMenuHide ? 'hidden' :'block'}`}>Reports</span>
            </Link>
        </nav>

    </div>
  )
}

export default SideMenu