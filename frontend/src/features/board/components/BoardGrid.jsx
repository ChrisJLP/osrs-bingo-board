import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Tile from "./Tile";

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
  order,
  tiles,
  onTileUpdate,
  sensors,
  handleDragEnd,
}) => {
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
          items={order.map(String)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-1" style={gridStyle}>
            {order.map((tileId) => (
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BoardGrid;
