import { useState, useCallback, useRef, useEffect } from 'react';

export interface TreeNode {
  /**
   * Unique identifier for the node
   */
  id: string;
  /**
   * Display label for the node
   */
  label: string;
  /**
   * Optional icon for the node
   */
  icon?: React.ReactNode;
  /**
   * Whether the node is disabled
   */
  disabled?: boolean;
  /**
   * Child nodes
   */
  children?: TreeNode[];
  /**
   * Any additional data to associate with the node
   */
  data?: any;
}

export interface UseTreeNavigationProps {
  /**
   * Array of tree nodes
   */
  nodes: TreeNode[];
  /**
   * Default expanded node IDs
   */
  defaultExpandedIds?: string[];
  /**
   * Default selected node ID
   */
  defaultSelectedId?: string;
  /**
   * Whether to allow multiple selection
   */
  multiSelect?: boolean;
  /**
   * Controlled expanded node IDs
   */
  expandedIds?: string[];
  /**
   * Controlled selected node IDs
   */
  selectedIds?: string[];
  /**
   * Callback when expanded nodes change
   */
  onExpandedChange?: (expandedIds: string[]) => void;
  /**
   * Callback when selected nodes change
   */
  onSelectedChange?: (selectedIds: string[]) => void;
  /**
   * Whether to automatically expand parent nodes when a child is selected
   */
  autoExpandParent?: boolean;
  /**
   * Whether to collapse other branches when expanding a node
   */
  collapseSiblings?: boolean;
}

