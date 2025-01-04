'use server';
import z, { ZodError } from 'zod';

type UploadResponse = {
    message: string | null;
    isCreated: boolean;
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

        console.log(inputValues);

        return {
            message: "Uploaded Successfully",
            isCreated: true
        };
    }catch(error){
        if (error instanceof ZodError) {
            return {
                message: '',
                isCreated: false,
                errors: error.flatten().fieldErrors,
            };
        }
        console.error("Unexpected Error:", error);
        return {
            message: '',
            isCreated: false,
            errors: { root: ["Something went wrong. Please try again!"] },
        };
    }

}