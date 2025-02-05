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
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// A sortable tile component using dnd-kit's hook
function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid="bingo-cell"
      className="border border-black bg-white flex items-center justify-center p-4"
    >
      {id}
    </div>
  );
}

const BingoBoard = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [order, setOrder] = useState([]);

  // When rows/columns change, reset the tile order
  useEffect(() => {
    const totalCells = rows * columns;
    setOrder(Array.from({ length: totalCells }, (_, index) => index + 1));
  }, [rows, columns]);

  // Setup sensors for pointer input with a slight activation delay
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // When a drag ends, update the order
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

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
            className="grid gap-2"
            style={{
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {order.map((cell) => (
              <SortableItem key={cell} id={cell} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BingoBoard;
