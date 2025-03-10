import React, { useEffect, useState } from "react";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
import { useBingoBoard } from "../hooks/useBingoBoard";
import useDragAndDrop from "../hooks/useDragAndDrop";
import BoardControls from "./BoardControls";
import BoardGrid from "./BoardGrid";

// Default tile values if none exist.
const defaultTileData = {
  content: "",
  target: 0,
  unit: "drops",
  progress: 0,
  completed: false,
};

const BingoBoard = () => {
  // Board state
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [boardName, setBoardName] = useState("");
  const [boardPassword, setBoardPassword] = useState("");
  const [isExistingBoard, setIsExistingBoard] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findBoardName, setFindBoardName] = useState("");
  const [tiles, setTiles] = useState({});

  // API hook for board interactions.
  const { error, fetchBoard, saveBoard, updateBoard } = useBingoBoard();

  // Drag-and-drop hook; initialize order based on grid size.
  const { order, setOrder, sensors, handleDragEnd } = useDragAndDrop(
    Array.from({ length: rows * columns }, (_, index) => index + 1)
  );

  // When grid dimensions change, update the order.
  useEffect(() => {
    setOrder(Array.from({ length: rows * columns }, (_, index) => index + 1));
  }, [rows, columns, setOrder]);

  // Listen for external events to open the find board modal.
  useEffect(() => {
    const openFindModal = () => setShowFindModal(true);
    window.addEventListener("openFindBoardModal", openFindModal);
    return () =>
      window.removeEventListener("openFindBoardModal", openFindModal);
  }, []);

  // Update individual tile data from child Tile components.
  const handleTileUpdate = (tileId, newData) => {
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  // Handle saving/updating the board.
  const handleConfirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      rows,
      columns,
      tiles: order.map(
        (tileId) =>
          tiles[tileId] || { ...defaultTileData, content: tileId.toString() }
      ),
    };

    if (isExistingBoard) {
      await updateBoard(boardDataToSave);
      alert("Board updated successfully!");
    } else {
      await saveBoard(boardDataToSave);
      alert("Board saved successfully!");
    }
    setShowSaveModal(false);
  };

  // Handle fetching an existing board.
  const handleConfirmFind = async () => {
    const data = await fetchBoard(findBoardName);
    if (data) {
      setBoardName(findBoardName);
      setIsExistingBoard(true);
      setRows(data.rows || 5);
      setColumns(data.columns || 5);
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

  return (
    <div className="p-4 text-center flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Bingo Board</h1>
      <BoardControls
        rows={rows}
        columns={columns}
        onRowsChange={setRows}
        onColumnsChange={setColumns}
      />
      <BoardGrid
        rows={rows}
        columns={columns}
        order={order}
        tiles={tiles}
        onTileUpdate={handleTileUpdate}
        sensors={sensors}
        handleDragEnd={handleDragEnd}
      />
      <div className="mt-4">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
      </div>
      <SaveBoardModal
        isOpen={showSaveModal}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveModal(false)}
        boardName={boardName}
        setBoardName={setBoardName}
        boardPassword={boardPassword}
        setBoardPassword={setBoardPassword}
        errorMessage={error}
        isExistingBoard={isExistingBoard}
      />
      <FindBoardModal
        isOpen={showFindModal}
        onConfirm={handleConfirmFind}
        onCancel={() => setShowFindModal(false)}
        findBoardName={findBoardName}
        setFindBoardName={setFindBoardName}
        errorMessage={error}
      />
    </div>
  );
};

export default BingoBoard;
