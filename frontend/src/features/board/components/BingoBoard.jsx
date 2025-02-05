import React, { useState } from "react";

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);

  const cells = Array(rows * columns).fill(null);

  return (
    <div data-testid="bingo-board">
      <h1>Bingo Board</h1>

      <div className="controls">
        <div>
          <label htmlFor="rows-input">Rows:</label>
          <input
            id="rows-input"
            type="number"
            value={rows}
            aria-label="Rows:"
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="columns-input">Columns:</label>
          <input
            id="columns-input"
            type="number"
            value={columns}
            aria-label="Columns:"
            onChange={(e) => setColumns(Number(e.target.value))}
          />
        </div>
      </div>

      <div
        data-testid="bingo-grid"
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {cells.map((_, index) => (
          <div key={index} data-testid="bingo-cell">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;
