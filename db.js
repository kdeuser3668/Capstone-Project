const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  options: {
    encrypt: true, // AWS requires this
    trustServerCertificate: false,
  },
};

async function getPool() {
  try {
    return await sql.connect(config);
  } catch (err) {
    console.error("SQL connection error:", err);
    throw err;
  }
}

module.exports = { sql, getPool };


