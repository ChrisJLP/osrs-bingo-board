// BingoBoard.jsx
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

  // Warn user if unsaved changes exist when trying to leave the page.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes on your board. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTemplateClick = () => {
    if (hasUnsavedChanges) {
      const confirmUnsaved = window.confirm(
        "You have unsaved changes. Please save your changes first, or if you continue, they will be discarded. Continue?"
      );
      if (!confirmUnsaved) return;
    }
    setShowTemplateModal(true);
  };

  return (
    <div className="p-4 text-center flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">{boardTitle}</h1>
      <div className="w-full flex flex-col items-center mb-2">
        <BoardControls
          rows={rows}
          columns={columns}
          onRowsChange={setRows}
          onColumnsChange={setColumns}
        />
        <div className="flex space-x-2 mt-2">
          <button onClick={undo} className="bg-gray-200 text-black p-2 rounded">
            Undo
          </button>
          <button onClick={redo} className="bg-gray-200 text-black p-2 rounded">
            Redo
          </button>
        </div>
        <div className="osrs-username-container my-2">
          <label className="mr-2 font-semibold">OSRS Username:</label>
          <input
            type="text"
            value={osrsUsername}
            onChange={(e) => setOsrsUsername(e.target.value)}
            className="border rounded p-1"
            placeholder="Enter OSRS username"
            autoComplete="off"
          />
          <button
            onClick={() => updateOsrsData()}
            className="bg-blue-500 text-white p-1 rounded ml-2"
          >
            Update
          </button>
          {osrsData && <span className="ml-2 text-green-600">Data Cached</span>}
        </div>
      </div>
      <BoardGrid
        rows={rows}
        columns={columns}
        tiles={tiles}
        onTileUpdate={handleTileUpdate}
        order={order}
        onOrderChange={setOrder}
        osrsData={osrsData}
      />
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
        <button
          onClick={handleTemplateClick}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Use board as a template
        </button>
      </div>
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
