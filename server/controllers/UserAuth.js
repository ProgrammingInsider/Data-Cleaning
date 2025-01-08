import { queryDb } from '../DB_methods/query.js';
import { BadRequestError, ConventionError,UnauthenticatedError, NoContentError, ForbiddenError } from '../errors/index.js';
import { checkArrayLength } from '../utils/checkArrayLength.js';
import bcrypt from 'bcryptjs'
import { tokenService } from '../utils/tokenService.js';

// REGISTER
export const Register = async(req, res) => {
    
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    
    if(!firstName || !lastName || !email || !password || !confirmPassword){
        throw new BadRequestError("Please Provide all require information")
    }
    
    if (password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match');
    }

    const existanceSql = `SELECT email FROM user WHERE email = "${email}"`;

    const getResult = await queryDb(existanceSql);
    const isExist = checkArrayLength(getResult);

    if(isExist){
        throw new ConventionError(`There is a user registration with this ${email} Email`)
    }else{

        // INSERT QUERY    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const insertSql = `INSERT INTO user (email,firstName,lastName,password) VALUES ("${email}","${firstName}","${lastName}","${hashedPassword}")`

        const postResult = await queryDb(insertSql);

        if(postResult.affectedRows){
            res.status(200).json({status:true, message:`Registered Successfully`}) 
        }
    }
}

// LOGIN
export const Login = async(req, res) => {
    const {email,password} = req.body;
    

    if(!email || !password){
        throw new BadRequestError("Please Provide email and password")
    }

    const sql = `SELECT * FROM user WHERE email = "${email}"`
    const queryResult = await queryDb(sql);
    const isExist = checkArrayLength(queryResult);
        if(isExist){
            const isMatch = await bcrypt.compare(password,queryResult[0].password)
    
                if(isMatch){

                const {email, firstName, lastName} = queryResult[0];

                // create access token
                const payload = {email, firstName, lastName}
                const {accessToken, refreshToken} = tokenService(payload)
                
                // store refresh token in a database
                const refreshSql = `UPDATE user SET refreshToken = "${refreshToken}" WHERE email="${email}"`

                
                
                await queryDb(refreshSql);
                
                res.cookie('dataCleaningJWT', refreshToken, {
                    httpOnly: true,
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'None'
                });
                
                
                res.status(200).json({EmailMatch:true, PasswordMatch:true, payload, accessToken}) 

                }else{

                res.status(200).json({EmailMatch:true, PasswordMatch:false}) 
                }
        }else{
            res.status(200).json({EmailMatch:false}) 
        }
}

// LOGOUT
export const Logout = async (req,res)=>{
    const cookies = req.cookies;

    console.log(cookies);
    
    if(!cookies?.dataCleaningJWT){
        throw new NoContentError("No Content to send back");
    }
    
    const refreshToken = cookies.dataCleaningJWT;
    const sql = `SELECT * FROM user WHERE refreshToken = "${refreshToken}"`;
    const queryResult = await queryDb(sql);
    const isExist = checkArrayLength(queryResult);
    console.log(sql);
    
        if(isExist){
            const sql = `UPDATE user SET refreshToken = null WHERE refreshToken="${refreshToken}"`
            await queryDb(sql);    
            res.clearCookie('dataCleaningJWT',{httpOnly:true, secure:true, sameSite:'None'})
            throw new NoContentError("No Content to send back");    
        } else{
            res.clearCookie('dataCleaningJWT',{httpOnly:true, secure:true, sameSite:'None'})
            throw new NoContentError("No Content to send back");
        }
}

// REFRESH TOKEN
// export const Refresh = async (req,res)=>{
//     const cookies = req.cookies;

//     console.log(req);
    

//         if(!cookies?.dataCleaningJWT){
//         throw new UnauthenticatedError("No token Provided");
//         }
        
//         const refreshToken = cookies.dataCleaningJWT;
//         console.log({refreshToken});
        
//         const sql = `SELECT * FROM user WHERE refreshToken = "${refreshToken}"`;
//         const queryResult = await queryDb(sql);
//         const isExist = checkArrayLength(queryResult);
//         console.log({queryResult});

//         if(isExist){
//             try{
                    
//                     const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)

//                     if(!decode){
//                         throw new ForbiddenError("Forbidden Request");
//                     }else{
//                         // create access token
//                         const payload = {userId:queryResult[0].userId,email:queryResult[0].email, firstName:queryResult[0].firstName, lastName:queryResult[0].lastName}
                        
//                         const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
                        
//                         res.json({payload, accessToken:token})
//                     }
                    
//             }catch(err){                
//                 throw new ForbiddenError("Forbidden Request");
//             }
//         } else{
//             throw new ForbiddenError("Forbidden Request");
//         }    
// }

