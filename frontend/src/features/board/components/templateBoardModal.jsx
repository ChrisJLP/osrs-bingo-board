import React from "react";
import LoadingSpinner from "./LoadingSpinner";

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
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-[#f0e8da] p-4 rounded-lg shadow-md w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
            <LoadingSpinner size="w-8 h-8" />
          </div>
        )}
        <h2 className="text-lg font-bold mb-2 text-[#362511]">
          Create New Board
        </h2>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full text-[#362511]"
          placeholder="Enter new board name"
        />
        <input
          type="text"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full text-[#362511]"
          placeholder="Enter board title"
        />
        <input
          type="password"
          value={boardPassword}
          onChange={(e) => setBoardPassword(e.target.value)}
          className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full text-[#362511]"
          placeholder="Enter new board password"
        />
        <input
          type="text"
          name="templateOsrsUsernameField"
          value={osrsUsername}
          onChange={(e) => setOsrsUsername(e.target.value)}
          className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full text-[#362511]"
          placeholder="Enter OSRS username (optional)"
          autoComplete="new-password"
        />
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-[#bfb3a7] text-[#362511] p-2 rounded-lg hover:scale-105 transition"
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

export default TemplateBoardModal;
