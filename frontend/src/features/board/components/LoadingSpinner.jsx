import React from "react";

const LoadingSpinner = ({ size = "w-6 h-6", color = "border-[#d4af37]" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 ${color} border-t-transparent ${size}`}
    ></div>
  );
};

export default LoadingSpinner;
