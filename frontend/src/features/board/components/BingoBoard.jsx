// frontend/src/features/board/components/BingoBoard.jsx
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Tile from "./Tile";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
import { useBingoBoard } from "../hooks/useBingoBoard";
import useDragAndDrop from "../hooks/useDragAndDrop";

// Default tile values if none exist.
const defaults = {
  content: "",
  target: 0,
  unit: "drops",
  progress: 0,
  completed: false,
};

const BingoBoard = () => {
  // Grid dimensions
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);

  // Board identifiers and modal state
  const [boardName, setBoardName] = useState("");
  const [boardPassword, setBoardPassword] = useState("");
  const [isExistingBoard, setIsExistingBoard] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findBoardName, setFindBoardName] = useState("");

  // Tiles state
  const [tiles, setTiles] = useState({});

  // API hook for board interactions
  const { error, fetchBoard, saveBoard, updateBoard } = useBingoBoard();

  // Drag-and-drop hook; initialize order based on rows * columns
  const { order, setOrder, sensors, handleDragEnd } = useDragAndDrop(
    Array.from({ length: rows * columns }, (_, index) => index + 1)
  );

  // Update order when grid dimensions change
  useEffect(() => {
    setOrder(Array.from({ length: rows * columns }, (_, index) => index + 1));
  }, [rows, columns, setOrder]);

  // Update tile data from child Tile components
  const handleTileUpdate = (tileId, newData) => {
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  const handleConfirmSave = async () => {
    const boardDataToSave = {
      name: boardName,
      password: boardPassword,
      rows,
      columns,
      tiles: order.map((tileId) => tiles[tileId] || { ...defaults }),
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

  // Handler for finding an existing board
  const handleConfirmFind = async () => {
    const data = await fetchBoard(findBoardName);
    if (data) {
      setBoardName(findBoardName);
      setIsExistingBoard(true);
      setRows(data.rows || 5);
      setColumns(data.columns || 5);
      const fetchedTiles = {};
      const sortedTiles = (data.tiles || []).sort(
        (a, b) => a.position - b.position
      );
      sortedTiles.forEach((tile) => {
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

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  useEffect(() => {
    const openFindModal = () => {
      setShowFindModal(true);
    };
    window.addEventListener("openFindBoardModal", openFindModal);
    return () =>
      window.removeEventListener("openFindBoardModal", openFindModal);
  }, []);

  return (
    <div className="p-4 text-center flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Bingo Board</h1>

      {/* Grid dimension controls */}
      <div className="controls flex space-x-4 mb-4">
        <div>
          <label className="block mb-1">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>
        <div>
          <label className="block mb-1">Columns:</label>
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>
      </div>

      {/* Board grid with drag-and-drop */}
      <div className="border-2 border-gray-400 bg-gray-100 p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={order.map(String)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-1" style={gridStyle}>
              {order.map((tileId) => (
                <Tile
                  key={tileId}
                  id={tileId}
                  data={
                    tiles[tileId] || {
                      content: tileId.toString(),
                      target: 0,
                      unit: "drops",
                      progress: 0,
                      completed: false,
                    }
                  }
                  onTileUpdate={handleTileUpdate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Button to open the save/update modal */}
      <div className="mt-4">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
      </div>

      {/* Render modals */}
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
