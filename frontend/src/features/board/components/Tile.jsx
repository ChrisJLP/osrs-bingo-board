// frontend/src/features/board/components/Tile.jsx
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TileEditor from "./TileEditor";

const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 ? 1 : 0) + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 ? 1 : 0) + "k";
  }
  return num.toString();
};

const Tile = ({ id, data: initialData, onTileUpdate }) => {
  // Use DnD Kit's useSortable hook for drag-and-drop.
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id.toString() });

  // Local state to track whether the tile is being edited.
  const [isEditing, setIsEditing] = useState(false);

  // tileData: { content, target, unit, progress, completed? }
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
    }
  );

  // Apply transform/transition for DnD.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isEditing ? "none" : "auto", // prevent dragging when editing
    position: "relative",
  };

  // Called when the user clicks "Save" in the TileEditor.
  const handleSave = (newData) => {
    setTileData(newData);
    // Notify the parent about the update so it can store it in board-level state.
    if (onTileUpdate) {
      onTileUpdate(id, newData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Calculate percentage completion for overlay display.
  const percentage =
    tileData.target > 0
      ? Math.min(100, Math.round((tileData.progress / tileData.target) * 100))
      : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      // Only attach DnD attributes if not editing.
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      data-testid="bingo-cell"
      className={`relative border border-black bg-white flex items-center justify-center p-14 cursor-pointer ${
        percentage === 100 ? "completed" : ""
      }`}
      onClick={(e) => {
        // Prevent the click from bubbling up, and open the editor.
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <span data-testid="tile-content">{tileData.content}</span>

      {/* If there's a target, show the progress overlay & text */}
      {tileData.target > 0 && (
        <>
          <div
            data-testid="progress-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${percentage}%`,
              backgroundColor: "green",
              opacity: 0.5,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: 5,
              width: "100%",
              textAlign: "center",
            }}
          >
            {`${formatNumber(tileData.progress)}/${formatNumber(
              tileData.target
            )}`}
          </div>
        </>
      )}

      {/* Show the editor as a portal-based modal when editing. */}
      {isEditing && (
        <TileEditor
          initialData={tileData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Tile;
