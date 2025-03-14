import React, { useEffect, useState } from "react";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
import TemplateBoardModal from "./templateBoardModal";
import BoardControls from "./BoardControls";
import BoardGrid from "./BoardGrid";
import useBingoBoardLogic from "../hooks/useBingoBoardLogic";
import LoadingSpinner from "../components/LoadingSpinner";

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

  // New state for handling OSRS hiscores update loading and message
  const [loadingOSRS, setLoadingOSRS] = useState(false);
  const [osrsUpdateMessage, setOsrsUpdateMessage] = useState("");

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

  // Modified update handler for OSRS hiscores
  const handleUpdateOSRS = async () => {
    setLoadingOSRS(true);
    let success = false;
    try {
      // Assume updateOsrsData returns a truthy value on success or throws on failure.
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

  // Modified save and template handlers to show loading spinners
  const handleConfirmSave = async () => {
    // For saving board
    await confirmSave();
  };

  const handleConfirmTemplate = async () => {
    await createTemplateBoard();
  };

  return (
    <div className="flex flex-col items-center p-4 text-[#362511]">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-4">{boardTitle}</h1>

      {/* OSRS Username / Undo/Redo Row */}
      <div className="w-full max-w-[700px] mx-auto flex flex-col mb-4">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <label className="font-semibold mb-1" htmlFor="osrsUsername">
              OSRS Username:
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="osrsUsername"
                type="text"
                value={osrsUsername}
                onChange={(e) => setOsrsUsername(e.target.value)}
                className="border border-[#8B5A2B] rounded-lg p-1"
                placeholder="Enter OSRS username"
                autoComplete="off"
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
              className="bg-[#bfb3a7] text-[#362511] px-3 py-1 text-base leading-tight rounded-lg transition hover:scale-105"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="bg-[#bfb3a7] text-[#362511] px-3 py-1 text-base leading-tight rounded-lg transition hover:scale-105"
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
        <button
          onClick={handleTemplateClick}
          className="bg-[#D4AF37] text-[#362511] px-4 py-2 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
        >
          Use board as a template
        </button>
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
        loading={loadingOSRS} // You can pass loading here if needed
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
        loading={false} // Adjust as needed if you want a loading spinner for template actions
      />
    </div>
  );
};

export default BingoBoard;
