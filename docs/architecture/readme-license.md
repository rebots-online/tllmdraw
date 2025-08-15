# Project Architecture - README & License Update

Project UUID: 45977b8f-64c1-4b09-94e6-6d5416521aa1

```mermaid
graph TD
  MainLayout --> Canvas
  MainLayout --> AIAssistant
  MainLayout --> useLLM
  useLLM --> LLMService
  useLLM --> Canvas
  LLMService --> LocalLLM["Ollama / LM Studio"]
  LLMService --> HostedLLM["OpenRouter / Anthropic / Gemini"]
  LLMService --> Response["JSON {reply, actions}"]
  Response --> Canvas
  Canvas --> CanvasRenderer
  Canvas --> Draggable
  Canvas --> CanvasToolbar
  Canvas --> CanvasImporter
  Canvas --> UserToolbox
  Canvas --> AnnotationTools
  Canvas --> CanvasExporter
  Canvas --> CanvasHistory
  Canvas --> CanvasSettings
```

Architecture unchanged for README & license update.
