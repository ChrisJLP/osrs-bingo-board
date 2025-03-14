import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import useTileEditor from "../hooks/useTileEditor";

// Import skill icons
import AgilityIcon from "../../../assets/skill_icons/Agility_icon.webp";
import AttackIcon from "../../../assets/skill_icons/Attack_icon.webp";
import DefenceIcon from "../../../assets/skill_icons/Defence_icon.webp";
import StrengthIcon from "../../../assets/skill_icons/Strength_icon.webp";
import HitpointsIcon from "../../../assets/skill_icons/Hitpoints_icon.webp";
import RangedIcon from "../../../assets/skill_icons/Ranged_icon.png";
import PrayerIcon from "../../../assets/skill_icons/Prayer_icon.webp";
import MagicIcon from "../../../assets/skill_icons/Magic_icon.png";
import CookingIcon from "../../../assets/skill_icons/Cooking_icon.webp";
import WoodcuttingIcon from "../../../assets/skill_icons/Woodcutting_icon.webp";
import FletchingIcon from "../../../assets/skill_icons/Fletching_icon.webp";
import FishingIcon from "../../../assets/skill_icons/Fishing_icon.png";
import FiremakingIcon from "../../../assets/skill_icons/Firemaking_icon.webp";
import CraftingIcon from "../../../assets/skill_icons/Crafting_icon.png";
import SmithingIcon from "../../../assets/skill_icons/Smithing_icon.webp";
import MiningIcon from "../../../assets/skill_icons/Mining_icon.webp";
import HerbloreIcon from "../../../assets/skill_icons/Herblore_icon.webp";
import ThievingIcon from "../../../assets/skill_icons/Thieving_icon.webp";
import SlayerIcon from "../../../assets/skill_icons/Slayer_icon.png";
import FarmingIcon from "../../../assets/skill_icons/Farming_icon.webp";
import RunecraftingIcon from "../../../assets/skill_icons/Runecraft_icon.webp";
import HunterIcon from "../../../assets/skill_icons/Hunter_icon.webp";
import ConstructionIcon from "../../../assets/skill_icons/Construction_icon.webp";

const skillIcons = {
  Attack: AttackIcon,
  Defence: DefenceIcon,
  Strength: StrengthIcon,
  Hitpoints: HitpointsIcon,
  Ranged: RangedIcon,
  Prayer: PrayerIcon,
  Magic: MagicIcon,
  Cooking: CookingIcon,
  Woodcutting: WoodcuttingIcon,
  Fletching: FletchingIcon,
  Fishing: FishingIcon,
  Firemaking: FiremakingIcon,
  Crafting: CraftingIcon,
  Smithing: SmithingIcon,
  Mining: MiningIcon,
  Herblore: HerbloreIcon,
  Agility: AgilityIcon,
  Thieving: ThievingIcon,
  Slayer: SlayerIcon,
  Farming: FarmingIcon,
  Runecrafting: RunecraftingIcon,
  Hunter: HunterIcon,
  Construction: ConstructionIcon,
};

const getSkillIcon = (skill) => skillIcons[skill] || "";

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

const skillsList = Object.keys(skillIcons);

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

  const [skill, setSkill] = useState(initialData.skill || "");
  const [currentXp, setCurrentXp] = useState(initialData.currentXp || "");
  const [currentLevel, setCurrentLevel] = useState(
    initialData.currentLevel || ""
  );
  const [goalLevel, setGoalLevel] = useState(initialData.goalLevel || "");

  // For wiki searching
  const [selectedWikiItem, setSelectedWikiItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "skill" && osrsData && skill) {
      const xpValue = osrsData[`${skill.toLowerCase()}Xp`];
      if (xpValue !== undefined) {
        setCurrentLevel(xpToLevel(Number(xpValue)));
      }
    }
  }, [mode, osrsData, skill]);

  useEffect(() => {
    if (mode !== "wiki") {
      setSelectedWikiItem(null);
      setError("");
    }
  }, [mode]);

  const handleWikiSelect = (result) => {
    setSelectedWikiItem(result);
    setError("");
    handleContentChange(result.title);
  };

  const saveTileData = () => {
    setError("");
    if (mode === "skill") {
      onSave({
        mode: "skill",
        skill,
        currentLevel,
        goalLevel,
        imageUrl: getSkillIcon(skill),
        content: skill,
      });
    } else if (mode === "wiki") {
      if (!selectedWikiItem) {
        setError("Not a valid item");
        return;
      }
      onSave({
        mode: "wiki",
        content,
        imageUrl: selectedWikiItem.imageUrl || "",
        ...criteria,
      });
    } else {
      onSave({ mode: "custom", content, ...criteria });
    }
    onCancel();
  };

  // Helper for tab button styling
  const getTabClasses = (tabMode) => {
    const isActive = mode === tabMode;
    return [
      "px-3",
      "py-1",
      "rounded-lg",
      "transition",
      "transform",
      "text-[#3b2f25]",
      isActive
        ? "bg-[#f5e5cc] border border-[#8b6d48] font-semibold"
        : "bg-[#d4af37] hover:bg-[#c59c2a] hover:scale-105",
    ].join(" ");
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      ></div>

      <div
        ref={editorRef}
        className="relative bg-[#f0e8da] p-4 rounded-lg shadow-md w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mode Tabs */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => handleModeChange("wiki")}
            className={getTabClasses("wiki")}
          >
            Wiki Search
          </button>
          <button
            onClick={() => handleModeChange("custom")}
            className={getTabClasses("custom")}
          >
            Custom Entry
          </button>
          <button
            onClick={() => handleModeChange("skill")}
            className={getTabClasses("skill")}
          >
            Skills
          </button>
        </div>

        {/* Editor Body */}
        <div className="mb-4 text-[#3b2f25]">
          {mode === "wiki" && (
            <>
              <WikiSearch onSelect={handleWikiSelect} />
              <div className="mt-2">
                <strong>Currently selected:</strong>{" "}
                {selectedWikiItem ? selectedWikiItem.title : "None"}
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
                    if (
                      osrsData &&
                      osrsData[`${e.target.value.toLowerCase()}Xp`] !==
                        undefined
                    ) {
                      setCurrentLevel(
                        xpToLevel(
                          Number(osrsData[`${e.target.value.toLowerCase()}Xp`])
                        )
                      );
                    } else {
                      setCurrentLevel("");
                    }
                  }}
                  className="border border-[#8b6d48] rounded-lg p-1 w-full text-[#3b2f25]"
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
                  <span>Current Level: {currentLevel || "N/A"}</span>
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
                    className="border border-[#8b6d48] rounded-lg p-1 w-full text-[#3b2f25]"
                  />
                  <div>Computed Level: {currentLevel || "N/A"}</div>
                </div>
              )}

              <div className="mb-2">
                <label className="block mb-1">Goal Level:</label>
                <input
                  type="number"
                  value={goalLevel}
                  onChange={(e) => setGoalLevel(e.target.value)}
                  className="border border-[#8b6d48] rounded-lg p-1 w-full text-[#3b2f25]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Display (if any) */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Footer Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white p-2 rounded-lg hover:scale-105 transition"
          >
            Reset
          </button>
          <div className="flex space-x-2">
            <button
              onClick={saveTileData}
              className="bg-[#d4af37] text-[#3b2f25] p-2 rounded-lg transition hover:bg-[#c59c2a] hover:scale-105"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="bg-[#bfb3a7] text-[#3b2f25] p-2 rounded-lg hover:scale-105 transition"
            >
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
