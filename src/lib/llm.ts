import { ChatMessage, CanvasAction } from '@/ast/ast-types';

export type LLMProviderType = 'ollama' | 'lmstudio' | 'openrouter' | 'anthropic' | 'gemini';

export interface LLMProviderConfig {
  type: LLMProviderType;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

const SYSTEM_PROMPT = `You are an expert brainstorm partner for Nexus Canvas, skilled in crafting business canvases, business planning and presentation content, app UI and wireframes, and technical schematics. All generated elements must be drag-and-droppable and optimally positioned on the canvas. When producing content for the canvas, respond in JSON with {"reply": string, "actions": CanvasAction[]}.`;

function extractJSON(text: string): { reply: string; actions: CanvasAction[] } {
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const obj = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      return {
        reply: obj.reply ?? text,
        actions: obj.actions ?? [],
      };
    }
  } catch {
    // ignore parse errors
  }
  return { reply: text, actions: [] };
}

export async function callLLM(messages: ChatMessage[], config: LLMProviderConfig): Promise<{ reply: string; actions: CanvasAction[] }> {
  const history = messages.map(m => ({ role: m.role, content: m.content }));
  let url = config.baseUrl;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: unknown;

  switch (config.type) {
    case 'anthropic':
      url = url ?? 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = config.apiKey ?? '';
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: config.model,
        system: SYSTEM_PROMPT,
        max_tokens: 1024,
        messages: history,
      };
      break;
    case 'gemini':
      url = url ?? `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
      body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}` }],
          },
        ],
      };
      break;
    default:
      url = url ?? (config.type === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : config.type === 'ollama'
        ? 'http://localhost:11434/v1/chat/completions'
        : config.type === 'lmstudio'
        ? 'http://localhost:1234/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions');
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
      body = {
        model: config.model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        stream: false,
      };
      break;
  }

  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();

  let text: string = '';
  if (config.type === 'anthropic') {
    text = data.content?.[0]?.text ?? '';
  } else if (config.type === 'gemini') {
    text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } else {
    text = data.choices?.[0]?.message?.content ?? '';
  }

  return extractJSON(text);
}
