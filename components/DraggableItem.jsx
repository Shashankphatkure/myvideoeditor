// components/DraggableItem.jsx
import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: item.left,
        top: item.top,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {item.type === "IMAGE" && (
        <img src={item.src} alt={item.name} style={{ width: "100px" }} />
      )}
      {item.type === "VIDEO" && <div>{item.name}</div>}
      {item.type === "STICKER" && (
        <img src={item.src} alt={item.name} style={{ width: "50px" }} />
      )}
    </div>
  );
};

export default DraggableItem;
