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
    "runecrafting", // This will be mapped to "runecraft"
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
    // Map "runecrafting" to "runecraft" to match the Prisma field name
    const fieldName = skills[i] === "runecrafting" ? "runecraft" : skills[i];
    result[`${fieldName}Xp`] = parseInt(parts[2], 10);
  }
  return result;
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
          console.error(
            "Hiscores API error:",
            response.status,
            response.statusText
          );
        } else {
          const textData = await response.text();
          console.log("Hiscores API response text:", textData);
          const lines = textData
            .split("\n")
            .filter((line) => line.trim().length > 0);
          console.log("Hiscores API returned", lines.length, "lines");
          if (lines.length < 24) {
            console.error("Insufficient data from hiscores API:", textData);
          } else {
            const hiscores = parseHiscoresData(textData);
            const playerRecord = await prisma.player.create({
              data: {
                username: osrsUsername,
                overallLevel: hiscores.overallLevel,
                overallXp: hiscores.overallXp,
                attackXp: hiscores.attackXp,
                defenceXp: hiscores.defenceXp,
                strengthXp: hiscores.strengthXp,
                hitpointsXp: hiscores.hitpointsXp,
                rangedXp: hiscores.rangedXp,
                prayerXp: hiscores.prayerXp,
                magicXp: hiscores.magicXp,
                cookingXp: hiscores.cookingXp,
                woodcuttingXp: hiscores.woodcuttingXp,
                fletchingXp: hiscores.fletchingXp,
                fishingXp: hiscores.fishingXp,
                firemakingXp: hiscores.firemakingXp,
                craftingXp: hiscores.craftingXp,
                smithingXp: hiscores.smithingXp,
                miningXp: hiscores.miningXp,
                herbloreXp: hiscores.herbloreXp,
                agilityXp: hiscores.agilityXp,
                thievingXp: hiscores.thievingXp,
                slayerXp: hiscores.slayerXp,
                farmingXp: hiscores.farmingXp,
                runecraftXp: hiscores.runecraftXp,
                hunterXp: hiscores.hunterXp,
                constructionXp: hiscores.constructionXp,
                boardId: board.id,
              },
            });
            console.log("Player record created:", playerRecord);
          }
        }
      } catch (apiError) {
        console.error("Error fetching OSRS hiscores:", apiError);
      }
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
    return res.status(200).json(board);
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
      try {
        const hiscoreUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
          osrsUsername
        )}`;
        const response = await fetch(hiscoreUrl, {
          headers: {
            "User-Agent": "OSRS Bingo App (your_email@example.com)",
          },
        });
        const textData = await response.text();
        const hiscores = parseHiscoresData(textData);
        await prisma.player.upsert({
          where: { boardId: board.id },
          update: {
            username: osrsUsername,
            overallLevel: hiscores.overallLevel,
            overallXp: hiscores.overallXp,
            attackXp: hiscores.attackXp,
            defenceXp: hiscores.defenceXp,
            strengthXp: hiscores.strengthXp,
            hitpointsXp: hiscores.hitpointsXp,
            rangedXp: hiscores.rangedXp,
            prayerXp: hiscores.prayerXp,
            magicXp: hiscores.magicXp,
            cookingXp: hiscores.cookingXp,
            woodcuttingXp: hiscores.woodcuttingXp,
            fletchingXp: hiscores.fletchingXp,
            fishingXp: hiscores.fishingXp,
            firemakingXp: hiscores.firemakingXp,
            craftingXp: hiscores.craftingXp,
            smithingXp: hiscores.smithingXp,
            miningXp: hiscores.miningXp,
            herbloreXp: hiscores.herbloreXp,
            agilityXp: hiscores.agilityXp,
            thievingXp: hiscores.thievingXp,
            slayerXp: hiscores.slayerXp,
            farmingXp: hiscores.farmingXp,
            runecraftXp: hiscores.runecraftXp,
            hunterXp: hiscores.hunterXp,
            constructionXp: hiscores.constructionXp,
          },
          create: {
            username: osrsUsername,
            overallLevel: hiscores.overallLevel,
            overallXp: hiscores.overallXp,
            attackXp: hiscores.attackXp,
            defenceXp: hiscores.defenceXp,
            strengthXp: hiscores.strengthXp,
            hitpointsXp: hiscores.hitpointsXp,
            rangedXp: hiscores.rangedXp,
            prayerXp: hiscores.prayerXp,
            magicXp: hiscores.magicXp,
            cookingXp: hiscores.cookingXp,
            woodcuttingXp: hiscores.woodcuttingXp,
            fletchingXp: hiscores.fletchingXp,
            fishingXp: hiscores.fishingXp,
            firemakingXp: hiscores.firemakingXp,
            craftingXp: hiscores.craftingXp,
            smithingXp: hiscores.smithingXp,
            miningXp: hiscores.miningXp,
            herbloreXp: hiscores.herbloreXp,
            agilityXp: hiscores.agilityXp,
            thievingXp: hiscores.thievingXp,
            slayerXp: hiscores.slayerXp,
            farmingXp: hiscores.farmingXp,
            runecraftXp: hiscores.runecraftXp,
            hunterXp: hiscores.hunterXp,
            constructionXp: hiscores.constructionXp,
            boardId: board.id,
          },
        });
      } catch (apiError) {
        console.error("Error fetching OSRS hiscores during update:", apiError);
      }
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
