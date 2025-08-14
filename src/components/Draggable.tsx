"use client";

import React, { useState, useEffect } from 'react';

interface DraggableProps {
  id: string;
  initialPosition: { x: number; y: number };
  onDragEnd?: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({ id, initialPosition, onDragEnd, children }) => {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragging) return;
      const newPos = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      setPosition(newPos);
    };
    const handleUp = () => {
      if (dragging) {
        setDragging(false);
        onDragEnd?.(position);
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, offset, position, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  return (
    <div
      id={id}
      style={{ position: 'absolute', left: position.x, top: position.y, cursor: 'move' }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};
