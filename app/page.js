"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
const Canvas = dynamic(() => import("../components/Canvas"), { ssr: false });
const PropertiesPanel = dynamic(() => import("../components/PropertiesPanel"), {
  ssr: false,
});

export default function Home() {
  const [mediaItems] = useState([
    {
      id: 1,
      name: "Beach Sunset",
      url: "/videos/video1.mp4",
      duration: 120,
      size: 15728640,
      thumbnail: "/thumbnail/image1.png",
      type: "video",
    },
    {
      id: 2,
      name: "City Timelapse",
      url: "/videos/video2.mp4",
      duration: 180,
      size: 31457280,
      thumbnail: "/thumbnail/image2.png",
      type: "video",
    },
    {
      id: 3,
      name: "Nature Sounds",
      url: "/audio/audio1.mp3",
      duration: 60,
      size: 5242880,
      thumbnail: "/thumbnail/audio1.png",
      type: "audio",
    },
    {
      id: 4,
      name: "Landscape Image",
      url: "/images/landscape.jpg",
      size: 2097152,
      thumbnail: "/thumbnail/landscape_thumb.jpg",
      type: "image",
    },
  ]);

  const [timelineItems, setTimelineItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCanvasItem, setSelectedCanvasItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLastProject = () => {
      try {
        const lastProject = localStorage.getItem("lastProject");
        if (lastProject) {
          const parsedProject = JSON.parse(lastProject);
          setCurrentProject(parsedProject);
          setTimelineItems(parsedProject.timelineItems || []);
          setCanvasItems(parsedProject.canvasItems || []);
          setCurrentVideo(parsedProject.currentVideo || null);
        }
      } catch (error) {
        console.error("Error loading last project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLastProject();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleMediaItemClick = useCallback(
    (item) => {
      if (item.type === "video" || item.type === "audio") {
        setTimelineItems((prevItems) => [
          ...prevItems,
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
        setTotalDuration((prevDuration) => prevDuration + item.duration);
        if (item.type === "video") {
          setCurrentVideo(item.url);
        }
      } else if (item.type === "image") {
        setCanvasItems((prevItems) => [
          ...prevItems,
          {
            ...item,
            id: Date.now(),
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
        ]);
      }
    },
    [totalDuration]
  );

  const handleItemMove = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTimelineItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handlePlayheadMove = useCallback((newTime) => {
    setCurrentTime(newTime);
  }, []);

  const handleSaveProject = useCallback(
    (project) => {
      const projectData = {
        ...project,
        timelineItems,
        canvasItems,
        currentVideo,
      };
      setCurrentProject(projectData);
      localStorage.setItem("lastProject", JSON.stringify(projectData));
    },
    [timelineItems, canvasItems, currentVideo]
  );

  const handleLoadProject = useCallback((project) => {
    setCurrentProject(project);
    setTimelineItems(project.data.timelineItems || []);
    setCanvasItems(project.data.canvasItems || []);
    setCurrentVideo(project.data.currentVideo || null);
    localStorage.setItem("lastProject", JSON.stringify(project.data));
  }, []);

  const handleNewProject = useCallback(() => {
    setCurrentProject(null);
    setTimelineItems([]);
    setCanvasItems([]);
    setCurrentVideo(null);
    localStorage.removeItem("lastProject");
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleProgress = useCallback((state) => {
    setCurrentTime(state.playedSeconds);
  }, []);

  const handleDuration = useCallback((duration) => {
    setTotalDuration(duration);
  }, []);

  const updateCanvasItem = useCallback((updatedItem) => {
    setCanvasItems((items) =>
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const memoizedCanvas = useMemo(
    () => (
      <Canvas
        items={canvasItems}
        setItems={setCanvasItems}
        onSelectItem={setSelectedCanvasItem}
      />
    ),
    [canvasItems]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <header className="bg-gray-800 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Advanced Video Editor
            </h1>
            <div className="flex space-x-4">
              <button
                className="btn-primary"
                onClick={() => handleSaveProject(currentProject)}
              >
                <FiSave className="mr-2" /> Save Project
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleLoadProject(currentProject)}
              >
                <FiFolder className="mr-2" /> Open Project
              </button>
              <button className="btn-secondary" onClick={handleNewProject}>
                <FiPlus className="mr-2" /> New Project
              </button>
            </div>
          </div>
        </header>
        <main className="flex-grow flex overflow-hidden p-4">
          <aside className="w-64 bg-gray-800 rounded-lg shadow-lg overflow-y-auto mr-4">
            <MediaLibrary
              items={mediaItems}
              onItemClick={handleMediaItemClick}
            />
            <ProjectManager
              currentProject={currentProject}
              onSave={handleSaveProject}
              onLoad={handleLoadProject}
              onNew={handleNewProject}
            />
          </aside>
          <section className="flex-grow flex flex-col overflow-hidden bg-gray-800 rounded-lg shadow-lg">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
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
              {memoizedCanvas}
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
          <aside className="w-64 bg-gray-800 rounded-lg shadow-lg overflow-y-auto ml-4">
            <PropertiesPanel
              selectedItem={selectedCanvasItem}
              onUpdateItem={updateCanvasItem}
            />
          </aside>
        </main>
        <footer className="bg-gray-800 p-4 shadow-md mt-4">
          <div className="container mx-auto flex justify-between items-center">
            <ExportPreview
              timelineItems={timelineItems}
              canvasItems={canvasItems}
            />
            <button className="btn-primary">
              <FiUpload className="mr-2" /> Export Video
            </button>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}

function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}
