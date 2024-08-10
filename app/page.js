"use client";
import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FiPlay,
  FiPause,
  FiUpload,
  FiSave,
  FiFolder,
  FiPlus,
} from "react-icons/fi";

const ExportPreview = dynamic(() => import("../components/ExportPreview"), {
  ssr: false,
});

const CustomVideoPlayer = dynamic(
  () => import("../components/CustomVideoPlayer"),
  { ssr: false }
);
const AdvancedTimeline = dynamic(
  () => import("../components/AdvancedTimeline"),
  { ssr: false }
);
const MediaLibrary = dynamic(() => import("../components/MediaLibrary"), {
  ssr: false,
});
const ProjectManager = dynamic(() => import("../components/ProjectManager"), {
  ssr: false,
});

export default function Home() {
  const [mediaItems] = useState([
    {
      id: 1,
      name: "Beach Sunset",
      url: "/videos/video1.mp4",
      duration: 120,
      size: 15728640, // 15 MB
      thumbnail: "/thumbnail/image1.png",
    },
    {
      id: 2,
      name: "City Timelapse",
      url: "/videos/video1.mp4",
      duration: 180,
      size: 31457280, // 30 MB
      thumbnail: "/thumbnail/image1.png",
    },
    {
      id: 3,
      name: "Nature Sounds",
      url: "https://www.example.com/audio1.mp3",
      duration: 60,
      size: 5242880, // 5 MB
      thumbnail: "/thumbnail/image1.png",
    },
  ]);

  const [timelineItems, setTimelineItems] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const lastProject = localStorage.getItem("lastProject");
    if (lastProject) {
      const parsedProject = JSON.parse(lastProject);
      setCurrentProject(parsedProject);
      setTimelineItems(parsedProject.timelineItems || []);
      setCurrentVideo(parsedProject.currentVideo || null);
    }
  }, []);

  const handleMediaItemClick = (item) => {
    setTimelineItems([
      ...timelineItems,
      {
        ...item,
        id: Date.now(),
        start: totalDuration,
        trimStart: 0,
        trimEnd: item.duration,
        effect: "none",
        volume: 1,
        fadeIn: 0,
        fadeOut: 0,
      },
    ]);
    setTotalDuration(totalDuration + item.duration);
    if (item.type === "video") {
      setCurrentVideo(item.url);
    }
  };

  const handleItemMove = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTimelineItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePlayheadMove = (newTime) => {
    setCurrentTime(newTime);
  };

  const handleSaveProject = (project) => {
    const projectData = {
      ...project,
      timelineItems,
      currentVideo,
    };
    setCurrentProject(projectData);
    localStorage.setItem("lastProject", JSON.stringify(projectData));
  };

  const handleLoadProject = (project) => {
    setCurrentProject(project);
    setTimelineItems(project.data.timelineItems || []);
    setCurrentVideo(project.data.currentVideo || null);
    localStorage.setItem("lastProject", JSON.stringify(project.data));
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setTimelineItems([]);
    setCurrentVideo(null);
    localStorage.removeItem("lastProject");
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Advanced Video Editor
          </h1>
          <div className="flex space-x-4">
            <button className="btn-primary">
              <FiSave className="mr-2" /> Save Project
            </button>
            <button className="btn-secondary">
              <FiFolder className="mr-2" /> Open Project
            </button>
            <button className="btn-secondary">
              <FiPlus className="mr-2" /> New Project
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden p-4">
        <aside className="w-80 bg-gray-800 rounded-lg shadow-lg overflow-y-auto mr-4 transition-all duration-300 ease-in-out">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Media Library</h2>
            <MediaLibrary
              items={mediaItems}
              onItemClick={handleMediaItemClick}
            />
          </div>
          <div className="p-4 border-t border-gray-700">
            <ProjectManager
              currentProject={currentProject}
              onSave={handleSaveProject}
              onLoad={handleLoadProject}
              onNew={handleNewProject}
            />
          </div>
        </aside>
        <section className="flex-grow flex flex-col overflow-hidden bg-gray-800 rounded-lg shadow-lg">
          <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
            <CustomVideoPlayer
              currentVideo={
                currentVideo || "https://www.example.com/default-video.mp4"
              }
              timelineItems={timelineItems}
              currentTime={currentTime}
              onProgress={handleProgress}
              onDuration={handleDuration}
              playing={isPlaying}
            />
          </div>
          <div className="bg-gray-700 p-2 flex justify-center items-center">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>
          </div>
          <div className="flex-grow overflow-hidden">
            <AdvancedTimeline
              items={timelineItems}
              currentTime={currentTime}
              duration={totalDuration}
              onItemMove={handleItemMove}
              onPlayheadMove={handlePlayheadMove}
            />
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 p-4 shadow-md mt-4">
        <div className="container mx-auto flex justify-between items-center">
          <ExportPreview timelineItems={timelineItems} />
          <button className="btn-primary">
            <FiUpload className="mr-2" /> Export Video
          </button>
        </div>
      </footer>
    </div>
  );
}
