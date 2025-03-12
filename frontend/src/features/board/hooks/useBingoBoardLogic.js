import { useState, useEffect } from "react";
import { useBingoBoard } from "./useBingoBoard";

const defaultTileData = {
  content: "",
  target: 0,
  unit: "drops",
  progress: 0,
  completed: false,
};

const useBingoBoardLogic = () => {
  // Board properties
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [boardName, setBoardName] = useState("");
  const [boardTitle, setBoardTitle] = useState("Bingo Board");
  const [boardPassword, setBoardPassword] = useState("");
  const [osrsUsername, setOsrsUsername] = useState(""); // OSRS username state
  const [isExistingBoard, setIsExistingBoard] = useState(false);

  // New state to cache OSRS hiscores data
  const [osrsData, setOsrsData] = useState(null);

  // Modal visibility
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findBoardName, setFindBoardName] = useState("");

  // Tiles and order
  const [tiles, setTiles] = useState({});
  const [order, setOrder] = useState(
    Array.from({ length: 5 * 5 }, (_, index) => index + 1)
  );

  // API interactions
  const { error, fetchBoard, saveBoard, updateBoard } = useBingoBoard();

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const openFindModal = () => setShowFindModal(true);
    window.addEventListener("openFindBoardModal", openFindModal);
    return () =>
      window.removeEventListener("openFindBoardModal", openFindModal);
  }, []);

  const saveCurrentState = () => {
    const snapshot = { rows, columns, tiles, order };
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]);
  };

  const handleRowsChange = (newRows) => {
    saveCurrentState();
    setRows(newRows);
  };

  const handleColumnsChange = (newColumns) => {
    saveCurrentState();
    setColumns(newColumns);
  };

  const handleOrderChange = (newOrder) => {
    saveCurrentState();
    setOrder(newOrder);
  };

  const handleTileUpdate = (tileId, newData) => {
    saveCurrentState();
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  // Client-side version of parseHiscoresData.
  const parseHiscoresData = (textData) => {
    const lines = textData.split("\n").filter((line) => line.trim() !== "");
    if (lines.length < 24) return null;
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
  };

  // Function to update cached OSRS data from hiscores API.
  const updateOsrsData = async () => {
    if (!osrsUsername) {
      alert("Please enter an OSRS username.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5001/api/osrs-hiscores?username=${encodeURIComponent(
          osrsUsername
        )}`
      );
      if (!response.ok) {
        alert("Failed to fetch hiscores data. Please check the username.");
        return;
      }
      const { data: textData } = await response.json();
      const parsed = parseHiscoresData(textData);
      if (!parsed) {
        alert("Invalid OSRS username provided.");
        return;
      }
      const allInvalid = Object.values(parsed).every((val) => val === -1);
      if (allInvalid) {
        alert("Invalid OSRS username provided.");
        return;
      }
      setOsrsData(parsed);
      alert("OSRS data updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Error fetching hiscores data.");
    }
  };

  const confirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      title: boardTitle,
      osrsUsername, // include OSRS username in payload
      osrsData, // include cached hiscores data
      rows,
      columns,
      tiles: order.map(
        (tileId) =>
          tiles[tileId] || { ...defaultTileData, content: tileId.toString() }
      ),
    };

    let response = null;
    if (isExistingBoard) {
      response = await updateBoard(boardDataToSave);
      if (response) {
        alert("Board updated successfully!");
        setShowSaveModal(false);
      }
    } else {
      response = await saveBoard(boardDataToSave);
      if (response) {
        alert("Board saved successfully!");
        setShowSaveModal(false);
      }
    }
  };

  const handleConfirmFind = async () => {
    const data = await fetchBoard(findBoardName);
    if (data) {
      setBoardName(findBoardName);
      setIsExistingBoard(true);
      setRows(data.rows || 5);
      setColumns(data.columns || 5);
      setBoardTitle(data.title || "Bingo Board");
      const fetchedTiles = {};
      (data.tiles || [])
        .sort((a, b) => a.position - b.position)
        .forEach((tile) => {
          // Tile positions in your UI are 1-indexed.
          fetchedTiles[tile.position + 1] = {
            content: tile.content,
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
            mode: tile.mode,
            skill: tile.skill,
            currentLevel: tile.currentLevel,
            goalLevel: tile.goalLevel,
          };
        });
      setTiles(fetchedTiles);
      setShowFindModal(false);
      setUndoStack([]);
      setRedoStack([]);
      // If a player is associated with this board,
      // set the username and, if no cache exists, use the player's stored xp values.
      if (data.player) {
        setOsrsUsername(data.player.username);
        const fallbackOsrsData = {
          overallXp: Number(data.player.overallXp),
          attackXp: Number(data.player.attackXp),
          defenceXp: Number(data.player.defenceXp),
          strengthXp: Number(data.player.strengthXp),
          hitpointsXp: Number(data.player.hitpointsXp),
          rangedXp: Number(data.player.rangedXp),
          prayerXp: Number(data.player.prayerXp),
          magicXp: Number(data.player.magicXp),
          cookingXp: Number(data.player.cookingXp),
          woodcuttingXp: Number(data.player.woodcuttingXp),
          fletchingXp: Number(data.player.fletchingXp),
          fishingXp: Number(data.player.fishingXp),
          firemakingXp: Number(data.player.firemakingXp),
          craftingXp: Number(data.player.craftingXp),
          smithingXp: Number(data.player.smithingXp),
          miningXp: Number(data.player.miningXp),
          herbloreXp: Number(data.player.herbloreXp),
          agilityXp: Number(data.player.agilityXp),
          thievingXp: Number(data.player.thievingXp),
          slayerXp: Number(data.player.slayerXp),
          farmingXp: Number(data.player.farmingXp),
          runecraftXp: Number(data.player.runecraftXp),
          hunterXp: Number(data.player.hunterXp),
          constructionXp: Number(data.player.constructionXp),
        };
        // Set the OSRS data cache using the player's stored data.
        setOsrsData(fallbackOsrsData);
        // Optionally, you could call updateOsrsData() here to refresh data from the hiscores API.
      }
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const lastSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    const currentSnapshot = { rows, columns, tiles, order };
    setRedoStack((prev) => [...prev, currentSnapshot]);
    setRows(lastSnapshot.rows);
    setColumns(lastSnapshot.columns);
    setTiles(lastSnapshot.tiles);
    setOrder(lastSnapshot.order);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastSnapshot = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    const currentSnapshot = { rows, columns, tiles, order };
    setUndoStack((prev) => [...prev, currentSnapshot]);
    setRows(lastSnapshot.rows);
    setColumns(lastSnapshot.columns);
    setTiles(lastSnapshot.tiles);
    setOrder(lastSnapshot.order);
  };

  return {
    rows,
    setRows: handleRowsChange,
    columns,
    setColumns: handleColumnsChange,
    boardName,
    setBoardName,
    boardTitle,
    setBoardTitle,
    boardPassword,
    setBoardPassword,
    osrsUsername,
    setOsrsUsername,
    osrsData,
    updateOsrsData,
    isExistingBoard,
    showSaveModal,
    setShowSaveModal,
    showFindModal,
    setShowFindModal,
    findBoardName,
    setFindBoardName,
    tiles,
    order,
    setOrder: handleOrderChange,
    error,
    handleTileUpdate,
    confirmSave,
    handleConfirmFind,
    undo,
    redo,
  };
};

export default useBingoBoardLogic;
