// Tile.jsx
import React, { useState, useEffect, useRef } from "react";
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

// Mapping of skill names to their corresponding hiscores property keys.
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });

  const [isEditing, setIsEditing] = useState(false);
  // Initialize tileData with safe defaults.
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
      // For skill tiles, ensure these default to 0.
      currentLevel: 0,
      goalLevel: 0,
    }
  );

  // State for showing the tick overlay (for wiki mode).
  const [showCompleteTick, setShowCompleteTick] = useState(false);
  // State for showing the wiki info overlay at top right (for wiki mode).
  const [showWikiInfoOverlay, setShowWikiInfoOverlay] = useState(false);
  // Timer refs for hover behaviors.
  const hoverTimerRef = useRef(null);
  const wikiOverlayTimerRef = useRef(null);

  // Update tileData when initialData changes.
  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

  // Update current level for skill tiles when osrsData changes.
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

  // When dragging stops, reset the wiki overlay timer and hide the overlay.
  useEffect(() => {
    if (!isDragging) {
      if (wikiOverlayTimerRef.current) {
        clearTimeout(wikiOverlayTimerRef.current);
        wikiOverlayTimerRef.current = null;
      }
      setShowWikiInfoOverlay(false);
    }
  }, [isDragging]);

  // Base style for the tile container.
  const style = {
    transform: isEditing ? "none" : CSS.Transform.toString(transform),
    transition: isEditing ? "none" : transition,
    pointerEvents: isEditing ? "none" : "auto",
    position: "relative",
    backgroundColor: tileData.completed ? "rgba(0,255,0,0.1)" : undefined,
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

  // --- Skill Mode Branch ---
  if (tileData.mode === "skill" && tileData.skill) {
    // Use safe defaults for current and target levels.
    const currentLevel = Number(tileData.currentLevel) || 0;
    const goalLevel = Number(tileData.goalLevel) || 0;
    const isComplete = goalLevel > 0 && currentLevel >= goalLevel;
    const skillBackgroundStyle = tileData.imageUrl
      ? {
          backgroundImage: `url(${tileData.imageUrl})`,
          backgroundSize: "40%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }
      : {};
    if (isComplete) {
      skillBackgroundStyle.backgroundColor = "rgba(0,255,0,0.1)";
    }
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
        {isComplete && (
          <div
            style={{
              position: "absolute",
              top: "4px",
              left: "4px",
              color: "green",
              fontSize: "1.5rem",
              zIndex: 10,
            }}
          >
            ✔
          </div>
        )}
        <div className="absolute bottom-2 w-full text-center">
          {`${currentLevel}/${goalLevel}`}
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

  // --- Wiki and Custom Modes ---
  let backgroundStyle = {};
  if (tileData.mode === "wiki" && tileData.imageUrl) {
    backgroundStyle = {
      backgroundImage: `url(${tileData.imageUrl})`,
      backgroundSize: "40%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    };
  }

  const handleMouseMove = (e) => {
    if (tileData.mode === "wiki") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // If cursor is in the bottom left 25% region, start the tick timer.
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
        // Start a timer for the wiki overlay (0.2 sec delay).
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
      className="relative border border-black flex items-center justify-center p-14 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
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
      {/* Render tick overlay in the bottom left corner for wiki mode */}
      {tileData.mode === "wiki" && (showCompleteTick || tileData.completed) && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            const updatedTile = { ...tileData, completed: !tileData.completed };
            setTileData(updatedTile);
            if (onTileUpdate) {
              onTileUpdate(id, updatedTile);
            }
          }}
          style={{
            position: "absolute",
            bottom: "4px",
            left: "4px",
            cursor: "pointer",
            color: "green",
            fontSize: "1.5rem",
            zIndex: 10,
          }}
        >
          ✔
        </div>
      )}
      {/* Render opaque wiki info overlay in the top right corner if not dragging */}
      {tileData.mode === "wiki" && !isDragging && showWikiInfoOverlay && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            backgroundColor: "white",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            zIndex: 10,
          }}
        >
          <div>{tileData.content}</div>
          <div>
            <a
              onClick={(e) => e.stopPropagation()}
              href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(
                tileData.content.replace(/ /g, "_")
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Wiki Link
            </a>
          </div>
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
