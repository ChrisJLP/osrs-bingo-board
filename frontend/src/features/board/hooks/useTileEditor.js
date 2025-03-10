// frontend/src/features/board/hooks/useTileEditor.js
import { useState } from "react";

const useTileEditor = (initialData = {}) => {
  // Initialize content and criteria from initialData
  const [content, setContent] = useState(initialData.content || "");
  const [criteria, setCriteria] = useState({
    target: initialData.target || 0,
    unit: initialData.unit || "drops",
    progress: initialData.progress || 0,
  });
  // Editing mode: "wiki" or "custom"
  const [mode, setMode] = useState("wiki");
  // Dirty flag indicates unsaved changes
  const [dirty, setDirty] = useState(false);
  // Controls whether a warning about unsaved changes is shown
  const [showWarning, setShowWarning] = useState(false);

  // Handler to update content and mark as dirty
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setDirty(true);
  };

  // Handler to update criteria and mark as dirty
  const handleCriteriaChange = (newCriteria) => {
    setCriteria(newCriteria);
    setDirty(true);
  };

  // Handler to change editing mode and mark as dirty
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setDirty(true);
  };

  // When saving, return the updated tile data and clear the dirty flag
  const handleSave = () => {
    setDirty(false);
    setShowWarning(false);
    return { content, ...criteria };
  };

  // Cancel editing and reset state to the initial values
  const handleCancel = () => {
    setContent(initialData.content || "");
    setCriteria({
      target: initialData.target || 0,
      unit: initialData.unit || "drops",
      progress: initialData.progress || 0,
    });
    setDirty(false);
    setShowWarning(false);
  };

  // Warning actions for unsaved changes
  const saveChanges = () => {
    setShowWarning(false);
    return handleSave();
  };

  const discardChanges = () => {
    setShowWarning(false);
    handleCancel();
  };

  const goBack = () => {
    // Simply hide the warning, let the user continue editing
    setShowWarning(false);
  };

  return {
    content,
    criteria,
    mode,
    dirty,
    showWarning,
    setShowWarning,
    handleContentChange,
    handleCriteriaChange,
    handleModeChange,
    handleSave,
    handleCancel,
    saveChanges,
    discardChanges,
    goBack,
  };
};

export default useTileEditor;
