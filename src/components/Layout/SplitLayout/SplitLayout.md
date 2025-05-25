# Split Layout

The `SplitLayout` component provides a flexible way to create resizable split layouts for side-by-side content, code editors, comparison views, or master-detail interfaces.

## Features

- **Resizable Split Panes**: Drag the divider to resize the panes
- **Horizontal or Vertical Splitting**: Split content horizontally or vertically
- **Configurable Gutter**: Customize the size and appearance of the divider
- **Minimum Size Constraints**: Set minimum sizes for each pane
- **Percentage or Pixel Units**: Use percentage or pixel units for sizing
- **Collapse Support**: Optionally collapse panes when dragged to minimum size
- **Touch Support**: Works with both mouse and touch events
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { SplitLayout } from '@strive-ui/layout';

function BasicSplit() {
  return (
    <SplitLayout style={{ height: '400px' }}>
      <div style={{ padding: '1rem' }}>
        <h2>Left Panel</h2>
        <p>This is the left panel content.</p>
      </div>
      <div style={{ padding: '1rem' }}>
        <h2>Right Panel</h2>
        <p>This is the right panel content.</p>
      </div>
    </SplitLayout>
  );
}
```

## Examples

### Vertical Split Layout

```tsx
import { SplitLayout } from '@strive-ui/layout';

function VerticalSplit() {
  return (
    <SplitLayout 
      direction="vertical" 
      initialSizes={[30, 70]} 
      style={{ height: '400px' }}
    >
      <div style={{ padding: '1rem' }}>
        <h2>Top Panel</h2>
        <p>This is the top panel content.</p>
      </div>
      <div style={{ padding: '1rem' }}>
        <h2>Bottom Panel</h2>
        <p>This is the bottom panel content.</p>
      </div>
    </SplitLayout>
  );
}
```

### Code Editor Layout

```tsx
import { SplitLayout } from '@strive-ui/layout';
import { useState } from 'react';

