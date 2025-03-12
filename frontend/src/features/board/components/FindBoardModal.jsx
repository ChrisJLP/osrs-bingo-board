// FindBoardModal.jsx
import React from "react";

const FindBoardModal = ({
  isOpen,
  onConfirm,
  onCancel,
  findBoardName,
  setFindBoardName,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">Enter Board Name to Find</h2>
        <input
          type="text"
          value={findBoardName}
          onChange={(e) => setFindBoardName(e.target.value)}
          className="border rounded p-1 mb-2 w-full"
          placeholder="Board name"
        />
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-300 p-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white p-2 rounded"
          >
            Find Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBoardModal;
