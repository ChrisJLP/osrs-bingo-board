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

  const confirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      title: boardTitle,
      osrsUsername, // include OSRS username in payload
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
      setUndoStack([]);
      setRedoStack([]);
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
    osrsUsername, // expose OSRS username
    setOsrsUsername, // expose its setter
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
