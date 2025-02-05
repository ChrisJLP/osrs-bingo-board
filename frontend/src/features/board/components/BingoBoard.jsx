import React, { useState } from "react";

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);

  const totalCells = rows * columns;
  const cells = Array.from({ length: totalCells }, (_, index) => index + 1);

  return (
    <div data-testid="bingo-board" className="p-4">
      <h1 className="text-xl font-bold mb-4">Bingo Board</h1>

      <div className="controls flex space-x-4 mb-4">
        <div>
          <label htmlFor="rows-input" className="block mb-1">
            Rows:
          </label>
          <input
            id="rows-input"
            type="number"
            value={rows}
            aria-label="Rows:"
            onChange={(e) => setRows(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>
        <div>
          <label htmlFor="columns-input" className="block mb-1">
            Columns:
          </label>
          <input
            id="columns-input"
            type="number"
            value={columns}
            aria-label="Columns:"
            onChange={(e) => setColumns(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        </div>
      </div>

      <div
        data-testid="bingo-grid"
        className="grid gap-2"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {cells.map((cell) => (
          <div
            key={cell}
            data-testid="bingo-cell"
            className="border border-black bg-white flex items-center justify-center p-4"
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;
