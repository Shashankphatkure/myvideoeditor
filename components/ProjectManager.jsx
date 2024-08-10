"use client";

import React, { useState } from "react";
import { FiSave, FiFolder, FiPlus } from "react-icons/fi";

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
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl mb-4 font-semibold">Project Management</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="flex-grow mr-2 p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button onClick={handleSave} className="btn-primary">
          <FiSave className="mr-2" /> Save
        </button>
      </div>
      <button onClick={handleNew} className="btn-secondary mb-4 w-full">
        <FiPlus className="mr-2" /> New Project
      </button>
      <h3 className="text-lg mb-2 font-semibold">Saved Projects:</h3>
      <ul className="max-h-48 overflow-y-auto">
        {savedProjects.map((project, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => handleLoad(project)}
              className="bg-gray-700 px-4 py-2 rounded-md w-full text-left hover:bg-gray-600 transition-colors duration-200 flex items-center"
            >
              <FiFolder className="mr-2" /> {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManager;
