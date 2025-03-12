import bcrypt from "bcrypt";
import prisma from "../config/db.js";

// Helper function to parse hiscores CSV data using only the first 24 lines.
function parseHiscoresData(textData) {
  let lines = textData.split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 24) {
    throw new Error(
      `Unexpected hiscores data format: expected at least 24 lines but got ${lines.length}`
    );
  }
  lines = lines.slice(0, 24);
  const skills = [
    "overall",
    "attack",
    "defence",
    "strength",
    "hitpoints",
    "ranged",
    "prayer",
    "magic",
    "cooking",
    "woodcutting",
    "fletching",
    "fishing",
    "firemaking",
    "crafting",
    "smithing",
    "mining",
    "herblore",
    "agility",
    "thieving",
    "slayer",
    "farming",
    "runecrafting",
    "hunter",
    "construction",
  ];
  const result = {};
  const overallParts = lines[0].split(",");
  result.overallLevel = parseInt(overallParts[1], 10);
  result.overallXp = parseInt(overallParts[2], 10);
  for (let i = 1; i < skills.length; i++) {
    const parts = lines[i].split(",");
    const fieldName = skills[i] === "runecrafting" ? "runecraft" : skills[i];
    result[`${fieldName}Xp`] = parseInt(parts[2], 10);
  }
  return result;
}

