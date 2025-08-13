"use client";

import React from 'react';
import { 
  Square, 
  Circle, 
  Type, 
  Move, 
  Trash2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Save,
  Share,
  Settings
} from 'lucide-react';

interface CanvasToolbarProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
  onZoom: (direction: 'in' | 'out') => void;
  onClear: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onToolSelect,
  selectedTool,
  onZoom,
  onClear,
  onSave,
  onShare,
}) => {
  const tools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
      <div className="flex flex-col space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`p-2 rounded-md transition-colors ${
                selectedTool === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <button
          onClick={() => onZoom('in')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onZoom('out')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <button
          onClick={onClear}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <button
          onClick={onSave}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>
        
        <button
          onClick={onShare}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Share"
        >
          <Share className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onToolSelect('settings')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};