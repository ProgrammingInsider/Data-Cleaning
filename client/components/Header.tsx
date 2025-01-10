'use client';

import { useGlobalContext } from '@/context/context';
import Link from 'next/link';
import { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
// import { MdOutlineToggleOff } from "react-icons/md";
// import { MdOutlineToggleOn } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { FaCircleUser } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { logout } from '@/utils/authActions';


const Header = () => {
    // const [isDarkMode, setDarkMode] = useState<boolean>(false)
    const {user, setUser} = useGlobalContext();
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const route = useRouter();

    // useEffect(() => {
        
    //     const savedTheme = localStorage.getItem('theme');
    //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    //     if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
    //         document.documentElement.classList.add('dark');
    //         setDarkMode(true);
    //     } else {
    //         document.documentElement.classList.remove('dark');
    //         setDarkMode(false);
    //     }
    // }, []);

    // Toggle theme on button click
    // const toggleTheme = () => {
    //     const html = document.documentElement;
    //     if (html.classList.contains('dark')) {
    //     html.classList.remove('dark');
    //     localStorage.setItem('theme', 'light'); 
    //     setDarkMode(false)
    //     } else {
    //     html.classList.add('dark');
    //     localStorage.setItem('theme', 'dark'); 
    //     setDarkMode(true)
    //     }
    // };

    const handleLogout = async () => {
        try {
            const  result = await logout();
            
            if (result) {
                console.log("User logged out successfully");
                setUser(null); 
                setIsMenuVisible(false)
                route.push("/")
            }
        } catch (error) {
            console.log(error);
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
        <section className='h-16 flex items-center px-5 z-30'>
            <header className='max-w-7xl mx-auto flex justify-between items-center w-full'>
                <Link href={"/"} className='heading font-bold text-2xl'>Sweepo</Link>
                <nav className='flex items-center gap-3'>
                    <div className={`flex flex-col pt-24 items-center gap-3 text-base fixed top-0 left-0 bottom-0 background sm:bg-transparent w-full z-50 sm:flex-row sm:pt-0 sm:relative ${isMenuVisible ? 'flex' : 'hidden sm:flex'} `}>
                        <IoCloseSharp className='fixed right-4 top-4 text-2xl font-bold cursor-pointer sm:hidden' onClick={() => setIsMenuVisible(false)} />
                        <Link href={"#"} className={`font-semibold heading `} onClick={() => setIsMenuVisible(false)}>How it works</Link>
                        <Link href={"#"} className={`font-semibold heading `} onClick={() => setIsMenuVisible(false)}>About Us</Link>
                        <Link href={"#"} className={`font-semibold heading `} onClick={() => setIsMenuVisible(false)}>Contact Us</Link>
                        {
                            user
                            ? (<Link href={"#"} onClick={handleLogout} className='font-semibold heading' >Signout</Link>)
                            : (<Link href={"/login"} className="font-semibold heading" onClick={() => setIsMenuVisible(false)}>Signin</Link>)
                        }
                        
                    </div>
                    <GiHamburgerMenu className='heading text-2xl cursor-pointer sm:hidden' onClick={() => setIsMenuVisible(true)} />
                    {user && <Link title='dashboard' href={"/projects"}>
                        <FaCircleUser className='heading text-xl cursor-pointer' />
                    </Link>}
                    {/* <div className='cursor-pointer'>
                    {
                        isDarkMode
                        ?(<MdOutlineToggleOff className='primary text-2xl' onClick={()=>{setDarkMode(false);toggleTheme()}} />)
                        :(<MdOutlineToggleOn className='primary text-2xl' onClick={()=>{setDarkMode(true);toggleTheme()}}/>)
                    }
                    </div> */}
                </nav>

            </header>
        </section>
        </>
    );
};

export default Header;