// Helper to obtain hiscores data. If osrsData is provided in the request body, use it.
// Otherwise, fetch from the hiscores API.
async function getHiscores(req, res, osrsUsername) {
  if (req.body.osrsData) {
    const hiscores = req.body.osrsData;
    const allInvalid = Object.values(hiscores).every((val) => val === -1);
    if (allInvalid) {
      res.status(400).json({ error: "Invalid OSRS username provided" });
      return null;
    }
    return hiscores;
  } else {
    try {
      const hiscoreUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
        osrsUsername
      )}`;
      const response = await fetch(hiscoreUrl, {
        headers: {
          "User-Agent": "OSRS Bingo App (your_email@example.com)",
        },
      });
      if (!response.ok) {
        res.status(400).json({
          error: "Failed to fetch hiscores for provided username",
        });
        return null;
      }
      const textData = await response.text();
      const lines = textData
        .split("\n")
        .filter((line) => line.trim().length > 0);
      if (lines.length < 24) {
        res.status(400).json({ error: "Invalid OSRS username provided" });
        return null;
      }
      const hiscores = parseHiscoresData(textData);
      const allInvalid = Object.values(hiscores).every((val) => val === -1);
      if (allInvalid) {
        res.status(400).json({ error: "Invalid OSRS username provided" });
        return null;
      }
      return hiscores;
    } catch (apiError) {
      console.error("Error fetching OSRS hiscores:", apiError);
      res
        .status(400)
        .json({ error: "Error fetching hiscores for provided username" });
      return null;
    }
  }
}

export const createSoloBoard = async (req, res) => {
  try {
    const {
      name,
      rows = 5,
      columns = 5,
      tiles,
      password,
      osrsUsername,
    } = req.body;
    const existingBoard = await prisma.soloBoard.findUnique({
      where: { name },
    });
    if (existingBoard) {
      return res.status(409).json({ error: "Board name already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const board = await prisma.soloBoard.create({
      data: {
        name,
        password: hashedPassword,
        title: req.body.title || "Bingo Board",
        rows,
        columns,
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index,
            content: tile.content,
            // For skill tiles, convert goalLevel/currentLevel to numbers
            target:
              tile.mode === "skill" ? Number(tile.goalLevel) || 0 : tile.target,
            unit: tile.unit,
            progress:
              tile.mode === "skill"
                ? Number(tile.currentLevel) || 0
                : tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
            mode: tile.mode,
            skill: tile.mode === "skill" ? tile.skill : null,
            currentLevel:
              tile.mode === "skill" ? Number(tile.currentLevel) || 0 : null,
            goalLevel:
              tile.mode === "skill" ? Number(tile.goalLevel) || 0 : null,
          })),
        },
      },
    });
    if (osrsUsername) {
      const hiscores = await getHiscores(req, res, osrsUsername);
      if (!hiscores) return;
      let playerRecord = await prisma.player.findUnique({
        where: { username: osrsUsername },
      });
      const overallLevel = Number(hiscores.overallLevel) || 1;
      if (playerRecord) {
        playerRecord = await prisma.player.update({
          where: { username: osrsUsername },
          data: {
            overallLevel: overallLevel,
            overallXp: BigInt(hiscores.overallXp),
            attackXp: BigInt(hiscores.attackXp),
            defenceXp: BigInt(hiscores.defenceXp),
            strengthXp: BigInt(hiscores.strengthXp),
            hitpointsXp: BigInt(hiscores.hitpointsXp),
            rangedXp: BigInt(hiscores.rangedXp),
            prayerXp: BigInt(hiscores.prayerXp),
            magicXp: BigInt(hiscores.magicXp),
            cookingXp: BigInt(hiscores.cookingXp),
            woodcuttingXp: BigInt(hiscores.woodcuttingXp),
            fletchingXp: BigInt(hiscores.fletchingXp),
            fishingXp: BigInt(hiscores.fishingXp),
            firemakingXp: BigInt(hiscores.firemakingXp),
            craftingXp: BigInt(hiscores.craftingXp),
            smithingXp: BigInt(hiscores.smithingXp),
            miningXp: BigInt(hiscores.miningXp),
            herbloreXp: BigInt(hiscores.herbloreXp),
            agilityXp: BigInt(hiscores.agilityXp),
            thievingXp: BigInt(hiscores.thievingXp),
            slayerXp: BigInt(hiscores.slayerXp),
            farmingXp: BigInt(hiscores.farmingXp),
            runecraftXp: BigInt(hiscores.runecraftXp),
            hunterXp: BigInt(hiscores.hunterXp),
            constructionXp: BigInt(hiscores.constructionXp),
          },
        });
      } else {
        playerRecord = await prisma.player.create({
          data: {
            username: osrsUsername,
            overallLevel: overallLevel,
            overallXp: BigInt(hiscores.overallXp),
            attackXp: BigInt(hiscores.attackXp),
            defenceXp: BigInt(hiscores.defenceXp),
            strengthXp: BigInt(hiscores.strengthXp),
            hitpointsXp: BigInt(hiscores.hitpointsXp),
            rangedXp: BigInt(hiscores.rangedXp),
            prayerXp: BigInt(hiscores.prayerXp),
            magicXp: BigInt(hiscores.magicXp),
            cookingXp: BigInt(hiscores.cookingXp),
            woodcuttingXp: BigInt(hiscores.woodcuttingXp),
            fletchingXp: BigInt(hiscores.fletchingXp),
            fishingXp: BigInt(hiscores.fishingXp),
            firemakingXp: BigInt(hiscores.firemakingXp),
            craftingXp: BigInt(hiscores.craftingXp),
            smithingXp: BigInt(hiscores.smithingXp),
            miningXp: BigInt(hiscores.miningXp),
            herbloreXp: BigInt(hiscores.herbloreXp),
            agilityXp: BigInt(hiscores.agilityXp),
            thievingXp: BigInt(hiscores.thievingXp),
            slayerXp: BigInt(hiscores.slayerXp),
            farmingXp: BigInt(hiscores.farmingXp),
            runecraftXp: BigInt(hiscores.runecraftXp),
            hunterXp: BigInt(hiscores.hunterXp),
            constructionXp: BigInt(hiscores.constructionXp),
          },
        });
      }
      // Associate the player record with this board.
      await prisma.soloBoard.update({
        where: { id: board.id },
        data: { playerId: playerRecord.id },
      });
    }
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
      include: { tiles: true, player: true },
    });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    const safeBoard = JSON.parse(
      JSON.stringify(board, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    return res.status(200).json(safeBoard);
  } catch (error) {
    console.error("Error fetching solo board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSoloBoard = async (req, res) => {
  try {
    const { name } = req.params;
    const { rows, columns, tiles, password, osrsUsername } = req.body;
    const board = await prisma.soloBoard.findUnique({ where: { name } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, board.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect board password" });
    }
    await prisma.soloTile.deleteMany({ where: { boardId: board.id } });
    const updatedBoard = await prisma.soloBoard.update({
      where: { name },
      data: {
        rows,
        columns,
        title: req.body.title,
        tiles: {
          create: tiles.map((tile, index) => ({
            position: index,
            content: tile.content,
            target:
              tile.mode === "skill" ? Number(tile.goalLevel) || 0 : tile.target,
            unit: tile.unit,
            progress:
              tile.mode === "skill"
                ? Number(tile.currentLevel) || 0
                : tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
            mode: tile.mode,
            skill: tile.mode === "skill" ? tile.skill : null,
            currentLevel:
              tile.mode === "skill" ? Number(tile.currentLevel) || 0 : null,
            goalLevel:
              tile.mode === "skill" ? Number(tile.goalLevel) || 0 : null,
          })),
        },
      },
    });

    if (osrsUsername) {
      const hiscores = await getHiscores(req, res, osrsUsername);
      if (!hiscores) return;
      const overallLevel = Number(hiscores.overallLevel) || 1;
      const playerRecord = await prisma.player.upsert({
        where: { username: osrsUsername },
        update: {
          overallLevel: overallLevel,
          overallXp: BigInt(hiscores.overallXp),
          attackXp: BigInt(hiscores.attackXp),
          defenceXp: BigInt(hiscores.defenceXp),
          strengthXp: BigInt(hiscores.strengthXp),
          hitpointsXp: BigInt(hiscores.hitpointsXp),
          rangedXp: BigInt(hiscores.rangedXp),
          prayerXp: BigInt(hiscores.prayerXp),
          magicXp: BigInt(hiscores.magicXp),
          cookingXp: BigInt(hiscores.cookingXp),
          woodcuttingXp: BigInt(hiscores.woodcuttingXp),
          fletchingXp: BigInt(hiscores.fletchingXp),
          fishingXp: BigInt(hiscores.fishingXp),
          firemakingXp: BigInt(hiscores.firemakingXp),
          craftingXp: BigInt(hiscores.craftingXp),
          smithingXp: BigInt(hiscores.smithingXp),
          miningXp: BigInt(hiscores.miningXp),
          herbloreXp: BigInt(hiscores.herbloreXp),
          agilityXp: BigInt(hiscores.agilityXp),
          thievingXp: BigInt(hiscores.thievingXp),
          slayerXp: BigInt(hiscores.slayerXp),
          farmingXp: BigInt(hiscores.farmingXp),
          runecraftXp: BigInt(hiscores.runecraftXp),
          hunterXp: BigInt(hiscores.hunterXp),
          constructionXp: BigInt(hiscores.constructionXp),
        },
        create: {
          username: osrsUsername,
          overallLevel: overallLevel,
          overallXp: BigInt(hiscores.overallXp),
          attackXp: BigInt(hiscores.attackXp),
          defenceXp: BigInt(hiscores.defenceXp),
          strengthXp: BigInt(hiscores.strengthXp),
          hitpointsXp: BigInt(hiscores.hitpointsXp),
          rangedXp: BigInt(hiscores.rangedXp),
          prayerXp: BigInt(hiscores.prayerXp),
          magicXp: BigInt(hiscores.magicXp),
          cookingXp: BigInt(hiscores.cookingXp),
          woodcuttingXp: BigInt(hiscores.woodcuttingXp),
          fletchingXp: BigInt(hiscores.fletchingXp),
          fishingXp: BigInt(hiscores.fishingXp),
          firemakingXp: BigInt(hiscores.firemakingXp),
          craftingXp: BigInt(hiscores.craftingXp),
          smithingXp: BigInt(hiscores.smithingXp),
          miningXp: BigInt(hiscores.miningXp),
          herbloreXp: BigInt(hiscores.herbloreXp),
          agilityXp: BigInt(hiscores.agilityXp),
          thievingXp: BigInt(hiscores.thievingXp),
          slayerXp: BigInt(hiscores.slayerXp),
          farmingXp: BigInt(hiscores.farmingXp),
          runecraftXp: BigInt(hiscores.runecraftXp),
          hunterXp: BigInt(hiscores.hunterXp),
          constructionXp: BigInt(hiscores.constructionXp),
        },
      });
      await prisma.soloBoard.update({
        where: { id: board.id },
        data: { playerId: playerRecord.id },
      });
    }
    return res.status(200).json({
      message: "Board updated successfully",
      boardId: updatedBoard.id,
    });
  } catch (error) {
    console.error("Error updating board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
