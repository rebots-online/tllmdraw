"use client";

import React, { useState } from 'react';
import { Download, FileText, Image, Share2, Copy, Save } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CanvasExporterProps {
  canvasData: {
    shapes: any[];
    connections: any[];
    canvas: any;
  };
  onExport: (format: 'png' | 'svg' | 'json' | 'excalidraw' | 'tldraw') => void;
}

export const CanvasExporter: React.FC<CanvasExporterProps> = ({
  canvasData,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');

  const exportFormats = [
    { id: 'png', name: 'PNG Image', icon: Image, description: 'High-quality PNG image' },
    { id: 'svg', name: 'SVG Vector', icon: FileText, description: 'Scalable vector graphics' },
    { id: 'json', name: 'JSON Data', icon: FileText, description: 'Canvas data structure' },
    { id: 'excalidraw', name: 'Excalidraw', icon: FileText, description: '.excalidraw format' },
    { id: 'tldraw', name: 'TLdraw', icon: FileText, description: '.tldraw format' },
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      await onExport(format as any);
      showSuccess(`Successfully exported as ${format.toUpperCase()}`);
    } catch (error) {
      showError(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = () => {
    const dataStr = JSON.stringify(canvasData, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      showSuccess('Canvas data copied to clipboard');
    }).catch(() => {
      showError('Failed to copy to clipboard');
    });
  };

  return (
    <div className="absolute top-4 right-24 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Export Canvas</h3>
        <button
          onClick={handleCopyToClipboard}
          className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
          title="Copy to Clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {exportFormats.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              disabled={isExporting}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">{format.name}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => handleExport('png')}
          disabled={isExporting}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export {exportFormat.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};