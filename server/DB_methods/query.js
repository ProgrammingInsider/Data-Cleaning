import pool from "../DB/db.js";

export const queryDb = async (sql) => {
    try{

        const resp = await new Promise((resolve,reject)=>{
            pool.query(sql,(err,result)=>{                
                if(err){
                    reject(err)
                }else{    
                    resolve(result)
                }
            })
        });
    
        return resp

    }catch(error){
        throw error
    }
}