import React from "react";

const CustomEntry = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter custom text..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#8b6d48] rounded-lg p-1 w-full text-[#3b2f25]"
      />
    </div>
  );
};

export default CustomEntry;
