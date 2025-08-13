"use client";

import React, { useState } from 'react';
import { 
  PenTool, 
  Highlighter, 
  StickyNote, 
  MessageSquare, 
  Tag, 
  Hash, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Pin,
  Eye,
  EyeOff
} from 'lucide-react';

interface AnnotationToolsProps {
  onAnnotation: (type: string, content: string) => void;
  selectedAnnotation?: string;
  annotations: Array<{
    id: string;
    type: string;
    content: string;
    position: { x: number; y: number };
    author: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  onAnnotationUpdate: (id: string, updates: any) => void;
  onAnnotationDelete: (id: string) => void;
}

export const AnnotationTools: React.FC<AnnotationToolsProps> = ({
  onAnnotation,
  selectedAnnotation,
  annotations,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  const [activeTool, setActiveTool] = useState('pen');
  const [isAdding, setIsAdding] = useState(false);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');

  const annotationTypes = [
    { id: 'pen', icon: PenTool, label: 'Draw', color: '#3B82F6' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', color: '#F59E0B' },
    { id: 'note', icon: StickyNote, label: 'Note', color: '#10B981' },
    { id: 'comment', icon: MessageSquare, label: 'Comment', color: '#8B5CF6' },
    { id: 'tag', icon: Tag, label: 'Tag', color: '#EF4444' },
    { id: 'hashtag', icon: Hash, label: 'Hashtag', color: '#6B7280' },
  ];

  const handleAddAnnotation = (e: React.MouseEvent) => {
    if (!isAdding) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (newAnnotationContent.trim()) {
      onAnnotation(activeTool, newAnnotationContent);
      setNewAnnotationContent('');
      setIsAdding(false);
    }
  };

  const renderAnnotation = (annotation: any) => {
    const typeConfig = annotationTypes.find(t => t.id === annotation.type);
    const Icon = typeConfig?.icon || MessageSquare;
    
    return (
      <div
        key={annotation.id}
        className={`absolute p-2 rounded-lg border cursor-pointer transition-all ${
          selectedAnnotation === annotation.id
            ? 'ring-2 ring-blue-500 border-blue-300'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{
          left: annotation.position.x,
          top: annotation.position.y,
          backgroundColor: `${typeConfig?.color}20`,
          borderColor: typeConfig?.color,
        }}
        onClick={() => onAnnotationUpdate(annotation.id, { selected: true })}
      >
        <div className="flex items-start space-x-2">
          <Icon className="w-4 h-4 mt-0.5" style={{ color: typeConfig?.color }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {annotation.content}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {annotation.author}
              </span>
              <span className="text-xs text-gray-400">
                • {new Date(annotation.timestamp).toLocaleTimeString()}
              </span>
              {annotation.resolved && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAnnotationDelete(annotation.id);
            }}
            className="p-0.5 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
      {/* Annotation Tools */}
      <div className="flex items-center space-x-2 mb-3">
        {annotationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setActiveTool(type.id);
                setIsAdding(!isAdding);
              }}
              className={`p-2 rounded-md transition-colors ${
                activeTool === type.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={type.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Add Annotation Input */}
      {isAdding && (
        <div className="border-t border-gray-200 pt-3">
          <textarea
            value={newAnnotationContent}
            onChange={(e) => setNewAnnotationContent(e.target.value)}
            placeholder="Enter annotation..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewAnnotationContent('');
                }}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>You</span>
            </div>
          </div>
        </div>
      )}

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Annotations</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {annotations.slice(-5).map(renderAnnotation)}
          </div>
        </div>
      )}
    </div>
  );
};