// frontend/src/features/board/components/BoardGrid.jsx
import React, { useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Tile from "./Tile";
import useBoardGridDnD from "../hooks/useBoardGridDnD";

const defaultTileData = {
  content: "",
  target: 0,
  unit: "drops",
  progress: 0,
  completed: false,
};

const BoardGrid = ({
  rows,
  columns,
  tiles,
  onTileUpdate,
  order,
  onOrderChange,
  osrsData,
}) => {
  const currentOrder =
    order && order.length === rows * columns
      ? order
      : Array.from({ length: rows * columns }, (_, index) => index + 1);

  useEffect(() => {
    const newOrder = Array.from(
      { length: rows * columns },
      (_, index) => index + 1
    );
    if (!order || order.length !== newOrder.length) {
      onOrderChange(newOrder);
    }
  }, [rows, columns, order, onOrderChange]);

  const { sensors, handleDragEnd } = useBoardGridDnD(
    currentOrder,
    onOrderChange
  );

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="border-2 border-gray-400 bg-gray-100 p-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentOrder.map(String)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-1" style={gridStyle}>
            {currentOrder.map((tileId) => (
              <Tile
                key={tileId}
                id={tileId}
                data={
                  tiles[tileId] || {
                    ...defaultTileData,
                    content: tileId.toString(),
                  }
                }
                onTileUpdate={onTileUpdate}
                osrsData={osrsData}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BoardGrid;
