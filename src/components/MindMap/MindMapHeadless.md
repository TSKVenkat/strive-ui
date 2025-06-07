# MindMapHeadless

A headless component for creating customizable mind mapping interfaces with extensive flexibility for developers.

## Usage

```jsx
import { MindMapHeadless } from 'pulseui';

function MyMindMap() {
  const initialNodes = [
    {
      id: 'root',
      text: 'Main Idea',
      parentId: null,
      position: { x: 400, y: 100 },
      backgroundColor: '#e1f5fe',
      expanded: true
    }
  ];

  const handleNodeAdd = (node) => {
    console.log('Node added:', node);
  };

  return (
    <MindMapHeadless.Root
      initialNodes={initialNodes}
      defaultNodeBackgroundColor="#f5f5f5"
      defaultNodeBorderColor="#ccc"
      layoutDirection="horizontal"
      onNodeAdd={handleNodeAdd}
      style={{ height: '600px', border: '1px solid #ddd' }}
    >
      <MindMapHeadless.Container>
        <MindMapHeadless.Connections>
          {({ connections }) => (
            <>
              {connections.map(connection => (
                <MindMapHeadless.Connection
                  key={connection.id}
                  id={connection.id}
                />
              ))}
            </>
          )}
        </MindMapHeadless.Connections>
        
        <MindMapHeadless.Nodes>
          {({ nodes, selectedNode }) => (
            <>
              {nodes.map(node => (
                <MindMapHeadless.Node
                  key={node.id}
                  id={node.id}
                >
                  {({ 
                    node, 
                    isSelected, 
                    isEditing, 
                    startEdit, 
                    stopEdit, 
                    toggleExpansion 
                  }) => (
                    <div style={{ 
                      padding: '10px',
                      boxShadow: isSelected ? '0 0 0 2px blue' : 'none',
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isEditing ? (
                        <input
                          autoFocus
                          defaultValue={node.text}
                          onBlur={(e) => stopEdit(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') stopEdit(e.target.value);
                            if (e.key === 'Escape') stopEdit();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: '90%', padding: '5px' }}
                        />
                      ) : (
                        <div onDoubleClick={() => startEdit()}>
                          {node.text}
                        </div>
                      )}
                      
                      {node.parentId && (
                        <div 
                          style={{ 
                            position: 'absolute', 
                            top: '-15px', 
                            right: '-15px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#f44336',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            visibility: isSelected ? 'visible' : 'hidden'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            node.delete();
                          }}
                        >
                          ×
                        </div>
                      )}
                      
                      {MindMapHeadless.getNodeChildren(node.id).length > 0 && (
                        <div 
                          style={{ 
                            position: 'absolute', 
                            bottom: '-15px', 
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpansion();
                          }}
                        >
                          {node.expanded ? '-' : '+'}
                        </div>
                      )}
                    </div>
                  )}
                </MindMapHeadless.Node>
              ))}
            </>
          )}
        </MindMapHeadless.Nodes>
      </MindMapHeadless.Container>
      
      <MindMapHeadless.Controls>
        {({ addNode, autoLayout, selectedNode, exportToJSON, importFromJSON }) => (
          <div style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
            <button 
              onClick={() => addNode({ 
                text: 'New Idea', 
                parentId: selectedNode ? selectedNode.id : null 
              })}
              disabled={!selectedNode}
            >
              Add Child Node
            </button>
            <button onClick={() => addNode({ text: 'New Topic', parentId: null })}>
              Add Root Node
            </button>
            <button onClick={autoLayout}>
              Auto Layout
            </button>
            <button onClick={() => {
              const json = exportToJSON();
              console.log(json);
              // You could also save this to a file or localStorage
            }}>
              Export
            </button>
            <button onClick={() => {
              // In a real app, you would get this from a file input or API
              const json = prompt('Paste JSON data:');
              if (json) importFromJSON(json);
            }}>
              Import
            </button>
          </div>
        )}
      </MindMapHeadless.Controls>
    </MindMapHeadless.Root>
  );
}
```

