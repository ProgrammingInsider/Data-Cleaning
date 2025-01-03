'use server'

import { z } from "zod";

type RegisterResponse = {
    message: string;
    errors?: Record<string, string[] | undefined>,
};

export const createUser = async (
  state: { message: string | null, errors?: Record<string, string[] | undefined> },
  formData: FormData
): Promise<RegisterResponse> => {

    const UserValidation = z.object({
        firstName: z.string().nonempty("First Name is required."),
        lastName: z.string().nonempty("Last Name is required."),
        email: z.string().email("Invalid email address."),
        password: z.string().min(8, "Password must be at least 8 characters long."),
        confirmPassword: z.string().nonempty("Confirm Password is required."),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], 
    });


    try {
        const formValues = Object.fromEntries(formData.entries());
        UserValidation.parse(formValues);
        
        const inputValues = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }
        
        console.log(inputValues);
            
            return { message: "Registered Successfully" };

    } catch (error) {
        if (error instanceof z.ZodError) {
            
            return {
                message: '',
                errors: error.flatten().fieldErrors,
            };
        }
        return {
            message: '',
            errors: {root:["Something went wrong. Please try again!"]},
        };
    }
};

type LoginResponse = {
    message: string,
    errors?: Record<string, string[] | undefined>,
    isLoggedIn?: boolean,
    accessToken?: string,
    userId?: string
};

export const login =  async(
    state:{
        message: string | null, 
        errors?: Record<string, string [] | undefined>,
        isLoggedIn?:boolean,
        accessToken?: string | null,
        userId?: string | null
    },
        formData:FormData): Promise<LoginResponse> =>  {
    const inputValidation = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().nonempty('Password is required')
    })
    const formValues = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    try{
        inputValidation.parse(formValues);

                    return{
                        message:'LoggedIn Succesfully',
                        isLoggedIn:true,
                    }
                    
    }catch(error){

        if(error instanceof z.ZodError){
            return {
                message: '',
                isLoggedIn:false,
                errors: error.flatten().fieldErrors,
            }
        }

        return {
            message: 'An unexpected error occurred. Please try again later.',
            isLoggedIn:false,
            errors: {root:['Something went wrong, Please try again!']}
        }
    }
}
