import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const pool = await sql.connect(config);

pool.connect()
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

export const db = pool;