import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const ExportPreview = ({ timelineItems }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePreview = async () => {
    setIsGenerating(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real scenario, you'd send the timelineItems to a backend service
    // and get back a URL for the processed video. For now, we'll just use the first video.
    const firstVideoItem = timelineItems.find((item) =>
      item.url.includes("video")
    );
    setPreviewUrl(firstVideoItem ? firstVideoItem.url : "");

    setIsGenerating(false);
  };

  useEffect(() => {
    // Reset preview when timelineItems change
    setPreviewUrl("");
  }, [timelineItems]);

  return (
    <div className="mt-4">
      <button
        onClick={generatePreview}
        disabled={isGenerating || timelineItems.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isGenerating ? "Generating Preview..." : "Generate Export Preview"}
      </button>
      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Export Preview</h3>
          <ReactPlayer url={previewUrl} width="100%" height="auto" controls />
        </div>
      )}
    </div>
  );
};

export default ExportPreview;
