import React, { useState, useEffect } from "react";

const parseShorthand = (inputStr) => {
  const trimmed = inputStr.trim().toLowerCase();
  const regex = /^(\d+(\.\d+)?)([km])?$/;
  const match = trimmed.match(regex);
  if (!match) return NaN;
  let num = parseFloat(match[1]);
  if (match[3] === "k") {
    num *= 1000;
  } else if (match[3] === "m") {
    num *= 1000000;
  }
  return num;
};

const CompletionCriteria = ({ value, onChange }) => {
  const [targetStr, setTargetStr] = useState(value.target.toString());
  const [progressStr, setProgressStr] = useState(value.progress.toString());

  useEffect(() => {
    setTargetStr(value.target.toString());
    setProgressStr(value.progress.toString());
  }, [value.target, value.progress]);

  const handleTargetBlur = () => {
    const parsed = parseShorthand(targetStr);
    const newTarget = isNaN(parsed) ? 0 : parsed;
    if (value.progress > newTarget) {
      const confirmed = window.confirm(
        "The new target is below the current progress. If you proceed, progress will be set equal to the new target. Do you want to continue?"
      );
      if (!confirmed) {
        setTargetStr(value.target.toString());
        return;
      } else {
        onChange({ ...value, target: newTarget, progress: newTarget });
        setTargetStr(newTarget.toString());
        return;
      }
    } else {
      const newProgress =
        value.progress > newTarget ? newTarget : value.progress;
      onChange({ ...value, target: newTarget, progress: newProgress });
      setTargetStr(newTarget.toString());
    }
  };

  const handleProgressBlur = () => {
    const parsed = parseShorthand(progressStr);
    let newProgress = isNaN(parsed) ? 0 : parsed;
    if (newProgress > value.target) newProgress = value.target;
    onChange({ ...value, progress: newProgress });
    setProgressStr(newProgress.toString());
  };

  const handleTargetChange = (e) => {
    setTargetStr(e.target.value);
  };

  const handleProgressChange = (e) => {
    setProgressStr(e.target.value);
  };

  const handleUnitChange = (e) => {
    onChange({ ...value, unit: e.target.value });
  };

  const handleTargetKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTargetBlur();
    }
  };

  const handleProgressKeyDown = (e) => {
    if (e.key === "Enter") {
      handleProgressBlur();
    }
  };

  return (
    <div className="text-[#3b2f25]">
      <div>
        <label>
          Target:
          <input
            type="text"
            value={targetStr}
            onChange={handleTargetChange}
            onBlur={handleTargetBlur}
            onKeyDown={handleTargetKeyDown}
            aria-label="Target"
            className="border border-[#8b6d48] rounded-lg p-1 ml-2 w-20 text-[#3b2f25]"
          />
        </label>
        <label className="ml-4">
          Unit:
          <select
            value={value.unit}
            onChange={handleUnitChange}
            aria-label="Unit"
            className="border border-[#8b6d48] rounded-lg p-1 ml-2 text-[#3b2f25]"
          >
            <option value="drops">Drops</option>
            <option value="xp">XP</option>
          </select>
        </label>
      </div>
      <div className="mt-2">
        <label>
          Progress:
          <input
            type="text"
            value={progressStr}
            onChange={handleProgressChange}
            onBlur={handleProgressBlur}
            onKeyDown={handleProgressKeyDown}
            aria-label="Progress"
            className="border border-[#8b6d48] rounded-lg p-1 ml-2 w-20 text-[#3b2f25]"
          />
        </label>
      </div>
    </div>
  );
};

export default CompletionCriteria;
