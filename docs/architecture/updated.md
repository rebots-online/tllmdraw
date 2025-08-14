# Project Architecture Updated

Project UUID: 45977b8f-64c1-4b09-94e6-6d5416521aa1

```mermaid
graph TD
  Canvas --> CanvasRenderer
  Canvas --> Draggable
  CanvasRenderer --> ShapeRenderer
  Draggable --> CanvasToolbar
  Draggable --> CanvasImporter
  Draggable --> UserToolbox
  Draggable --> AnnotationTools
  Draggable --> CanvasExporter
  Draggable --> CanvasHistory
  Draggable --> CanvasSettings
```

This diagram reflects the codebase after introducing draggable toolboxes and draggable shapes.