export interface UseTreeNavigationReturn {
  /**
   * Currently expanded node IDs
   */
  expandedIds: string[];
  /**
   * Currently selected node IDs
   */
  selectedIds: string[];
  /**
   * Toggle the expanded state of a node
   */
  toggleExpanded: (nodeId: string) => void;
  /**
   * Toggle the selected state of a node
   */
  toggleSelected: (nodeId: string) => void;
  /**
   * Expand a node
   */
  expandNode: (nodeId: string) => void;
  /**
   * Collapse a node
   */
  collapseNode: (nodeId: string) => void;
  /**
   * Select a node
   */
  selectNode: (nodeId: string) => void;
  /**
   * Deselect a node
   */
  deselectNode: (nodeId: string) => void;
  /**
   * Expand all nodes
   */
  expandAll: () => void;
  /**
   * Collapse all nodes
   */
  collapseAll: () => void;
  /**
   * Check if a node is expanded
   */
  isExpanded: (nodeId: string) => boolean;
  /**
   * Check if a node is selected
   */
  isSelected: (nodeId: string) => boolean;
  /**
   * Get all parent node IDs for a node
   */
  getParentIds: (nodeId: string) => string[];
  /**
   * Find a node by ID
   */
  findNodeById: (nodeId: string) => TreeNode | null;
  /**
   * Handle keyboard navigation
   */
  handleKeyDown: (event: React.KeyboardEvent, nodeId: string) => void;
  /**
   * Get props for a tree node
   */
  getNodeProps: (node: TreeNode) => {
    role: string;
    'aria-expanded'?: boolean;
    'aria-selected': boolean;
    'aria-disabled'?: boolean;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * Hook for creating tree navigation functionality.
 * 
 * @example
 * ```jsx
 * const MyTreeNavigation = ({ nodes }) => {
 *   const { 
 *     expandedIds,
 *     selectedIds,
 *     toggleExpanded,
 *     toggleSelected,
 *     getNodeProps
 *   } = useTreeNavigation({
 *     nodes,
 *     defaultExpandedIds: ['node-1'],
 *     defaultSelectedId: 'node-1-1',
 *   });
 *   
 *   return (
 *     <div role="tree">
 *       {renderNodes(nodes)}
 *     </div>
 *   );
 *   
 *   function renderNodes(nodes) {
 *     return nodes.map(node => (
 *       <div key={node.id} {...getNodeProps(node)}>
 *         <div onClick={() => toggleExpanded(node.id)}>
 *           {isExpanded(node.id) ? '▼' : '►'} {node.label}
 *         </div>
 *         {isExpanded(node.id) && node.children && (
 *           <div style={{ marginLeft: 20 }}>
 *             {renderNodes(node.children)}
 *           </div>
 *         )}
 *       </div>
 *     ));
 *   }
 * };
 * ```
 */
export function useTreeNavigation({
  nodes,
  defaultExpandedIds = [],
  defaultSelectedId,
  multiSelect = false,
  expandedIds: controlledExpandedIds,
  selectedIds: controlledSelectedIds,
  onExpandedChange,
  onSelectedChange,
  autoExpandParent = true,
  collapseSiblings = false,
}: UseTreeNavigationProps): UseTreeNavigationReturn {
  // State for expanded and selected nodes
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(defaultExpandedIds);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    defaultSelectedId ? [defaultSelectedId] : []
  );

  // Use controlled or uncontrolled state
  const expandedIds = controlledExpandedIds !== undefined ? controlledExpandedIds : internalExpandedIds;
  const selectedIds = controlledSelectedIds !== undefined ? controlledSelectedIds : internalSelectedIds;

  // Flat map of all nodes for easy lookup
  const nodeMap = useRef<Map<string, { node: TreeNode; parentId?: string }>>(new Map());
  
  // Build node map and parent map
  useEffect(() => {
    const map = new Map<string, { node: TreeNode; parentId?: string }>();
    
    function traverseNodes(nodeList: TreeNode[], parentId?: string) {
      nodeList.forEach(node => {
        map.set(node.id, { node, parentId });
        if (node.children && node.children.length > 0) {
          traverseNodes(node.children, node.id);
        }
      });
    }
    
    traverseNodes(nodes);
    nodeMap.current = map;
  }, [nodes]);

  // Get all parent IDs for a node
  const getParentIds = useCallback((nodeId: string): string[] => {
    const parents: string[] = [];
    let currentNodeData = nodeMap.current.get(nodeId);
    
    while (currentNodeData && currentNodeData.parentId) {
      parents.push(currentNodeData.parentId);
      currentNodeData = nodeMap.current.get(currentNodeData.parentId);
    }
    
    return parents;
  }, []);

  // Find a node by ID
  const findNodeById = useCallback((nodeId: string): TreeNode | null => {
    const nodeData = nodeMap.current.get(nodeId);
    return nodeData ? nodeData.node : null;
  }, []);

  // Get all sibling IDs for a node
  const getSiblingIds = useCallback((nodeId: string): string[] => {
    const nodeData = nodeMap.current.get(nodeId);
    if (!nodeData || !nodeData.parentId) return [];
    
    const parentNodeData = nodeMap.current.get(nodeData.parentId);
    if (!parentNodeData || !parentNodeData.node.children) return [];
    
    return parentNodeData.node.children
      .filter(child => child.id !== nodeId)
      .map(child => child.id);
  }, []);

  // Expand a node
  const expandNode = useCallback((nodeId: string) => {
    if (!expandedIds.includes(nodeId)) {
      const newExpandedIds = [...expandedIds, nodeId];
      
      if (collapseSiblings) {
        // Collapse siblings
        const siblingIds = getSiblingIds(nodeId);
        const filteredIds = newExpandedIds.filter(id => !siblingIds.includes(id));
        
        if (onExpandedChange) {
          onExpandedChange(filteredIds);
        } else {
          setInternalExpandedIds(filteredIds);
        }
      } else {
        if (onExpandedChange) {
          onExpandedChange(newExpandedIds);
        } else {
          setInternalExpandedIds(newExpandedIds);
        }
      }
    }
  }, [expandedIds, collapseSiblings, getSiblingIds, onExpandedChange]);

  // Collapse a node
  const collapseNode = useCallback((nodeId: string) => {
    if (expandedIds.includes(nodeId)) {
      const newExpandedIds = expandedIds.filter(id => id !== nodeId);
      
      if (onExpandedChange) {
        onExpandedChange(newExpandedIds);
      } else {
        setInternalExpandedIds(newExpandedIds);
      }
    }
  }, [expandedIds, onExpandedChange]);

  // Toggle expanded state
  const toggleExpanded = useCallback((nodeId: string) => {
    if (expandedIds.includes(nodeId)) {
      collapseNode(nodeId);
    } else {
      expandNode(nodeId);
    }
  }, [expandedIds, expandNode, collapseNode]);

  // Select a node
  const selectNode = useCallback((nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node || node.disabled) return;
    
    let newSelectedIds: string[];
    
    if (multiSelect) {
      newSelectedIds = [...selectedIds, nodeId];
    } else {
      newSelectedIds = [nodeId];
    }
    
    if (onSelectedChange) {
      onSelectedChange(newSelectedIds);
    } else {
      setInternalSelectedIds(newSelectedIds);
    }
    
    // Auto expand parents
    if (autoExpandParent) {
      const parentIds = getParentIds(nodeId);
      const newExpandedIds = [...new Set([...expandedIds, ...parentIds])];
      
      if (onExpandedChange) {
        onExpandedChange(newExpandedIds);
      } else {
        setInternalExpandedIds(newExpandedIds);
      }
    }
  }, [
    findNodeById, 
    multiSelect, 
    selectedIds, 
    onSelectedChange, 
    autoExpandParent, 
    getParentIds, 
    expandedIds, 
    onExpandedChange
  ]);

