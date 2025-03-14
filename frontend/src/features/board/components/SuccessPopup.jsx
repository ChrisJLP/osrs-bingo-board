import React, { useEffect } from "react";

const SuccessPopup = ({
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-[#f0e8da] border border-[#8B5A2B] p-4 rounded-lg shadow-lg">
        <p className="text-[#362511] font-bold">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 bg-[#D4AF37] text-[#362511] px-3 py-1 rounded-lg transition hover:bg-[#C59C2A]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
