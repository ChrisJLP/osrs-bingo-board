import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import soloBoardRoutes from "./src/routes/soloBoard.js";
import osrsHiscoresRouter from "./src/controllers/osrsHiscoresController.js";

dotenv.config({ path: path.join(process.cwd(), ".env") });

console.log("DATABASE_URL in use:", process.env.DATABASE_URL);
console.log("Current working directory:", process.cwd());
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/osrs-hiscores", osrsHiscoresRouter);
app.use("/solo-board", soloBoardRoutes);
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
