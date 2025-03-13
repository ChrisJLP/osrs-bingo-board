import React from "react";

const BoardControls = ({ rows, columns, onRowsChange, onColumnsChange }) => (
  <div className="flex flex-col space-y-2 border border-[#8B5A2B] p-2 rounded-lg">
    <div>
      <label className="block mb-1 text-[#362511]">Rows:</label>
      <input
        type="number"
        value={rows}
        onChange={(e) => onRowsChange(Number(e.target.value))}
        className="border border-[#8B5A2B] rounded p-1 w-16"
      />
    </div>
    <div>
      <label className="block mb-1 text-[#362511]">Columns:</label>
      <input
        type="number"
        value={columns}
        onChange={(e) => onColumnsChange(Number(e.target.value))}
        className="border border-[#8B5A2B] rounded p-1 w-16"
      />
    </div>
  </div>
);

export default BoardControls;
