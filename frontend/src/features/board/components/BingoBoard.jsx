import React, { useState, useEffect } from "react";
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
import { saveSoloBoard } from "../../../api/soloBoard";

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [order, setOrder] = useState([]);
  const [tiles, setTiles] = useState({});

  // For the modal popup:
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    const totalCells = rows * columns;
    setOrder(Array.from({ length: totalCells }, (_, index) => index + 1));
  }, [rows, columns]);

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

  // This is called by each Tile to update the tile data in the board-level state.
  const handleTileUpdate = (tileId, newData) => {
    setTiles((prev) => ({ ...prev, [tileId]: newData }));
  };

  // Open the modal for board name input
  const handleClickSaveBoard = () => {
    setShowNamePrompt(true);
  };

  // Once the user has typed a name and clicked "Confirm," actually save the board
  const handleConfirmBoardName = async () => {
    setShowNamePrompt(false);

    // Build the data object we’ll send to the backend
    const boardData = {
      name: boardName, // pass the chosen board name
      rows,
      columns,
      tiles: order.map(
        (tileId) =>
          tiles[tileId] || {
            content: tileId.toString(),
            target: 0,
            unit: "drops",
            progress: 0,
            completed: false,
          }
      ),
    };

    try {
      const result = await saveSoloBoard(boardData);
      console.log("Board saved successfully:", result);
      alert("Board saved successfully!");
    } catch (error) {
      console.error("Error saving board:", error);
      alert("Error saving board.");
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

      <button
        onClick={handleClickSaveBoard}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Save Board
      </button>

      {/* Simple modal for board name input */}
      {showNamePrompt && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowNamePrompt(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Enter Board Name</h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="border rounded p-1 mb-2 w-full"
              placeholder="e.g. My 2025 Goals"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNamePrompt(false)}
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
    </div>
  );
};

export default BingoBoard;
