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
      : Array.from({ length: rows * columns }, (_, i) => i + 1);

  // If row/col changes, reset or create an updated order
  useEffect(() => {
    const neededOrder = Array.from({ length: rows * columns }, (_, i) => i + 1);
    if (!order || order.length !== neededOrder.length) {
      onOrderChange(neededOrder);
    }
  }, [rows, columns, order, onOrderChange]);

  // useBoardGridDnD is presumably your custom DnD logic hook
  const { sensors, handleDragEnd } = useBoardGridDnD(
    currentOrder,
    onOrderChange
  );

  return (
    <div className="md:w-[700px] w-[400px] border-2 border-[#8B5A2B] bg-[#FDF6E3] p-2 rounded-lg shadow-md">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentOrder.map(String)}
          strategy={rectSortingStrategy}
        >
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {currentOrder.map((tileId) => (
              <div key={tileId} className="relative w-full h-0 pb-[100%]">
                <div className="absolute top-0 left-0 w-full h-full">
                  <Tile
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
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BoardGrid;