## API

### MindMapHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialNodes` | `MindMapNode[]` | `[]` | Initial nodes |
| `initialConnections` | `MindMapConnection[]` | `[]` | Initial connections |
| `defaultNodeWidth` | `number` | `150` | Default node width |
| `defaultNodeHeight` | `number` | `50` | Default node height |
| `defaultNodeBackgroundColor` | `string` | `'#ffffff'` | Default node background color |
| `defaultNodeTextColor` | `string` | `'#000000'` | Default node text color |
| `defaultNodeBorderColor` | `string` | `'#cccccc'` | Default node border color |
| `defaultNodeBorderWidth` | `number` | `1` | Default node border width |
| `defaultNodeBorderRadius` | `number` | `5` | Default node border radius |
| `defaultNodeFontSize` | `number` | `14` | Default node font size |
| `defaultNodeFontWeight` | `string \| number` | `'normal'` | Default node font weight |
| `defaultConnectionColor` | `string` | `'#666666'` | Default connection color |
| `defaultConnectionWidth` | `number` | `2` | Default connection width |
| `defaultConnectionStyle` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Default connection style |
| `autoLayout` | `boolean` | `true` | Whether to auto-layout the mind map |
| `layoutDirection` | `'horizontal' \| 'vertical' \| 'radial'` | `'horizontal'` | Layout direction |
| `nodeSpacing` | `number` | `50` | Node spacing in the layout |
| `levelSpacing` | `number` | `150` | Level spacing in the layout |
| `onNodesChange` | `(nodes: MindMapNode[]) => void` | - | Callback when nodes change |
| `onConnectionsChange` | `(connections: MindMapConnection[]) => void` | - | Callback when connections change |
| `onNodeAdd` | `(node: MindMapNode) => void` | - | Callback when a node is added |
| `onNodeUpdate` | `(node: MindMapNode) => void` | - | Callback when a node is updated |
| `onNodeDelete` | `(nodeId: string) => void` | - | Callback when a node is deleted |
| `onNodeSelect` | `(node: MindMapNode \| null) => void` | - | Callback when a node is selected |
| `onConnectionAdd` | `(connection: MindMapConnection) => void` | - | Callback when a connection is added |
| `onConnectionUpdate` | `(connection: MindMapConnection) => void` | - | Callback when a connection is updated |
| `onConnectionDelete` | `(connectionId: string) => void` | - | Callback when a connection is deleted |

### Node and Connection Types

```typescript
interface MindMapNode {
  id: string;
  text: string;
  parentId: string | null;
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string | number;
  data?: Record<string, any>;
  expanded?: boolean;
  selected?: boolean;
  editing?: boolean;
}

interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  data?: Record<string, any>;
}
```

### Other Components

- `MindMapHeadless.Container`: Container for the mind map
- `MindMapHeadless.Node`: Represents a node in the mind map
- `MindMapHeadless.Connection`: Represents a connection between nodes
- `MindMapHeadless.Nodes`: Renders all nodes
- `MindMapHeadless.Connections`: Renders all connections
- `MindMapHeadless.Controls`: Provides access to mind map controls
- `MindMapHeadless.NodeChildren`: Renders children of a specific node

### useMindMap Hook

For even more control, you can use the `useMindMap` hook directly:

```jsx
import { useMindMap } from 'pulseui';

function MyCustomMindMap() {
  const {
    nodes,
    connections,
    selectedNode,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addConnection,
    autoLayout,
    exportToJSON,
    importFromJSON,
    // ...other properties and methods
  } = useMindMap({
    initialNodes: [
      { id: 'root', text: 'Main Idea', parentId: null, position: { x: 100, y: 100 } }
    ],
    layoutDirection: 'horizontal',
  });
  
  // Custom implementation
}
```
