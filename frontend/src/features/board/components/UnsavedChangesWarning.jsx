import React from "react";

const UnsavedChangesWarning = ({ onSave, onDiscard, onGoBack }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-60">
      <div className="bg-[#f0e8da] border border-[#8b6d48] p-4 rounded">
        <p className="text-[#3b2f25]">Unsaved Changes</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={onSave}
            className="bg-[#d4af37] text-[#3b2f25] px-3 py-1 rounded hover:bg-[#c59c2a]"
          >
            Save changes
          </button>
          <button
            onClick={onDiscard}
            className="bg-[#bfb3a7] text-[#3b2f25] px-3 py-1 rounded"
          >
            Discard changes
          </button>
          <button
            onClick={onGoBack}
            className="bg-[#bfb3a7] text-[#3b2f25] px-3 py-1 rounded"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesWarning;
