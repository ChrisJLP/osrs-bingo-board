// Tile.jsx
import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TileEditor from "./TileEditor";

// Helper to format numbers
const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 ? 1 : 0) + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 ? 1 : 0) + "k";
  }
  return num.toString();
};

// Function to calculate RuneScape level from XP
const xpToLevel = (xp) => {
  let points = 0;
  for (let level = 1; level < 100; level++) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
    const xpForLevel = Math.floor(points / 4);
    if (xpForLevel > xp) {
      return level;
    }
  }
  return 99;
};

// Mapping of skill names to their corresponding hiscores property keys
const skillMapping = {
  Overall: "overallXp",
  Attack: "attackXp",
  Defence: "defenceXp",
  Strength: "strengthXp",
  Hitpoints: "hitpointsXp",
  Ranged: "rangedXp",
  Prayer: "prayerXp",
  Magic: "magicXp",
  Cooking: "cookingXp",
  Woodcutting: "woodcuttingXp",
  Fletching: "fletchingXp",
  Fishing: "fishingXp",
  Firemaking: "firemakingXp",
  Crafting: "craftingXp",
  Smithing: "smithingXp",
  Mining: "miningXp",
  Herblore: "herbloreXp",
  Agility: "agilityXp",
  Thieving: "thievingXp",
  Slayer: "slayerXp",
  Farming: "farmingXp",
  Runecrafting: "runecraftXp",
  Hunter: "hunterXp",
  Construction: "constructionXp",
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

  // When initialData changes, update tileData.
  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

  // When osrsData changes, update the current level for skill tiles.
  useEffect(() => {
    if (tileData.mode === "skill" && tileData.skill && osrsData) {
      const xpProp = skillMapping[tileData.skill];
      if (xpProp) {
        const xpValue = osrsData[xpProp];
        if (xpValue !== undefined) {
          const newLevel = xpToLevel(Number(xpValue));
          if (newLevel !== tileData.currentLevel) {
            setTileData((prev) => ({ ...prev, currentLevel: newLevel }));
          }
        }
      }
    }
  }, [osrsData, tileData.mode, tileData.skill, tileData.currentLevel]);

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

  // Dedicated branch for skill mode
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
        {/* Only show progress for skill tiles */}
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

  // For wiki and custom modes, apply wiki background if available.
  let backgroundStyle = {};
  if (tileData.mode === "wiki" && tileData.imageUrl) {
    backgroundStyle = {
      backgroundImage: `url(${tileData.imageUrl})`,
      backgroundSize: "40%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    };
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...backgroundStyle }}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      className="relative border border-black flex items-center justify-center p-14 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {/* Render text for non-skill tiles */}
      {tileData.mode !== "wiki" && (
        <span>{tileData.mode === "custom" ? tileData.content : ""}</span>
      )}
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
