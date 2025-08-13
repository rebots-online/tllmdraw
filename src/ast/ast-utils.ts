import { ASTNode, DesignNode, CanvasNode, ShapeNode, ConnectionNode, ChatNode } from './ast-types';

export class ASTUtils {
  static createNode(type: string, properties: Record<string, any> = {}, children: ASTNode[] = []): ASTNode {
    return {
      id: this.generateId(),
      type,
      properties,
      children,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        version: 1,
      },
    };
  }

  static createCanvas(width: number = 1200, height: number = 800): CanvasNode {
    return this.createNode('canvas', {
      width,
      height,
      backgroundColor: '#ffffff',
      gridEnabled: true,
      zoom: 1.0,
    }) as CanvasNode;
  }

  static createShape(
    shapeType: ShapeNode['properties']['shapeType'],
    x: number,
    y: number,
    width: number,
    height: number,
    properties: Partial<ShapeNode['properties']> = {}
  ): ShapeNode {
    return this.createNode('shape', {
      shapeType,
      x,
      y,
      width,
      height,
      rotation: 0,
      fillColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      ...properties,
    }) as ShapeNode;
  }

  static createConnection(
    fromNodeId: string,
    toNodeId: string,
    connectionType: ConnectionNode['properties']['connectionType'] = 'line'
  ): ConnectionNode {
    return this.createNode('connection', {
      fromNodeId,
      toNodeId,
      connectionType,
      strokeColor: '#000000',
      strokeWidth: 2,
    }) as ConnectionNode;
  }

  static createChat(): ChatNode {
    return this.createNode('chat', {
      messages: [],
      aiContext: '',
      currentTopic: '',
    }) as ChatNode;
  }

  static addChild(parent: ASTNode, child: ASTNode): void {
    parent.children.push(child);
    parent.metadata.updatedAt = new Date();
    parent.metadata.version += 1;
  }

  static removeChild(parent: ASTNode, childId: string): boolean {
    const index = parent.children.findIndex(child => child.id === childId);
    if (index !== -1) {
      parent.children.splice(index, 1);
      parent.metadata.updatedAt = new Date();
      parent.metadata.version += 1;
      return true;
    }
    return false;
  }

  static updateNode(node: ASTNode, properties: Record<string, any>): void {
    node.properties = { ...node.properties, ...properties };
    node.metadata.updatedAt = new Date();
    node.metadata.version += 1;
  }

  static findNode(root: ASTNode, nodeId: string): ASTNode | null {
    if (root.id === nodeId) return root;
    
    for (const child of root.children) {
      const found = this.findNode(child, nodeId);
      if (found) return found;
    }
    
    return null;
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static serializeToNeo4j(node: ASTNode): string {
    const labels = this.getLabelsForType(node.type);
    const properties = this.stringifyProperties(node.properties);
    
    return `(${labels} {id: "${node.id}", type: "${node.type}", properties: ${properties}, metadata: ${this.stringifyProperties(node.metadata)}})`;
  }

  static getLabelsForType(type: string): string {
    const labelMap: Record<string, string> = {
      canvas: ':Canvas',
      shape: ':Shape',
      connection: ':Connection',
      chat: ':Chat',
      component: ':Component',
      project: ':Project',
      template: ':Template',
    };
    
    return labelMap[type] || `:${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  static stringifyProperties(properties: Record<string, any>): string {
    return JSON.stringify(properties);
  }

  static createCypherQuery(node: ASTNode): string {
    const labels = this.getLabelsForType(node.type);
    const properties = this.stringifyProperties(node.properties);
    
    let query = `CREATE (n${labels} {id: "${node.id}", type: "${node.type}", properties: ${properties}, metadata: ${this.stringifyProperties(node.metadata)}})`;
    
    for (const child of node.children) {
      query += `\nWITH n\nMATCH (c${this.getLabelsForType(child.type)} {id: "${child.id}"})\nCREATE (n)-[:CONTAINS]->(c)`;
    }
    
    return query;
  }
}