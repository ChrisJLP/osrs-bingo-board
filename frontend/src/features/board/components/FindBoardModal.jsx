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
        className="bg-[#f0e8da] p-4 rounded-lg shadow-md w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2 text-[#3b2f25]">
          Enter Board Name to Find
        </h2>
        <input
          type="text"
          value={findBoardName}
          onChange={(e) => setFindBoardName(e.target.value)}
          className="border border-[#8b6d48] rounded-lg p-1 mb-2 w-full text-[#3b2f25]"
          placeholder="Board name"
        />
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-[#bfb3a7] text-[#3b2f25] p-2 rounded-lg hover:scale-105 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#d4af37] text-[#3b2f25] p-2 rounded-lg transition hover:bg-[#c59c2a] hover:scale-105"
          >
            Find Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBoardModal;
