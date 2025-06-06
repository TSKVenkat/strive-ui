import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface TreeNode {
  /** Unique identifier for the node */
  id: string | number;
  /** Label to display for the node */
  label: React.ReactNode;
  /** Icon to display before the label */
  icon?: React.ReactNode;
  /** Additional data to store with the node */
  data?: any;
  /** Child nodes */
  children?: TreeNode[];
  /** Whether the node is initially expanded */
  defaultExpanded?: boolean;
  /** Whether the node is disabled */
  disabled?: boolean;
  /** Whether the node is selected */
  selected?: boolean;
}

export interface TreeProps {
  /** Array of tree nodes */
  nodes: TreeNode[];
  /** Function called when a node is selected */
  onNodeSelect?: (node: TreeNode, path: (string | number)[]) => void;
  /** Function called when a node is expanded or collapsed */
  onNodeToggle?: (node: TreeNode, expanded: boolean, path: (string | number)[]) => void;
  /** Whether to show lines connecting nodes */
  showLines?: boolean;
  /** Whether to animate expanding and collapsing */
  animate?: boolean;
  /** Whether to allow multiple selections */
  multiSelect?: boolean;
  /** Custom icon for collapsed state */
  collapsedIcon?: React.ReactNode;
  /** Custom icon for expanded state */
  expandedIcon?: React.ReactNode;
  /** Whether to show icons for nodes */
  showIcons?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
  /** Custom renderer for node content */
  nodeRenderer?: (node: TreeNode, isExpanded: boolean, isSelected: boolean) => React.ReactNode;
  /** Whether to indent nodes */
  indented?: boolean;
  /** Indentation width in pixels */
  indentationWidth?: number;
}

const Container = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const TreeList = styled.ul<{ showLines?: boolean }>`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;
  
  ${({ showLines }) => showLines && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 9px;
      width: 1px;
      background-color: ${({ theme }) => theme.colors.neutral[300]};
    }
  `}
`;

const TreeItem = styled.li`
  position: relative;
  
  &:last-child {
    > ul::before {
      height: 20px;
    }
  }
