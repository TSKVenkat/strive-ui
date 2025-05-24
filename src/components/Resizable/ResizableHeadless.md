# ResizableHeadless

A headless component for creating resizable elements with extensive customization options.

## Usage

```jsx
import { ResizableHeadless } from 'strive-ui';

function MyResizableComponent() {
  return (
    <ResizableHeadless.Root
      initialWidth={300}
      initialHeight={200}
      minWidth={100}
      minHeight={100}
    >
      <ResizableHeadless.Content>
        {({ size, isResizing }) => (
          <div>
            <p>Width: {size.width}px</p>
            <p>Height: {size.height}px</p>
            <p>{isResizing ? 'Resizing...' : 'Not resizing'}</p>
          </div>
        )}
      </ResizableHeadless.Content>
      
      <ResizableHeadless.Handle direction="right" />
      <ResizableHeadless.Handle direction="bottom" />
      <ResizableHeadless.Handle direction="bottomRight" />
    </ResizableHeadless.Root>
  );
}
```

## API

### ResizableHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialWidth` | `number` | `200` | Initial width of the resizable element |
| `initialHeight` | `number` | `200` | Initial height of the resizable element |
| `minWidth` | `number` | `10` | Minimum width constraint |
| `maxWidth` | `number` | `Infinity` | Maximum width constraint |
| `minHeight` | `number` | `10` | Minimum height constraint |
| `maxHeight` | `number` | `Infinity` | Maximum height constraint |
| `grid` | `[number, number]` | - | Grid size for snapping during resize |
| `aspectRatio` | `number` | - | Aspect ratio to maintain during resize (width/height) |
| `directions` | `ResizeDirection[]` | `['right', 'bottom', 'bottomRight']` | Allowed resize directions |
| `disabled` | `boolean` | `false` | Whether the element is resizable |
| `onResizeStart` | `(size, direction) => void` | - | Callback when resize starts |
| `onResize` | `(size, direction) => void` | - | Callback during resize |
| `onResizeEnd` | `(size, direction) => void` | - | Callback when resize ends |

### ResizableHeadless.Content

Renders the content of the resizable element. Can accept a render prop function that receives `size` and `isResizing` as arguments.

### ResizableHeadless.Handle

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `direction` | `ResizeDirection` | Yes | Direction of the resize handle |

## Types

```typescript
type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
```
