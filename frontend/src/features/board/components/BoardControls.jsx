import React from "react";

const BoardControls = ({ rows, columns, onRowsChange, onColumnsChange }) => (
  <div className="controls flex space-x-4 mb-4">
    <div>
      <label className="block mb-1">Rows:</label>
      <input
        type="number"
        value={rows}
        onChange={(e) => onRowsChange(Number(e.target.value))}
        className="border rounded p-1 w-20"
      />
    </div>
    <div>
      <label className="block mb-1">Columns:</label>
      <input
        type="number"
        value={columns}
        onChange={(e) => onColumnsChange(Number(e.target.value))}
        className="border rounded p-1 w-20"
      />
    </div>
  </div>
);

export default BoardControls;
