import { queryDb } from '../DB_methods/query.js';
import { BadRequestError, ConventionError,UnauthenticatedError, NoContentError, ForbiddenError } from '../errors/index.js';
import bcrypt from 'bcryptjs'
import { tokenService } from '../utils/tokenService.js';

// REGISTER
export const Register = async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // VALIDATE INPUT
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return next(new BadRequestError("Please provide all required information."));
    }

    if (password !== confirmPassword) {
        return next(new BadRequestError('Passwords do not match.'));
    }

    // CHECK IF USER EXISTS
    const existanceSql = `SELECT email FROM user WHERE email = ?`;
    const getResult = await queryDb(existanceSql, [email]);

    if (getResult.length > 0) {
        return next(new ConventionError(`User with email ${email} already exists.`));
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // INSERT USER INTO DATABASE
    const insertSql = `INSERT INTO user (email, firstName, lastName, password) VALUES (?, ?, ?, ?)`;
    const postResult = await queryDb(insertSql, [email, firstName, lastName, hashedPassword]);

    if (postResult.affectedRows) {
        return res.status(201).json({ status: true, message: "Registered successfully" });
    } else {
        return next(new Error("Failed to register user."));
    }
};

// LOGIN
export const Login = async (req, res, next) => {
    const { email, password } = req.body;

    // VALIDATE INPUT
    if (!email || !password) {
        return next(new BadRequestError("Please provide email and password."));
    }

    // CHECK IF USER EXISTS
    const sql = `SELECT * FROM user WHERE email = ?`;
    const queryResult = await queryDb(sql, [email]);

    if (queryResult.length === 0) {
        return res.status(200).json({ EmailMatch: false });
    }

    const isMatch = await bcrypt.compare(password, queryResult[0].password);

    if (isMatch) {
        const { email, firstName, lastName } = queryResult[0];

        // Create access token
        const payload = { email, firstName, lastName };
        const { accessToken, refreshToken } = tokenService(payload);

        // Store refresh token in the database
        const refreshSql = `UPDATE user SET refreshToken = ? WHERE email = ?`;
        await queryDb(refreshSql, [refreshToken, email]);

        // Set refresh token in cookies
        res.cookie('dataCleaningJWT', refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            secure: true,
            sameSite: 'None',
        });

        return res.status(200).json({ EmailMatch: true, PasswordMatch: true, payload, accessToken });
    } else {
        return res.status(200).json({ EmailMatch: true, PasswordMatch: false });
    }
};

// LOGOUT
export const Logout = async (req, res, next) => {
    const cookies = req.cookies;

    // Check if the cookie exists
    if (!cookies?.dataCleaningJWT) {
        return next(new NoContentError("No content to send back"));
    }

    const refreshToken = cookies.dataCleaningJWT;

    // Check if the refresh token exists in the database
    const sql = `SELECT * FROM user WHERE refreshToken = ?`;
    const queryResult = await queryDb(sql, [refreshToken]);

    // If the refresh token is found in the database, update the user record
    if (queryResult.length > 0) {
        const updateSql = `UPDATE user SET refreshToken = NULL WHERE refreshToken = ?`;
        await queryDb(updateSql, [refreshToken]);

        // Clear the cookie
        res.clearCookie('dataCleaningJWT', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        return res.status(204).send(); // No content response
    }

    // If the refresh token is not found, clear the cookie and send a no content response
    res.clearCookie('dataCleaningJWT', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    return res.status(204).send(); // No content response
};


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

