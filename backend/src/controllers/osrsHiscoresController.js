// backend/src/controllers/osrsHiscoresController.js
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res
      .status(400)
      .json({ error: "Username query parameter is required" });
  }
  try {
    const hiscoreUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
      username
    )}`;
    const response = await fetch(hiscoreUrl, {
      headers: {
        "User-Agent": "OSRS Bingo App (your_email@example.com)",
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error fetching hiscores" });
    }
    const textData = await response.text();
    return res.status(200).json({ data: textData });
  } catch (error) {
    console.error("Error in proxy hiscores endpoint:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
