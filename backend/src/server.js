import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
