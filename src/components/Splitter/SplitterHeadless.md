# SplitterHeadless

A headless component for creating resizable split views with extensive customization options.

## Usage

```jsx
import { SplitterHeadless } from 'strive-ui';

function MySplitView() {
  return (
    <SplitterHeadless.Root 
      direction="horizontal" 
      initialSizes={[30, 70]}
      minSizes={[100, 200]}
    >
      <SplitterHeadless.Pane index={0}>
        {({ size }) => (
          <div>Left Pane ({size.toFixed(1)}%)</div>
        )}
      </SplitterHeadless.Pane>
      
      <SplitterHeadless.Gutter index={0} />
      
      <SplitterHeadless.Pane index={1}>
        {({ size }) => (
          <div>Right Pane ({size.toFixed(1)}%)</div>
        )}
      </SplitterHeadless.Pane>
      
      <SplitterHeadless.Controls>
        {({ resetSizes }) => (
          <button onClick={resetSizes}>Reset</button>
        )}
      </SplitterHeadless.Controls>
    </SplitterHeadless.Root>
  );
}
```

## API

### SplitterHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the split |
| `initialSizes` | `number[]` | `[50, 50]` | Initial sizes of the panes as percentages |
| `minSizes` | `number[]` | `[]` | Minimum sizes of the panes in pixels |
| `maxSizes` | `number[]` | `[]` | Maximum sizes of the panes in pixels |
| `disabled` | `boolean` | `false` | Whether the splitter is disabled |
| `gutterSize` | `number` | `10` | Gutter size in pixels |
| `snapThreshold` | `number` | `0` | Snap threshold in pixels |
| `onDragStart` | `(sizes: number[]) => void` | - | Callback when drag starts |
| `onDrag` | `(sizes: number[]) => void` | - | Callback during drag |
| `onDragEnd` | `(sizes: number[]) => void` | - | Callback when drag ends |
| `onPaneCollapse` | `(index: number) => void` | - | Callback when a pane is collapsed |
| `onPaneExpand` | `(index: number) => void` | - | Callback when a pane is expanded |

### SplitterHeadless.Pane

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `index` | `number` | Yes | Index of the pane |
| `as` | `React.ElementType` | No | Element type to render as |

### SplitterHeadless.Gutter

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `index` | `number` | Yes | Index of the gutter |
| `as` | `React.ElementType` | No | Element type to render as |

### SplitterHeadless.Controls

Provides access to control functions for the splitter.
