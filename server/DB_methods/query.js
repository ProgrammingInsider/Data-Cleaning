import pool from "../DB/db.js";

export const queryDb = async (sql, params = []) => {
    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (error) {
        console.error("Database Query Error:", error);
        throw error;
    }
};
