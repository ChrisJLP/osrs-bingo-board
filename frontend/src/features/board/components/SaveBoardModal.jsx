// frontend/src/features/board/components/SaveBoardModal.jsx
import React from "react";

const SaveBoardModal = ({
  isOpen,
  onConfirm,
  onCancel,
  boardName,
  setBoardName,
  boardPassword,
  setBoardPassword,
  errorMessage,
  isExistingBoard,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">
          {isExistingBoard
            ? "Enter Board Password to Update Board"
            : "Enter Board Details"}
        </h2>
        {isExistingBoard ? (
          <>
            <p className="mb-2">
              <strong>Board Name:</strong> {boardName}
            </p>
            <input
              type="password"
              value={boardPassword}
              onChange={(e) => setBoardPassword(e.target.value)}
              className="border rounded p-1 mb-2 w-full"
              placeholder="Enter board password"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="border rounded p-1 mb-2 w-full"
              placeholder="e.g. Ironman goals 2025"
            />
            <input
              type="password"
              value={boardPassword}
              onChange={(e) => setBoardPassword(e.target.value)}
              className="border rounded p-1 mb-2 w-full"
              placeholder="Enter board password"
            />
          </>
        )}
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-300 p-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveBoardModal;
