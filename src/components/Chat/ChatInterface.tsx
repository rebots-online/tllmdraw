"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff, Loader2 } from 'lucide-react';
import { ChatMessage, CanvasAction } from '@/ast/ast-types';
import { showSuccess, showError } from '@/utils/toast';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  onCanvasAction?: (action: CanvasAction) => void;
  messages: ChatMessage[];
  isTyping?: boolean;
  isConnected?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  onCanvasAction,
  messages,
  isTyping = false,
  isConnected = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      await onSendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      showError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      showSuccess('Voice recording started');
    } else {
      showSuccess('Voice recording stopped');
    }
  };

  const formatMessage = (message: ChatMessage) => {
    const timestamp = new Date(message.timestamp).toLocaleTimeString();
    
    return (
      <div
        key={message.id}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <div className="flex items-center mb-1">
            {message.role === 'user' ? (
              <User className="w-4 h-4 mr-2" />
            ) : (
              <Bot className="w-4 h-4 mr-2" />
            )}
            <span className="text-xs opacity-75">{timestamp}</span>
          </div>
          <div className="text-sm">{message.content}</div>
          {message.metadata?.aiSuggestions && (
            <div className="mt-2">
              <div className="text-xs font-semibold mb-1">AI Suggestions:</div>
              {message.metadata.aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1 cursor-pointer hover:bg-blue-200"
                  onClick={() => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          {!isConnected && (
            <div className="ml-2 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-full ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(formatMessage)}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your design..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};