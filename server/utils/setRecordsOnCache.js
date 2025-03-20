import client from "../config/redis.js";

export async function setRecordsOnCache(records, userId, fileId) {
    const key = `dataset:${userId}&${fileId}`;  
    const recordsString = JSON.stringify(records); 
    const expirySeconds = 30 * 24 * 60 * 60;

    await client.set(key, recordsString, { EX: expirySeconds }); 
}