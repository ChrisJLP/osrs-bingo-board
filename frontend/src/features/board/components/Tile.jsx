import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TileEditor from "./TileEditor";

// Utility function to format big numbers (e.g., 1500 -> 1.5k)
const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 ? 1 : 0) + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 ? 1 : 0) + "k";
  }
  return num.toString();
};

// Basic XP -> Level formula used previously
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

// Maps skill names to OSRS data fields
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
  // DnD kit setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });

  const [isEditing, setIsEditing] = useState(false);

  // Merge the tile's initial data with defaults
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
      currentLevel: 0,
      goalLevel: 0,
      mode: "wiki", // fallback if no mode is set
    }
  );

  // If `initialData` changes, update local tileData
  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

  // If skill tile, auto-update current level from OSRS data
  useEffect(() => {
    if (tileData.mode === "skill" && tileData.skill && osrsData) {
      const xpProp = skillMapping[tileData.skill];
      if (xpProp) {
        const xpValue = osrsData[xpProp];
        if (xpValue !== undefined) {
          const newLevel = xpToLevel(Number(xpValue));
          if (newLevel !== Number(tileData.currentLevel)) {
            setTileData((prev) => ({ ...prev, currentLevel: newLevel }));
          }
        }
      }
    }
  }, [osrsData, tileData.mode, tileData.skill, tileData.currentLevel]);

  // Save changes from TileEditor
  const handleSave = (newData) => {
    setTileData(newData);
    onTileUpdate?.(id, newData);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // DnD styling
  const style = {
    transform: isEditing ? "none" : CSS.Transform.toString(transform),
    transition: isEditing ? "none" : transition,
    pointerEvents: isEditing ? "none" : "auto",
    position: "relative",
  };

  // =============== RENDER LOGIC ===============

  // If it's a skill tile with a valid skill
  if (tileData.mode === "skill" && tileData.skill) {
    const currentLevel = Number(tileData.currentLevel) || 0;
    const goalLevel = Number(tileData.goalLevel) || 0;
    const isComplete = goalLevel > 0 && currentLevel >= goalLevel;

    // For skill tiles, we sometimes show a skill icon background or color
    const skillBackgroundStyle = tileData.imageUrl
      ? {
          backgroundImage: `url(${tileData.imageUrl})`,
          backgroundSize: "40%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }
      : {};

    // If it's complete, color it differently
    skillBackgroundStyle.backgroundColor = isComplete
      ? "#d0dbc0" // greenish for completed
      : "#f0e8da"; // normal tile color

    return (
      <div
        ref={setNodeRef}
        style={{ ...style, ...skillBackgroundStyle }}
        {...attributes}
        {...listeners}
        className="border border-[#8b6d48] rounded-lg shadow-md w-full h-full cursor-pointer
                   hover:scale-105 transition-colors flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {/* Completion checkmark if done */}
        {isComplete && (
          <div
            style={{
              position: "absolute",
              top: "4px",
              left: "4px",
              color: "#3b2f25",
              fontSize: "1.5rem",
              zIndex: 10,
            }}
          >
            ✔
          </div>
        )}

        {/* Show currentLevel / goalLevel at bottom */}
        <div className="absolute bottom-2 w-full text-center text-[#3b2f25]">
          {`${currentLevel}/${goalLevel}`}
        </div>

        {/* If editing, show the tile editor */}
        {isEditing && (
          <TileEditor
            initialData={tileData}
            tilePosition={id}
            onSave={handleSave}
            onCancel={handleCancel}
            osrsData={osrsData}
            defaultMode={tileData.mode} // important line
          />
        )}
      </div>
    );
  }

  // Otherwise, handle wiki or custom
  let backgroundStyle = {};
  // For wiki tiles with an image
  if (tileData.mode === "wiki" && tileData.imageUrl) {
    backgroundStyle = {
      backgroundImage: `url(${tileData.imageUrl})`,
      backgroundSize: "40%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    };
  }

  // Completed tiles get a greenish color
  if (tileData.completed) {
    backgroundStyle.backgroundColor = "#d0dbc0";
  } else if (!backgroundStyle.backgroundColor) {
    // default background
    backgroundStyle.backgroundColor = "#f0e8da";
  }

  // For wiki overlay & checkmark
  const [showCompleteTick, setShowCompleteTick] = useState(false);
  const [showWikiInfoOverlay, setShowWikiInfoOverlay] = useState(false);
  const hoverTimerRef = useRef(null);
  const wikiOverlayTimerRef = useRef(null);

  // If user is dragging, we hide overlays
  useEffect(() => {
    if (!isDragging) {
      if (wikiOverlayTimerRef.current) {
        clearTimeout(wikiOverlayTimerRef.current);
        wikiOverlayTimerRef.current = null;
      }
      setShowWikiInfoOverlay(false);
    }
  }, [isDragging]);

  // Mouse logic for wiki overlay
  const handleMouseMove = (e) => {
    if (tileData.mode === "wiki") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // If bottom-left quadrant, show tick
      if (x < rect.width * 0.25 && y > rect.height * 0.75) {
        if (!hoverTimerRef.current) {
          hoverTimerRef.current = setTimeout(() => {
            setShowCompleteTick(true);
          }, 300);
        }
        if (wikiOverlayTimerRef.current) {
          clearTimeout(wikiOverlayTimerRef.current);
          wikiOverlayTimerRef.current = null;
        }
        setShowWikiInfoOverlay(false);
      } else {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
          setShowCompleteTick(false);
        }
        if (!wikiOverlayTimerRef.current) {
          wikiOverlayTimerRef.current = setTimeout(() => {
            setShowWikiInfoOverlay(true);
            wikiOverlayTimerRef.current = null;
          }, 200);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (wikiOverlayTimerRef.current) {
      clearTimeout(wikiOverlayTimerRef.current);
      wikiOverlayTimerRef.current = null;
    }
    setShowCompleteTick(false);
    setShowWikiInfoOverlay(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...backgroundStyle }}
      onMouseMove={tileData.mode === "wiki" ? handleMouseMove : undefined}
      onMouseLeave={tileData.mode === "wiki" ? handleMouseLeave : undefined}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      className="border border-[#8b6d48] rounded-lg shadow-md w-full h-full cursor-pointer
                 hover:scale-105 transition-colors flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {/* For custom text, we show the text. Wiki mode uses the background image. */}
      {tileData.mode === "custom" && (
        <span
          className="
            text-[#3b2f25]
            whitespace-normal
            break-words
            text-center
            px-1
            overflow-hidden
          "
          style={{ maxHeight: "90%" }}
        >
          {tileData.content}
        </span>
      )}

      {/* If there's a target (for custom or wiki) we show progress at the bottom */}
      {tileData.target > 0 && (
        <div className="absolute bottom-2 w-full text-center text-[#3b2f25]">
          {`${formatNumber(tileData.progress)}/${formatNumber(
            tileData.target
          )}`}
        </div>
      )}

      {/* Wiki Completed Tick */}
      {tileData.mode === "wiki" && (showCompleteTick || tileData.completed) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            const updated = { ...tileData, completed: !tileData.completed };
            setTileData(updated);
            onTileUpdate?.(id, updated);
          }}
          style={{
            position: "absolute",
            bottom: "4px",
            left: "4px",
            cursor: "pointer",
            color: "#3b2f25",
            fontSize: "1.5rem",
            zIndex: 10,
          }}
        >
          ✔
        </div>
      )}

      {/* Wiki Overlay */}
      {tileData.mode === "wiki" && !isDragging && showWikiInfoOverlay && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            backgroundColor: "#f0e8da",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            zIndex: 10,
          }}
        >
          <div className="text-[#3b2f25]">{tileData.content}</div>
          <div>
            <a
              onClick={(e) => e.stopPropagation()}
              href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(
                tileData.content.replace(/ /g, "_")
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#3b2f25]"
            >
              Wiki Link
            </a>
          </div>
        </div>
      )}

      {/* If editing, open the TileEditor with defaultMode */}
      {isEditing && (
        <TileEditor
          initialData={tileData}
          tilePosition={id}
          onSave={handleSave}
          onCancel={handleCancel}
          osrsData={osrsData}
          defaultMode={tileData.mode} // This ensures correct tab is selected
        />
      )}
    </div>
  );
};

export default Tile;
