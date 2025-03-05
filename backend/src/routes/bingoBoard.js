// import express from "express";
// const router = express.Router();
// import * as boardController from "../controllers/boardController.js";
// import * as authMiddleware from "../middleware/auth.js";

// router.get("/test", (req, res) => {
//   res.send("Bingo Board route is working");
// });

// // GET /bingo-board/:id
// router.get("/:id", boardController.getBoard);

// // POST /bingo-board
// router.post("/", boardController.createBoard);

// // PUT /bingo-board/:id (requires password)
// router.put(
//   "/:id",
//   authMiddleware.verifyBoardPassword,
//   boardController.updateBoard
// );

// // DELETE /bingo-board/:id (requires password)
// router.delete(
//   "/:id",
//   authMiddleware.verifyBoardPassword,
//   boardController.deleteBoard
// );

// export default router;
