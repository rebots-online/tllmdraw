"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, 
  Redo, 
  RotateCcw, 
  Save, 
  History,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CanvasHistoryProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: Array<{
    id: string;
    action: string;
    timestamp: Date;
    description: string;
  }>;
}

export const CanvasHistory: React.FC<CanvasHistoryProps> = ({
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  history,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleUndo = () => {
    if (canUndo) {
      onUndo();
      showSuccess('Undo successful');
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      onRedo();
      showSuccess('Redo successful');
    }
  };

  const handleSave = () => {
    onSave();
    showSuccess('Canvas saved');
  };

  const formatHistoryItem = (item: any) => {
    const timeAgo = new Date(item.timestamp).toLocaleTimeString();
    return (
      <div
        key={item.id}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex-shrink-0">
          {item.action.includes('create') ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : item.action.includes('delete') ? (
            <XCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Clock className="w-4 h-4 text-blue-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {item.description}
          </div>
          <div className="text-xs text-gray-500">
            {timeAgo}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-4 right-44 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
      {/* History Controls */}
      <div className="flex items-center space-x-2 mb-3">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded-md transition-colors ${
            canUndo
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded-md transition-colors ${
            canRedo
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className="border-l border-gray-300 mx-1"></div>
        
        <button
          onClick={handleSave}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-md transition-colors ${
            showHistory
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="History"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-700">History</h4>
            <span className="text-xs text-gray-500">{history.length} actions</span>
          </div>
          
          <div 
            ref={historyRef}
            className="max-h-48 overflow-y-auto space-y-1"
          >
            {history.length > 0 ? (
              history.slice(-10).reverse().map(formatHistoryItem)
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                No history yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};