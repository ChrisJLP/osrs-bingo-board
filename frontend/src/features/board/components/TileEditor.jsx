import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import useTileEditor from "../hooks/useTileEditor";

// Import skill icons from assets
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

const getSkillIcon = (skill) => {
  return skillIcons[skill] || "";
};

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
      // Save skill tile data with the corresponding skill icon URL
      // Include a content field so Prisma receives a valid value.
      onSave({
        mode: "skill",
        skill,
        currentLevel,
        goalLevel,
        imageUrl: getSkillIcon(skill),
        content: skill,
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
