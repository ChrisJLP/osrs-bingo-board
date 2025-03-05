// backend/src/controllers/soloBoardController.js
import prisma from "../config/db.js";

export const createSoloBoard = async (req, res) => {
  try {
    const { name, rows, columns, tiles } = req.body;

    // Check if a board with this name already exists
    const existingBoard = await prisma.soloBoard.findUnique({
      where: { name },
    });

    if (existingBoard) {
      // Name is taken
      return res.status(409).json({ error: "Board name already taken" });
    }

    // Otherwise, create the new board
    const board = await prisma.soloBoard.create({
      data: {
        name,
        password: "password", // For testing only
        title: "Test Board Title",
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index,
            content: tile.content,
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
          })),
        },
      },
    });

    return res.status(201).json({
      message: "Solo board created successfully",
      boardId: board.id,
    });
  } catch (error) {
    console.error("Error creating solo board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
