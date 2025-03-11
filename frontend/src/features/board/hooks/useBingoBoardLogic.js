// frontend/src/features/board/hooks/useBingoBoardLogic.js
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
  const [boardTitle, setBoardTitle] = useState("Bingo Board"); // new title state with default
  const [boardPassword, setBoardPassword] = useState("");
  const [isExistingBoard, setIsExistingBoard] = useState(false);

  // Modal visibility
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findBoardName, setFindBoardName] = useState("");

  // Tiles state and order for board layout
  const [tiles, setTiles] = useState({});
  const [order, setOrder] = useState(
    Array.from({ length: 5 * 5 }, (_, index) => index + 1)
  );

  // API interactions from useBingoBoard hook
  const { error, fetchBoard, saveBoard, updateBoard } = useBingoBoard();

  // Listen for external events to open the "find board" modal.
  useEffect(() => {
    const openFindModal = () => setShowFindModal(true);
    window.addEventListener("openFindBoardModal", openFindModal);
    return () =>
      window.removeEventListener("openFindBoardModal", openFindModal);
  }, []);

  // Handler to update a single tile's data.
  const handleTileUpdate = (tileId, newData) => {
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  // Handler to save (or update) the board.
  const confirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      title: boardTitle, // include the title
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

  // Handler to fetch an existing board.
  const handleConfirmFind = async () => {
    const data = await fetchBoard(findBoardName);
    if (data) {
      setBoardName(findBoardName);
      setIsExistingBoard(true);
      setRows(data.rows || 5);
      setColumns(data.columns || 5);
      setBoardTitle(data.title || "Bingo Board"); // update title from fetched board
      const fetchedTiles = {};
      (data.tiles || [])
        .sort((a, b) => a.position - b.position)
        .forEach((tile) => {
          fetchedTiles[tile.position + 1] = {
            content: tile.content,
            target: tile.target,
            unit: tile.unit,
            progress: tile.progress,
            completed: tile.completed,
            imageUrl: tile.imageUrl,
          };
        });
      setTiles(fetchedTiles);
      setShowFindModal(false);
    }
  };

  return {
    // Board properties
    rows,
    setRows,
    columns,
    setColumns,
    boardName,
    setBoardName,
    boardTitle, // added boardTitle
    setBoardTitle, // added setter for boardTitle
    boardPassword,
    setBoardPassword,
    isExistingBoard,
    setIsExistingBoard,
    // Modal states
    showSaveModal,
    setShowSaveModal,
    showFindModal,
    setShowFindModal,
    findBoardName,
    setFindBoardName,
    // Tile data and order
    tiles,
    order,
    setOrder,
    // API error (if any)
    error,
    // Handlers
    handleTileUpdate,
    confirmSave,
    handleConfirmFind,
  };
};

export default useBingoBoardLogic;
