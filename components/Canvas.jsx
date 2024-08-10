import React from "react";
import { useDrop } from "react-dnd";
import CanvasItem from "./CanvasItem";

const Canvas = ({ items, setItems, onSelectItem }) => {
  const [, drop] = useDrop(() => ({
    accept: ["IMAGE", "TEXT", "SHAPE"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      addItemToCanvas(item, offset);
    },
  }));

  const addItemToCanvas = (item, offset) => {
    const newItem = {
      ...item,
      id: Date.now(),
      x: offset.x,
      y: offset.y,
      width: 100,
      height: 100,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleResizeItem = (id, newWidth, newHeight) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, width: newWidth, height: newHeight } : item
      )
    );
  };

  return (
    <div
      ref={drop}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {items.map((item) => (
        <CanvasItem
          key={item.id}
          item={item}
          onSelect={() => onSelectItem(item)}
          onResize={(newWidth, newHeight) =>
            handleResizeItem(item.id, newWidth, newHeight)
          }
        />
      ))}
    </div>
  );
};

export default Canvas;
