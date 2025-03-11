// frontend/src/features/board/components/BingoBoard.jsx
import React from "react";
import SaveBoardModal from "./SaveBoardModal";
import FindBoardModal from "./FindBoardModal";
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
    boardTitle, // added boardTitle
    setBoardTitle, // added setBoardTitle
    boardPassword,
    setBoardPassword,
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
  } = useBingoBoardLogic();

  return (
    <div className="p-4 text-center flex flex-col items-center">
      {/* Use the boardTitle state here */}
      <h1 className="text-xl font-bold mb-4">{boardTitle}</h1>

      <BoardControls
        rows={rows}
        columns={columns}
        onRowsChange={setRows}
        onColumnsChange={setColumns}
      />
      <BoardGrid
        rows={rows}
        columns={columns}
        tiles={tiles}
        onTileUpdate={handleTileUpdate}
        onOrderChange={setOrder}
      />
      <div className="mt-4">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isExistingBoard ? "Update board" : "Save Board"}
        </button>
      </div>
      <SaveBoardModal
        isOpen={showSaveModal}
        onConfirm={confirmSave}
        onCancel={() => setShowSaveModal(false)}
        boardName={boardName}
        setBoardName={setBoardName}
        boardTitle={boardTitle} // pass boardTitle to modal
        setBoardTitle={setBoardTitle} // pass its setter
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
    </div>
  );
};

export default BingoBoard;
