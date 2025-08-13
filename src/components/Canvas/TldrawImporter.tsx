"use client";

import React from 'react';
import { ShapeNode, ConnectionNode } from '@/ast/ast-types';
import { ASTUtils } from '@/ast/ast-utils';

interface TldrawImporterProps {
  tldrawData: any;
  onImport: (shapes: ShapeNode[], connections: ConnectionNode[]) => void;
}

export const TldrawImporter: React.FC<TldrawImporterProps> = ({
  tldrawData,
  onImport,
}) => {
  const convertTldrawToShapes = (tldrawData: any): ShapeNode[] => {
    const shapes: ShapeNode[] = [];
    
    if (tldrawData.document) {
      Object.values(tldrawData.document).forEach((shape: any) => {
        if (shape.type === 'rectangle' || shape.type === 'ellipse' || shape.type === 'text') {
          const shapeNode: ShapeNode = ASTUtils.createShape(
            shape.type === 'text' ? 'text' : shape.type === 'ellipse' ? 'circle' : 'rectangle',
            shape.x,
            shape.y,
            shape.props.w || 100,
            shape.props.h || 100,
            {
              shapeType: shape.type === 'text' ? 'text' : shape.type === 'ellipse' ? 'circle' : 'rectangle',
              x: shape.x,
              y: shape.y,
              width: shape.props.w || 100,
              height: shape.props.h || 100,
              rotation: shape.rotation || 0,
              fillColor: shape.props.color || '#ffffff',
              strokeColor: shape.props.strokeColor || '#000000',
              strokeWidth: shape.props.strokeWidth || 2,
              text: shape.props.text || '',
              fontSize: shape.props.fontSize || 16,
              fontFamily: shape.props.fontFamily || 'Arial, sans-serif',
              textAlign: shape.props.textAlign || 'left',
            }
          );
          shapes.push(shapeNode);
        }
      });
    }
    
    return shapes;
  };

  const convertTldrawToConnections = (tldrawData: any): ConnectionNode[] => {
    const connections: ConnectionNode[] = [];
    
    if (tldrawData.document) {
      Object.values(tldrawData.document).forEach((shape: any) => {
        if (shape.type === 'arrow' || shape.type === 'line') {
          const connectionNode: ConnectionNode = ASTUtils.createConnection(
            shape.props.startBinding?.elementId || 'unknown',
            shape.props.endBinding?.elementId || 'unknown',
            shape.type === 'arrow' ? 'arrow' : 'line'
          );
          connections.push(connectionNode);
        }
      });
    }
    
    return connections;
  };

  React.useEffect(() => {
    const shapes = convertTldrawToShapes(tldrawData);
    const connections = convertTldrawToConnections(tldrawData);
    onImport(shapes, connections);
  }, [tldrawData, onImport]);

  return null;
};