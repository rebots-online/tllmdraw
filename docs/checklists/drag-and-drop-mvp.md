# Drag and Drop MVP Checklist

Project UUID: 45977b8f-64c1-4b09-94e6-6d5416521aa1

## Tasks

[✅] Create `src/components/Draggable.tsx` component
    - Props: `id: string`
    - Props: `initialPosition: { x: number; y: number }`
    - Props: `onDragEnd?: (position: { x: number; y: number }) => void`
    - Render children within absolutely positioned `div`
    - Use mouse events to update position state
[✅] Update `src/components/Canvas/Canvas.tsx`
    - Introduce state hooks for positions of each toolbox:
        - `toolbarPos`, `importerPos`, `userToolboxPos`, `annotationPos`, `exporterPos`, `historyPos`, `settingsPos`
    - Wrap each toolbox component with `Draggable` using corresponding position state
[✅] Implement shape dragging
    - Modify `src/components/Canvas/ShapeRenderer.tsx`
        - Add `onDragStart?: (id: string, start: { x: number; y: number }, offset: { x: number; y: number }) => void`
        - Call `onDragStart` on `onMouseDown`
    - Modify `src/components/Canvas/CanvasRenderer.tsx`
        - Track `draggingId` and `dragOffset`
        - On `onMouseMove`, if `draggingId`, update shape position via `onNodeUpdate`
        - On `onMouseUp`, clear dragging and call `onNodeUpdate` once more for history
[✅] Enhance undo/redo functionality in `src/components/Canvas/Canvas.tsx`
    - `addToHistory` stores snapshot of shapes and connections
    - `handleUndo` restores previous snapshot
    - `handleRedo` restores next snapshot
[✅] Implement persistence utilities in `src/components/Canvas/Canvas.tsx`
    - `handleSave` serializes `{ shapes, connections, canvasSettings }` to `localStorage` key `nexus-canvas`
    - `handleShare` copies serialized JSON to clipboard via `navigator.clipboard`
[✅] Remove stub comments about unimplemented logic
[✅] Update architecture diagram to include `Draggable` component and data flow changes
[x] Run `pnpm lint` (fails: existing lint errors in unrelated files)