`;

const TreeItemContent = styled.div<{
  disabled?: boolean;
  selected?: boolean;
  indented?: boolean;
  indentationWidth?: number;
  level: number;
}>`
  display: flex;
  align-items: center;
  padding: 8px;
  padding-left: ${({ indented, indentationWidth, level }) => 
    indented ? `${(level * (indentationWidth || 20)) + 8}px` : '8px'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary[100] : 'transparent'};
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ selected, theme, disabled }) => 
      disabled ? 'transparent' : selected ? theme.colors.primary[200] : theme.colors.neutral[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const ToggleIcon = styled.div<{ showLines?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border-radius: 2px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
  
  ${({ showLines }) => showLines && `
    position: relative;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  `}
`;

const NodeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const NodeLabel = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChildrenContainer = styled(motion.div)`
  overflow: hidden;
`;

// Default toggle icons
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="currentColor" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" fill="currentColor" />
  </svg>
);

// Helper function to check if a node has children
const hasChildren = (node: TreeNode): boolean => {
  return Boolean(node.children && node.children.length > 0);
};

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  path: (string | number)[];
  showLines?: boolean;
  animate?: boolean;
  multiSelect?: boolean;
  collapsedIcon?: React.ReactNode;
  expandedIcon?: React.ReactNode;
  showIcons?: boolean;
  indented?: boolean;
  indentationWidth?: number;
  nodeRenderer?: (node: TreeNode, isExpanded: boolean, isSelected: boolean) => React.ReactNode;
  onNodeSelect?: (node: TreeNode, path: (string | number)[]) => void;
  onNodeToggle?: (node: TreeNode, expanded: boolean, path: (string | number)[]) => void;
  selectedNodes: Set<string | number>;
  setSelectedNodes: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  expandedNodes: Set<string | number>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string | number>>>;
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  level,
  path,
  showLines,
  animate,
  multiSelect,
  collapsedIcon,
  expandedIcon,
  showIcons,
  indented,
  indentationWidth,
  nodeRenderer,
  onNodeSelect,
  onNodeToggle,
  selectedNodes,
  setSelectedNodes,
  expandedNodes,
  setExpandedNodes,
}) => {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodes.has(node.id);
  const hasChildNodes = hasChildren(node);
  
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newExpanded = !isExpanded;
    
    if (newExpanded) {
      setExpandedNodes(prev => new Set([...Array.from(prev), node.id]));
    } else {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        next.delete(node.id);
        return next;
      });
    }
    
    if (onNodeToggle) {
      onNodeToggle(node, newExpanded, path);
    }
  }, [isExpanded, node, onNodeToggle, path, setExpandedNodes]);
  
  const handleSelect = useCallback(() => {
    if (node.disabled) return;
    
    if (multiSelect) {
      setSelectedNodes(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    } else {
      setSelectedNodes(new Set([node.id]));
    }
    
    if (onNodeSelect) {
      onNodeSelect(node, path);
    }
  }, [node, onNodeSelect, path, setSelectedNodes, multiSelect]);
  
  return (
    <TreeItem>
      <TreeItemContent 
        onClick={handleSelect}
        disabled={node.disabled}
        selected={isSelected}
        indented={indented}
        indentationWidth={indentationWidth}
        level={level}
        tabIndex={node.disabled ? -1 : 0}
        role="treeitem"
        aria-expanded={hasChildNodes ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
      >
        {hasChildNodes && (
          <ToggleIcon 
            onClick={handleToggle} 
            showLines={showLines}
            role="button"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            tabIndex={-1}
          >
            {isExpanded 
              ? (expandedIcon || <ChevronDown />) 
              : (collapsedIcon || <ChevronRight />)
            }
          </ToggleIcon>
        )}
        
        {!hasChildNodes && showLines && <ToggleIcon showLines={showLines} />}
        
        {showIcons && node.icon && (
          <NodeIcon>{node.icon}</NodeIcon>
        )}
        
        {nodeRenderer ? (
          nodeRenderer(node, isExpanded, isSelected)
        ) : (
          <NodeLabel>{node.label}</NodeLabel>
        )}
      </TreeItemContent>
      
      {hasChildNodes && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <ChildrenContainer
              initial={animate ? { height: 0, opacity: 0 } : undefined}
              animate={animate ? { height: 'auto', opacity: 1 } : undefined}
              exit={animate ? { height: 0, opacity: 0 } : undefined}
              transition={{ duration: 0.2 }}
            >
              <TreeList showLines={showLines} role="group">
                {node.children!.map((childNode, index) => (
                  <TreeNodeComponent
                    key={childNode.id}
                    node={childNode}
                    level={level + 1}
                    path={[...path, childNode.id]}
                    showLines={showLines}
                    animate={animate}
                    multiSelect={multiSelect}
                    collapsedIcon={collapsedIcon}
                    expandedIcon={expandedIcon}
                    showIcons={showIcons}
                    indented={indented}
                    indentationWidth={indentationWidth}
                    nodeRenderer={nodeRenderer}
                    onNodeSelect={onNodeSelect}
                    onNodeToggle={onNodeToggle}
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    expandedNodes={expandedNodes}
                    setExpandedNodes={setExpandedNodes}
                  />
                ))}
              </TreeList>
            </ChildrenContainer>
          )}
        </AnimatePresence>
      )}
    </TreeItem>
  );
};

export const Tree: React.FC<TreeProps> = ({
  nodes,
  onNodeSelect,
  onNodeToggle,
  showLines = true,
  animate = true,
  multiSelect = false,
  collapsedIcon,
  expandedIcon,
  showIcons = true,
  className,
  style,
  nodeRenderer,
  indented = true,
  indentationWidth = 20,
}) => {
  // Track expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(() => {
    const expanded = new Set<string | number>();
    
    // Initialize with nodes that have defaultExpanded set to true
    const initializeExpanded = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.defaultExpanded) {
          expanded.add(node.id);
        }
        if (node.children) {
          initializeExpanded(node.children);
        }
      });
    };
    
    initializeExpanded(nodes);
    return expanded;
  });
  
  // Track selected nodes
  const [selectedNodes, setSelectedNodes] = useState<Set<string | number>>(() => {
    const selected = new Set<string | number>();
    
    // Initialize with nodes that have selected set to true
    const initializeSelected = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.selected) {
          selected.add(node.id);
        }
        if (node.children) {
          initializeSelected(node.children);
        }
      });
    };
    
    initializeSelected(nodes);
    return selected;
  });
  
  return (
    <Container className={className} style={style} role="tree">
      <TreeList showLines={showLines}>
        {nodes.map((node, index) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            path={[node.id]}
            showLines={showLines}
            animate={animate}
            multiSelect={multiSelect}
            collapsedIcon={collapsedIcon}
            expandedIcon={expandedIcon}
            showIcons={showIcons}
            indented={indented}
            indentationWidth={indentationWidth}
            nodeRenderer={nodeRenderer}
            onNodeSelect={onNodeSelect}
            onNodeToggle={onNodeToggle}
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
            expandedNodes={expandedNodes}
            setExpandedNodes={setExpandedNodes}
          />
        ))}
      </TreeList>
    </Container>
  );
};

Tree.displayName = 'Tree';
