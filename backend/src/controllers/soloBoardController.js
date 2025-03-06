import prisma from "../config/db.js";

export const createSoloBoard = async (req, res) => {
  try {
    const { name, rows, columns, tiles } = req.body;
    const existingBoard = await prisma.soloBoard.findUnique({
      where: { name },
    });

    if (existingBoard) {
      return res.status(409).json({ error: "Board name already taken" });
    }

    const board = await prisma.soloBoard.create({
      data: {
        name,
        password: "password", // For testing only – update as needed
        title: "Test Board Title",
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index, // Stored as 0-indexed
            content: tile.content,
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
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

export const getSoloBoard = async (req, res) => {
  try {
    console.log("Incoming name param:", JSON.stringify(req.params.name));
    const { name } = req.params;
    const board = await prisma.soloBoard.findUnique({
      where: { name },
      include: { tiles: true },
    });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    return res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching solo board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// In soloBoardController.js
export const updateSoloBoard = async (req, res) => {
  try {
    const { name } = req.params;
    const { rows, columns, tiles } = req.body;
    // Find the board by name
    const board = await prisma.soloBoard.findUnique({ where: { name } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    // Instead of prisma.tile.deleteMany({ where: { soloBoardId: board.id } })
    await prisma.soloTile.deleteMany({
      where: { boardId: board.id },
    });

    // Update board dimensions and re-create the tiles
    const updatedBoard = await prisma.soloBoard.update({
      where: { name },
      data: {
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index,
            content: tile.content,
            imageUrl: tile.imageUrl,
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
          })),
        },
      },
    });

    return res.status(200).json({
      message: "Board updated successfully",
      boardId: updatedBoard.id,
    });
  } catch (error) {
    console.error("Error updating board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
