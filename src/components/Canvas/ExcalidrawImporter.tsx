"use client";

import React from 'react';
import { ShapeNode, ConnectionNode } from '@/ast/ast-types';
import { ASTUtils } from '@/ast/ast-utils';

interface ExcalidrawImporterProps {
  excalidrawData: any;
  onImport: (shapes: ShapeNode[], connections: ConnectionNode[]) => void;
}

export const ExcalidrawImporter: React.FC<ExcalidrawImporterProps> = ({
  excalidrawData,
  onImport,
}) => {
  const convertExcalidrawToShapes = (excalidrawData: any): ShapeNode[] => {
    const shapes: ShapeNode[] = [];
    
    if (excalidrawData.elements) {
      excalidrawData.elements.forEach((element: any) => {
        if (element.type === 'rectangle' || element.type === 'ellipse' || element.type === 'text') {
          const shapeNode: ShapeNode = ASTUtils.createShape(
            element.type === 'text' ? 'text' : element.type === 'ellipse' ? 'circle' : 'rectangle',
            element.x,
            element.y,
            element.width || 100,
            element.height || 100,
            {
              shapeType: element.type === 'text' ? 'text' : element.type === 'ellipse' ? 'circle' : 'rectangle',
              x: element.x,
              y: element.y,
              width: element.width || 100,
              height: element.height || 100,
              rotation: element.rotation || 0,
              fillColor: element.backgroundColor || '#ffffff',
              strokeColor: element.strokeColor || '#000000',
              strokeWidth: element.strokeWidth || 2,
              text: element.text || '',
              fontSize: element.fontSize || 16,
              fontFamily: element.fontFamily || 'Arial, sans-serif',
              textAlign: element.textAlign || 'left',
            }
          );
          shapes.push(shapeNode);
        }
      });
    }
    
    return shapes;
  };

  const convertExcalidrawToConnections = (excalidrawData: any): ConnectionNode[] => {
    const connections: ConnectionNode[] = [];
    
    if (excalidrawData.elements) {
      excalidrawData.elements.forEach((element: any) => {
        if (element.type === 'arrow' || element.type === 'line') {
          // For arrows and lines, we'll create connection nodes
          // This is a simplified conversion - in practice, you'd need to track start/end points
          const connectionNode: ConnectionNode = ASTUtils.createConnection(
            element.startBinding?.elementId || 'unknown',
            element.endBinding?.elementId || 'unknown',
            element.type === 'arrow' ? 'arrow' : 'line'
          );
          connections.push(connectionNode);
        }
      });
    }
    
    return connections;
  };

  React.useEffect(() => {
    const shapes = convertExcalidrawToShapes(excalidrawData);
    const connections = convertExcalidrawToConnections(excalidrawData);
    onImport(shapes, connections);
  }, [excalidrawData, onImport]);

  return null;
};