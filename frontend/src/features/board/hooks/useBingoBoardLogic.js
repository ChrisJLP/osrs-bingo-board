// useBingoBoardLogic.js
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
  const [osrsUsername, setOsrsUsername] = useState("");
  const [isExistingBoard, setIsExistingBoard] = useState(false);

  // OSRS hiscores data
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

  // Undo/Redo stacks (if undoStack is not empty, there are unsaved changes)
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

  // Full implementation for finding a board.
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
          // UI tile positions are 1-indexed.
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
        setOsrsData(fallbackOsrsData);
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

  const hasUnsavedChanges = undoStack.length > 0;

  const confirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      title: boardTitle,
      osrsUsername,
      osrsData,
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
        setUndoStack([]);
      }
    } else {
      response = await saveBoard(boardDataToSave);
      if (response) {
        alert("Board saved successfully!");
        setShowSaveModal(false);
        setUndoStack([]);
      }
    }
  };

  // NEW: updateOsrsData function to fetch and update OSRS hiscores data via a CORS proxy.
  const updateOsrsData = async () => {
    if (!osrsUsername) {
      alert("Please enter an OSRS username first.");
      return;
    }
    try {
      const hiscoreUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
        osrsUsername
      )}`;
      // Use ThingProxy to bypass CORS restrictions.
      const proxyUrl = `https://thingproxy.freeboard.io/fetch/${hiscoreUrl}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        alert("Failed to fetch OSRS hiscores.");
        return;
      }
      const textData = await response.text();
      const lines = textData.split("\n").filter((line) => line.trim() !== "");
      if (lines.length < 24) {
        alert("Invalid OSRS username provided.");
        return;
      }
      const parseHiscoresData = (textData) => {
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
          const fieldName =
            skills[i] === "runecrafting" ? "runecraftXp" : `${skills[i]}Xp`;
          result[fieldName] = parseInt(parts[2], 10);
        }
        return result;
      };

      const hiscores = parseHiscoresData(textData);
      setOsrsData(hiscores);
      alert("OSRS data updated successfully!");
    } catch (error) {
      console.error("Error updating OSRS data:", error);
      alert("Error updating OSRS data.");
    }
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
    setOsrsData,
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
    hasUnsavedChanges,
    updateOsrsData, // <-- now using ThingProxy
  };
};

export default useBingoBoardLogic;
