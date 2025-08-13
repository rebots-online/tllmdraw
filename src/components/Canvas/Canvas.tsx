"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ShapeNode, ConnectionNode, CanvasNode } from '@/ast/ast-types';
import { ASTUtils } from '@/ast/ast-utils';
import { CanvasRenderer } from './CanvasRenderer';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasImporter } from './CanvasImporter';
import { ExcalidrawImporter } from './ExcalidrawImporter';
import { TldrawImporter } from './TldrawImporter';
import { UserToolbox } from './UserToolbox';
import { AnnotationTools } from './AnnotationTools';

interface CanvasProps {
  width?: number;
  height?: number;
  onNodeCreated?: (node: ShapeNode) => void;
  onNodeUpdated?: (nodeId: string, properties: Partial<ShapeNode['properties']>) => void;
  onNodeDeleted?: (nodeId: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = 1200,
  height = 800,
  onNodeCreated,
  onNodeUpdated,
  onNodeDeleted,
}) => {
  const [canvas, setCanvas] = useState<CanvasNode>(() => ASTUtils.createCanvas(width, height));
  const [shapes, setShapes] = useState<ShapeNode[]>([]);
  const [connections, setConnections] = useState<ConnectionNode[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [importedData, setImportedData] = useState<{ type: 'excalidraw' | 'tldraw'; data: any } | null>(null);
  const [canvasSettings, setCanvasSettings] = useState({
    showGrid: true,
    showConnections: true,
    lockElements: false,
    zoom: 1.0,
  });
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    type: string;
    content: string;
    position: { x: number; y: number };
    author: string;
    timestamp: Date;
    resolved: boolean;
  }>>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'rectangle') {
      const shapeNode: ShapeNode = ASTUtils.createShape(
        'rectangle',
        x - 50,
        y - 25,
        100,
        50,
        {
          shapeType: 'rectangle',
          fillColor: '#ffffff',
          strokeColor: '#000000',
          strokeWidth: 2,
        }
      );
      setShapes(prev => [...prev, shapeNode]);
      onNodeCreated?.(shapeNode);
    } else if (selectedTool === 'circle') {
      const shapeNode: ShapeNode = ASTUtils.createShape(
        'circle',
        x - 25,
        y - 25,
        50,
        50,
        {
          shapeType: 'circle',
          fillColor: '#ffffff',
          strokeColor: '#000000',
          strokeWidth: 2,
        }
      );
      setShapes(prev => [...prev, shapeNode]);
      onNodeCreated?.(shapeNode);
    } else if (selectedTool === 'text') {
      const shapeNode: ShapeNode = ASTUtils.createShape(
        'text',
        x,
        y,
        100,
        30,
        {
          shapeType: 'text',
          fillColor: '#ffffff',
          strokeColor: '#000000',
          strokeWidth: 2,
          text: 'New Text',
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          textAlign: 'left',
        }
      );
      setShapes(prev => [...prev, shapeNode]);
      onNodeCreated?.(shapeNode);
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeUpdate = (nodeId: string, properties: Partial<ShapeNode['properties']>) => {
    setShapes(prev => prev.map(shape => 
      shape.id === nodeId 
        ? { ...shape, properties: { ...shape.properties, ...properties } }
        : shape
    ));
    onNodeUpdated?.(nodeId, properties);
  };

  const handleImport = (data: any, type: 'excalidraw' | 'tldraw') => {
    setImportedData({ type, data });
  };

  const handleClear = () => {
    setShapes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setImportedData(null);
    onNodeDeleted?.('all');
  };

  const handleSave = () => {
    // Save functionality would be implemented here
    console.log('Saving canvas');
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    console.log('Sharing canvas');
  };

  const handleToolAction = (action: string) => {
    switch (action) {
      case 'zoom-in':
        setCanvasSettings(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 5) }));
        break;
      case 'zoom-out':
        setCanvasSettings(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
        break;
      case 'grid':
        setCanvasSettings(prev => ({ ...prev, showGrid: !prev.showGrid }));
        break;
      case 'connections':
        setCanvasSettings(prev => ({ ...prev, showConnections: !prev.showConnections }));
        break;
      case 'lock':
        setCanvasSettings(prev => ({ ...prev, lockElements: true }));
        break;
      case 'unlock':
        setCanvasSettings(prev => ({ ...prev, lockElements: false }));
        break;
      default:
        console.log('Action:', action);
    }
  };

  const handleAnnotation = (type: string, content: string) => {
    const newAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      position: { x: 100, y: 100 },
      author: 'User',
      timestamp: new Date(),
      resolved: false,
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleAnnotationUpdate = (id: string, updates: any) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const handleAnnotationDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  return (
    <div
      ref={canvasRef}
      className="relative border border-gray-300 bg-white"
      style={{ width, height }}
      onClick={handleCanvasClick}
    >
      <CanvasRenderer
        canvas={canvas}
        shapes={shapes}
        connections={connections}
        selectedNodeId={selectedNodeId || undefined}
        onNodeSelect={handleNodeSelect}
        onNodeUpdate={handleNodeUpdate}
      />
      
      <CanvasToolbar
        onToolSelect={setSelectedTool}
        selectedTool={selectedTool}
        onZoom={(direction) => handleToolAction(direction === 'in' ? 'zoom-in' : 'zoom-out')}
        onClear={handleClear}
        onSave={handleSave}
        onShare={handleShare}
      />

      <CanvasImporter
        onImport={handleImport}
        onClear={handleClear}
      />

      <UserToolbox
        onToolSelect={setSelectedTool}
        selectedTool={selectedTool}
        onAction={handleToolAction}
        canvasSettings={canvasSettings}
      />

      <AnnotationTools
        onAnnotation={handleAnnotation}
        selectedAnnotation={selectedAnnotation}
        annotations={annotations}
        onAnnotationUpdate={handleAnnotationUpdate}
        onAnnotationDelete={handleAnnotationDelete}
      />

      {importedData?.type === 'excalidraw' && (
        <ExcalidrawImporter
          excalidrawData={importedData.data}
          onImport={(newShapes, newConnections) => {
            setShapes(newShapes);
            setConnections(newConnections);
          }}
        />
      )}

      {importedData?.type === 'tldraw' && (
        <TldrawImporter
          tldrawData={importedData.data}
          onImport={(newShapes, newConnections) => {
            setShapes(newShapes);
            setConnections(newConnections);
          }}
        />
      )}
    </div>
  );
};