"use client";

import React, { useState } from "react";

const ProjectManager = ({ currentProject, onSave, onLoad, onNew }) => {
  const [projectName, setProjectName] = useState(currentProject?.name || "");
  const [savedProjects, setSavedProjects] = useState(() => {
    const saved = localStorage.getItem("videoEditorProjects");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }
    const newProject = { name: projectName, data: currentProject };
    const updatedProjects = [
      ...savedProjects.filter((p) => p.name !== projectName),
      newProject,
    ];
    localStorage.setItem(
      "videoEditorProjects",
      JSON.stringify(updatedProjects)
    );
    setSavedProjects(updatedProjects);
    onSave(newProject);
  };

  const handleLoad = (project) => {
    setProjectName(project.name);
    onLoad(project);
  };

  const handleNew = () => {
    setProjectName("");
    onNew();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl mb-4">Project Management</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="flex-grow mr-2 p-2 bg-gray-700 rounded"
        />
        <button onClick={handleSave} className="bg-blue-500 px-4 py-2 rounded">
          Save
        </button>
      </div>
      <button
        onClick={handleNew}
        className="bg-green-500 px-4 py-2 rounded mb-4 w-full"
      >
        New Project
      </button>
      <h3 className="text-lg mb-2">Saved Projects:</h3>
      <ul className="max-h-48 overflow-y-auto">
        {savedProjects.map((project, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => handleLoad(project)}
              className="bg-gray-700 px-4 py-2 rounded w-full text-left hover:bg-gray-600"
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManager;
