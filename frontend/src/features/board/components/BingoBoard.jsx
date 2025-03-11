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
    boardTitle,
    setBoardTitle,
    boardPassword,
    setBoardPassword,
    osrsUsername, // OSRS username state
    setOsrsUsername, // OSRS username setter
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
  } = useBingoBoardLogic();

  return (
    <div className="p-4 text-center flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">{boardTitle}</h1>
      <div className="w-full flex justify-between items-center mb-2">
        <BoardControls
          rows={rows}
          columns={columns}
          onRowsChange={setRows}
          onColumnsChange={setColumns}
        />
        <div className="flex space-x-2">
          <button onClick={undo} className="bg-gray-200 text-black p-2 rounded">
            Undo
          </button>
          <button onClick={redo} className="bg-gray-200 text-black p-2 rounded">
            Redo
          </button>
        </div>
      </div>
      <BoardGrid
        rows={rows}
        columns={columns}
        tiles={tiles}
        onTileUpdate={handleTileUpdate}
        order={order}
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
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardPassword={boardPassword}
        setBoardPassword={setBoardPassword}
        osrsUsername={osrsUsername} // pass OSRS username state
        setOsrsUsername={setOsrsUsername} // pass OSRS username setter
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
