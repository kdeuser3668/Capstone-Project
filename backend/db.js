import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// tests connection, comment out prior to hosting
try {
  const client = await pool.connect();
  console.log("Connected to Neon PostgreSQL database.");
  client.release();
} catch (err) {
  console.error("Database connection failed:", err);
}