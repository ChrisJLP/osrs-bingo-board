import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Tile from "./Tile";
import { saveSoloBoard, updateSoloBoard } from "../../../api/soloBoard";

// Default tile values if none exist.
const defaults = {
  content: "",
  target: 0,
  unit: "drops",
  progress: 0,
  completed: false,
};

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [order, setOrder] = useState([]);
  const [tiles, setTiles] = useState({});
  const [isExistingBoard, setIsExistingBoard] = useState(false);

  // New states for board name and board password
  const [boardName, setBoardName] = useState("");
  const [boardPassword, setBoardPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // States for the modals
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showFindBoardPrompt, setShowFindBoardPrompt] = useState(false);
  const [findBoardName, setFindBoardName] = useState("");

  useEffect(() => {
    const totalCells = rows * columns;
    setOrder(Array.from({ length: totalCells }, (_, index) => index + 1));
  }, [rows, columns]);

  // Listen for the custom event from NavBar to open the "find board" modal
  useEffect(() => {
    const openFindModal = () => {
      setShowFindBoardPrompt(true);
    };
    window.addEventListener("openFindBoardModal", openFindModal);
    return () => {
      window.removeEventListener("openFindBoardModal", openFindModal);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  // Called by each Tile to update board-level tile data.
  const handleTileUpdate = (tileId, newData) => {
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  // Always show the save/update modal when clicking "Save Board"/"Update board"
  const handleClickSaveBoard = () => {
    setErrorMessage("");
    setShowSavePrompt(true);
  };

  const handleConfirmBoardName = async () => {
    setErrorMessage("");
    const boardData = {
      name: boardName,
      password: boardPassword, // Include the board password
      rows,
      columns,
      tiles: order.map((tileId) => tiles[tileId] || { ...defaults }),
    };

    try {
      let result;
      if (isExistingBoard) {
        result = await updateSoloBoard(boardData);
        console.log("Board updated successfully:", result);
        alert("Board updated successfully!");
      } else {
        result = await saveSoloBoard(boardData);
        console.log("Board saved successfully:", result);
        alert("Board saved successfully!");
      }
      setShowSavePrompt(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
    }
  };

  const handleFindBoard = async () => {
    try {
      const res = await axios.get(`/solo-board/${findBoardName}`);
      const boardData = res.data;
      console.log("Fetched board data:", boardData);
      // Sort the tiles by position (ascending)
      const sortedTiles = (boardData.tiles || []).sort(
        (a, b) => a.position - b.position
      );
      const newTiles = {};
      sortedTiles.forEach((tile) => {
        // Use tile.position + 1 for your 1-indexed keys
        newTiles[tile.position + 1] = {
          content: tile.content,
          target: tile.target,
          unit: tile.unit,
          progress: tile.progress,
          completed: tile.completed,
          imageUrl: tile.imageUrl,
        };
      });
      setTiles(newTiles);
      setBoardName(findBoardName);
      setIsExistingBoard(true);
      setShowFindBoardPrompt(false);
    } catch (err) {
      console.error("Board not found:", err);
      alert("Board not found. Please check the board name.");
    }
  };

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="p-4 text-center flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Bingo Board</h1>
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

      <div className="mt-4">
        <button
          onClick={handleClickSaveBoard}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
      </div>

      {/* Modal for saving/updating board */}
      {showSavePrompt && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSavePrompt(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">
              {isExistingBoard
                ? "Enter Board Password to Update Board"
                : "Enter Board Details"}
            </h2>
            {isExistingBoard ? (
              <>
                <p className="mb-2">
                  <strong>Board Name:</strong> {boardName}
                </p>
                <input
                  type="password"
                  value={boardPassword}
                  onChange={(e) => setBoardPassword(e.target.value)}
                  className="border rounded p-1 mb-2 w-full"
                  placeholder="Enter board password"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="border rounded p-1 mb-2 w-full"
                  placeholder="e.g. Ironman goals 2025"
                />
                <input
                  type="password"
                  value={boardPassword}
                  onChange={(e) => setBoardPassword(e.target.value)}
                  className="border rounded p-1 mb-2 w-full"
                  placeholder="Enter board password"
                />
              </>
            )}
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSavePrompt(false)}
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBoardName}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for finding board */}
      {showFindBoardPrompt && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowFindBoardPrompt(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Enter Board Name to Find</h2>
            <input
              type="text"
              value={findBoardName}
              onChange={(e) => setFindBoardName(e.target.value)}
              className="border rounded p-1 mb-2 w-full"
              placeholder="Board name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowFindBoardPrompt(false)}
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFindBoard}
                className="bg-green-500 text-white p-2 rounded"
              >
                Find Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoBoard;
