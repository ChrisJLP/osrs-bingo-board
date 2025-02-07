import pool from "../config/db.js";
console.log("DATABASE_URL in use:", process.env.DATABASE_URL);

export const getBoard = async (req, res) => {
  const boardId = req.params.id;
  try {
    // Use all lowercase for table names
    const boardResult = await pool.query(
      "SELECT id, name, rows, columns, color, bonus_points FROM public.mainboards WHERE id = $1",
      [boardId]
    );
    if (!boardResult.rowCount) {
      return res.status(404).json({ error: "Board not found" });
    }
    const board = boardResult.rows[0];

    // Fetch board tiles from "tiles" (lowercase)
    const tilesResult = await pool.query(
      "SELECT id, content, target, unit, position FROM public.tiles WHERE board_id = $1 ORDER BY position",
      [boardId]
    );
    board.tiles = tilesResult.rows;

    board.leaderboard = [];
    res.json(board);
  } catch (err) {
    console.error("Error fetching board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBoard = async (req, res) => {
  const { name, rows, columns, color, bonus_points, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO public.mainboards (name, rows, columns, color, bonus_points, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, rows, columns, color, bonus_points || 0, password || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const { name, rows, columns, color, bonus_points } = req.body;
  try {
    const result = await pool.query(
      "UPDATE public.mainboards SET name = $1, rows = $2, columns = $3, color = $4, bonus_points = $5 WHERE id = $6 RETURNING *",
      [name, rows, columns, color, bonus_points, boardId]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBoard = async (req, res) => {
  const boardId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM public.mainboards WHERE id = $1 RETURNING *",
      [boardId]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
