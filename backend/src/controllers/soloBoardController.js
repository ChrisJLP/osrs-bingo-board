import prisma from "../config/db.js";

export const createSoloBoard = async (req, res) => {
  try {
    const { name, rows, columns, tiles } = req.body;

    // For this test, no password or other fields yet
    // 'name' must be unique if your schema has @unique on it
    const board = await prisma.soloBoard.create({
      data: {
        name: name || "test-board-" + Date.now(),
        password: "password", // dummy placeholder
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

    res.status(201).json({
      message: "Solo board created successfully",
      boardId: board.id,
    });
  } catch (error) {
    console.error("Error creating solo board:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
