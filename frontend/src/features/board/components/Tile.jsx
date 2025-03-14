import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TileEditor from "./TileEditor";

// Utility function to format large numbers (1.5k, 2m, etc.)
const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 ? 1 : 0) + "m";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 ? 1 : 0) + "k";
  }
  return num.toString();
};

// Simple XP -> Level function
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

// Maps tileData.skill to the corresponding OSRS data field
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
  // ---- 1) HOOKS ALWAYS AT THE TOP ----

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });

  const [isEditing, setIsEditing] = useState(false);
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
      currentLevel: 0,
      goalLevel: 0,
      mode: "wiki", // fallback
    }
  );

  // For wiki overlays:
  const [showCompleteTick, setShowCompleteTick] = useState(false);
  const [showWikiInfoOverlay, setShowWikiInfoOverlay] = useState(false);
  const hoverTimerRef = useRef(null);
  const wikiOverlayTimerRef = useRef(null);

  // Sync tileData if initialData changes
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

  // If user stops dragging, hide wiki overlay
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

  // Handle saves from TileEditor
  const handleSave = (newData) => {
    setTileData(newData);
    if (onTileUpdate) {
      onTileUpdate(id, newData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  // ---- 2) SINGLE RETURN STATEMENT ----
  // We'll build the tile’s background/style + content in variables.

  // Common container style for all tiles
  const containerStyle = {
    transform: isEditing ? "none" : CSS.Transform.toString(transform),
    transition: isEditing ? "none" : transition,
    pointerEvents: isEditing ? "none" : "auto",
    position: "relative",
  };

  // Decide background style
  let backgroundStyle = {};
  if (tileData.mode === "skill" && tileData.imageUrl) {
    // skill with an icon (handled in skill logic below, though)
    backgroundStyle.backgroundImage = `url(${tileData.imageUrl})`;
    backgroundStyle.backgroundSize = "40%";
    backgroundStyle.backgroundRepeat = "no-repeat";
    backgroundStyle.backgroundPosition = "center";
  } else if (tileData.mode === "wiki" && tileData.imageUrl) {
    // wiki with an image
    backgroundStyle.backgroundImage = `url(${tileData.imageUrl})`;
    backgroundStyle.backgroundSize = "40%";
    backgroundStyle.backgroundRepeat = "no-repeat";
    backgroundStyle.backgroundPosition = "center";
  }

  // If tile is completed, or skill tile is complete
  let tileComplete = false;
  if (tileData.mode === "skill") {
    const currLvl = Number(tileData.currentLevel) || 0;
    const goalLvl = Number(tileData.goalLevel) || 0;
    tileComplete = goalLvl > 0 && currLvl >= goalLvl;
  } else {
    tileComplete = !!tileData.completed;
  }

  if (tileComplete) {
    backgroundStyle.backgroundColor = "#d0dbc0"; // greenish for completed
  } else {
    backgroundStyle.backgroundColor =
      backgroundStyle.backgroundColor || "#f0e8da";
  }

  // Build the tile content
  let tileContent = null;

  if (tileData.mode === "skill" && tileData.skill) {
    // If it's a skill tile
    const currentLevel = Number(tileData.currentLevel) || 0;
    const goalLevel = Number(tileData.goalLevel) || 0;

    tileContent = (
      <>
        {tileComplete && (
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
        <div className="absolute bottom-2 w-full text-center text-[#3b2f25]">
          {`${currentLevel}/${goalLevel}`}
        </div>
      </>
    );
  } else if (tileData.mode === "custom") {
    // If it's a custom tile
    tileContent = (
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
    );
  }

  // If the tile has a target (for wiki or custom), show progress
  let progressElement = null;
  if (tileData.mode !== "skill" && tileData.target > 0) {
    progressElement = (
      <div className="absolute bottom-2 w-full text-center text-[#3b2f25]">
        {`${formatNumber(tileData.progress)}/${formatNumber(tileData.target)}`}
      </div>
    );
  }

  // For wiki tiles, show the checkmark if hovered in bottom-left
  let wikiCheckmark = null;
  if (tileData.mode === "wiki" && (showCompleteTick || tileData.completed)) {
    wikiCheckmark = (
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
    );
  }

  // For wiki tiles, show the overlay on the top-right
  let wikiOverlay = null;
  if (tileData.mode === "wiki" && !isDragging && showWikiInfoOverlay) {
    wikiOverlay = (
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
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...containerStyle, ...backgroundStyle }}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      className="border border-[#8b6d48] rounded-lg shadow-md w-full h-full cursor-pointer
                 hover:scale-105 transition-colors flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      onMouseMove={tileData.mode === "wiki" ? handleMouseMove : undefined}
      onMouseLeave={tileData.mode === "wiki" ? handleMouseLeave : undefined}
    >
      {/* If it's a skill tile, tileContent is the skill levels. If custom, tileContent is the text. */}
      {tileContent}

      {/* If wiki or custom with target, show progress. If skill tile, we show current/goal in tileContent. */}
      {progressElement}

      {/* Wiki checkmark in bottom-left */}
      {wikiCheckmark}

      {/* Wiki overlay in top-right */}
      {wikiOverlay}

      {/* If editing, show the TileEditor */}
      {isEditing && (
        <TileEditor
          initialData={tileData}
          tilePosition={id}
          onSave={handleSave}
          onCancel={handleCancel}
          osrsData={osrsData}
          defaultMode={tileData.mode} // ensures correct tab
        />
      )}
    </div>
  );
};

export default Tile;
