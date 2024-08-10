"use client";

import React from "react";
import { FiFilm, FiMusic, FiImage } from "react-icons/fi";
import { useDrag } from "react-dnd";

const MediaItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type.toUpperCase(),
    item: { id: item.id, ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getIcon = () => {
    switch (item.type) {
      case "video":
        return <FiFilm className="mr-2" />;
      case "audio":
        return <FiMusic className="mr-2" />;
      case "image":
        return <FiImage className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-gray-700 p-3 rounded-md mb-2 cursor-move hover:bg-gray-600 transition-colors duration-200 flex items-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {getIcon()}
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-400">
          {item.type === "video" || item.type === "audio"
            ? `Duration: ${formatDuration(item.duration)}`
            : `Size: ${item.size}`}
        </p>
      </div>
    </div>
  );
};

const MediaLibrary = ({ items }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-800 p-4 overflow-y-auto h-screen">
      <h2 className="text-xl font-bold mb-4">Media Library</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search media..."
          className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredItems.map((item) => (
        <MediaItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Helper functions
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default MediaLibrary;
