// TemplateBoardModal.jsx
import React from "react";

const TemplateBoardModal = ({
  isOpen,
  onConfirm,
  onCancel,
  boardName,
  setBoardName,
  boardTitle,
  setBoardTitle,
  boardPassword,
  setBoardPassword,
  osrsUsername,
  setOsrsUsername,
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
        <h2 className="text-lg font-bold mb-2">Create New Board</h2>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          className="border rounded p-1 mb-2 w-full"
          placeholder="Enter new board name"
        />
        <input
          type="text"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          className="border rounded p-1 mb-2 w-full"
          placeholder="Enter board title"
        />
        <input
          type="password"
          value={boardPassword}
          onChange={(e) => setBoardPassword(e.target.value)}
          className="border rounded p-1 mb-2 w-full"
          placeholder="Enter new board password"
        />
        <input
          type="text"
          value={osrsUsername}
          onChange={(e) => setOsrsUsername(e.target.value)}
          className="border rounded p-1 mb-2 w-full"
          placeholder="Enter OSRS username (optional)"
        />
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

export default TemplateBoardModal;
