import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const verifyBoardPassword = async (req, res, next) => {
  try {
    const providedPassword =
      req.headers["x-board-password"] || req.body.password;
    if (!providedPassword) {
      return res.status(401).json({ error: "Password required" });
    }

    let board;

    // Check if it's a MainBoard
    if (req.params.id) {
      board = await prisma.mainBoard.findUnique({
        where: { id: req.params.id },
        select: { password: true }, // Only fetch the password
      });

      if (!board) {
        return res.status(404).json({ error: "Board not found" });
      }
    }
    // Check if it's a TeamBoard
    else if (req.body.team_board_id) {
      board = await prisma.teamBoard.findUnique({
        where: { id: req.body.team_board_id },
        select: { password: true },
      });

      if (!board) {
        return res.status(404).json({ error: "Team board not found" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Board ID not provided for password verification" });
    }

    // If the board has no password set, allow access
    if (!board.password) return next();

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(providedPassword, board.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    next();
  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
