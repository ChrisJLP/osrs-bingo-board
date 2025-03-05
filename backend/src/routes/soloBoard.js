import express from "express";
import { createSoloBoard } from "../controllers/soloBoardController.js";

const router = express.Router();

router.post("/", createSoloBoard);

export default router;
