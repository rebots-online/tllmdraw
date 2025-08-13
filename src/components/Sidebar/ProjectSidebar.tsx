"use client";

import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Users, 
  Palette, 
  Component,
  Layout,
  GitBranch,
  Settings,
  Plus,
  Search
} from 'lucide-react';

interface ProjectSidebarProps {
  onTemplateSelect: (template: string) => void;
  onComponentSelect: (component: string) => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  onTemplateSelect,
  onComponentSelect,
}) => {
  const [activeTab, setActiveTab] = useState('templates');

  const templates = [
    { id: 'flowchart', name: 'Flowchart', icon: GitBranch },
    { id: 'wireframe', name: 'Wireframe', icon: Layout },
    { id: 'mindmap', name: 'Mind Map', icon: Component },
    { id: 'user-journey', name: 'User Journey', icon: Users },
    { id: 'architecture', name: 'System Architecture', icon: Folder },
  ];

  const components = [
    { id: 'button', name: 'Button', icon: Component },
    { id: 'input', name: 'Input Field', icon: Component },
    { id: 'card', name: 'Card', icon: Component },
    { id: 'navbar', name: 'Navigation', icon: Component },
    { id: 'modal', name: 'Modal', icon: Component },
    { id: 'form', name: 'Form', icon: Component },
  ];

  const renderTemplates = () => (
    <div className="space-y-2">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{template.name}</span>
          </button>
        );
      })}
    </div>
  );

  const renderComponents = () => (
    <div className="space-y-2">
      {components.map((component) => {
        const Icon = component.icon;
        return (
          <button
            key={component.id}
            onClick={() => onComponentSelect(component.id)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{component.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Project</h2>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Components
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'components' && renderComponents()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>
    </div>
  );
};