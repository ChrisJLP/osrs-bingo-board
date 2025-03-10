// frontend/src/features/board/components/TileEditor.jsx
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import UnsavedChangesWarning from "./UnsavedChangesWarning";
import useTileEditor from "../hooks/useTileEditor"; // Adjust path as needed

const TileEditor = ({ initialData, onSave, onCancel }) => {
  const {
    content,
    criteria,
    mode,
    showWarning,
    handleContentChange,
    handleCriteriaChange,
    handleModeChange,
    handleSave,
    handleCancel,
    handleBackdropClick,
    handleWarningSave,
    handleWarningDiscard,
    handleWarningGoBack,
  } = useTileEditor(initialData);

  const editorRef = useRef(null);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop handles click-away */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => handleBackdropClick(onCancel)}
      ></div>
      {/* Modal content – stop propagation so clicks inside don’t trigger the backdrop */}
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
        <div className="mb-4">
          <CompletionCriteria
            value={criteria}
            onChange={handleCriteriaChange}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              const result = handleSave();
              onSave(result);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              handleCancel();
              onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {showWarning && (
        <UnsavedChangesWarning
          onSave={() => {
            const result = handleWarningSave();
            onSave(result);
          }}
          onDiscard={handleWarningDiscard}
          onGoBack={handleWarningGoBack}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TileEditor;
