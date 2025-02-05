import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TileEditor from "./TileEditor";

const Tile = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id.toString() });
  const [isEditing, setIsEditing] = useState(false);
  const [tileText, setTileText] = useState(id.toString());

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // When editing, disable pointer events so drag doesn't interfere.
    pointerEvents: isEditing ? "none" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : attributes)}
      {...(isEditing ? {} : listeners)}
      data-testid="bingo-cell"
      className="relative border border-black bg-white flex items-center justify-center p-14 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <span data-testid="tile-content">{tileText}</span>
      {isEditing && (
        <TileEditor
          key={`tile-editor-${id}`} // force remount on open
          onSelectEntry={(entry) => {
            setTileText(entry);
            setIsEditing(false);
          }}
          onCancel={() => {
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default Tile;
