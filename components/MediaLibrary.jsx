import React from "react";
import Image from "next/image";

const MediaItem = ({ item, onClick }) => (
  <div
    className="bg-gray-700 p-2 mb-2 rounded cursor-pointer hover:bg-gray-600 flex items-center"
    onClick={() => onClick(item)}
  >
    <div className="w-20 h-20 relative mr-3 flex-shrink-0">
      <Image
        src={item.thumbnail}
        alt={item.name}
        layout="fill"
        objectFit="cover"
        className="rounded"
      />
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-300">
        Duration: {formatDuration(item.duration)}
      </p>
      <p className="text-sm text-gray-300">Size: {formatFileSize(item.size)}</p>
    </div>
  </div>
);

const MediaLibrary = ({ items, onItemClick }) => (
  <div>
    <h2 className="text-xl mb-4">Media Library</h2>
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

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
}

export default MediaLibrary;
