"use client";

import React from 'react';
import { ShapeNode } from '@/ast/ast-types';

interface ShapeRendererProps {
  node: ShapeNode;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, properties: Partial<ShapeNode['properties']>) => void;
  onDragStart?: (id: string, start: { x: number; y: number }, offset: { x: number; y: number }) => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  node,
  isSelected = false,
  onSelect,
  onUpdate,
  onDragStart,
}) => {
  const { shapeType, x, y, width, height, fillColor, strokeColor, strokeWidth, text, fontSize, fontFamily, textAlign } = node.properties;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(node.id);
    const start = { x: e.clientX, y: e.clientY };
    const offset = { x: start.x - x, y: start.y - y };
    onDragStart?.(node.id, start, offset);
  };

  const renderShape = () => {
    const commonProps = {
      x,
      y,
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
      onMouseDown: handleMouseDown,
      className: `cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`,
    };

    switch (shapeType) {
      case 'rectangle':
        return (
          <rect
            {...commonProps}
            rx="4"
            ry="4"
          />
        );
      case 'circle':
        return (
          <ellipse
            {...commonProps}
            cx={x + width / 2}
            cy={y + height / 2}
            rx={width / 2}
            ry={height / 2}
          />
        );
      case 'text':
        return (
          <text
            x={x}
            y={y + height}
            fontSize={fontSize || 16}
            fontFamily={fontFamily || 'Arial, sans-serif'}
            fill={strokeColor}
            textAnchor={textAlign || 'left'}
            onMouseDown={handleMouseDown}
            className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            {text || 'Text'}
          </text>
        );
      default:
        return (
          <rect
            {...commonProps}
            rx="4"
            ry="4"
          />
        );
    }
  };

  return (
    <g>
      {renderShape()}
      {isSelected && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
      )}
    </g>
  );
};