// test-db.js
require("dotenv").config();
const sql = require("mssql");

const config = {
  server: process.env.DB_HOST, // e.g. gameshelfserver.database.windows.net
  database: process.env.DB_NAME,
  user: process.env.DB_USER,   // format: youradmin@gameshelfserver
  password: process.env.DB_PASS,
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("✅ Connected to Azure SQL!");
    const result = await sql.query`SELECT GETDATE() AS CurrentDateTime`;
    console.log("⏱️ DB Server Time:", result.recordset[0].CurrentDateTime);
    await sql.close();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

connectToDatabase();
