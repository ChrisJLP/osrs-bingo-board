import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// (Optional) Test the connection:
pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Connected to DB at:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

export default pool;
