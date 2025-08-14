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
import { CanvasExporter } from './CanvasExporter';
import { CanvasHistory } from './CanvasHistory';
import { CanvasSettings } from './CanvasSettings';
import { Draggable } from '../Draggable';

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
    backgroundColor: '#ffffff',
    snapToGrid: true,
    gridSize: 20,
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
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{
    id: string;
    action: string;
    timestamp: Date;
    description: string;
    snapshot: { shapes: ShapeNode[]; connections: ConnectionNode[] };
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLDivElement>(null);

  const [toolbarPos, setToolbarPos] = useState({ x: 16, y: 16 });
  const [importerPos, setImporterPos] = useState({ x: width - 160, y: 16 });
  const [userToolboxPos, setUserToolboxPos] = useState({ x: 16, y: height - 160 });
  const [annotationPos, setAnnotationPos] = useState({ x: width / 2 - 100, y: height / 2 - 100 });
  const [exporterPos, setExporterPos] = useState({ x: width - 260, y: 16 });
  const [historyPos, setHistoryPos] = useState({ x: width - 460, y: 16 });
  const [settingsPos, setSettingsPos] = useState({ x: width - 660, y: 16 });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Snap to grid if enabled
    if (canvasSettings.snapToGrid) {
      x = Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize;
      y = Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize;
    }

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
      addToHistory('create', 'Rectangle created');
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
      addToHistory('create', 'Circle created');
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
      addToHistory('create', 'Text element created');
      onNodeCreated?.(shapeNode);
    }
  };

  const addToHistory = (action: string, description: string) => {
    const snapshot = {
      shapes: JSON.parse(JSON.stringify(shapes)),
      connections: JSON.parse(JSON.stringify(connections)),
    };
    const newHistory = history.slice(0, historyIndex + 1);
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date(),
      description,
      snapshot,
    };
    setHistory([...newHistory, newEntry]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const snapshot = history[newIndex].snapshot;
      setShapes(snapshot.shapes);
      setConnections(snapshot.connections);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const snapshot = history[newIndex].snapshot;
      setShapes(snapshot.shapes);
      setConnections(snapshot.connections);
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

  const handleNodeMoveEnd = () => {
    addToHistory('move', 'Node moved');
  };

  const handleImport = (data: any, type: 'excalidraw' | 'tldraw') => {
    console.log('Importing data:', data);
    setImportedData({ type, data });
    addToHistory('import', `Imported ${type} file`);
  };

  const handleClear = () => {
    setShapes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setImportedData(null);
    addToHistory('delete', 'Canvas cleared');
    onNodeDeleted?.('all');
  };

  const handleSave = () => {
    const data = { shapes, connections, canvasSettings };
    localStorage.setItem('nexus-canvas', JSON.stringify(data));
    addToHistory('save', 'Canvas saved');
  };

  const handleShare = async () => {
    const data = { shapes, connections, canvasSettings };
    try {
      await navigator.clipboard.writeText(JSON.stringify(data));
      addToHistory('share', 'Canvas copied to clipboard');
    } catch (err) {
      console.error('Share failed', err);
    }
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
    addToHistory('create', 'Annotation added');
  };

  const handleAnnotationUpdate = (id: string, updates: any) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const handleAnnotationDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    addToHistory('delete', 'Annotation removed');
  };

  const handleExport = async (format: 'png' | 'svg' | 'json' | 'excalidraw' | 'tldraw') => {
    const data = { shapes, connections, canvas };
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'canvas.json';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      console.log('Export as', format, 'not implemented');
    }
    addToHistory('export', `Exported as ${format}`);
  };

  const handleSettingsChange = (newSettings: any) => {
    setCanvasSettings(newSettings);
  };

  const handleSettingsReset = () => {
    setCanvasSettings({
      showGrid: true,
      showConnections: true,
      lockElements: false,
      zoom: 1.0,
      backgroundColor: '#ffffff',
      snapToGrid: true,
      gridSize: 20,
    });
  };

  const handleSettingsSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('canvasSettings', JSON.stringify(canvasSettings));
  };

  // Debug logging
  useEffect(() => {
    console.log('Canvas state:', {
      shapes: shapes.length,
      connections: connections.length,
      importedData: importedData ? importedData.type : 'none',
      canvasSettings
    });
  }, [shapes, connections, importedData, canvasSettings]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={canvasRef}
        className="relative border border-gray-300 bg-white"
        style={{ 
          width, 
          height,
          backgroundColor: canvasSettings.backgroundColor,
        }}
        onClick={handleCanvasClick}
      >
        <CanvasRenderer
          canvas={canvas}
          shapes={shapes}
          connections={connections}
          selectedNodeId={selectedNodeId || undefined}
          onNodeSelect={handleNodeSelect}
          onNodeUpdate={handleNodeUpdate}
          onNodeMoveEnd={handleNodeMoveEnd}
        />
        
        {/* Positioned toolboxes to prevent overlap */}
        <Draggable id="toolbar" initialPosition={toolbarPos} onDragEnd={setToolbarPos}>
          <CanvasToolbar
            onToolSelect={setSelectedTool}
            selectedTool={selectedTool}
            onZoom={(direction) => handleToolAction(direction === 'in' ? 'zoom-in' : 'zoom-out')}
            onClear={handleClear}
            onSave={handleSave}
            onShare={handleShare}
          />
        </Draggable>

        <Draggable id="importer" initialPosition={importerPos} onDragEnd={setImporterPos}>
          <CanvasImporter
            onImport={handleImport}
            onClear={handleClear}
          />
        </Draggable>

        <Draggable id="user-toolbox" initialPosition={userToolboxPos} onDragEnd={setUserToolboxPos}>
          <UserToolbox
            onToolSelect={setSelectedTool}
            selectedTool={selectedTool}
            onAction={handleToolAction}
            canvasSettings={canvasSettings}
          />
        </Draggable>

        <Draggable id="annotation" initialPosition={annotationPos} onDragEnd={setAnnotationPos}>
          <AnnotationTools
            onAnnotation={handleAnnotation}
            selectedAnnotation={selectedAnnotation}
            annotations={annotations}
            onAnnotationUpdate={handleAnnotationUpdate}
            onAnnotationDelete={handleAnnotationDelete}
          />
        </Draggable>

        <Draggable id="exporter" initialPosition={exporterPos} onDragEnd={setExporterPos}>
          <CanvasExporter
            canvasData={{ shapes, connections, canvas }}
            onExport={handleExport}
          />
        </Draggable>

        <Draggable id="history" initialPosition={historyPos} onDragEnd={setHistoryPos}>
          <CanvasHistory
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            history={history}
          />
        </Draggable>

        <Draggable id="settings" initialPosition={settingsPos} onDragEnd={setSettingsPos}>
          <CanvasSettings
            settings={canvasSettings}
            onSettingsChange={handleSettingsChange}
            onReset={handleSettingsReset}
            onSave={handleSettingsSave}
          />
        </Draggable>

        {importedData?.type === 'excalidraw' && (
          <ExcalidrawImporter
            excalidrawData={importedData.data}
            onImport={(newShapes, newConnections) => {
              console.log('Import callback received:', { newShapes, newConnections });
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
    </div>
  );
};