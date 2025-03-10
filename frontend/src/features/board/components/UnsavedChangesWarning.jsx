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
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import WikiSearch from "./WikiSearch";
import CustomEntry from "./CustomEntry";
import CompletionCriteria from "./CompletionCriteria";
import UnsavedChangesWarning from "./UnsavedChangesWarning";

const TileEditor = ({ initialData, onSave, onCancel }) => {
  const [content, setContent] = useState(initialData.content || "");
  const [criteria, setCriteria] = useState({
    target: initialData.target || 0,
    unit: initialData.unit || "drops",
    progress: initialData.progress || 0,
  });
  const [mode, setMode] = useState("wiki"); // 'wiki' or 'custom'
  const [dirty, setDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const editorRef = useRef(null);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setDirty(true);
  };

  const handleCriteriaChange = (newCriteria) => {
    setCriteria(newCriteria);
    setDirty(true);
  };

  const handleSave = () => {
    onSave({ content, ...criteria });
  };

  const handleCancel = () => {
    onCancel();
  };

  // When clicking on the backdrop, check for unsaved changes.
  const handleBackdropClick = () => {
    if (dirty) {
      setShowWarning(true);
    } else {
      onCancel();
    }
  };

  const handleWarningSave = () => {
    setShowWarning(false);
    handleSave();
  };

  const handleWarningDiscard = () => {
    setShowWarning(false);
    onCancel();
  };

  const handleWarningGoBack = () => {
    setShowWarning(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleBackdropClick}
      ></div>
      {/* Modal content */}
      <div
        ref={editorRef}
        className="relative bg-white p-4 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex space-x-2">
          <button onClick={() => setMode("wiki")} disabled={mode === "wiki"}>
            Wiki Search
          </button>
          <button
            onClick={() => {
              setMode("custom");
              setContent(""); // Clear input when switching mode.
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
          <CompletionCriteria value={criteria} onChange={handleCriteriaChange} />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      {showWarning && (
        <UnsavedChangesWarning
          onSave={handleWarningSave}
          onDiscard={handleWarningDiscard}
          onGoBack={handleWarningGoBack}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TileEditor;
