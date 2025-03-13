import React from "react";

const SaveBoardModal = ({
  isOpen,
  onConfirm,
  onCancel,
  boardName,
  setBoardName,
  boardTitle,
  setBoardTitle,
  boardPassword,
  setBoardPassword,
  errorMessage,
  isExistingBoard,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2 text-[#362511]">
          {isExistingBoard
            ? "Enter Board Details to Update Board"
            : "Enter Board Details"}
        </h2>
        {isExistingBoard ? (
          <>
            <p className="mb-2 text-[#362511]">
              <strong>Board Name:</strong> {boardName}
            </p>
            <div className="mb-2">
              <label className="block mb-1 text-[#362511]">Board Title:</label>
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="border border-[#8B5A2B] rounded-lg p-1 w-full"
                placeholder="Bingo Board"
              />
            </div>
            <input
              type="password"
              value={boardPassword}
              onChange={(e) => setBoardPassword(e.target.value)}
              className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full"
              placeholder="Enter board password"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full"
              placeholder="e.g. Ironman goals 2025"
            />
            <div className="mb-2">
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full"
                placeholder="Bingo Board"
              />
            </div>
            <input
              type="password"
              value={boardPassword}
              onChange={(e) => setBoardPassword(e.target.value)}
              className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full"
              placeholder="Enter board password"
            />
          </>
        )}
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-[#362511] p-2 rounded-lg hover:scale-105 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#D4AF37] text-[#362511] p-2 rounded-lg transition hover:bg-[#C59C2A] hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveBoardModal;
