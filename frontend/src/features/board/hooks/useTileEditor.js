// frontend/src/hooks/useTileEditor.js
import { useState, useRef } from "react";

const useTileEditor = (initialData) => {
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
  const [showWarning, setShowWarning] = useState(false);

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
    setShowWarning(false);
    return { content, ...criteria };
  };

  const handleCancel = () => {
    setContent(initialValues.current.content);
    setCriteria(initialValues.current.criteria);
    setDirty(false);
    setShowWarning(false);
  };

  const handleBackdropClick = (onCancel) => {
    if (dirty) {
      setShowWarning(true);
    } else if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const handleWarningSave = () => {
    setShowWarning(false);
    return handleSave();
  };

  const handleWarningDiscard = () => {
    setShowWarning(false);
    handleCancel();
  };

  const handleWarningGoBack = () => {
    setShowWarning(false);
  };

  return {
    content,
    criteria,
    mode,
    dirty,
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
  };
};

export default useTileEditor;
