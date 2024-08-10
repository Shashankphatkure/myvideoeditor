import React from "react";
import { FiFilm, FiMusic } from "react-icons/fi";

const MediaItem = ({ item, onClick }) => (
  <div
    className="bg-gray-700 p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200 flex items-center"
    onClick={() => onClick(item)}
  >
    {item.type === "video" ? (
      <FiFilm className="mr-2" />
    ) : (
      <FiMusic className="mr-2" />
    )}
    <div className="flex-grow">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-400">
        Duration: {formatDuration(item.duration)}
      </p>
    </div>
  </div>
);

const MediaLibrary = ({ items, onItemClick }) => (
  <div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search media..."
        className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
    </div>
    {items.map((item) => (
      <MediaItem key={item.id} item={item} onClick={onItemClick} />
    ))}
  </div>
);

// Helper functions
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default MediaLibrary;
