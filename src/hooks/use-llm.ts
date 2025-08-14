import { useState } from 'react';
import { ChatMessage, CanvasAction } from '@/ast/ast-types';
import { callLLM, LLMProviderConfig, LLMProviderType } from '@/lib/llm';

export function useLLM() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'assistant-0',
      role: 'assistant',
      content:
        "Hello! I'm your AI design assistant. I can help with business canvases, planning, presentations, UI wireframes, and schematics.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const config: LLMProviderConfig = {
    type: (import.meta.env.VITE_LLM_PROVIDER as LLMProviderType) || 'openrouter',
    apiKey: import.meta.env.VITE_LLM_API_KEY,
    baseUrl: import.meta.env.VITE_LLM_BASE_URL,
    model: import.meta.env.VITE_LLM_MODEL || 'gpt-3.5-turbo',
  };

  const sendMessage = async (message: string): Promise<CanvasAction[]> => {
    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    try {
      const result = await callLLM([...messages, userMsg], config);
      const assistantMsg: ChatMessage = {
        id: `${Date.now() + 1}`,
        role: 'assistant',
        content: result.reply,
        timestamp: new Date(),
        metadata: result.actions.length ? { canvasActions: result.actions } : undefined,
      };
      setMessages(prev => [...prev, assistantMsg]);
      return result.actions;
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage };
}
