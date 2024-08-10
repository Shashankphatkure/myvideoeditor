"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TIMELINE_PADDING = 20;
const ZOOM_SPEED = 0.1;

const TimelineItem = ({
  item,
  index,
  onRemove,
  onTrimChange,
  onEffectChange,
  onAudioChange,
  scale,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${item.duration * scale}px`,
  };

  const startHandleRef = useRef(null);
  const endHandleRef = useRef(null);

  const handleTrimDrag = useCallback(
    (e, type) => {
      const rect = e.target.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTrim = Math.max(0, Math.min(item.duration, x / scale));
      onTrimChange(item.id, type, newTrim);
    },
    [item, scale, onTrimChange]
  );

  useEffect(() => {
    const startHandle = startHandleRef.current;
    const endHandle = endHandleRef.current;

    const handleStartDrag = (e) => handleTrimDrag(e, "trimStart");
    const handleEndDrag = (e) => handleTrimDrag(e, "trimEnd");

    startHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      window.addEventListener("mousemove", handleStartDrag);
      window.addEventListener(
        "mouseup",
        () => {
          window.removeEventListener("mousemove", handleStartDrag);
        },
        { once: true }
      );
    });

    endHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      window.addEventListener("mousemove", handleEndDrag);
      window.addEventListener(
        "mouseup",
        () => {
          window.removeEventListener("mousemove", handleEndDrag);
        },
        { once: true }
      );
    });

    return () => {
      startHandle.removeEventListener("mousedown", handleStartDrag);
      endHandle.removeEventListener("mousedown", handleEndDrag);
    };
  }, [handleTrimDrag]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-blue-500 rounded flex flex-col mb-2 relative h-32"
    >
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold">{item.name}</span>
          <select
            value={item.effect || "none"}
            onChange={(e) => onEffectChange(item.id, e.target.value)}
            className="bg-blue-600 text-white text-xs p-1 rounded"
          >
            <option value="none">No Effect</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={item.volume || 1}
            onChange={(e) =>
              onAudioChange(item.id, "volume", parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <label className="text-xs mb-1">Fade In</label>
            <input
              type="range"
              min="0"
              max={item.duration / 2}
              step="0.1"
              value={item.fadeIn || 0}
              onChange={(e) =>
                onAudioChange(item.id, "fadeIn", parseFloat(e.target.value))
              }
              className="w-24"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs mb-1">Fade Out</label>
            <input
              type="range"
              min="0"
              max={item.duration / 2}
              step="0.1"
              value={item.fadeOut || 0}
              onChange={(e) =>
                onAudioChange(item.id, "fadeOut", parseFloat(e.target.value))
              }
              className="w-24"
            />
          </div>
        </div>
      </div>
      <div
        ref={startHandleRef}
        className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400 cursor-ew-resize"
        style={{ left: `${item.trimStart * scale}px` }}
      />
      <div
        ref={endHandleRef}
        className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-400 cursor-ew-resize"
        style={{ right: `${(item.duration - item.trimEnd) * scale}px` }}
      />
    </div>
  );
};

const Timeline = ({
  items,
  onRemoveItem,
  onReorder,
  onTrimChange,
  onEffectChange,
  onAudioChange,
}) => {
  const [scale, setScale] = useState(1);
  const timelineRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const newScale = Math.max(
          0.1,
          Math.min(10, scale - e.deltaY * ZOOM_SPEED)
        );
        setScale(newScale);
      }
    },
    [scale]
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    timeline.addEventListener("wheel", handleWheel, { passive: false });
    return () => timeline.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="relative h-full" ref={timelineRef}>
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-700 flex items-center px-2">
          {Array.from({ length: Math.ceil(totalDuration / 60) }).map(
            (_, index) => (
              <div
                key={index}
                className="absolute text-xs"
                style={{ left: `${index * 60 * scale + TIMELINE_PADDING}px` }}
              >
                {index + 1}m
              </div>
            )
          )}
        </div>
        <div className="absolute top-8 left-0 right-0 bottom-0 overflow-x-auto">
          <div
            style={{
              width: `${totalDuration * scale + TIMELINE_PADDING * 2}px`,
              padding: `${TIMELINE_PADDING}px`,
            }}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  index={index}
                  onRemove={onRemoveItem}
                  onTrimChange={onTrimChange}
                  onEffectChange={onEffectChange}
                  onAudioChange={onAudioChange}
                  scale={scale}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Timeline;
