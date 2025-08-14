# LLM Integration Checklist

Project UUID: 45977b8f-64c1-4b09-94e6-6d5416521aa1

## Tasks

[✅] Update `src/components/Canvas/Canvas.tsx` to expose `applyAction` via `forwardRef`
    - Define `CanvasHandle` interface with `applyAction(action: CanvasAction): void`
    - Implement action types: `create`, `update`, `delete`, `move`
[✅] Add `src/lib/llm.ts` implementing provider-agnostic LLM client
    - Define `LLMProviderConfig` and `LLMProviderType`
    - Implement `callLLM(messages: ChatMessage[], config: LLMProviderConfig): Promise<{ reply: string; actions: CanvasAction[] }> `
    - Support providers: `ollama`, `lmstudio`, `openrouter`, `anthropic`, `gemini`
    - Include system prompt for business canvases, planning, UI wireframes, schematics
[✅] Create `src/hooks/use-llm.ts` hook to manage chat state and canvas actions
    - Expose `messages`, `isTyping`, `sendMessage`
    - Use environment variables `VITE_LLM_PROVIDER`, `VITE_LLM_API_KEY`, `VITE_LLM_BASE_URL`, `VITE_LLM_MODEL`
[✅] Update `src/components/Layout/MainLayout.tsx` to connect AI assistant with canvas via `useLLM`
    - Maintain `canvasRef` to apply actions
    - Pass `messages`, `isTyping`, `sendMessage` to `AIAssistant`
    - Apply returned `CanvasAction` objects to canvas
[✅] Update architecture diagram to reflect LLM connectivity
[x] Run `pnpm lint` (fails: existing lint errors in unrelated files)
