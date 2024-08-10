import React from "react";
import { FiMove, FiMaximize, FiType, FiImage, FiSquare } from "react-icons/fi";

const PropertiesPanel = ({ selectedItem, onUpdateItem }) => {
  if (!selectedItem)
    return <div className="p-4 text-gray-400">No item selected</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdateItem({
      ...selectedItem,
      [name]: name === "text" ? value : Number(value),
    });
  };

  const handleColorChange = (e) => {
    onUpdateItem({ ...selectedItem, color: e.target.value });
  };

  return (
    <div className="bg-gray-800 p-4 w-64 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      <div className="space-y-4">
        <section>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <FiMove className="mr-2" /> Position
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">X</label>
              <input
                type="number"
                name="x"
                value={selectedItem.x}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Y</label>
              <input
                type="number"
                name="y"
                value={selectedItem.y}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <FiMaximize className="mr-2" /> Size
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">Width</label>
              <input
                type="number"
                name="width"
                value={selectedItem.width}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Height</label>
              <input
                type="number"
                name="height"
                value={selectedItem.height}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </section>

        {selectedItem.type === "TEXT" && (
          <section>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FiType className="mr-2" /> Text Properties
            </h4>
            <div>
              <label className="block text-xs mb-1">Content</label>
              <input
                type="text"
                name="text"
                value={selectedItem.text}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs mb-1">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={selectedItem.fontSize || 16}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs mb-1">Color</label>
              <input
                type="color"
                name="color"
                value={selectedItem.color || "#ffffff"}
                onChange={handleColorChange}
                className="w-full bg-gray-700 rounded px-2 py-1 h-8"
              />
            </div>
          </section>
        )}

        {selectedItem.type === "IMAGE" && (
          <section>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FiImage className="mr-2" /> Image Properties
            </h4>
            <div>
              <label className="block text-xs mb-1">Opacity</label>
              <input
                type="range"
                name="opacity"
                min="0"
                max="1"
                step="0.1"
                value={selectedItem.opacity || 1}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded"
              />
            </div>
          </section>
        )}

        {selectedItem.type === "SHAPE" && (
          <section>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <FiSquare className="mr-2" /> Shape Properties
            </h4>
            <div>
              <label className="block text-xs mb-1">Color</label>
              <input
                type="color"
                name="color"
                value={selectedItem.color || "#ffffff"}
                onChange={handleColorChange}
                className="w-full bg-gray-700 rounded px-2 py-1 h-8"
              />
            </div>
          </section>
        )}

        <section>
          <h4 className="text-sm font-medium mb-2">Advanced</h4>
          <div>
            <label className="block text-xs mb-1">Z-Index</label>
            <input
              type="number"
              name="zIndex"
              value={selectedItem.zIndex || 0}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="mt-2">
            <label className="block text-xs mb-1">Rotation (degrees)</label>
            <input
              type="number"
              name="rotation"
              value={selectedItem.rotation || 0}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertiesPanel;
