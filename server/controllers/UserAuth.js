import { BadRequestError } from '../errors/index.js';

export const Register = async(req, res) => {
    
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    
    if(!firstName || !lastName || !email || !password || !confirmPassword){
        throw new BadRequestError('Please, Fill all provided input')
    }
    
    if (password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match');
    }

    res.status(201).json({message:"Successfully Registered", status:true});
}

export const Login = async(req, res) => {
    const {email,password} = req.body;

    
    if(!email || !password){
        throw new BadRequestError('Please, Fill all provided input')
    }

    res.status(200).json({message:"Successfully Loggedin", status:true});
}

export const RefreshToken = async(req, res) => {
    res.status(201).json({message:"Successfully Refreshed", status:true});
}

export const Logout = async(req, res) => {
    res.status(201).json({message:"Successfully Logged out", status:true});
}