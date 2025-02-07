import pool from "../config/db.js";

export const getLeaderboard = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const result = await pool.query(
      `SELECT tm.name as player, lb.points as score
       FROM Leaderboard lb
       JOIN TeamMembers tm ON lb.member_id = tm.id
       WHERE lb.team_board_id = $1
       ORDER BY lb.points DESC`,
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContributions = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const result = await pool.query(
      `SELECT tm.name as player, c.tile_id, c.amount
       FROM Contributions c
       JOIN TeamMembers tm ON c.member_id = tm.id
       WHERE c.team_board_id = $1`,
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching contributions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
