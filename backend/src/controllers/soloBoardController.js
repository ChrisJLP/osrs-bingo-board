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
  // Use only the first 24 lines (ignoring extra boss/kill data)
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
    "runecrafting", // will be mapped to "runecraft"
    "hunter",
    "construction",
  ];
  const result = {};
  // Process Overall (line 0)
  const overallParts = lines[0].split(",");
  result.overallLevel = parseInt(overallParts[1], 10);
  result.overallXp = parseInt(overallParts[2], 10);
  // Process individual skills (lines 1 to 23)
  for (let i = 1; i < skills.length; i++) {
    const parts = lines[i].split(",");
    const fieldName = skills[i] === "runecrafting" ? "runecraft" : skills[i];
    result[`${fieldName}Xp`] = parseInt(parts[2], 10);
  }
  return result;
}

async function fetchAndValidateHiscores(osrsUsername, res) {
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
      return res
        .status(400)
        .json({ error: "Failed to fetch hiscores for provided username" });
    }
    const textData = await response.text();
    const lines = textData.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length < 24) {
      return res.status(400).json({ error: "Invalid OSRS username provided" });
    }
    const hiscores = parseHiscoresData(textData);
    const allInvalid = Object.values(hiscores).every((val) => val === -1);
    if (allInvalid) {
      return res.status(400).json({ error: "Invalid OSRS username provided" });
    }
    return hiscores;
  } catch (apiError) {
    console.error("Error fetching OSRS hiscores:", apiError);
    return res
      .status(400)
      .json({ error: "Error fetching hiscores for provided username" });
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

    // If an OSRS username is provided, validate it first.
    let hiscores = null;
    if (osrsUsername) {
      const result = await fetchAndValidateHiscores(osrsUsername, res);
      // If the result is an Express response, then an error was already sent.
      if (result?.headersSent) return;
      hiscores = result;
    }

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
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
          })),
        },
      },
    });

    if (osrsUsername && hiscores) {
      // Create or update the player record.
      let playerRecord = await prisma.player.findUnique({
        where: { username: osrsUsername },
      });
      if (playerRecord) {
        playerRecord = await prisma.player.update({
          where: { username: osrsUsername },
          data: {
            overallLevel: hiscores.overallLevel,
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
            overallLevel: hiscores.overallLevel,
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
      // Associate the player record with the board.
      await prisma.soloBoard.update({
        where: { id: board.id },
        data: { playerId: playerRecord.id },
      });
    }

    return res
      .status(201)
      .json({ message: "Solo board created successfully", boardId: board.id });
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
    // Convert BigInt values to strings for safe JSON serialization.
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
    // Remove old tiles and update board details.
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
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
          })),
        },
      },
    });

    if (osrsUsername) {
      let hiscores = await fetchAndValidateHiscores(osrsUsername, res);
      // If an error was returned from fetchAndValidateHiscores, stop here.
      if (hiscores?.headersSent) return;
      const playerRecord = await prisma.player.upsert({
        where: { username: osrsUsername },
        update: {
          overallLevel: hiscores.overallLevel,
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
          overallLevel: hiscores.overallLevel,
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
      // Update the board to reference the player record.
      await prisma.soloBoard.update({
        where: { id: board.id },
        data: { playerId: playerRecord.id },
      });
    }
    return res
      .status(200)
      .json({
        message: "Board updated successfully",
        boardId: updatedBoard.id,
      });
  } catch (error) {
    console.error("Error updating board:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
