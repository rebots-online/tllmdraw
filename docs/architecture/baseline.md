# Project Architecture Baseline

Project UUID: 45977b8f-64c1-4b09-94e6-6d5416521aa1

```mermaid
graph TD
  Canvas --> CanvasRenderer
  Canvas --> CanvasToolbar
  Canvas --> CanvasImporter
  Canvas --> CanvasExporter
  Canvas --> CanvasHistory
  Canvas --> CanvasSettings
  Canvas --> UserToolbox
  Canvas --> AnnotationTools
  Canvas --> TldrawImporter
  Canvas --> ExcalidrawImporter
  CanvasRenderer --> ShapeRenderer
```

This diagram captures the state of the codebase before implementing drag-and-drop functionality for toolboxes and canvas elements.
