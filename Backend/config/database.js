import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log("Connect success!");
        client.release();
    } catch (error) {
        console.error("Error", error.message);
    }
}

checkDatabaseConnection();