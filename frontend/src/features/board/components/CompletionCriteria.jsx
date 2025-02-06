// frontend/src/features/board/components/CompletionCriteria.jsx
import React from "react";

const CompletionCriteria = ({ value, onChange }) => {
  // value = { target, unit, progress }
  const handleTargetChange = (e) => {
    const newTarget = parseInt(e.target.value, 10) || 0;
    const newProgress = value.progress > newTarget ? newTarget : value.progress;
    onChange({ ...value, target: newTarget, progress: newProgress });
  };

  const handleUnitChange = (e) => {
    onChange({ ...value, unit: e.target.value });
  };

  const handleProgressChange = (e) => {
    let newProgress = parseInt(e.target.value, 10) || 0;
    if (newProgress > value.target) newProgress = value.target;
    onChange({ ...value, progress: newProgress });
  };

  return (
    <div>
      <div>
        <label>
          Target:
          <input
            type="number"
            value={value.target}
            onChange={handleTargetChange}
            aria-label="Target"
          />
        </label>
        <label>
          Unit:
          <select
            value={value.unit}
            onChange={handleUnitChange}
            aria-label="Unit"
          >
            <option value="drops">Drops</option>
            <option value="xp">XP</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Progress:
          <input
            type="number"
            value={value.progress}
            onChange={handleProgressChange}
            aria-label="Progress"
          />
        </label>
      </div>
    </div>
  );
};

export default CompletionCriteria;
