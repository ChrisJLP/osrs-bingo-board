// frontend/src/hooks/useTileEditor.js
import { useState, useRef } from "react";

const useTileEditor = (initialData, tilePosition, onReset) => {
  // Store original values in a ref to reset later.
  const initialValues = useRef({
    content: initialData.content || "",
    criteria: {
      target: initialData.target || 0,
      unit: initialData.unit || "drops",
      progress: initialData.progress || 0,
    },
  });

  // State management
  const [content, setContent] = useState(initialValues.current.content);
  const [criteria, setCriteria] = useState(initialValues.current.criteria);
  const [mode, setMode] = useState("wiki"); // "wiki" or "custom"
  const [dirty, setDirty] = useState(false);

  // Handler functions
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setDirty(true);
  };

  const handleCriteriaChange = (newCriteria) => {
    setCriteria(newCriteria);
    setDirty(true);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setDirty(true);
  };

  const handleSave = () => {
    setDirty(false);
    return { content, ...criteria };
  };

  const handleCancel = () => {
    setContent(initialValues.current.content);
    setCriteria(initialValues.current.criteria);
    setDirty(false);
  };

  // Reset function - Now immediately resets and calls onReset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset this tile?")) {
      const resetData = {
        content: tilePosition.toString(),
        target: 0,
        unit: "drops",
        progress: 0,
      };
      setContent(resetData.content);
      setCriteria({
        target: resetData.target,
        unit: resetData.unit,
        progress: resetData.progress,
      });
      setDirty(false); // Reset means no unsaved changes
      onReset(resetData); // Immediately update tile and close editor
    }
  };

  return {
    content,
    criteria,
    mode,
    dirty,
    handleReset,
    handleContentChange,
    handleCriteriaChange,
    handleModeChange,
    handleSave,
    handleCancel,
  };
};

export default useTileEditor;
