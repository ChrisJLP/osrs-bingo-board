import prisma from "../config/db.js";

export const createSoloBoard = async (req, res) => {
  try {
    // Expecting board data with rows, columns, and an array of tiles.
    const { rows, columns, tiles } = req.body;

    // Generate a unique board name (for now, as a test)
    const boardName = "test-board-" + Date.now();
    const boardPassword = "password";

    // Create the SoloBoard with nested creation of SoloTile records
    const board = await prisma.soloBoard.create({
      data: {
        name: boardName,
        password: boardPassword,
        title: "Test Board",
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index, // Use index as position (or tile-specific value if available)
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
