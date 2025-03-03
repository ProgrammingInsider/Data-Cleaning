import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { userTable, filesTable, actionsTable, issuesTable, schemaTable } from './creation.js';

dotenv.config();

// CREATE POOL CONNECTION
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,  
    queueLimit: 0
});

export default pool;

// CHECK DATABASE CONNECTION
export const Db_connection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to the database successfully.");

        await userTable(pool);
        await filesTable(pool);
        await actionsTable(pool);
        await issuesTable(pool);
        await schemaTable(pool);
        
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
    }
};
