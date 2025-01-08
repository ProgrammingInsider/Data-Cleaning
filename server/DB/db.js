import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config();

// FILES
import { database, userTable } from './creation.js';

// CREATE CONNECTION WITH DATABASE
// const con = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// })

// export default con;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,   // Allow up to 10 simultaneous connections
    queueLimit: 0
});

export default pool;

export const Db_connection = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            return;
        }
        console.log("Connected to the database successfully.");
        connection.release();
    });
};

// CHECK IF IT IS CONNECTED, IF IT CONNECTED CREATE DATABASE AND TABLES
// export const Db_connection = () => {
//     con.connect(function(err){
//         if(err) throw err;
//         console.log("Connected");
//         // console.log(userTable(con));
//     })
// }