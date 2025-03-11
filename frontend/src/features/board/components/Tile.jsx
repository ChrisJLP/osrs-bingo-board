// frontend/src/features/board/components/Tile.jsx
import React, { useState, useEffect } from "react";
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id.toString() });

  const [isEditing, setIsEditing] = useState(false);
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
    }
  );

  // Ensure local tile data updates when props change
  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

  const style = {
    transform: isEditing ? "none" : CSS.Transform.toString(transform), // Disable movement when editing
    transition: isEditing ? "none" : transition, // Disable animations when editing
    pointerEvents: isEditing ? "none" : "auto", // Prevent drag events while editing
    position: "relative",
  };

  // Save tile data and notify parent component
  const handleSave = (newData) => {
    setTileData(newData);
    if (onTileUpdate) {
      onTileUpdate(id, newData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const percentage =
    tileData.target > 0
      ? Math.min(100, Math.round((tileData.progress / tileData.target) * 100))
      : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : attributes)} // Disable attributes when editing
      {...(isEditing ? {} : listeners)} // Disable listeners when editing
      className="relative border border-black bg-white flex items-center justify-center p-14 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <span>{tileData.content}</span>

      {tileData.target > 0 && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-full bg-green-500 opacity-50"
            style={{ height: `${percentage}%` }}
          ></div>
          <div className="absolute bottom-2 w-full text-center">
            {`${formatNumber(tileData.progress)}/${formatNumber(
              tileData.target
            )}`}
          </div>
        </>
      )}

      {isEditing && (
        <TileEditor
          initialData={tileData}
          tilePosition={id}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Tile;
