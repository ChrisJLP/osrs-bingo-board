// frontend/src/features/board/components/UnsavedChangesWarning.jsx
import React from "react";

const UnsavedChangesWarning = ({ onSave, onDiscard, onGoBack }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-60">
      <div className="bg-white border p-4 rounded">
        <p>Unsaved Changes</p>
        <div className="flex space-x-2 mt-2">
          <button onClick={onSave}>Save changes</button>
          <button onClick={onDiscard}>Discard changes</button>
          <button onClick={onGoBack}>Go back</button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesWarning;
