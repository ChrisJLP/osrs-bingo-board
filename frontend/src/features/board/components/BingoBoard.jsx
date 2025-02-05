import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Tile from "./Tile";

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const totalCells = rows * columns;
    setOrder(Array.from({ length: totalCells }, (_, index) => index + 1));
  }, [rows, columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div
      data-testid="bingo-board"
      className="p-4 text-center flex flex-col items-center"
    >
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

      {/* Board container with border, background and inner padding for gap */}
      <div className="border-2 border-gray-400 bg-gray-100 p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={order.map(String)}
            strategy={rectSortingStrategy}
          >
            <div
              data-testid="bingo-grid"
              className="grid gap-1"
              style={gridStyle}
            >
              {order.map((cell) => (
                <Tile key={cell} id={cell} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default BingoBoard;
