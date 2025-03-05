import express from "express";
import {
  createSoloBoard,
  getSoloBoard,
} from "../controllers/soloBoardController.js";

const router = express.Router();

router.post("/", createSoloBoard);
router.get("/:name", getSoloBoard);

export default router;
