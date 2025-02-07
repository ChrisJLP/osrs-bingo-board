import fetch from "node-fetch";

export const searchWiki = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const apiUrl = `https://oldschool.runescape.wiki/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error searching wiki:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
