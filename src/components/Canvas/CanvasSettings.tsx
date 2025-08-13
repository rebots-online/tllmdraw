"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Grid, 
  Layers, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Download,
  Upload,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Square,
  Circle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CanvasSettingsProps {
  settings: {
    showGrid: boolean;
    showConnections: boolean;
    lockElements: boolean;
    zoom: number;
    backgroundColor: string;
    snapToGrid: boolean;
    gridSize: number;
  };
  onSettingsChange: (settings: any) => void;
  onReset: () => void;
  onSave: () => void;
}

export const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  settings,
  onSettingsChange,
  onReset,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleReset = () => {
    onReset();
    showSuccess('Settings reset to defaults');
  };

  const handleSave = () => {
    onSave();
    showSuccess('Settings saved');
  };

  const colorPresets = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af',
    '#fef3c7', '#fed7aa', '#fecaca', '#fde68a', '#d1fae5'
  ];

  return (
    <div className="absolute top-4 right-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Canvas Settings</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded-md transition-colors ${
            isOpen
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Display Settings */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Display</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Show Grid</label>
                <button
                  onClick={() => handleSettingChange('showGrid', !settings.showGrid)}
                  className={`p-1 rounded-md transition-colors ${
                    settings.showGrid
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Show Connections</label>
                <button
                  onClick={() => handleSettingChange('showConnections', !settings.showConnections)}
                  className={`p-1 rounded-md transition-colors ${
                    settings.showConnections
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Lock Elements</label>
                <button
                  onClick={() => handleSettingChange('lockElements', !settings.lockElements)}
                  className={`p-1 rounded-md transition-colors ${
                    settings.lockElements
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {settings.lockElements ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Grid Settings */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Grid</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Snap to Grid</label>
                <button
                  onClick={() => handleSettingChange('snapToGrid', !settings.snapToGrid)}
                  className={`p-1 rounded-md transition-colors ${
                    settings.snapToGrid
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              
              <div>
                <label className="text-xs text-gray-600">Grid Size</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={settings.gridSize}
                  onChange={(e) => handleSettingChange('gridSize', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 text-center">{settings.gridSize}px</div>
              </div>
            </div>
          </div>

          {/* Background Settings */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Background</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600">Color</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSettingChange('backgroundColor', color)}
                      className={`w-6 h-6 rounded border-2 ${
                        settings.backgroundColor === color
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Zoom Settings */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Zoom</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSettingChange('zoom', Math.max(0.1, settings.zoom - 0.1))}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="text-xs text-gray-600 text-center flex-1">
                {Math.round(settings.zoom * 100)}%
              </div>
              <button
                onClick={() => handleSettingChange('zoom', Math.min(3, settings.zoom + 0.1))}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center space-x-1 text-xs text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
              >
                <Save className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};