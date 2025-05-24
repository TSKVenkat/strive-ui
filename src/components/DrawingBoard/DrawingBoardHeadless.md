# DrawingBoardHeadless

A headless component for creating customizable drawing and whiteboard applications with extensive flexibility.

## Usage

```jsx
import { DrawingBoardHeadless } from 'strive-ui';

function MyDrawingApp() {
  const handleExport = (dataUrl) => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <DrawingBoardHeadless.Root
      width={800}
      height={600}
      backgroundColor="#f5f5f5"
      showGrid={true}
    >
      <DrawingBoardHeadless.Toolbar>
        {({ tool, setTool, mode, setMode, clear, undo, redo }) => (
          <div style={{ marginBottom: '10px' }}>
            <button onClick={() => setTool('pen')} style={{ fontWeight: tool === 'pen' ? 'bold' : 'normal' }}>Pen</button>
            <button onClick={() => setTool('eraser')} style={{ fontWeight: tool === 'eraser' ? 'bold' : 'normal' }}>Eraser</button>
            <button onClick={() => setTool('line')} style={{ fontWeight: tool === 'line' ? 'bold' : 'normal' }}>Line</button>
            <button onClick={() => setTool('rectangle')} style={{ fontWeight: tool === 'rectangle' ? 'bold' : 'normal' }}>Rectangle</button>
            <button onClick={() => setTool('circle')} style={{ fontWeight: tool === 'circle' ? 'bold' : 'normal' }}>Circle</button>
            <button onClick={() => setMode('draw')} style={{ fontWeight: mode === 'draw' ? 'bold' : 'normal' }}>Draw</button>
            <button onClick={() => setMode('select')} style={{ fontWeight: mode === 'select' ? 'bold' : 'normal' }}>Select</button>
            <button onClick={clear}>Clear</button>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
          </div>
        )}
      </DrawingBoardHeadless.Toolbar>
      
      <DrawingBoardHeadless.ColorPicker type="stroke">
        {({ color, setColor }) => (
          <div>
            <label>Stroke Color:</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
            />
          </div>
        )}
      </DrawingBoardHeadless.ColorPicker>
      
      <DrawingBoardHeadless.ColorPicker type="fill">
        {({ color, setColor }) => (
          <div>
            <label>Fill Color:</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
            />
          </div>
        )}
      </DrawingBoardHeadless.ColorPicker>
      
      <DrawingBoardHeadless.StrokeWidthPicker>
        {({ strokeWidth, setStrokeWidth }) => (
          <div>
            <label>Stroke Width: {strokeWidth}px</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={strokeWidth} 
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
            />
          </div>
        )}
      </DrawingBoardHeadless.StrokeWidthPicker>
      
      <DrawingBoardHeadless.Canvas style={{ border: '1px solid #ccc' }} />
      
      <DrawingBoardHeadless.Export>
        {({ exportImage }) => (
          <button onClick={() => handleExport(exportImage())}>
            Export as PNG
          </button>
        )}
      </DrawingBoardHeadless.Export>
    </DrawingBoardHeadless.Root>
  );
}
```

## API

### DrawingBoardHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Width of the drawing board |
| `height` | `number` | `600` | Height of the drawing board |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the drawing board |
| `initialObjects` | `DrawingObject[]` | `[]` | Initial objects to render |
| `initialTool` | `DrawingTool` | `'pen'` | Initial drawing tool |
| `initialStyle` | `Partial<DrawingStyle>` | `{}` | Initial drawing style |
| `initialMode` | `DrawingMode` | `'draw'` | Initial drawing mode |
| `gridSize` | `number` | `20` | Size of the grid cells |
| `showGrid` | `boolean` | `false` | Whether to show the grid |
| `snapToGrid` | `boolean` | `false` | Whether to snap to grid |
| `onDrawingChange` | `(objects: DrawingObject[]) => void` | - | Callback when drawing changes |
| `onObjectAdd` | `(object: DrawingObject) => void` | - | Callback when an object is added |
| `onObjectRemove` | `(objectId: string) => void` | - | Callback when an object is removed |
| `onObjectSelect` | `(objectId: string \| null) => void` | - | Callback when an object is selected |

### Other Components

- `DrawingBoardHeadless.Canvas`: Renders the drawing canvas
- `DrawingBoardHeadless.Toolbar`: Provides access to tool selection and actions
- `DrawingBoardHeadless.ColorPicker`: Interface for selecting colors
- `DrawingBoardHeadless.StrokeWidthPicker`: Interface for selecting stroke width
- `DrawingBoardHeadless.OpacityPicker`: Interface for selecting opacity
- `DrawingBoardHeadless.Objects`: Interface for managing drawing objects
- `DrawingBoardHeadless.Export`: Interface for exporting and importing drawings

### Types

```typescript
type DrawingTool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';
type DrawingMode = 'draw' | 'select' | 'pan';

interface DrawingStyle {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
}

interface DrawingObject {
  id: string;
  type: DrawingTool;
  points: { x: number; y: number }[];
  style: DrawingStyle;
  text?: string;
}
```

### useDrawingBoard Hook

For even more control, you can use the `useDrawingBoard` hook directly:

```jsx
import { useDrawingBoard } from 'strive-ui';

function MyCustomDrawingBoard() {
  const {
    objects,
    tool,
    setTool,
    style,
    setStyle,
    canvasRef,
    clear,
    undo,
    redo,
    // ...other properties and methods
  } = useDrawingBoard({
    width: 800,
    height: 600,
    showGrid: true,
  });
  
  // Custom implementation
}
```
