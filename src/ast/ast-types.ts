export interface ASTNode {
  id: string;
  type: string;
  properties: Record<string, any>;
  children: ASTNode[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    version: number;
  };
}

export interface CanvasNode extends ASTNode {
  type: 'canvas';
  properties: {
    width: number;
    height: number;
    backgroundColor: string;
    gridEnabled: boolean;
    zoom: number;
  };
}

export interface ShapeNode extends ASTNode {
  type: 'shape';
  properties: {
    shapeType: 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface ConnectionNode extends ASTNode {
  type: 'connection';
  properties: {
    fromNodeId: string;
    toNodeId: string;
    connectionType: 'line' | 'arrow' | 'curve';
    strokeColor: string;
    strokeWidth: number;
    dashArray?: string;
  };
}

export interface ChatNode extends ASTNode {
  type: 'chat';
  properties: {
    messages: ChatMessage[];
    aiContext: string;
    currentTopic: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    canvasActions?: CanvasAction[];
    aiSuggestions?: string[];
  };
}

export interface CanvasAction {
  type: 'create' | 'update' | 'delete' | 'move';
  nodeId: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export interface ComponentNode extends ASTNode {
  type: 'component';
  properties: {
    componentType: 'button' | 'input' | 'card' | 'navbar' | 'modal' | 'form';
    name: string;
    props: Record<string, any>;
    children: ComponentNode[];
  };
}

export interface ProjectNode extends ASTNode {
  type: 'project';
  properties: {
    name: string;
    description: string;
    collaborators: string[];
    templates: string[];
    version: string;
  };
}

export interface TemplateNode extends ASTNode {
  type: 'template';
  properties: {
    name: string;
    category: 'flowchart' | 'user-journey' | 'architecture' | 'wireframe' | 'mindmap';
    thumbnail: string;
    description: string;
    defaultNodes: ASTNode[];
  };
}

export type DesignNode = CanvasNode | ShapeNode | ConnectionNode | ChatNode | ComponentNode | ProjectNode | TemplateNode;