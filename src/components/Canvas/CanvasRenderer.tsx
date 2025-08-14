"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ShapeNode, ConnectionNode, CanvasNode } from '@/ast/ast-types';
import { ShapeRenderer } from './ShapeRenderer';

interface CanvasRendererProps {
  canvas: CanvasNode;
  shapes: ShapeNode[];
  connections: ConnectionNode[];
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, properties: any) => void;
  onNodeMoveEnd?: (nodeId: string) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  canvas,
  shapes,
  connections,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
  onNodeMoveEnd,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? scale * 1.2 : scale / 1.2;
    setScale(Math.max(0.1, Math.min(5, newScale)));
  };

  const handlePan = (dx: number, dy: number) => {
    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const handleDragStart = (id: string, start: { x: number; y: number }, offset: { x: number; y: number }) => {
    setDraggingId(id);
    setDragOffset(offset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0) - dragOffset.x;
    const y = e.clientY - (rect?.top || 0) - dragOffset.y;
    onNodeUpdate?.(draggingId, { x, y });
  };

  const handleMouseUp = () => {
    if (draggingId) {
      onNodeMoveEnd?.(draggingId);
    }
    setDraggingId(null);
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const fromShape = shapes.find(s => s.id === connection.properties.fromNodeId);
      const toShape = shapes.find(s => s.id === connection.properties.toNodeId);
      
      if (!fromShape || !toShape) return null;

      const fromX = fromShape.properties.x + fromShape.properties.width / 2;
      const fromY = fromShape.properties.y + fromShape.properties.height / 2;
      const toX = toShape.properties.x + toShape.properties.width / 2;
      const toY = toShape.properties.y + toShape.properties.height / 2;

      return (
        <line
          key={connection.id}
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={connection.properties.strokeColor}
          strokeWidth={connection.properties.strokeWidth}
          strokeDasharray={connection.properties.dashArray}
          markerEnd={connection.properties.connectionType === 'arrow' ? 'url(#arrowhead)' : undefined}
        />
      );
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        ref={svgRef}
        width={canvas.properties.width}
        height={canvas.properties.height}
        viewBox={`${offset.x} ${offset.y} ${canvas.properties.width * scale} ${canvas.properties.height * scale}`}
        className="bg-white"
        style={{ backgroundColor: canvas.properties.backgroundColor }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#000000"
            />
          </marker>
        </defs>
        
        {/* Grid */}
        {canvas.properties.gridEnabled && (
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          </pattern>
        )}
        
        {canvas.properties.gridEnabled && (
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
          />
        )}
        
        {/* Connections */}
        {renderConnections()}
        
        {/* Shapes */}
        {shapes.map((shape) => (
        <ShapeRenderer
          key={shape.id}
          node={shape}
          isSelected={selectedNodeId === shape.id}
          onSelect={onNodeSelect}
          onUpdate={onNodeUpdate}
          onDragStart={handleDragStart}
        />
      ))}
      </svg>
    </div>
  );
};