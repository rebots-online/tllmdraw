"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ShapeNode, ConnectionNode } from '@/ast/ast-types';
import { ASTUtils } from '@/ast/ast-utils';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    // Initialize canvas
    setIsInitialized(true);
  }, [isInitialized]);

  const handleShapeCreate = (shapeType: string, x: number, y: number, width: number, height: number) => {
    const shapeNode: ShapeNode = ASTUtils.createShape(
      shapeType as any,
      x,
      y,
      width,
      height,
      {
        shapeType: shapeType as any,
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
      }
    );

    onNodeCreated?.(shapeNode);
  };

  const handleShapeUpdate = (nodeId: string, properties: Partial<ShapeNode['properties']>) => {
    onNodeUpdated?.(nodeId, properties);
  };

  const handleShapeDelete = (nodeId: string) => {
    onNodeDeleted?.(nodeId);
  };

  return (
    <div
      ref={canvasRef}
      className="border border-gray-300 bg-white"
      style={{ width, height }}
    >
      {/* Canvas Area */}
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Canvas Area - Drawing tools will be implemented here
      </div>
    </div>
  );
};