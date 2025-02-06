// frontend/src/features/board/components/CustomEntry.jsx
import React from "react";

const CustomEntry = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter custom text..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CustomEntry;
