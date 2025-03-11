// frontend/src/hooks/useBoardGridDnD.js
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const useBoardGridDnD = (order, onOrderChange) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(Number(active.id));
    const newIndex = order.indexOf(Number(over.id));
    const newOrder = arrayMove(order, oldIndex, newIndex);
    if (onOrderChange) {
      onOrderChange(newOrder);
    }
  };

  return { sensors, handleDragEnd };
};

export default useBoardGridDnD;
