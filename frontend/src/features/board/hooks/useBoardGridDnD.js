// frontend/src/hooks/useBoardGridDnD.js
import { useState } from "react";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const useBoardGridDnD = (initialOrder = []) => {
  const [order, setOrder] = useState(initialOrder);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  };

  return { order, setOrder, sensors, handleDragEnd };
};

export default useBoardGridDnD;
