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

const Tile = ({ id, data: initialData, onTileUpdate, osrsData }) => {
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

  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

  const style = {
    transform: isEditing ? "none" : CSS.Transform.toString(transform),
    transition: isEditing ? "none" : transition,
    pointerEvents: isEditing ? "none" : "auto",
    position: "relative",
  };

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

  if (tileData.mode === "skill" && tileData.skill) {
    const skillBackgroundStyle = tileData.imageUrl
      ? {
          backgroundImage: `url(${tileData.imageUrl})`,
          backgroundSize: "40%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }
      : {};
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, ...skillBackgroundStyle }}
        {...attributes}
        {...listeners}
        className="relative border border-black flex items-center justify-center p-14 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {/* Progress display at the bottom */}
        <div className="absolute bottom-2 w-full text-center">
          {`${tileData.currentLevel}/${tileData.goalLevel}`}
        </div>
        {isEditing && (
          <TileEditor
            initialData={tileData}
            tilePosition={id}
            onSave={handleSave}
            onCancel={handleCancel}
            osrsData={osrsData}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      className="relative border border-black bg-white flex items-center justify-center p-14 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <span>{tileData.content}</span>
      {tileData.target > 0 && (
        <div className="absolute bottom-2 w-full text-center">
          {`${formatNumber(tileData.progress)}/${formatNumber(
            tileData.target
          )}`}
        </div>
      )}
      {isEditing && (
        <TileEditor
          initialData={tileData}
          tilePosition={id}
          onSave={handleSave}
          onCancel={handleCancel}
          osrsData={osrsData}
        />
      )}
    </div>
  );
};

export default Tile;
