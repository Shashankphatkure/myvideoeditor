import React, { useState, useRef, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { FiVideo, FiMusic } from "react-icons/fi";

const TIMELINE_HEIGHT = 300;
const TRACK_HEIGHT = 50;
const ZOOM_SPEED = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

const TimelineTrack = ({ type, items, zoom, onItemMove }) => {
  const { setNodeRef } = useDroppable({ id: `track-${type}` });

  return (
    <div ref={setNodeRef} className="h-16 bg-gray-700 relative mb-2 rounded-md">
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          item={item}
          zoom={zoom}
          onMove={onItemMove}
        />
      ))}
    </div>
  );
};

const TimelineItem = ({ item, zoom, onMove }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = {
    width: `${item.duration * zoom}px`,
    left: `${item.start * zoom}px`,
    height: `${TRACK_HEIGHT}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute top-0 bg-blue-500 rounded cursor-move"
      {...listeners}
      {...attributes}
    >
      <div className="p-1 text-xs truncate">{item.name}</div>
    </div>
  );
};

const Playhead = ({ position, zoom, height }) => (
  <div
    className="absolute top-0 w-px bg-red-500 z-10"
    style={{ left: `${position * zoom}px`, height: `${height}px` }}
  />
);

const TimeRuler = ({ duration, zoom }) => {
  const intervals = [];
  const intervalSize = 60; // 1 minute intervals
  for (let i = 0; i <= duration; i += intervalSize) {
    intervals.push(
      <div
        key={i}
        className="absolute h-full flex items-end pb-1"
        style={{ left: `${i * zoom}px` }}
      >
        <span className="text-xs text-gray-400">
          {Math.floor(i / 60)}:{(i % 60).toString().padStart(2, "0")}
        </span>
      </div>
    );
  }
  return <div className="h-6 bg-gray-800 relative">{intervals}</div>;
};

const AdvancedTimeline = ({
  items,
  currentTime,
  duration,
  onItemMove,
  onPlayheadMove,
}) => {
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef(null);

  const videoItems = items.filter((item) => item.type === "video");
  const audioItems = items.filter((item) => item.type === "audio");

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, zoom - e.deltaY * ZOOM_SPEED)
      );
      setZoom(newZoom);
    }
  };

  const handlePlayheadMove = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onPlayheadMove(x / zoom);
    }
  };

  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (timeline) {
        timeline.removeEventListener("wheel", handleWheel);
      }
    };
  }, [zoom]);

  return (
    <DndContext onDragEnd={onItemMove}>
      <div
        className="bg-gray-900 p-4 rounded-lg shadow-inner"
        style={{ height: `${TIMELINE_HEIGHT}px` }}
      >
        <div
          ref={timelineRef}
          className="relative"
          style={{ width: `${duration * zoom}px` }}
          onClick={handlePlayheadMove}
        >
          <TimeRuler duration={duration} zoom={zoom} />
          <TimelineTrack
            type="video"
            items={videoItems}
            zoom={zoom}
            onItemMove={onItemMove}
          />
          <TimelineTrack
            type="audio"
            items={audioItems}
            zoom={zoom}
            onItemMove={onItemMove}
          />
          <Playhead
            position={currentTime}
            zoom={zoom}
            height={TIMELINE_HEIGHT}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default AdvancedTimeline;
