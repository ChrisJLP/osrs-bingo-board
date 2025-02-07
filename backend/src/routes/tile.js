import express from "express";
const router = express.Router();
import * as tileController from "../controllers/tileController.js";
import * as authMiddleware from "../middleware/auth.js";

router.get("/test", (req, res) => {
  res.send("tile route is working");
});

// POST /tile/update-progress (requires password)
router.post(
  "/update-progress",
  authMiddleware.verifyBoardPassword,
  tileController.updateTileProgress
);

// POST /tile/reorder (requires password)
router.post(
  "/reorder",
  authMiddleware.verifyBoardPassword,
  tileController.reorderTiles
);

export default router;
