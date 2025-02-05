import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Tile = ({ id }) => {
  // useSortable makes this component draggable.
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
};

export default Tile;
