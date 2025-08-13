"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ShapeNode, ConnectionNode, CanvasNode } from '@/ast/ast-types';
import { ASTUtils } from '@/ast/ast-utils';
import { CanvasRenderer } from './CanvasRenderer';
import { CanvasToolbar } from './CanvasToolbar';

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

  const handleZoom = (direction: 'in' | 'out') => {
    // Zoom functionality would be implemented here
    console.log('Zooming', direction);
  };

  const handleClear = () => {
    setShapes([]);
    setConnections([]);
    setSelectedNodeId(null);
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
        onZoom={handleZoom}
        onClear={handleClear}
        onSave={handleSave}
        onShare={handleShare}
      />
    </div>
  );
};