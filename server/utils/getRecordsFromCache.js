import client from "../config/redis.js";

export async function getRecordsFromCache(userId, fileId) {
    const key = `dataset:${userId}&${fileId}`;  
    const recordsString = await client.get(key); 
    if (recordsString) {
        return JSON.parse(recordsString); 
    }
    return null; 
}