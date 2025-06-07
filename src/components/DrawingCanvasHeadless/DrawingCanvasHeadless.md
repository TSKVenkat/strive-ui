# DrawingCanvasHeadless

The `DrawingCanvasHeadless` component is a flexible, headless UI component for creating drawing canvas functionality in React applications. It provides a comprehensive API for handling free-form drawing on a canvas, with features like stroke customization, undo/redo functionality, and exporting drawings.

## Features

- **Headless UI Pattern**: Separates logic from presentation, allowing for complete styling freedom
- **Compound Component Pattern**: Provides a set of composable subcomponents for building custom drawing interfaces
- **Customizable Strokes**: Control stroke color, width, opacity, and other properties
- **Undo/Redo Functionality**: Built-in history management for drawing actions
- **Export Options**: Save drawings as PNG, JPEG, or SVG
- **Accessibility Support**: Keyboard navigation and ARIA attributes for better accessibility
- **Responsive Design**: Adapts to different screen sizes and device types
- **Touch and Pressure Support**: Works with touch devices and pressure-sensitive inputs

## Installation

```bash
npm install @pulseui/drawing-canvas-headless
```

## Basic Usage

```tsx
import { DrawingCanvasHeadless, useDrawingCanvas } from '@pulseui/drawing-canvas-headless';

function MyDrawingCanvas() {
  const drawingCanvas = useDrawingCanvas({
    strokeColor: '#000000',
    strokeWidth: 2,
    canvasWidth: 500,
    canvasHeight: 300,
  });

  return (
    <DrawingCanvasHeadless {...drawingCanvas}>
      <DrawingCanvasHeadless.Canvas />
      <div className="drawing-controls">
        <DrawingCanvasHeadless.ClearButton>
          Clear Canvas
        </DrawingCanvasHeadless.ClearButton>
        <DrawingCanvasHeadless.UndoButton>
          Undo
        </DrawingCanvasHeadless.UndoButton>
        <DrawingCanvasHeadless.RedoButton>
          Redo
        </DrawingCanvasHeadless.RedoButton>
        <DrawingCanvasHeadless.SaveButton format="png">
          Save as PNG
        </DrawingCanvasHeadless.SaveButton>
      </div>
    </DrawingCanvasHeadless>
  );
}
```

## Advanced Usage

```tsx
import { DrawingCanvasHeadless, useDrawingCanvas } from '@pulseui/drawing-canvas-headless';
import { useState } from 'react';

function AdvancedDrawingCanvas() {
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const drawingCanvas = useDrawingCanvas({
    strokeColor,
    strokeWidth,
    canvasWidth: 800,
    canvasHeight: 600,
    backgroundColor: '#ffffff',
    enablePressure: true,
    historyLimit: 20,
  });

  const handleColorChange = (e) => {
    setStrokeColor(e.target.value);
  };

  const handleWidthChange = (e) => {
    setStrokeWidth(parseInt(e.target.value, 10));
  };

  return (
    <div className="drawing-app">
      <div className="toolbar">
        <div className="color-picker">
          <label htmlFor="color">Color:</label>
          <input
            id="color"
            type="color"
            value={strokeColor}
            onChange={handleColorChange}
          />
        </div>
        <div className="width-slider">
          <label htmlFor="width">Width:</label>
          <input
            id="width"
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={handleWidthChange}
          />
          <span>{strokeWidth}px</span>
        </div>
      </div>
      
      <DrawingCanvasHeadless {...drawingCanvas}>
        <DrawingCanvasHeadless.Canvas className="drawing-canvas" />
        <div className="drawing-controls">
          <DrawingCanvasHeadless.ClearButton className="control-button">
            Clear All
          </DrawingCanvasHeadless.ClearButton>
          <DrawingCanvasHeadless.UndoButton 
            className="control-button"
            disabled={!drawingCanvas.canUndo}
          >
            Undo
          </DrawingCanvasHeadless.UndoButton>
          <DrawingCanvasHeadless.RedoButton 
            className="control-button"
            disabled={!drawingCanvas.canRedo}
          >
            Redo
          </DrawingCanvasHeadless.RedoButton>
          <DrawingCanvasHeadless.SaveButton 
            className="control-button"
            format="png"
            fileName="my-drawing"
          >
            Export PNG
          </DrawingCanvasHeadless.SaveButton>
        </div>
      </DrawingCanvasHeadless>
    </div>
  );
}
```

## API Reference

### useDrawingCanvas Hook

```tsx
const drawingCanvas = useDrawingCanvas(options);
```

#### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `strokeColor` | `string` | `'#000000'` | Color of the drawing stroke |
| `strokeWidth` | `number` | `2` | Width of the drawing stroke in pixels |
| `canvasWidth` | `number` | `500` | Width of the canvas in pixels |
| `canvasHeight` | `number` | `300` | Height of the canvas in pixels |
| `backgroundColor` | `string` | `'transparent'` | Background color of the canvas |
| `enablePressure` | `boolean` | `false` | Enable pressure sensitivity for compatible devices |
| `minPressure` | `number` | `0.1` | Minimum pressure value (0-1) |
| `maxPressure` | `number` | `1.0` | Maximum pressure value (0-1) |
| `historyLimit` | `number` | `50` | Maximum number of undo/redo steps to store |
| `smoothing` | `boolean` | `true` | Enable stroke smoothing |
| `smoothingFactor` | `number` | `0.5` | Smoothing factor (0-1), higher values create smoother lines |
| `onStrokeStart` | `(point: Point) => void` | `undefined` | Callback when a stroke starts |
| `onStrokeEnd` | `(stroke: Stroke) => void` | `undefined` | Callback when a stroke ends |
| `onClear` | `() => void` | `undefined` | Callback when canvas is cleared |
| `onSave` | `(dataUrl: string, format: string) => void` | `undefined` | Callback when drawing is saved |

#### Return Value

| Name | Type | Description |
|------|------|-------------|
| `canvasRef` | `React.RefObject<HTMLCanvasElement>` | Ref to attach to the canvas element |
| `strokes` | `Stroke[]` | Array of all strokes drawn on the canvas |
| `isDrawing` | `boolean` | Whether the user is currently drawing |
| `canUndo` | `boolean` | Whether there are strokes that can be undone |
| `canRedo` | `boolean` | Whether there are strokes that can be redone |
| `clear` | `() => void` | Function to clear all strokes |
| `undo` | `() => void` | Function to undo the last stroke |
| `redo` | `() => void` | Function to redo the last undone stroke |
| `save` | `(format: 'png' \| 'jpeg' \| 'svg', fileName?: string) => string` | Function to save the drawing as an image |
| `setStrokeColor` | `(color: string) => void` | Function to update the stroke color |
| `setStrokeWidth` | `(width: number) => void` | Function to update the stroke width |
| `setBackgroundColor` | `(color: string) => void` | Function to update the background color |

### DrawingCanvasHeadless Component

```tsx
<DrawingCanvasHeadless {...drawingCanvas}>
  {/* Children components */}
</DrawingCanvasHeadless>
```

#### Props

All props from the `useDrawingCanvas` hook return value.

### DrawingCanvasHeadless.Canvas

```tsx
<DrawingCanvasHeadless.Canvas />
```

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | CSS class to apply to the canvas |
| `style` | `React.CSSProperties` | `undefined` | Inline styles to apply to the canvas |
| `as` | `React.ElementType` | `'canvas'` | Element type to render as |

### DrawingCanvasHeadless.ClearButton

```tsx
<DrawingCanvasHeadless.ClearButton>
  Clear
</DrawingCanvasHeadless.ClearButton>
```

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | CSS class to apply to the button |
| `style` | `React.CSSProperties` | `undefined` | Inline styles to apply to the button |
| `as` | `React.ElementType` | `'button'` | Element type to render as |
| `onClick` | `(e: React.MouseEvent) => void` | `undefined` | Additional onClick handler |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `children` | `React.ReactNode` | `undefined` | Button content |

### DrawingCanvasHeadless.UndoButton

```tsx
<DrawingCanvasHeadless.UndoButton>
  Undo
</DrawingCanvasHeadless.UndoButton>
```

#### Props

Same as `ClearButton`.

### DrawingCanvasHeadless.RedoButton

```tsx
<DrawingCanvasHeadless.RedoButton>
  Redo
</DrawingCanvasHeadless.RedoButton>
```

#### Props

Same as `ClearButton`.

### DrawingCanvasHeadless.SaveButton

```tsx
<DrawingCanvasHeadless.SaveButton format="png" fileName="my-drawing">
  Save
</DrawingCanvasHeadless.SaveButton>
```

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `'png' \| 'jpeg' \| 'svg'` | `'png'` | Format to save the drawing as |
| `fileName` | `string` | `'drawing'` | Name of the saved file (without extension) |
| `quality` | `number` | `0.95` | Quality of JPEG image (0-1) |
| `download` | `boolean` | `true` | Whether to trigger download automatically |
| ...other props from `ClearButton` | | | |

## Accessibility

The `DrawingCanvasHeadless` component implements several accessibility features:

- Proper ARIA roles and attributes for interactive elements
- Keyboard navigation support
- Focus management for control buttons
- Screen reader announcements for actions like undo, redo, and clear

## Browser Support

The component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
