import React, { useEffect } from "react";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
import TemplateBoardModal from "./templateBoardModal";
import BoardControls from "./BoardControls";
import BoardGrid from "./BoardGrid";
import useBingoBoardLogic from "../hooks/useBingoBoardLogic";

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

  return (
    <div className="flex flex-col items-center p-4 text-[#362511]">
      {/* Title (centered) */}
      <h1 className="text-2xl font-bold text-center mb-4">{boardTitle}</h1>

      {/* 
        Row with OSRS Username (left) + Undo/Redo (right) 
        all inside a container that's centered horizontally
      */}
      <div className="w-full max-w-[700px] mx-auto flex flex-col mb-4">
        <div className="flex items-end justify-between">
          {/* Left side: OSRS username */}
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
                onClick={() => updateOsrsData()}
                className="bg-[#D4AF37] text-[#362511] px-3 py-1 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
              >
                Update
              </button>
              {osrsData && <span className="text-green-600">Data Cached</span>}
            </div>
          </div>

          {/* Right side: Undo/Redo, slightly bigger */}
          <div className="flex space-x-2">
            <button
              onClick={undo}
              className="bg-gray-300 text-[#362511] px-3 py-1 text-base leading-tight rounded-lg transition hover:scale-105"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="bg-gray-300 text-[#362511] px-3 py-1 text-base leading-tight rounded-lg transition hover:scale-105"
            >
              Redo
            </button>
          </div>
        </div>
      </div>

      {/*
        A wider container for the board & controls, so the board can center ignoring the controls.
        "relative" so we can absolutely position the controls to the left side, 
        while the board remains centered with "mx-auto".
      */}
      <div
        className="relative w-full max-w-[1200px] mb-4" /* large enough to hold the board + pinned controls */
      >
        {/* The board is truly centered, ignoring the controls */}
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

        {/*
          Absolutely position the Rows/Columns panel on the left side,
          so it does NOT affect the board's centering.
          No negative margin, no transform. 
        */}
        <div className="absolute top-0 left-0" style={{ margin: "1rem" }}>
          <BoardControls
            rows={rows}
            columns={columns}
            onRowsChange={setRows}
            onColumnsChange={setColumns}
          />
        </div>
      </div>

      {/* Save/Template Buttons (centered) */}
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
        onConfirm={confirmSave}
        onCancel={() => setShowSaveModal(false)}
        boardName={boardName}
        setBoardName={setBoardName}
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardPassword={boardPassword}
        setBoardPassword={setBoardPassword}
        errorMessage={error}
        isExistingBoard={isExistingBoard}
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
        onConfirm={createTemplateBoard}
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
      />
    </div>
  );
};

export default BingoBoard;
