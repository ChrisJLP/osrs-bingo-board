import React, { useState, useEffect, useRef } from "react";
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
  const [tileData, setTileData] = useState(
    initialData || {
      content: id.toString(),
      target: 0,
      unit: "drops",
      progress: 0,
      completed: false,
      currentLevel: 0,
      goalLevel: 0,
    }
  );

  const [showCompleteTick, setShowCompleteTick] = useState(false);
  const [showWikiInfoOverlay, setShowWikiInfoOverlay] = useState(false);
  const hoverTimerRef = useRef(null);
  const wikiOverlayTimerRef = useRef(null);

  useEffect(() => {
    setTileData(initialData);
  }, [initialData]);

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

  useEffect(() => {
    if (!isDragging) {
      if (wikiOverlayTimerRef.current) {
        clearTimeout(wikiOverlayTimerRef.current);
        wikiOverlayTimerRef.current = null;
      }
      setShowWikiInfoOverlay(false);
    }
  }, [isDragging]);

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

  const handleCancel = () => setIsEditing(false);

  // If skill tile
  if (tileData.mode === "skill" && tileData.skill) {
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

    skillBackgroundStyle.backgroundColor = isComplete
      ? "#d0dbc0" // completed
      : "#f0e8da"; // incomplete

    return (
      <div
        ref={setNodeRef}
        style={{ ...style, ...skillBackgroundStyle }}
        {...attributes}
        {...listeners}
        className="border border-[#8b6d48] rounded-lg shadow-md w-full h-full cursor-pointer
                   hover:scale-105 transition-colors
                   flex items-center justify-center"
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

  // Otherwise, wiki or custom
  let backgroundStyle = {};
  if (tileData.mode === "wiki" && tileData.imageUrl) {
    backgroundStyle = {
      backgroundImage: `url(${tileData.imageUrl})`,
      backgroundSize: "40%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    };
  }
  if (tileData.completed) {
    backgroundStyle.backgroundColor = "#d0dbc0"; // completed
  } else if (!backgroundStyle.backgroundColor) {
    backgroundStyle.backgroundColor = "#f0e8da"; // incomplete
  }

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
                 hover:scale-105 transition-colors
                 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {/* Custom text display (non-wiki mode) */}
      {tileData.mode !== "wiki" && (
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
          {tileData.mode === "custom" ? tileData.content : ""}
        </span>
      )}

      {/* Completion criteria display (for wiki or custom with targets) */}
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