function CodeEditorLayout() {
  const [code, setCode] = useState('function helloWorld() {\n  console.log("Hello, world!");\n}');
  const [output, setOutput] = useState('');
  
  const runCode = () => {
    try {
      // This is just a simple example
      eval(code);
      setOutput('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };
  
  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0.5rem' }}>
        <button onClick={runCode}>Run Code</button>
      </div>
      
      <SplitLayout 
        direction="vertical" 
        initialSizes={[70, 30]} 
        minSizes={[20, 10]}
        style={{ flex: 1 }}
      >
        <div style={{ height: '100%', padding: '0.5rem', backgroundColor: '#f5f5f5' }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ 
              width: '100%', 
              height: '100%', 
              fontFamily: 'monospace', 
              border: 'none', 
              resize: 'none',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>
        <div style={{ 
          height: '100%', 
          padding: '0.5rem', 
          backgroundColor: '#2d2d2d', 
          color: 'white',
          fontFamily: 'monospace',
          overflow: 'auto'
        }}>
          <pre>{output}</pre>
        </div>
      </SplitLayout>
    </div>
  );
}
```

### Nested Split Layouts

```tsx
import { SplitLayout } from '@strive-ui/layout';

function NestedSplitLayout() {
  return (
    <SplitLayout style={{ height: '500px' }}>
      <div style={{ padding: '1rem' }}>
        <h2>Left Panel</h2>
        <p>This is the left panel content.</p>
      </div>
      
      <SplitLayout direction="vertical">
        <div style={{ padding: '1rem' }}>
          <h2>Top Right Panel</h2>
          <p>This is the top right panel content.</p>
        </div>
        <div style={{ padding: '1rem' }}>
          <h2>Bottom Right Panel</h2>
          <p>This is the bottom right panel content.</p>
        </div>
      </SplitLayout>
    </SplitLayout>
  );
}
```

### Collapsible Panes

```tsx
import { SplitLayout } from '@strive-ui/layout';

function CollapsiblePanes() {
  return (
    <SplitLayout 
      initialSizes={[30, 70]} 
      minSizes={[10, 10]}
      collapseWhenDraggedToMin={true}
      style={{ height: '400px' }}
    >
      <div style={{ padding: '1rem' }}>
        <h2>Sidebar</h2>
        <p>This is the sidebar content. Drag all the way left to collapse.</p>
      </div>
      <div style={{ padding: '1rem' }}>
        <h2>Main Content</h2>
        <p>This is the main content area.</p>
      </div>
    </SplitLayout>
  );
}
```

### File Explorer and Preview

```tsx
import { SplitLayout } from '@strive-ui/layout';
import { useState } from 'react';

function FileExplorerAndPreview() {
  const files = [
    { id: 1, name: 'Document 1.pdf', type: 'pdf' },
    { id: 2, name: 'Image 1.jpg', type: 'image' },
    { id: 3, name: 'Spreadsheet.xlsx', type: 'spreadsheet' },
    { id: 4, name: 'Presentation.pptx', type: 'presentation' },
  ];
  
  const [selectedFile, setSelectedFile] = useState(null);
  
  return (
    <SplitLayout 
      initialSizes={[30, 70]} 
      minSizes={[20, 40]}
      style={{ height: '500px', border: '1px solid #e0e0e0' }}
    >
      <div style={{ 
        height: '100%', 
        overflow: 'auto', 
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ padding: '1rem' }}>
          <h3>Files</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map((file) => (
              <li 
                key={file.id}
                style={{ 
                  padding: '0.5rem', 
                  cursor: 'pointer',
                  backgroundColor: selectedFile === file ? '#e0e0e0' : 'transparent',
                  borderRadius: '4px'
                }}
                onClick={() => setSelectedFile(file)}
              >
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div style={{ height: '100%', overflow: 'auto', padding: '1rem' }}>
        {selectedFile ? (
          <div>
            <h2>Preview: {selectedFile.name}</h2>
            <div style={{ 
              height: '300px', 
              backgroundColor: '#f9f9f9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: '4px'
            }}>
              {selectedFile.type === 'image' ? (
                <div>🖼️ Image Preview</div>
              ) : selectedFile.type === 'pdf' ? (
                <div>📄 PDF Preview</div>
              ) : selectedFile.type === 'spreadsheet' ? (
                <div>📊 Spreadsheet Preview</div>
              ) : (
                <div>📝 Document Preview</div>
              )}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h3>File Information</h3>
              <p><strong>Name:</strong> {selectedFile.name}</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          </div>
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#888'
          }}>
            Select a file to preview
          </div>
        )}
      </div>
    </SplitLayout>
  );
}
```

## API Reference

### SplitLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `[React.ReactNode, React.ReactNode]` | - | The content to render in the split layout. Should be exactly two children. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the split. |
| `initialSizes` | `[number, number]` | `[50, 50]` | The initial sizes of the split panes. |
| `minSizes` | `[number, number]` | `[0, 0]` | The minimum sizes of the split panes. |
| `unit` | `'percentage' \| 'pixel'` | `'percentage'` | The unit to use for sizes. |
| `gutterSize` | `number` | `10` | The width of the gutter between the panes. |
| `gutterColor` | `string` | `'#e0e0e0'` | The color of the gutter. |
| `resizable` | `boolean` | `true` | Whether the split is resizable. |
| `collapseWhenDraggedToMin` | `boolean` | `false` | Whether to collapse the first pane when dragging to minimum size. |
| `onSizesChange` | `(sizes: [number, number]) => void` | - | Callback when the sizes change. |
| `as` | `React.ElementType` | `'div'` | The component used for the root node. |
| `className` | `string` | `''` | Custom class name. |

Additionally, the SplitLayout component accepts all standard HTML div attributes.

### SplitPane Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the pane. |
| `minSize` | `number` | - | The minimum size of the pane. |
| `as` | `React.ElementType` | `'div'` | The component used for the root node. |
| `className` | `string` | `''` | Custom class name. |

Additionally, the SplitPane component accepts all standard HTML div attributes.

## Accessibility

The SplitLayout component includes several accessibility considerations:

- Keyboard navigation support for resizing (TODO)
- ARIA attributes for better screen reader support (TODO)
- High contrast mode support

## Browser Support

The SplitLayout component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
