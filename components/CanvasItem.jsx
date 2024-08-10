import React from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";

const CanvasItem = ({ item, onSelect, onResize }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleResizeStop = (e, direction, ref, d) => {
    onResize(item.width + d.width, item.height + d.height);
  };

  return (
    <Resizable
      size={{ width: item.width, height: item.height }}
      onResizeStop={handleResizeStop}
      enable={{
        top: false,
        right: true,
        bottom: true,
        left: false,
        topRight: true,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <div
        ref={drag}
        style={{
          position: "absolute",
          left: item.x,
          top: item.y,
          width: "100%",
          height: "100%",
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          pointerEvents: "auto",
        }}
        onClick={() => onSelect(item)}
      >
        {item.type === "IMAGE" && (
          <img
            src={item.url}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
        {item.type === "TEXT" && <div>{item.text}</div>}
        {item.type === "SHAPE" && (
          <div
            style={{ background: item.color, width: "100%", height: "100%" }}
          ></div>
        )}
      </div>
    </Resizable>
  );
};

export default CanvasItem;
