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
        className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2 text-[#362511]">
          Enter Board Name to Find
        </h2>
        <input
          type="text"
          value={findBoardName}
          onChange={(e) => setFindBoardName(e.target.value)}
          className="border border-[#8B5A2B] rounded-lg p-1 mb-2 w-full"
          placeholder="Board name"
        />
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
            Find Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindBoardModal;
