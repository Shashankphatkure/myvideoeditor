import React, { useState } from "react";

import { FiUpload, FiSettings } from "react-icons/fi";

const ExportPreview = ({ timelineItems }) => {
  const [exportSettings, setExportSettings] = useState({
    format: "mp4",
    quality: "high",
  });

  const handleExport = () => {
    // Implement export logic here
    console.log("Exporting with settings:", exportSettings);
    console.log("Timeline items:", timelineItems);
  };
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl mb-4 font-semibold flex items-center">
        <FiSettings className="mr-2" /> Export Settings
      </h2>
      <div className="mb-4">
        <label className="block mb-2">Format:</label>
        <select
          value={exportSettings.format}
          onChange={(e) =>
            setExportSettings({ ...exportSettings, format: e.target.value })
          }
          className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
          <option value="mov">MOV</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Quality:</label>
        <select
          value={exportSettings.quality}
          onChange={(e) =>
            setExportSettings({ ...exportSettings, quality: e.target.value })
          }
          className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button onClick={handleExport} className="btn-primary w-full">
        <FiUpload className="mr-2" /> Export Video
      </button>
    </div>
  );
};

export default ExportPreview;
