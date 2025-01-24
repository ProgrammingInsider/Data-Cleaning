'use server';
import { axiosPrivate } from '@/services/axios';
import z, { ZodError } from 'zod';
import { cookies } from "next/headers";
import { AxiosError } from 'axios';
// import { revalidatePath } from 'next/cache';

type UploadResponse = {
    message: string | null;
    errors?: Record<string, string[] | undefined>;
};

export const UploadFile = async (state: UploadResponse, formData: FormData): Promise<UploadResponse> => {
    

    const UploadValidation = z.object({
        file: z
            .instanceof(Blob, { message: "File upload is required." })
            .refine((file) => file.size > 0, "File upload cannot be empty.")
            .refine(
                (file) => ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.type),
                "Only CSV or Excel files are allowed."
            ),            
        category: z.string()
            .nonempty("Category is required."),
        description: z.string()
            .max(1000, "File description must not exceed 1000 characters.")
            .nonempty("File Description is required."),
    });

    const inputValues = {
        file: formData.get('file') as File,
        category: formData.get('category') as string,
        description: formData.get('description') as string
    };

    try{
        UploadValidation.parse(inputValues);

        const cookieStore = await cookies();
        const accessTokenCookie = cookieStore.get("accessToken")?.value;

        const {data} = await axiosPrivate.post("/upload",formData,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
                "Content-Type": "multipart/form-data",
            },
        });

        return {...data};
    }catch(error: unknown){
            
            if (error instanceof AxiosError) {
                
                const { response } = error;
                if (response) {
                    const { status, data } = response;
                    if (status === 400) {
                        return {
                            message: "",
                            errors: { root: [data?.message || "Invalid data."] },
                        };
                    } else if (status === 500) {
                        return {
                            message: "",
                            errors: { root: [data?.message || "Server error. Please try again later."] },
                        };
                    } else {
                        return {
                            message: "",
                            errors: { root: [data?.message || "Something went wrong. Please try again!"] },
                        };
                    }
                } else {
                    return {
                        message: "",
                        errors: { root: ["No response received from the server."] },
                    };
                }
            } else if (error instanceof ZodError) {
                return {
                    message: "",
                    errors: error.flatten().fieldErrors ,
                };
            } else {
                return {
                    message: "",
                    errors: { root: ["Something went wrong. Please try again!"] },
                };
            }
        }
        
}

export const GetFile = async () => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{

        const {data} = await axiosPrivate.get("/projects",{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    }catch(error){

    if(error){
        return {
            message: '',
            errors: { root: ["Something went wrong. Please try again!"] },
        };
    }
    }
}

export const DeleteFile = async (fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{

        const {data} = await axiosPrivate.delete(`/delete/${fileId}`,{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        // revalidatePath("/projects")
        return {data};
    }catch(error){

    if(error){
        return {
            message: '',
            errors: { root: ["Something went wrong. Please try again!"] },
        };
    }
    }
}

export const ErrorReport = async(fileId:string) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken")?.value;
    
    try{

        const {data} = await axiosPrivate.post("/errordetection",{fileId},{
            headers: {
                Authorization: `Bearer ${accessTokenCookie}`, 
            },
        });
        
        return {data};
    }catch(error){

        console.log(error);
        
    }
}