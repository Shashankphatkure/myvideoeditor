"use client";
import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const ExportPreview = dynamic(() => import("../components/ExportPreview"), {
  ssr: false,
});

const CustomVideoPlayer = dynamic(
  () => import("../components/CustomVideoPlayer"),
  { ssr: false }
);
const Timeline = dynamic(() => import("../components/Timeline"), {
  ssr: false,
});
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
        trimStart: 0,
        trimEnd: item.duration,
        effect: "none",
        volume: 1,
        fadeIn: 0,
        fadeOut: 0,
      },
    ]);
    setCurrentVideo(item.url);
  };

  const handleRemoveTimelineItem = (id) => {
    setTimelineItems(timelineItems.filter((item) => item.id !== id));
  };

  const handleReorder = (newItems) => {
    setTimelineItems(newItems);
  };

  const handleTrimChange = (id, type, value) => {
    setTimelineItems(
      timelineItems.map((item) => {
        if (item.id === id) {
          return { ...item, [type]: value };
        }
        return item;
      })
    );
  };

  const handleEffectChange = (id, effect) => {
    setTimelineItems(
      timelineItems.map((item) => {
        if (item.id === id) {
          return { ...item, effect };
        }
        return item;
      })
    );
  };

  const handleAudioChange = (id, property, value) => {
    setTimelineItems(
      timelineItems.map((item) => {
        if (item.id === id) {
          return { ...item, [property]: value };
        }
        return item;
      })
    );
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

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">My Video Editor</h1>
      </header>

      <main className="flex-grow flex overflow-hidden">
        <aside className="w-72 bg-gray-800 p-4 overflow-y-auto">
          <MediaLibrary items={mediaItems} onItemClick={handleMediaItemClick} />
          <div className="mt-4">
            <ProjectManager
              currentProject={currentProject}
              onSave={handleSaveProject}
              onLoad={handleLoadProject}
              onNew={handleNewProject}
            />
          </div>
        </aside>

        <section className="flex-grow p-4 flex flex-col overflow-hidden">
          <div className="aspect-video bg-black mb-4">
            <CustomVideoPlayer
              currentVideo={
                currentVideo || "https://www.example.com/default-video.mp4"
              }
              timelineItems={timelineItems}
              currentTime={currentTime}
              onProgress={handleProgress}
              onDuration={handleDuration}
            />
          </div>
          <div className="flex-grow bg-gray-800 p-2 overflow-hidden">
            <Timeline
              items={timelineItems}
              onRemoveItem={handleRemoveTimelineItem}
              onReorder={handleReorder}
              onTrimChange={handleTrimChange}
              onEffectChange={handleEffectChange}
              onAudioChange={handleAudioChange}
              currentTime={currentTime}
              totalDuration={totalDuration}
            />
          </div>
          <ExportPreview timelineItems={timelineItems} />
        </section>

        <aside className="w-64 bg-gray-800 p-4">
          <h2 className="text-xl mb-4">Properties</h2>
          {/* Property controls can be added here */}
        </aside>
      </main>
    </div>
  );
}
