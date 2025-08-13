"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Download, Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CanvasImporterProps {
  onImport: (data: any, type: 'excalidraw' | 'tldraw') => void;
  onClear: () => void;
}

export const CanvasImporter: React.FC<CanvasImporterProps> = ({
  onImport,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.name.endsWith('.excalidraw')) {
        await importExcalidrawFile(file);
      } else if (file.name.endsWith('.tldraw')) {
        await importTldrawFile(file);
      } else {
        showError(`Unsupported file format: ${file.name}`);
      }
    }
  };

  const importExcalidrawFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.type === 'excalidraw') {
        onImport(data, 'excalidraw');
        showSuccess(`Successfully imported ${file.name}`);
      } else {
        showError('Invalid .excalidraw file format');
      }
    } catch (error) {
      showError('Failed to import .excalidraw file');
    }
  };

  const importTldrawFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.type === 'tldraw') {
        onImport(data, 'tldraw');
        showSuccess(`Successfully imported ${file.name}`);
      } else {
        showError('Invalid .tldraw file format');
      }
    } catch (error) {
      showError('Failed to import .tldraw file');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Import Files</h3>
        <button
          onClick={onClear}
          className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".excalidraw,.tldraw"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">Drop files here or click to browse</p>
        <p className="text-xs text-gray-500">Supports .excalidraw, .tldraw</p>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-xs text-gray-600">
          <FileText className="w-3 h-3 mr-1" />
          .excalidraw
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Image className="w-3 h-3 mr-1" />
          .tldraw
        </div>
      </div>
    </div>
  );
};