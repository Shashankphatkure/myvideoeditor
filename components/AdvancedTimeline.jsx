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
const TRACK_HEIGHT = 50;

const TimelineItem = ({
  item,
  trackIndex,
  onTrimChange,
  onEffectChange,
  onAudioChange,
  scale,
  onItemClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${item.duration * scale}px`,
    height: `${TRACK_HEIGHT}px`,
    position: "absolute",
    left: `${item.start * scale}px`,
    top: `${trackIndex * (TRACK_HEIGHT + 5)}px`,
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
      className={`rounded flex flex-col relative cursor-move ${
        item.type === "video" ? "bg-blue-500" : "bg-green-500"
      }`}
      onClick={() => onItemClick(item)}
    >
      <div className="absolute inset-0 flex items-center justify-between p-1 text-xs">
        <span className="font-bold truncate">{item.name}</span>
        {item.type === "video" && (
          <select
            value={item.effect || "none"}
            onChange={(e) => onEffectChange(item.id, e.target.value)}
            className="bg-blue-600 text-white text-xs p-1 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="none">No Effect</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
          </select>
        )}
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

const AdvancedTimeline = ({
  items,
  onRemoveItem,
  onReorder,
  onTrimChange,
  onEffectChange,
  onAudioChange,
  currentTime,
  totalDuration,
  onItemClick,
}) => {
  const [scale, setScale] = useState(1);
  const timelineRef = useRef(null);
  const [tracks, setTracks] = useState([
    {
      id: "video",
      type: "video",
      items: items.filter((item) => item.type === "video"),
    },
    {
      id: "audio",
      type: "audio",
      items: items.filter((item) => item.type === "audio"),
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeTrack = tracks.find((track) =>
        track.items.some((item) => item.id === active.id)
      );
      const overTrack = tracks.find((track) =>
        track.items.some((item) => item.id === over.id)
      );

      if (activeTrack && overTrack) {
        setTracks(
          tracks.map((track) => {
            if (track.id === activeTrack.id) {
              return {
                ...track,
                items: track.items.filter((item) => item.id !== active.id),
              };
            }
            if (track.id === overTrack.id) {
              const oldIndex = track.items.findIndex(
                (item) => item.id === over.id
              );
              const newItem = items.find((item) => item.id === active.id);
              return {
                ...track,
                items: [
                  ...track.items.slice(0, oldIndex),
                  newItem,
                  ...track.items.slice(oldIndex),
                ],
              };
            }
            return track;
          })
        );
      }
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

  const renderTracks = () => {
    return tracks.map((track, trackIndex) => (
      <div
        key={track.id}
        className="relative"
        style={{ height: `${TRACK_HEIGHT}px`, marginBottom: "5px" }}
      >
        {track.items.map((item) => (
          <TimelineItem
            key={item.id}
            item={item}
            trackIndex={trackIndex}
            onTrimChange={onTrimChange}
            onEffectChange={onEffectChange}
            onAudioChange={onAudioChange}
            scale={scale}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    ));
  };

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
        <div className="absolute top-8 left-0 right-0 bottom-0 overflow-x-auto overflow-y-hidden">
          <div
            style={{
              width: `${totalDuration * scale + TIMELINE_PADDING * 2}px`,
              padding: `${TIMELINE_PADDING}px`,
              height: `${tracks.length * (TRACK_HEIGHT + 5)}px`,
            }}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {renderTracks()}
            </SortableContext>
          </div>
        </div>
        <div
          className="absolute top-8 bottom-0 w-px bg-red-500"
          style={{ left: `${currentTime * scale + TIMELINE_PADDING}px` }}
        />
      </div>
    </DndContext>
  );
};

export default AdvancedTimeline;
