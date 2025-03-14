import React, { useEffect, useState } from "react";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
import TemplateBoardModal from "./templateBoardModal";
import BoardControls from "./BoardControls";
import BoardGrid from "./BoardGrid";
import useBingoBoardLogic from "../hooks/useBingoBoardLogic";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessPopup from "../components/SuccessPopup";

const BingoBoard = () => {
  const {
    rows,
    setRows,
    columns,
    setColumns,
    boardName,
    setBoardName,
    boardTitle,
    setBoardTitle,
    boardPassword,
    setBoardPassword,
    osrsUsername,
    setOsrsUsername,
    osrsData,
    updateOsrsData,
    isExistingBoard,
    showSaveModal,
    setShowSaveModal,
    showFindModal,
    setShowFindModal,
    findBoardName,
    setFindBoardName,
    tiles,
    order,
    setOrder,
    error,
    handleTileUpdate,
    confirmSave,
    handleConfirmFind,
    undo,
    redo,
    hasUnsavedChanges,
    showTemplateModal,
    setShowTemplateModal,
    templateBoardName,
    setTemplateBoardName,
    templateBoardTitle,
    setTemplateBoardTitle,
    templateBoardPassword,
    setTemplateBoardPassword,
    templateOsrsUsername,
    setTemplateOsrsUsername,
    createTemplateBoard,
  } = useBingoBoardLogic();

  // Loading states for different API events:
  const [loadingOSRS, setLoadingOSRS] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // State for OSRS hiscores update message
  const [osrsUpdateMessage, setOsrsUpdateMessage] = useState("");

  // Success popup state (for board saves/updates/templates)
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Please finalize or discard first.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTemplateClick = () => {
    if (hasUnsavedChanges) {
      const confirmUnsaved = window.confirm(
        "You have unsaved changes. Please save or discard before continuing?"
      );
      if (!confirmUnsaved) return;
    }
    setShowTemplateModal(true);
  };

  const handleUpdateOSRS = async () => {
    setLoadingOSRS(true);
    let success = false;
    try {
      await updateOsrsData();
      success = true;
    } catch (err) {
      success = false;
    }
    setLoadingOSRS(false);
    if (success) {
      setOsrsUpdateMessage("Hiscores update successful");
    } else {
      setOsrsUpdateMessage("Failed to fetch hiscores data");
    }
    setTimeout(() => {
      setOsrsUpdateMessage("");
    }, 7000);
  };

  const handleConfirmSave = async () => {
    setLoadingSave(true);
    try {
      await confirmSave();
      setSuccessMessage(
        isExistingBoard
          ? "Board updated successfully!"
          : "Board saved successfully!"
      );
    } catch (err) {
      console.error(err);
    }
    setLoadingSave(false);
  };

  const handleConfirmTemplate = async () => {
    setLoadingTemplate(true);
    try {
      const message = await createTemplateBoard();
      setSuccessMessage(message);
    } catch (err) {
      console.error(err);
    }
    setLoadingTemplate(false);
  };

  return (
    <div className="flex flex-col items-center p-4 text-[#362511]">
      {/* Hidden dummy input to help disable autofill */}
      <div style={{ display: "none" }}>
        <input type="text" autoComplete="username" />
      </div>

      {/* Success Popup */}
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-4">{boardTitle}</h1>

      {/* OSRS Username / Undo-Redo Row */}
      <div className="w-full max-w-[700px] mx-auto flex flex-col mb-4">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <label className="font-semibold mb-1" htmlFor="osrsUsername">
              OSRS Username:
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="osrsUsername"
                name="osrsUsernameField"
                type="text"
                value={osrsUsername}
                onChange={(e) => setOsrsUsername(e.target.value)}
                className="border border-[#8B5A2B] rounded-lg p-1"
                placeholder="Enter OSRS username"
                autoComplete="new-password"
              />
              <button
                onClick={handleUpdateOSRS}
                className="bg-[#D4AF37] text-[#362511] px-3 py-1 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
              >
                Update
              </button>
              {loadingOSRS && <LoadingSpinner size="w-4 h-4" />}
              {!loadingOSRS && osrsUpdateMessage && (
                <span
                  className={
                    osrsUpdateMessage === "Hiscores update successful"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {osrsUpdateMessage}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={undo}
              className="bg-[#bfb3a7] text-[#362511] px-3 py-1 rounded-lg transition hover:scale-105"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="bg-[#bfb3a7] text-[#362511] px-3 py-1 rounded-lg transition hover:scale-105"
            >
              Redo
            </button>
          </div>
        </div>
      </div>

      {/* Board Grid & Controls */}
      <div className="relative w-full max-w-[1200px] mb-4">
        <div className="mx-auto" style={{ width: "700px" }}>
          <BoardGrid
            rows={rows}
            columns={columns}
            tiles={tiles}
            onTileUpdate={handleTileUpdate}
            order={order}
            onOrderChange={setOrder}
            osrsData={osrsData}
          />
        </div>
        <div className="absolute top-0 left-0" style={{ margin: "1rem" }}>
          <BoardControls
            rows={rows}
            columns={columns}
            onRowsChange={setRows}
            onColumnsChange={setColumns}
          />
        </div>
      </div>

      {/* Save / Template Buttons */}
      <div className="flex space-x-2 justify-center">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-[#D4AF37] text-[#362511] px-4 py-2 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
        {loadingSave && <LoadingSpinner size="w-6 h-6" />}
        <button
          onClick={handleTemplateClick}
          className="bg-[#D4AF37] text-[#362511] px-4 py-2 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
        >
          Use board as a template
        </button>
        {loadingTemplate && <LoadingSpinner size="w-6 h-6" />}
      </div>

      {/* Modals */}
      <SaveBoardModal
        isOpen={showSaveModal}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveModal(false)}
        boardName={boardName}
        setBoardName={setBoardName}
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardPassword={boardPassword}
        setBoardPassword={setBoardPassword}
        errorMessage={error}
        isExistingBoard={isExistingBoard}
        loading={loadingSave}
      />
      <FindBoardModal
        isOpen={showFindModal}
        onConfirm={handleConfirmFind}
        onCancel={() => setShowFindModal(false)}
        findBoardName={findBoardName}
        setFindBoardName={setFindBoardName}
        errorMessage={error}
      />
      <TemplateBoardModal
        isOpen={showTemplateModal}
        onConfirm={handleConfirmTemplate}
        onCancel={() => setShowTemplateModal(false)}
        boardName={templateBoardName}
        setBoardName={setTemplateBoardName}
        boardTitle={templateBoardTitle}
        setBoardTitle={setTemplateBoardTitle}
        boardPassword={templateBoardPassword}
        setBoardPassword={setTemplateBoardPassword}
        osrsUsername={templateOsrsUsername}
        setOsrsUsername={setTemplateOsrsUsername}
        errorMessage={error}
        loading={loadingTemplate}
      />
    </div>
  );
};

export default BingoBoard;
