'use server'
import { cookies } from "next/headers";
import { axiosPrivate } from '@/services/axios';

export const GetSchema = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{

        const {data} = await axiosPrivate.get(`/getschema?fileid=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return data;
    }catch(error){

    if(error){
        return {
            message: "Something went wrong. Please try again!",
        };
    }
    }
}

export const GetIssues = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{
        
        const {data} = await axiosPrivate.get(`/getissue?fileid=${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return data;
    }catch(error){
        
        if(error){
        return {
            message: "Something went wrong. Please try again!",
        };
    }
    }
}