# Tree

The Tree component displays hierarchical data structures in a tree-like format. It's useful for representing file systems, organization charts, nested menus, or any other hierarchical data.

## Features

- Expandable/collapsible nodes
- Single or multiple selection
- Customizable icons
- Optional connecting lines
- Animation support
- Keyboard navigation
- Accessibility support
- Custom node rendering
- Disabled nodes
- Customizable indentation

## Installation

```jsx
import { Tree } from 'pulseui';
```

## Usage

```jsx
import { Tree } from 'pulseui';

const fileStructure = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          {
            id: 'Tree.tsx',
            label: 'Tree.tsx',
          },
          {
            id: 'Button.tsx',
            label: 'Button.tsx',
          },
        ],
      },
      {
        id: 'App.tsx',
        label: 'App.tsx',
      },
    ],
  },
  {
    id: 'package.json',
    label: 'package.json',
  },
];

function MyComponent() {
  const handleNodeSelect = (node, path) => {
    console.log('Selected node:', node);
    console.log('Path to node:', path);
  };

  return (
    <Tree 
      nodes={fileStructure} 
      onNodeSelect={handleNodeSelect}
      showLines
    />
  );
}
```

## Props

### Tree Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | Required | Array of tree nodes to display |
| `onNodeSelect` | `(node: TreeNode, path: (string \| number)[]) => void` | - | Function called when a node is selected |
| `onNodeToggle` | `(node: TreeNode, expanded: boolean, path: (string \| number)[]) => void` | - | Function called when a node is expanded or collapsed |
| `showLines` | `boolean` | `true` | Whether to show lines connecting nodes |
| `animate` | `boolean` | `true` | Whether to animate expanding and collapsing |
| `multiSelect` | `boolean` | `false` | Whether to allow multiple selections |
| `collapsedIcon` | `React.ReactNode` | - | Custom icon for collapsed state |
| `expandedIcon` | `React.ReactNode` | - | Custom icon for expanded state |
| `showIcons` | `boolean` | `true` | Whether to show icons for nodes |
| `className` | `string` | - | Additional CSS class for the container |
| `style` | `React.CSSProperties` | - | Additional inline styles for the container |
| `nodeRenderer` | `(node: TreeNode, isExpanded: boolean, isSelected: boolean) => React.ReactNode` | - | Custom renderer for node content |
| `indented` | `boolean` | `true` | Whether to indent nodes |
| `indentationWidth` | `number` | `20` | Indentation width in pixels |

### TreeNode Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | Required | Unique identifier for the node |
| `label` | `React.ReactNode` | Required | Label to display for the node |
| `icon` | `React.ReactNode` | - | Icon to display before the label |
| `data` | `any` | - | Additional data to store with the node |
| `children` | `TreeNode[]` | - | Child nodes |
| `defaultExpanded` | `boolean` | `false` | Whether the node is initially expanded |
| `disabled` | `boolean` | `false` | Whether the node is disabled |
| `selected` | `boolean` | `false` | Whether the node is selected |

## Examples

### Basic Tree

```jsx
<Tree nodes={fileStructure} />
```

### Tree with Custom Icons

```jsx
const nodesWithIcons = [
  {
    id: 'folder',
    label: 'Folder',
    icon: <FolderIcon />,
    children: [
      {
        id: 'file',
        label: 'File',
        icon: <FileIcon />,
      },
    ],
  },
];

<Tree nodes={nodesWithIcons} />
```

### Tree with Multiple Selection

```jsx
<Tree 
  nodes={fileStructure} 
  multiSelect
  onNodeSelect={(node, path) => {
    console.log('Selected node:', node);
  }}
/>
```

### Tree without Connecting Lines

```jsx
<Tree 
  nodes={fileStructure} 
  showLines={false}
/>
```

### Tree without Animation

```jsx
<Tree 
  nodes={fileStructure} 
  animate={false}
/>
```

### Tree with Custom Node Renderer

```jsx
const customNodeRenderer = (node, isExpanded, isSelected) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center',
    backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
    padding: '4px 8px',
    borderRadius: '4px',
  }}>
    {node.icon && <span style={{ marginRight: '8px' }}>{node.icon}</span>}
    <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{node.label}</span>
    {node.data?.badge && (
      <span style={{ 
        marginLeft: '8px', 
        fontSize: '12px', 
        padding: '2px 6px', 
        backgroundColor: '#e6f7ff', 
        borderRadius: '10px',
      }}>
        {node.data.badge}
      </span>
    )}
  </div>
);

<Tree 
  nodes={fileStructure} 
  nodeRenderer={customNodeRenderer}
/>
```

### Tree with Custom Indentation

```jsx
<Tree 
  nodes={fileStructure} 
  indentationWidth={40}
/>
```

### Tree with Disabled Nodes

```jsx
const nodesWithDisabled = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      {
        id: 'file1',
        label: 'File 1',
      },
      {
        id: 'file2',
        label: 'File 2',
        disabled: true,
      },
    ],
  },
];

<Tree nodes={nodesWithDisabled} />
```

### Tree with Default Expanded Nodes

```jsx
const nodesWithDefaultExpanded = [
  {
    id: 'folder',
    label: 'Folder',
    defaultExpanded: true,
    children: [
      {
        id: 'file',
        label: 'File',
      },
    ],
  },
];

<Tree nodes={nodesWithDefaultExpanded} />
```

### Tree with Default Selected Nodes

```jsx
const nodesWithDefaultSelected = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      {
        id: 'file',
        label: 'File',
        selected: true,
      },
    ],
  },
];

<Tree nodes={nodesWithDefaultSelected} />
```

## Accessibility

- The Tree component uses appropriate ARIA attributes for better screen reader support.
- The tree container has `role="tree"` and each node has `role="treeitem"`.
- Expanded nodes have `aria-expanded="true"`.
- Selected nodes have `aria-selected="true"`.
- Disabled nodes have `aria-disabled="true"`.
- Toggle buttons have appropriate `aria-label` attributes.
- Keyboard navigation is supported for accessibility.

## Design Considerations

- For large trees, consider lazy loading child nodes to improve performance.
- Use clear and concise labels for nodes.
- Use icons to enhance visual understanding of node types.
- Consider the depth of your tree structure - deeply nested trees can be difficult to navigate.
- Use the `nodeRenderer` prop for complex node content.

## Best Practices

- Keep node labels short and descriptive.
- Use consistent icons throughout the tree.
- Provide meaningful feedback when nodes are selected.
- Consider using drag-and-drop for rearranging nodes in editable trees.
- For large datasets, implement virtualization to improve performance.
