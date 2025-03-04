import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateTileProgress = async (req, res) => {
  // Expected: { team_board_id, tile_id, progress, completed }
  const { team_board_id, tile_id, progress, completed } = req.body;

  try {
    const updatedTile = await prisma.teamBoardTile.updateMany({
      where: {
        teamBoardId: team_board_id,
        tileId: tile_id,
      },
      data: {
        progress,
        completed,
      },
    });

    if (updatedTile.count === 0) {
      return res.status(404).json({ error: "Tile progress not found" });
    }

    res.json({ message: "Tile progress updated successfully" });
  } catch (err) {
    console.error("Error updating tile progress:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reorderTiles = async (req, res) => {
  // Expected: { board_id, newOrder: [tileId1, tileId2, ...] }
  const { board_id, newOrder } = req.body;

  try {
    // Use a batch update operation
    const updateOperations = newOrder.map((tileId, index) =>
      prisma.tile.update({
        where: {
          id: tileId,
          boardId: board_id,
        },
        data: {
          position: index,
        },
      })
    );

    // Execute all updates in parallel
    await prisma.$transaction(updateOperations);

    res.json({ message: "Tile order updated successfully" });
  } catch (err) {
    console.error("Error reordering tiles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