  // Deselect a node
  const deselectNode = useCallback((nodeId: string) => {
    if (selectedIds.includes(nodeId)) {
      const newSelectedIds = selectedIds.filter(id => id !== nodeId);
      
      if (onSelectedChange) {
        onSelectedChange(newSelectedIds);
      } else {
        setInternalSelectedIds(newSelectedIds);
      }
    }
  }, [selectedIds, onSelectedChange]);

  // Toggle selected state
  const toggleSelected = useCallback((nodeId: string) => {
    if (selectedIds.includes(nodeId)) {
      deselectNode(nodeId);
    } else {
      selectNode(nodeId);
    }
  }, [selectedIds, deselectNode, selectNode]);

  // Expand all nodes
  const expandAll = useCallback(() => {
    const allNodeIds = Array.from(nodeMap.current.keys());
    
    if (onExpandedChange) {
      onExpandedChange(allNodeIds);
    } else {
      setInternalExpandedIds(allNodeIds);
    }
  }, [onExpandedChange]);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    if (onExpandedChange) {
      onExpandedChange([]);
    } else {
      setInternalExpandedIds([]);
    }
  }, [onExpandedChange]);

  // Check if a node is expanded
  const isExpanded = useCallback((nodeId: string): boolean => {
    return expandedIds.includes(nodeId);
  }, [expandedIds]);

  // Check if a node is selected
  const isSelected = useCallback((nodeId: string): boolean => {
    return selectedIds.includes(nodeId);
  }, [selectedIds]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node) return;
    
    switch (event.key) {
      case 'ArrowRight':
        if (node.children && node.children.length > 0) {
          if (!isExpanded(nodeId)) {
            expandNode(nodeId);
          } else if (node.children[0]) {
            selectNode(node.children[0].id);
          }
        }
        event.preventDefault();
        break;
        
      case 'ArrowLeft':
        if (isExpanded(nodeId)) {
          collapseNode(nodeId);
        } else {
          const parentIds = getParentIds(nodeId);
          if (parentIds.length > 0) {
            selectNode(parentIds[0]);
          }
        }
        event.preventDefault();
        break;
        
      case 'ArrowDown':
        {
          // Find the next visible node
          let found = false;
          let nextNodeId: string | null = null;
          
          function findNextNode(nodes: TreeNode[], afterId: string): string | null {
            for (let i = 0; i < nodes.length; i++) {
              if (found) {
                return nodes[i].id;
              }
              
              if (nodes[i].id === afterId) {
                found = true;
                
                // If this node is expanded and has children, return the first child
                if (isExpanded(nodes[i].id) && nodes[i].children && nodes[i].children.length > 0) {
                  return nodes[i].children[0].id;
                }
                
                // Otherwise, continue to the next sibling
                continue;
              }
              
              // Recursively search in children if expanded
              if (isExpanded(nodes[i].id) && nodes[i].children && nodes[i].children.length > 0) {
                const result = findNextNode(nodes[i].children, afterId);
                if (result) return result;
              }
            }
            
            return null;
          }
          
          nextNodeId = findNextNode(nodes, nodeId);
          
          if (nextNodeId) {
            selectNode(nextNodeId);
          }
        }
        event.preventDefault();
        break;
        
      case 'ArrowUp':
        {
          // Find the previous visible node
          let previousNodeId: string | null = null;
          let previousNodes: string[] = [];
          
          function collectVisibleNodes(nodes: TreeNode[]): void {
            for (let i = 0; i < nodes.length; i++) {
              previousNodes.push(nodes[i].id);
              
              if (isExpanded(nodes[i].id) && nodes[i].children && nodes[i].children.length > 0) {
                collectVisibleNodes(nodes[i].children);
              }
            }
          }
          
          collectVisibleNodes(nodes);
          const currentIndex = previousNodes.indexOf(nodeId);
          
          if (currentIndex > 0) {
            previousNodeId = previousNodes[currentIndex - 1];
            selectNode(previousNodeId);
          }
        }
        event.preventDefault();
        break;
        
      case 'Enter':
      case ' ':
        toggleSelected(nodeId);
        event.preventDefault();
        break;
        
      case 'Home':
        if (nodes.length > 0) {
          selectNode(nodes[0].id);
        }
        event.preventDefault();
        break;
        
      case 'End':
        {
          // Find the last visible node
          let lastNodeId: string | null = null;
          
          function findLastVisibleNode(nodes: TreeNode[]): string {
            const lastNode = nodes[nodes.length - 1];
            
            if (isExpanded(lastNode.id) && lastNode.children && lastNode.children.length > 0) {
              return findLastVisibleNode(lastNode.children);
            }
            
            return lastNode.id;
          }
          
          if (nodes.length > 0) {
            lastNodeId = findLastVisibleNode(nodes);
            selectNode(lastNodeId);
          }
        }
        event.preventDefault();
        break;
    }
  }, [
    findNodeById, 
    isExpanded, 
    expandNode, 
    collapseNode, 
    getParentIds, 
    selectNode, 
    toggleSelected, 
    nodes
  ]);

  // Get props for a tree node
  const getNodeProps = useCallback((node: TreeNode) => {
    return {
      role: 'treeitem',
      'aria-expanded': node.children && node.children.length > 0 ? isExpanded(node.id) : undefined,
      'aria-selected': isSelected(node.id),
      'aria-disabled': node.disabled,
      tabIndex: isSelected(node.id) ? 0 : -1,
      onClick: (event: React.MouseEvent) => {
        if (node.disabled) return;
        event.stopPropagation();
        toggleSelected(node.id);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        handleKeyDown(event, node.id);
      },
    };
  }, [isExpanded, isSelected, toggleSelected, handleKeyDown]);

  return {
    expandedIds,
    selectedIds,
    toggleExpanded,
    toggleSelected,
    expandNode,
    collapseNode,
    selectNode,
    deselectNode,
    expandAll,
    collapseAll,
    isExpanded,
    isSelected,
    getParentIds,
    findNodeById,
    handleKeyDown,
    getNodeProps,
  };
}
