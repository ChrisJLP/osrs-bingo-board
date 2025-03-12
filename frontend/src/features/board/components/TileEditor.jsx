// frontend/src/features/board/components/TileEditor.jsx
import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import useTileEditor from "../hooks/useTileEditor";

// Helper function to calculate level from XP (RuneScape formula)
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

// Mapping of displayed skill names to hiscores property keys.
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

const skillsList = Object.keys(skillMapping);

const TileEditor = ({
  initialData,
  tilePosition,
  onSave,
  onCancel,
  osrsData,
}) => {
  const editorRef = useRef(null);

  const {
    content,
    criteria,
    mode,
    handleReset,
    handleContentChange,
    handleCriteriaChange,
    handleModeChange,
    handleSave,
    handleCancel: handleEditorCancel,
  } = useTileEditor(initialData, tilePosition, (resetData) => {
    onSave(resetData);
    onCancel();
  });

  // Additional state for Skill mode
  const [skill, setSkill] = useState(initialData.skill || "");
  const [currentXp, setCurrentXp] = useState(initialData.currentXp || "");
  const [currentLevel, setCurrentLevel] = useState(
    initialData.currentLevel || ""
  );
  const [goalLevel, setGoalLevel] = useState(initialData.goalLevel || "");

  // When mode is "skill" and a skill is selected, auto-calculate level if osrsData exists.
  useEffect(() => {
    if (mode === "skill" && osrsData && skill) {
      const xpValue = osrsData[skillMapping[skill]];
      if (xpValue !== undefined) {
        setCurrentLevel(xpToLevel(Number(xpValue)));
      }
    }
  }, [mode, osrsData, skill]);

  const saveTileData = () => {
    if (mode === "skill") {
      // Save skill tile data
      onSave({
        mode: "skill",
        skill,
        currentLevel,
        goalLevel,
      });
    } else {
      onSave({ content, ...criteria });
    }
    onCancel();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onCancel}
      ></div>
      {/* Modal content */}
      <div
        ref={editorRef}
        className="relative bg-white p-4 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tab buttons */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => handleModeChange("wiki")}
            disabled={mode === "wiki"}
          >
            Wiki Search
          </button>
          <button
            onClick={() => handleModeChange("custom")}
            disabled={mode === "custom"}
          >
            Custom Entry
          </button>
          <button
            onClick={() => handleModeChange("skill")}
            disabled={mode === "skill"}
          >
            Skills
          </button>
        </div>
        {/* Content based on mode */}
        <div className="mb-4">
          {mode === "wiki" && (
            <>
              <WikiSearch onSelect={handleContentChange} />
              <div className="mt-2">
                <strong>Currently selected:</strong> {content || "None"}
              </div>
            </>
          )}
          {mode === "custom" && (
            <CustomEntry value={content} onChange={handleContentChange} />
          )}
          {mode === "skill" && (
            <div className="skill-editor">
              <div className="mb-2">
                <label className="block mb-1">Select Skill:</label>
                <select
                  value={skill}
                  onChange={(e) => {
                    setSkill(e.target.value);
                    // If OSRS data is available, auto-calc current level
                    if (
                      osrsData &&
                      osrsData[skillMapping[e.target.value]] !== undefined
                    ) {
                      setCurrentLevel(
                        xpToLevel(
                          Number(osrsData[skillMapping[e.target.value]])
                        )
                      );
                    } else {
                      setCurrentLevel("");
                    }
                  }}
                >
                  <option value="">--Select Skill--</option>
                  {skillsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {osrsData ? (
                <div className="mb-2">
                  <span>
                    Current Level: {currentLevel ? currentLevel : "N/A"}
                  </span>
                </div>
              ) : (
                <div className="mb-2">
                  <label className="block mb-1">Current XP:</label>
                  <input
                    type="number"
                    value={currentXp}
                    onChange={(e) => {
                      const xpVal = Number(e.target.value);
                      setCurrentXp(e.target.value);
                      setCurrentLevel(xpToLevel(xpVal));
                    }}
                    className="border rounded p-1 w-full"
                  />
                  <div>
                    Computed Level: {currentLevel ? currentLevel : "N/A"}
                  </div>
                </div>
              )}
              <div className="mb-2">
                <label className="block mb-1">Goal Level:</label>
                <input
                  type="number"
                  value={goalLevel}
                  onChange={(e) => setGoalLevel(e.target.value)}
                  className="border rounded p-1 w-full"
                />
              </div>
            </div>
          )}
        </div>
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white p-2 rounded"
          >
            Reset
          </button>
          <div className="flex space-x-2">
            <button
              onClick={saveTileData}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save
            </button>
            <button onClick={onCancel} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TileEditor;
