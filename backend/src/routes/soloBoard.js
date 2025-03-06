import express from "express";
import {
  createSoloBoard,
  getSoloBoard,
  updateSoloBoard,
} from "../controllers/soloBoardController.js";

const router = express.Router();

router.post("/", createSoloBoard);
router.get("/:name", getSoloBoard);
router.put("/:name", updateSoloBoard);

export default router;
