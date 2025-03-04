import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getLeaderboard = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      where: { teamBoardId: boardId },
      include: {
        member: {
          select: { name: true }, // Get the player's name from TeamMember
        },
      },
      orderBy: { points: "desc" },
    });

    // Format response to match the previous structure
    const formattedLeaderboard = leaderboard.map((entry) => ({
      player: entry.member.name,
      score: entry.points,
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getContributions = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    const contributions = await prisma.contribution.findMany({
      where: { teamBoardId: boardId },
      include: {
        member: {
          select: { name: true }, // Get player's name
        },
      },
    });

    // Format response to match previous structure
    const formattedContributions = contributions.map((contribution) => ({
      player: contribution.member.name,
      tile_id: contribution.tileId,
      amount: contribution.amount,
    }));

    res.json(formattedContributions);
  } catch (err) {
    console.error("Error fetching contributions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
