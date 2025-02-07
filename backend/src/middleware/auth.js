import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const verifyBoardPassword = async (req, res, next) => {
  try {
    const providedPassword =
      req.headers["x-board-password"] || req.body.password;
    if (!providedPassword) {
      return res.status(401).json({ error: "Password required" });
    }

    let boardId;
    // Check if this is a MainBoard route
    if (req.params.id) {
      boardId = req.params.id;
      const result = await pool.query(
        "SELECT password FROM MainBoards WHERE id = $1",
        [boardId]
      );
      if (!result.rowCount) {
        return res.status(404).json({ error: "Board not found" });
      }
      const hashedPassword = result.rows[0].password;
      if (!hashedPassword) return next(); // no password set

      const isMatch = await bcrypt.compare(providedPassword, hashedPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else if (req.body.team_board_id) {
      boardId = req.body.team_board_id;
      const result = await pool.query(
        "SELECT password FROM TeamBoards WHERE id = $1",
        [boardId]
      );
      if (!result.rowCount) {
        return res.status(404).json({ error: "Team board not found" });
      }
      const hashedPassword = result.rows[0].password;
      if (!hashedPassword) return next();

      const isMatch = await bcrypt.compare(providedPassword, hashedPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      return res.status(400).json({
        error: "Board id not provided for password verification",
      });
    }
    next();
  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
