import express from "express";
const router = express.Router();
import * as leaderboardController from "../controllers/leaderboardController.js";

router.get("/test", (req, res) => {
  res.send("Leaderboard route is working");
});

// GET /contributions/:boardId
router.get("/contributions/:boardId", leaderboardController.getContributions);

// GET /leaderboard/:boardId
router.get("/:boardId", leaderboardController.getLeaderboard);

export default router;
