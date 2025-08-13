"use client";

import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!excalidrawData || !excalidrawData.elements) {
      console.warn('Invalid Excalidraw data:', excalidrawData);
      return;
    }

    const convertExcalidrawToShapes = (excalidrawData: any): ShapeNode[] => {
      const shapes: ShapeNode[] = [];
      
      excalidrawData.elements.forEach((element: any) => {
        console.log('Processing element:', element);
        
        if (element.type === 'rectangle') {
          const shapeNode: ShapeNode = ASTUtils.createShape(
            'rectangle',
            element.x,
            element.y,
            element.width,
            element.height,
            {
              shapeType: 'rectangle',
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.angle || 0,
              fillColor: element.backgroundColor || '#ffffff',
              strokeColor: element.strokeColor || '#000000',
              strokeWidth: element.strokeWidth || 2,
              text: '', // Rectangle doesn't have text
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'left',
            }
          );
          shapes.push(shapeNode);
          console.log('Created rectangle shape:', shapeNode);
        } else if (element.type === 'text') {
          const shapeNode: ShapeNode = ASTUtils.createShape(
            'text',
            element.x,
            element.y,
            element.width,
            element.height,
            {
              shapeType: 'text',
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.angle || 0,
              fillColor: element.backgroundColor || '#ffffff',
              strokeColor: element.strokeColor || '#000000',
              strokeWidth: element.strokeWidth || 1,
              text: element.text || '',
              fontSize: element.fontSize || 16,
              fontFamily: 'Arial, sans-serif',
              textAlign: element.textAlign || 'left',
            }
          );
          shapes.push(shapeNode);
          console.log('Created text shape:', shapeNode);
        } else if (element.type === 'ellipse') {
          const shapeNode: ShapeNode = ASTUtils.createShape(
            'circle',
            element.x,
            element.y,
            element.width,
            element.height,
            {
              shapeType: 'circle',
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
              rotation: element.angle || 0,
              fillColor: element.backgroundColor || '#ffffff',
              strokeColor: element.strokeColor || '#000000',
              strokeWidth: element.strokeWidth || 2,
              text: '',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'left',
            }
          );
          shapes.push(shapeNode);
          console.log('Created circle shape:', shapeNode);
        } else if (element.type === 'line' || element.type === 'arrow') {
          // For lines and arrows, create a simple line shape
          const shapeNode: ShapeNode = ASTUtils.createShape(
            'rectangle', // Using rectangle as a simple line representation
            element.x,
            element.y,
            element.width || 100,
            element.height || 2,
            {
              shapeType: 'rectangle',
              x: element.x,
              y: element.y,
              width: element.width || 100,
              height: element.height || 2,
              rotation: element.angle || 0,
              fillColor: 'transparent',
              strokeColor: element.strokeColor || '#000000',
              strokeWidth: element.strokeWidth || 2,
              text: '',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'left',
            }
          );
          shapes.push(shapeNode);
          console.log('Created line shape:', shapeNode);
        }
      });
      
      console.log('Total shapes created:', shapes.length);
      return shapes;
    };

    const convertExcalidrawToConnections = (excalidrawData: any): ConnectionNode[] => {
      const connections: ConnectionNode[] = [];
      
      excalidrawData.elements.forEach((element: any) => {
        if (element.type === 'arrow') {
          // Create connection for arrows
          const connectionNode: ConnectionNode = ASTUtils.createConnection(
            element.startBinding?.elementId || 'unknown',
            element.endBinding?.elementId || 'unknown',
            'arrow'
          );
          connections.push(connectionNode);
          console.log('Created connection:', connectionNode);
        }
      });
      
      return connections;
    };

    try {
      const shapes = convertExcalidrawToShapes(excalidrawData);
      const connections = convertExcalidrawToConnections(excalidrawData);
      
      console.log('Final shapes:', shapes);
      console.log('Final connections:', connections);
      
      onImport(shapes, connections);
    } catch (error) {
      console.error('Error importing Excalidraw data:', error);
    }
  }, [excalidrawData, onImport]);

  return null;
};