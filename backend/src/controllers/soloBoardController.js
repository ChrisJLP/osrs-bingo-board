// backend/controllers/soloBoardController.js
import bcrypt from "bcrypt";
import prisma from "../config/db.js";

export const createSoloBoard = async (req, res) => {
  try {
    const { name, rows = 5, columns = 5, tiles, password } = req.body;
    const existingBoard = await prisma.soloBoard.findUnique({
      where: { name },
    });
    if (existingBoard) {
      return res.status(409).json({ error: "Board name already taken" });
    }
    // Hash the provided password using bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const board = await prisma.soloBoard.create({
      data: {
        name,
        password: hashedPassword,
        title: req.body.title || "Bingo Board", // default updated here
        rows,
        columns,
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index,
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

export const updateSoloBoard = async (req, res) => {
  try {
    const { name } = req.params;
    const { rows, columns, tiles, password } = req.body;
    // Find the board by name
    const board = await prisma.soloBoard.findUnique({ where: { name } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Verify the provided password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, board.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect board password" });
    }

    // Delete existing tiles before re-creating them
    await prisma.soloTile.deleteMany({
      where: { boardId: board.id },
    });

    // Update board dimensions, title, and re-create the tiles
    const updatedBoard = await prisma.soloBoard.update({
      where: { name },
      data: {
        rows,
        columns,
        title: req.body.title, // update title with new value
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
