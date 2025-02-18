"use server"
import { axiosPrivate } from '@/services/axios';
import { cookies } from "next/headers";
import { AxiosError } from 'axios';

interface ErrorResponse {
    message?: string;
}

export const CleanData = async(fileId: string, chat:string | null) => {

        const cookieStore = await cookies();
        const accessTokenCookie = cookieStore.get("accessToken")?.value;
        
        try {
            const { data } = await axiosPrivate.post(
                "/cleandata",
                { fileId, chat },
                {
                    headers: {
                        Authorization: `Bearer ${accessTokenCookie}`,
                    },
                }
            );
    
            if (data.status === true) {
                return { success: true, data };
            } else {
                console.error("Error detected in response:", data.message);
                return { success: false, message: data.message || "Unknown error occurred" };
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const { response } = error as AxiosError<ErrorResponse>;
    
                if (response) {
                    const { status, data } = response;
    
                    if (status === 400) {
                        console.error("Bad request error:", data?.message || "Invalid request parameters.");
                        return { success: false, message: data?.message || "Bad request." };
                    }
    
                    if (status === 401) {
                        console.error("Unauthorized access:", data?.message || "Invalid or expired token.");
                        return { success: false, message: data?.message || "Unauthorized access." };
                    }
    
                    if (status === 404) {
                        console.error("Resource not found:", data?.message || "File not found.");
                        return { success: false, message: data?.message || "File not found." };
                    }
    
                    if (status === 500) {
                        console.error("Internal server error:", data?.message || "An error occurred on the server.");
                        return { success: false, message: data?.message || "Internal server error." };
                    }
    
                    console.error("Unhandled status:", status, "Message:", data?.message);
                    return { success: false, message: data?.message || "An unexpected error occurred." };
                } else if (error.request) {
                    console.error("No response from server. Possible network error.");
                    return { success: false, message: "No response from server. Please check your network." };
                }
            }
    
            console.error("Error in request setup:", (error as Error).message);
            return { success: false, message: (error as Error).message || "Request setup failed." };
        }
    
    // return response; 
}


export const DeleteAction = async (fileId:string,actionId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    console.log(fileId,actionId);
    
    try{

        const {data} = await axiosPrivate.delete(`/deleteaction?fileId=${fileId}&actionId=${actionId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    }catch(error){

    if(error){
        console.log(error);
        
    }
    }
}


export const DeleteAllAction = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{

        const {data} = await axiosPrivate.delete(`/deleteallaction?fileId=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    }catch(error){

    if(error){
        console.log(error);
        
    }
    }
}