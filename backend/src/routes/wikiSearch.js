import express from "express";
const router = express.Router();
import * as wikiController from "../controllers/wikiController.js";

// GET /wiki-search?query=...
router.get("/test", (req, res) => {
  res.send("wiki search route is working");
});

router.get("/", wikiController.searchWiki);

export default router;
