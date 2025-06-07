# TreeNavigationHeadless

A headless implementation of a tree navigation component that provides hierarchical navigation with expandable/collapsible nodes. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Keyboard navigation**: Full keyboard support for navigation and selection
- **Multi-select**: Optional support for selecting multiple nodes
- **Controlled & uncontrolled modes**: Flexible state management
- **Auto-expand parent**: Automatically expand parent nodes when a child is selected
- **Collapse siblings**: Option to collapse sibling nodes when expanding a node

## Basic Usage

```jsx
import { TreeNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const StyledTree = styled(TreeNavigation)`
  font-family: sans-serif;
  width: 300px;
`;

const TreeItem = styled(TreeNavigation.Item)`
  padding: 4px 0;
  cursor: pointer;
  
  &[aria-selected="true"] {
    background-color: #e6f7ff;
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
`;

const Toggle = styled(TreeNavigation.Toggle)`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
  
  &:before {
    content: '▶';
    font-size: 10px;
    transition: transform 0.2s;
  }
  
  &[aria-label="Collapse"]:before {
    transform: rotate(90deg);
  }
`;

const Icon = styled(TreeNavigation.Icon)`
  margin-right: 8px;
`;

const Label = styled(TreeNavigation.Label)`
  flex: 1;
`;

const Content = styled(TreeNavigation.Content)`
  padding-left: 24px;
`;

function MyTreeNavigation() {
  const treeData = [
    {
      id: 'node-1',
      label: 'Documents',
      icon: '📁',
      children: [
        {
          id: 'node-1-1',
          label: 'Work',
          icon: '📁',
          children: [
            { id: 'node-1-1-1', label: 'Project A', icon: '📄' },
            { id: 'node-1-1-2', label: 'Project B', icon: '📄' },
          ],
        },
        {
          id: 'node-1-2',
          label: 'Personal',
          icon: '📁',
          children: [
            { id: 'node-1-2-1', label: 'Resume', icon: '📄' },
            { id: 'node-1-2-2', label: 'Photos', icon: '🖼️' },
          ],
        },
      ],
    },
    {
      id: 'node-2',
      label: 'Downloads',
      icon: '📁',
      children: [
        { id: 'node-2-1', label: 'Movies', icon: '🎬' },
        { id: 'node-2-2', label: 'Music', icon: '🎵' },
      ],
    },
    {
      id: 'node-3',
      label: 'Trash',
      icon: '🗑️',
      disabled: true,
    },
  ];

  const renderTreeNodes = (nodes, level = 0) => {
    return nodes.map(node => (
      <TreeItem key={node.id} node={node} level={level}>
        <ItemRow>
          <Toggle node={node} />
          <Icon node={node} />
          <Label node={node} />
        </ItemRow>
        
        {node.children && node.children.length > 0 && (
          <Content node={node} level={level + 1}>
            {renderTreeNodes(node.children, level + 1)}
          </Content>
        )}
      </TreeItem>
    ));
  };

  return (
    <StyledTree
      nodes={treeData}
      defaultExpandedIds={['node-1']}
      defaultSelectedId="node-1-1"
      autoExpandParent
    >
      {renderTreeNodes(treeData)}
    </StyledTree>
  );
}
```

## Multi-Select Example

```jsx
import { TreeNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const StyledTree = styled(TreeNavigation)`
  font-family: sans-serif;
  width: 300px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px;
`;

const TreeItem = styled(TreeNavigation.Item)`
  margin: 2px 0;
  border-radius: 4px;
  
  &[aria-selected="true"] {
    background-color: #e6f7ff;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
`;

const Toggle = styled(TreeNavigation.Toggle)`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  
  &:before {
    content: '+';
    font-size: 14px;
  }
  
  &[aria-label="Collapse"]:before {
    content: '-';
  }
`;

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${TreeItem}[aria-selected="true"] & {
    background-color: #1890ff;
    border-color: #1890ff;
    
    &:after {
      content: '✓';
      color: white;
      font-size: 12px;
    }
  }
`;

const Content = styled(TreeNavigation.Content)`
  padding-left: 24px;
`;

function MultiSelectTreeNavigation() {
  const [selectedIds, setSelectedIds] = useState(['file-2']);
  
  const treeData = [
    {
      id: 'folder-1',
      label: 'Photos',
      children: [
        { id: 'file-1', label: 'Vacation.jpg' },
        { id: 'file-2', label: 'Family.jpg' },
        { id: 'file-3', label: 'Friends.jpg' },
      ],
    },
    {
      id: 'folder-2',
      label: 'Documents',
      children: [
        { id: 'file-4', label: 'Resume.pdf' },
        { id: 'file-5', label: 'Contract.docx' },
      ],
    },
  ];

  const handleSelectedChange = (ids) => {
    setSelectedIds(ids);
    console.log('Selected IDs:', ids);
  };

  const renderTreeNodes = (nodes) => {
    return nodes.map(node => (
      <TreeItem key={node.id} node={node}>
        <ItemRow>
          <Toggle node={node} />
          <Checkbox />
          <TreeNavigation.Label node={node} />
        </ItemRow>
        
        {node.children && node.children.length > 0 && (
          <Content node={node}>
            {renderTreeNodes(node.children)}
          </Content>
        )}
      </TreeItem>
    ));
  };

  return (
    <StyledTree
      nodes={treeData}
      multiSelect
      selectedIds={selectedIds}
      onSelectedChange={handleSelectedChange}
      defaultExpandedIds={['folder-1']}
    >
      {renderTreeNodes(treeData)}
    </StyledTree>
  );
}
```

## Custom Icons and Styling

```jsx
import { TreeNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const StyledTree = styled(TreeNavigation)`
  font-family: sans-serif;
  width: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
`;

const TreeItem = styled(TreeNavigation.Item)`
  margin: 2px 0;
  transition: all 0.2s;
  
  &[aria-selected="true"] {
    background-color: #4a90e2;
    color: white;
    border-radius: 4px;
  }
  
  &:hover:not([aria-selected="true"]) {
    background-color: #e0e0e0;
    border-radius: 4px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const Toggle = styled(TreeNavigation.Toggle)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 50%;
  background-color: ${props => props['aria-label'] === 'Collapse' ? '#4a90e2' : 'transparent'};
  color: ${props => props['aria-label'] === 'Collapse' ? 'white' : 'inherit'};
  
  &:before {
    content: '▸';
    font-size: 12px;
    transition: transform 0.2s;
  }
  
  &[aria-label="Collapse"]:before {
    transform: rotate(90deg);
  }
`;

const Icon = styled(TreeNavigation.Icon)`
  margin-right: 8px;
  font-size: 18px;
`;

const Label = styled(TreeNavigation.Label)`
  flex: 1;
  font-weight: ${props => props.isFolder ? 'bold' : 'normal'};
`;

const Content = styled(TreeNavigation.Content)`
  padding-left: 32px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
`;

// Custom icons for different file types
const getFileIcon = (node) => {
  if (node.children) return '📁';
  
  const label = node.label.toLowerCase();
  if (label.endsWith('.pdf')) return '📕';
  if (label.endsWith('.doc') || label.endsWith('.docx')) return '📘';
  if (label.endsWith('.xls') || label.endsWith('.xlsx')) return '📗';
  if (label.endsWith('.ppt') || label.endsWith('.pptx')) return '📙';
  if (label.endsWith('.jpg') || label.endsWith('.png') || label.endsWith('.gif')) return '🖼️';
  if (label.endsWith('.mp3') || label.endsWith('.wav')) return '🎵';
  if (label.endsWith('.mp4') || label.endsWith('.mov')) return '🎬';
  
  return '📄';
};

function CustomIconsTreeNavigation() {
  const treeData = [
    {
      id: 'folder-1',
      label: 'Project Files',
      children: [
        {
          id: 'folder-1-1',
          label: 'Documents',
          children: [
            { id: 'file-1', label: 'Report.pdf' },
            { id: 'file-2', label: 'Presentation.pptx' },
            { id: 'file-3', label: 'Budget.xlsx' },
          ],
        },
        {
          id: 'folder-1-2',
          label: 'Images',
          children: [
            { id: 'file-4', label: 'Logo.png' },
            { id: 'file-5', label: 'Banner.jpg' },
          ],
        },
        { id: 'file-6', label: 'Notes.docx' },
      ],
    },
    {
      id: 'folder-2',
      label: 'Media',
      children: [
        { id: 'file-7', label: 'Intro.mp4' },
        { id: 'file-8', label: 'Theme.mp3' },
      ],
    },
  ];

  const renderTreeNodes = (nodes) => {
    return nodes.map(node => {
      const isFolder = node.children && node.children.length > 0;
      
      return (
        <TreeItem key={node.id} node={node}>
          <ItemRow>
            <Toggle node={node} />
            <Icon node={node}>{getFileIcon(node)}</Icon>
            <Label node={node} isFolder={isFolder} />
          </ItemRow>
          
          {isFolder && (
            <Content node={node}>
              {renderTreeNodes(node.children)}
            </Content>
          )}
        </TreeItem>
      );
    });
  };

  return (
    <StyledTree
      nodes={treeData}
      defaultExpandedIds={['folder-1']}
      autoExpandParent
    >
      {renderTreeNodes(treeData)}
    </StyledTree>
  );
}
```

## Drag and Drop Example

```jsx
import { TreeNavigation } from 'pulseui';
import { useState, useRef } from 'react';
import styled from 'styled-components';

const StyledTree = styled(TreeNavigation)`
  font-family: sans-serif;
  width: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px;
`;

const TreeItem = styled(TreeNavigation.Item)`
  margin: 2px 0;
  
  &[aria-selected="true"] {
    background-color: #e6f7ff;
  }
  
  &.dragging {
    opacity: 0.5;
  }
  
  &.drop-target {
    border: 2px dashed #1890ff;
    background-color: #e6f7ff;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
`;

const Toggle = styled(TreeNavigation.Toggle)`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  
  &:before {
    content: '▶';
    font-size: 10px;
    transition: transform 0.2s;
  }
  
  &[aria-label="Collapse"]:before {
    transform: rotate(90deg);
  }
`;

const Icon = styled(TreeNavigation.Icon)`
  margin-right: 8px;
`;

const Content = styled(TreeNavigation.Content)`
  padding-left: 24px;
`;

function DragDropTreeNavigation() {
  const [treeData, setTreeData] = useState([
    {
      id: 'folder-1',
      label: 'Folder 1',
      icon: '📁',
      children: [
        { id: 'item-1', label: 'Item 1', icon: '📄' },
        { id: 'item-2', label: 'Item 2', icon: '📄' },
      ],
    },
    {
      id: 'folder-2',
      label: 'Folder 2',
      icon: '📁',
      children: [
        { id: 'item-3', label: 'Item 3', icon: '📄' },
      ],
    },
  ]);
  
  const dragNode = useRef(null);
  const dragNodeId = useRef(null);
  
  const handleDragStart = (e, nodeId) => {
    dragNodeId.current = nodeId;
    e.dataTransfer.setData('text/plain', nodeId);
    
    // Add dragging class after a short delay to allow the ghost image to be created
    setTimeout(() => {
      const element = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (element) {
        element.classList.add('dragging');
      }
    }, 0);
  };
  
  const handleDragOver = (e, nodeId) => {
    e.preventDefault();
    
    if (dragNodeId.current === nodeId) return;
    
    const element = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (element) {
      element.classList.add('drop-target');
    }
  };
  
  const handleDragLeave = (e, nodeId) => {
    const element = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (element) {
      element.classList.remove('drop-target');
    }
  };
  
  const handleDrop = (e, targetNodeId) => {
    e.preventDefault();
    
    const sourceNodeId = dragNodeId.current;
    if (sourceNodeId === targetNodeId) return;
    
    // Remove all drop-target classes
    document.querySelectorAll('.drop-target').forEach(el => {
      el.classList.remove('drop-target');
    });
    
    // Find the source and target nodes
    let sourceNode = null;
    let sourceParentNode = null;
    let targetNode = null;
    
    const findNodes = (nodes, parentNode = null) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === sourceNodeId) {
          sourceNode = nodes[i];
          sourceParentNode = parentNode;
        }
        
        if (nodes[i].id === targetNodeId) {
          targetNode = nodes[i];
        }
        
        if (nodes[i].children) {
          findNodes(nodes[i].children, nodes[i]);
        }
      }
    };
    
    findNodes(treeData);
    
    if (!sourceNode || !targetNode) return;
    
    // Create a new tree data structure with the source node moved
    const moveNode = (nodes) => {
      return nodes.map(node => {
        // Skip the source node in its original position
        if (node.id === sourceNodeId && sourceParentNode === null) {
          return null;
        }
        
        // Add the source node to the target node's children
        if (node.id === targetNodeId) {
          return {
            ...node,
            children: [
              ...(node.children || []),
              sourceNode,
            ],
          };
        }
        
        // Process children recursively
        if (node.children) {
          const newChildren = node.children
            .filter(child => child.id !== sourceNodeId)
            .map(child => {
              if (child.id === targetNodeId) {
                return {
                  ...child,
                  children: [
                    ...(child.children || []),
                    sourceNode,
                  ],
                };
              }
              return child;
            });
          
          return {
            ...node,
            children: newChildren,
          };
        }
        
        return node;
      }).filter(Boolean);
    };
    
    setTreeData(moveNode(treeData));
    dragNodeId.current = null;
  };
  
  const handleDragEnd = () => {
    // Remove all dragging classes
    document.querySelectorAll('.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
    
    // Remove all drop-target classes
    document.querySelectorAll('.drop-target').forEach(el => {
      el.classList.remove('drop-target');
    });
    
    dragNodeId.current = null;
  };

  const renderTreeNodes = (nodes) => {
    return nodes.map(node => (
      <TreeItem 
        key={node.id} 
        node={node}
        data-node-id={node.id}
        draggable
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={(e) => handleDragLeave(e, node.id)}
        onDrop={(e) => handleDrop(e, node.id)}
        onDragEnd={handleDragEnd}
      >
        <ItemRow>
          <Toggle node={node} />
          <Icon node={node} />
          <TreeNavigation.Label node={node} />
        </ItemRow>
        
        {node.children && node.children.length > 0 && (
          <Content node={node}>
            {renderTreeNodes(node.children)}
          </Content>
        )}
      </TreeItem>
    ));
  };

  return (
    <StyledTree
      nodes={treeData}
      defaultExpandedIds={['folder-1', 'folder-2']}
    >
      {renderTreeNodes(treeData)}
    </StyledTree>
  );
}
```

## Props

### TreeNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| nodes | TreeNode[] | - | Array of tree nodes to render |
| defaultExpandedIds | string[] | [] | Default expanded node IDs (uncontrolled) |
| defaultSelectedId | string | - | Default selected node ID (uncontrolled) |
| multiSelect | boolean | false | Whether to allow multiple selection |
| expandedIds | string[] | - | Controlled expanded node IDs |
| selectedIds | string[] | - | Controlled selected node IDs |
| onExpandedChange | (expandedIds: string[]) => void | - | Callback when expanded nodes change |
| onSelectedChange | (selectedIds: string[]) => void | - | Callback when selected nodes change |
| autoExpandParent | boolean | true | Whether to automatically expand parent nodes when a child is selected |
| collapseSiblings | boolean | false | Whether to collapse other branches when expanding a node |
| ariaLabel | string | 'Tree navigation' | Aria label for the tree |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| node | TreeNode | - | The tree node data |
| level | number | 0 | Level of nesting (used for indentation) |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| node | TreeNode | - | The tree node data |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNavigation.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| node | TreeNode | - | The tree node data |
| level | number | 0 | Level of nesting (used for indentation) |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNavigation.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| node | TreeNode | - | The tree node data |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| node | TreeNode | - | The tree node data |
| as | React.ElementType | 'div' | The element type to render as |

### TreeNode Interface

```typescript
interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
  data?: any;
}
```

## Accessibility

The TreeNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="tree"` for the container
- `role="treeitem"` for each item
- `role="group"` for item content
- `aria-expanded` to indicate expanded state
- `aria-selected` to indicate selected state
- `aria-disabled` to indicate disabled state
- Full keyboard navigation:
  - Arrow keys for navigation
  - Enter/Space to select
  - Right arrow to expand
  - Left arrow to collapse
  - Home/End to jump to first/last item
