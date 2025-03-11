// frontend/src/features/board/components/TileEditor.jsx
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import useTileEditor from "../hooks/useTileEditor";

const TileEditor = ({ initialData, tilePosition, onSave, onCancel }) => {
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
    handleCancel,
  } = useTileEditor(initialData, tilePosition, (resetData) => {
    onSave(resetData); // Immediately update tile
    onCancel(); // Close the editor after reset
  });

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop to close on click outside */}
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
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => handleModeChange("wiki")}
            disabled={mode === "wiki"}
          >
            Wiki Search
          </button>
          <button
            onClick={() => {
              handleModeChange("custom");
              handleContentChange(""); // Clear input when switching to custom entry.
            }}
            disabled={mode === "custom"}
          >
            Custom Entry
          </button>
        </div>

        {/* Content Selection */}
        <div className="mb-4">
          {mode === "wiki" ? (
            <>
              <WikiSearch onSelect={handleContentChange} />
              <div className="mt-2">
                <strong>Currently selected:</strong> {content || "None"}
              </div>
            </>
          ) : (
            <CustomEntry value={content} onChange={handleContentChange} />
          )}
        </div>

        {/* Completion Criteria */}
        <div className="mb-4">
          <CompletionCriteria
            value={criteria}
            onChange={handleCriteriaChange}
          />
        </div>

        {/* Buttons - Reset, Save, Cancel */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white p-2 rounded"
          >
            Reset
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                onSave({ content, ...criteria });
                onCancel();
              }}
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
