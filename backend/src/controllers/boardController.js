import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getBoard = async (req, res) => {
  const boardId = req.params.id;
  try {
    const board = await prisma.mainBoard.findUnique({
      where: { id: boardId },
      include: {
        tiles: true, // Include tiles linked to this board
      },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json(board);
  } catch (err) {
    console.error("Error fetching board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBoard = async (req, res) => {
  const { name, rows, columns, color, bonusPoints, password } = req.body;
  try {
    const board = await prisma.mainBoard.create({
      data: {
        name,
        rows,
        columns,
        color,
        bonusPoints: bonusPoints || 0,
        password,
      },
    });

    res.status(201).json(board);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const { name, rows, columns, color, bonusPoints } = req.body;
  try {
    const board = await prisma.mainBoard.update({
      where: { id: boardId },
      data: {
        name,
        rows,
        columns,
        color,
        bonusPoints,
      },
    });

    res.json(board);
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBoard = async (req, res) => {
  const boardId = req.params.id;
  try {
    await prisma.mainBoard.delete({
      where: { id: boardId },
    });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
