const { Pool } = require("pg");
const fs = require("fs");
const { user, host, database, password, port } = require("./envConfig");
require("dotenv").config(); // Load environment variables

// ✅ PostgreSQL Connection Pool Configuration
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

// ✅ Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client:", err);
  process.exit(-1);
});

// ✅ Initialize database tables only once
const connection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database successfully");

    const initSql = fs.readFileSync("app/models/init.sql", "utf-8");
    await client.query(initSql);
    console.log("✅ All database tables initialized successfully");

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error(
      "❌ Error during database initialization:",
      err.message || err.stack
    );
  }
};

module.exports = {
  pool,
  connection,
};
