import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tree, TreeNode } from './Tree';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme';

// Mock theme provider for styled components
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      {ui}
    </ThemeProvider>
  );
};

// Sample data for testing
const sampleNodes: TreeNode[] = [
  {
    id: 'root',
    label: 'Root Node',
    children: [
      {
        id: 'child1',
        label: 'Child 1',
        children: [
          {
            id: 'grandchild1',
            label: 'Grandchild 1',
          },
          {
            id: 'grandchild2',
            label: 'Grandchild 2',
          },
        ],
      },
      {
        id: 'child2',
        label: 'Child 2',
      },
    ],
  },
  {
    id: 'root2',
    label: 'Root Node 2',
    disabled: true,
  },
];

describe('Tree Component', () => {
  it('renders tree with correct number of root nodes', () => {
    renderWithTheme(<Tree nodes={sampleNodes} />);
    
    // Only root nodes should be visible initially
    const rootNodes = screen.getAllByRole('treeitem', { expanded: false });
    expect(rootNodes).toHaveLength(2);
  });

  it('expands node when toggle icon is clicked', () => {
    renderWithTheme(<Tree nodes={sampleNodes} />);
    
    // Find the toggle button for the first root node
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // After expanding, the first child should be visible
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('collapses expanded node when toggle icon is clicked again', () => {
    renderWithTheme(<Tree nodes={sampleNodes} />);
    
    // First expand the node
    const expandButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(expandButton);
    
    // Then collapse it
    const collapseButton = screen.getByRole('button', { name: 'Collapse' });
    fireEvent.click(collapseButton);
    
    // Child nodes should not be in the document
    const childNodes = screen.queryByText('Child 1');
    expect(childNodes).not.toBeVisible();
  });

  it('selects node when clicked', () => {
    renderWithTheme(<Tree nodes={sampleNodes} />);
    
    // Click on the first root node
    const rootNode = screen.getByText('Root Node');
    fireEvent.click(rootNode);
    
    // The node should be selected
    expect(rootNode.closest('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('does not allow selection of disabled nodes', () => {
    renderWithTheme(<Tree nodes={sampleNodes} />);
    
    // Click on the disabled node
    const disabledNode = screen.getByText('Root Node 2');
    fireEvent.click(disabledNode);
    
    // The node should not be selected
    expect(disabledNode.closest('[aria-selected="true"]')).not.toBeInTheDocument();
  });

  it('allows multiple selection when multiSelect is true', () => {
    renderWithTheme(<Tree nodes={sampleNodes} multiSelect />);
    
    // Click on the first root node
    const rootNode1 = screen.getByText('Root Node');
    fireEvent.click(rootNode1);
    
    // Expand the first node to see its children
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // Click on the first child node
    const childNode = screen.getByText('Child 1');
    fireEvent.click(childNode);
    
    // Both nodes should be selected
    expect(rootNode1.closest('[aria-selected="true"]')).toBeInTheDocument();
    expect(childNode.closest('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('calls onNodeSelect when a node is selected', () => {
    const handleNodeSelect = jest.fn();
    renderWithTheme(<Tree nodes={sampleNodes} onNodeSelect={handleNodeSelect} />);
    
    // Click on the first root node
    const rootNode = screen.getByText('Root Node');
    fireEvent.click(rootNode);
    
    // onNodeSelect should be called with the node and path
    expect(handleNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'root' }),
      ['root']
    );
  });

  it('calls onNodeToggle when a node is expanded', () => {
    const handleNodeToggle = jest.fn();
    renderWithTheme(<Tree nodes={sampleNodes} onNodeToggle={handleNodeToggle} />);
    
    // Find the toggle button for the first root node
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // onNodeToggle should be called with the node, expanded state, and path
    expect(handleNodeToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'root' }),
      true,
      ['root']
    );
  });

  it('renders nodes with defaultExpanded set to true as expanded', () => {
    const nodesWithDefaultExpanded = [
      {
        id: 'root',
        label: 'Root Node',
        defaultExpanded: true,
        children: [
          {
            id: 'child1',
            label: 'Child 1',
          },
        ],
      },
    ];
    
    renderWithTheme(<Tree nodes={nodesWithDefaultExpanded} />);
    
    // The child node should be visible because the parent is expanded by default
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('renders nodes with selected set to true as selected', () => {
    const nodesWithSelected = [
      {
        id: 'root',
        label: 'Root Node',
        selected: true,
        children: [
          {
            id: 'child1',
            label: 'Child 1',
          },
        ],
      },
    ];
    
    renderWithTheme(<Tree nodes={nodesWithSelected} />);
    
    // The root node should be selected
    const rootNode = screen.getByText('Root Node');
    expect(rootNode.closest('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('renders tree without lines when showLines is false', () => {
    const { container } = renderWithTheme(<Tree nodes={sampleNodes} showLines={false} />);
    
    // Check that the TreeList doesn't have the showLines style
    const treeList = container.querySelector('ul');
    expect(treeList).not.toHaveStyle('&::before { content: ""; }');
  });

  it('renders tree with custom node renderer when provided', () => {
    const customRenderer = (node: TreeNode) => (
      <div data-testid="custom-node">{node.label}</div>
    );
    
    renderWithTheme(<Tree nodes={sampleNodes} nodeRenderer={customRenderer} />);
    
    // Custom rendered nodes should be in the document
    const customNodes = screen.getAllByTestId('custom-node');
    expect(customNodes).toHaveLength(2);
  });

  it('renders tree with indentation when indented is true', () => {
    renderWithTheme(<Tree nodes={sampleNodes} indented />);
    
    // Expand the first node to see its children
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // Child nodes should have indentation
    const childNode = screen.getByText('Child 1').closest('[role="treeitem"]');
    expect(childNode).toHaveStyle('padding-left: 28px');
  });

  it('renders tree without indentation when indented is false', () => {
    renderWithTheme(<Tree nodes={sampleNodes} indented={false} />);
    
    // Expand the first node to see its children
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // Child nodes should not have indentation
    const childNode = screen.getByText('Child 1').closest('[role="treeitem"]');
    expect(childNode).not.toHaveStyle('padding-left: 28px');
  });

  it('renders tree with custom indentation width when provided', () => {
    const customWidth = 40;
    renderWithTheme(<Tree nodes={sampleNodes} indented indentationWidth={customWidth} />);
    
    // Expand the first node to see its children
    const toggleButton = screen.getAllByRole('button', { name: 'Expand' })[0];
    fireEvent.click(toggleButton);
    
    // Child nodes should have custom indentation width
    const childNode = screen.getByText('Child 1').closest('[role="treeitem"]');
    expect(childNode).toHaveStyle(`padding-left: ${customWidth + 8}px`);
  });
});
