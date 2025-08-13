"use client";

import React, { useState } from 'react';
import { 
  PenTool, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  Line, 
  Arrow, 
  Hand, 
  Move, 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Layers, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  Save, 
  Share, 
  Download, 
  Upload, 
  Settings, 
  Palette, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Paste,
  Trash2,
  Undo,
  Redo
} from 'lucide-react';

interface UserToolboxProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
  onAction: (action: string) => void;
  canvasSettings: {
    showGrid: boolean;
    showConnections: boolean;
    lockElements: boolean;
    zoom: number;
  };
}

export const UserToolbox: React.FC<UserToolboxProps> = ({
  onToolSelect,
  selectedTool,
  onAction,
  canvasSettings,
}) => {
  const [activeTab, setActiveTab] = useState('draw');

  const drawingTools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Hand' },
    { id: 'pen', icon: PenTool, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'line', icon: Line, label: 'Line' },
    { id: 'arrow', icon: Arrow, label: 'Arrow' },
  ];

  const transformTools = [
    { id: 'rotate-left', icon: RotateCcw, label: 'Rotate Left' },
    { id: 'rotate-right', icon: RotateCw, label: 'Rotate Right' },
    { id: 'flip-horizontal', icon: FlipHorizontal, label: 'Flip Horizontal' },
    { id: 'flip-vertical', icon: FlipVertical, label: 'Flip Vertical' },
    { id: 'lock', icon: Lock, label: 'Lock Elements' },
    { id: 'unlock', icon: Unlock, label: 'Unlock Elements' },
  ];

  const viewTools = [
    { id: 'zoom-in', icon: ZoomIn, label: 'Zoom In' },
    { id: 'zoom-out', icon: ZoomOut, label: 'Zoom Out' },
    { id: 'grid', icon: Grid, label: 'Toggle Grid' },
    { id: 'connections', icon: Layers, label: 'Toggle Connections' },
    { id: 'visibility', icon: Eye, label: 'Show/Hide' },
  ];

  const fileTools = [
    { id: 'save', icon: Save, label: 'Save' },
    { id: 'share', icon: Share, label: 'Share' },
    { id: 'download', icon: Download, label: 'Download' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const editTools = [
    { id: 'undo', icon: Undo, label: 'Undo' },
    { id: 'redo', icon: Redo, label: 'Redo' },
    { id: 'copy', icon: Copy, label: 'Copy' },
    { id: 'paste', icon: Paste, label: 'Paste' },
    { id: 'delete', icon: Trash2, label: 'Delete' },
  ];

  const renderToolButton = (tool: any) => {
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
  };

  const renderActionButton = (action: any) => {
    const Icon = action.icon;
    return (
      <button
        key={action.id}
        onClick={() => onAction(action.id)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        title={action.label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-2">
        <button
          onClick={() => setActiveTab('draw')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'draw'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Draw
        </button>
        <button
          onClick={() => setActiveTab('transform')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'transform'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transform
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'view'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          View
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'file'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          File
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'edit'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Edit
        </button>
      </div>

      {/* Tool Groups */}
      <div className="space-y-2">
        {activeTab === 'draw' && (
          <div className="flex flex-wrap gap-1">
            {drawingTools.map(renderToolButton)}
          </div>
        )}
        
        {activeTab === 'transform' && (
          <div className="flex flex-wrap gap-1">
            {transformTools.map(renderActionButton)}
          </div>
        )}
        
        {activeTab === 'view' && (
          <div className="flex flex-wrap gap-1">
            {viewTools.map(renderActionButton)}
          </div>
        )}
        
        {activeTab === 'file' && (
          <div className="flex flex-wrap gap-1">
            {fileTools.map(renderActionButton)}
          </div>
        )}
        
        {activeTab === 'edit' && (
          <div className="flex flex-wrap gap-1">
            {editTools.map(renderActionButton)}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>Grid: {canvasSettings.showGrid ? 'On' : 'Off'}</span>
            <span>•</span>
            <span>Zoom: {Math.round(canvasSettings.zoom * 100)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            {canvasSettings.lockElements && (
              <Lock className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};