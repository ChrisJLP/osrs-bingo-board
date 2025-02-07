import pool from "../config/db.js";

export const updateTileProgress = async (req, res) => {
  // Expected: { team_board_id, tile_id, progress, completed }
  const { team_board_id, tile_id, progress, completed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE TeamBoardTiles
       SET progress = $1, completed = $2
       WHERE team_board_id = $3 AND tile_id = $4 RETURNING *`,
      [progress, completed, team_board_id, tile_id]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: "Tile progress not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating tile progress:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reorderTiles = async (req, res) => {
  // Expected: { board_id, newOrder: [tileId1, tileId2, ...] }
  const { board_id, newOrder } = req.body;
  try {
    for (let index = 0; index < newOrder.length; index++) {
      await pool.query(
        `UPDATE Tiles SET position = $1 WHERE id = $2 AND board_id = $3`,
        [index, newOrder[index], board_id]
      );
    }
    res.json({ message: "Tile order updated successfully" });
  } catch (err) {
    console.error("Error reordering tiles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
