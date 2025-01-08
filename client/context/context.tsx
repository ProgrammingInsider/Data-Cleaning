'use client'

import { createContext, useState, useContext, useEffect } from "react";

interface Payload {
    email: string;
    firstName: string;
    lastName: string;
}

interface UserContextType {
    user: Payload | null;
    setUser: React.Dispatch<React.SetStateAction<Payload | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

const ContextAPI: React.FC<{children:React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<Payload | null>(null);

    useEffect(() => {
        const getUserFromCookies = () => {
            try {
                const cookies = document.cookie.split("; ");
                const payloadCookie = cookies.find(row => row.startsWith("payload="));

                if (payloadCookie) {
                    const payloadValue = payloadCookie.split("=")[1];
                    const parsedPayload: Payload = JSON.parse(decodeURIComponent(payloadValue)); // ✅ Parse JSON
                    setUser(parsedPayload);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if(!user){
            getUserFromCookies();
        }

    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useGlobalContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextAPI provider");
    }
    return context;
}


export default ContextAPI;