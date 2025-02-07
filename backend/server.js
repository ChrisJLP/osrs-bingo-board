import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

console.log("DATABASE_URL in use:", process.env.DATABASE_URL);
console.log("Current working directory:", process.cwd());
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

import boardRoutes from "./src/routes/bingoBoard.js";
import tileRoutes from "./src/routes/tile.js";
import leaderboardRoutes from "./src/routes/leaderboard.js";
import wikiRoutes from "./src/routes/wikiSearch.js";

app.use("/bingo-board", boardRoutes);
app.use("/tile", tileRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/wiki-search", wikiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
