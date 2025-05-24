import { useState, useRef, useCallback, useEffect } from 'react';

export interface MindMapNode {
  /**
   * Unique ID of the node
   */
  id: string;
  /**
   * Text content of the node
   */
  text: string;
  /**
   * Parent node ID (null for root node)
   */
  parentId: string | null;
  /**
   * Position of the node
   */
  position: {
    x: number;
    y: number;
  };
  /**
   * Width of the node
   */
  width?: number;
  /**
   * Height of the node
   */
  height?: number;
  /**
   * Background color of the node
   */
  backgroundColor?: string;
  /**
   * Text color of the node
   */
  textColor?: string;
  /**
   * Border color of the node
   */
  borderColor?: string;
  /**
   * Border width of the node
   */
  borderWidth?: number;
  /**
   * Border radius of the node
   */
  borderRadius?: number;
  /**
   * Font size of the node text
   */
  fontSize?: number;
  /**
   * Font weight of the node text
   */
  fontWeight?: string | number;
  /**
   * Custom data for the node
   */
  data?: Record<string, any>;
  /**
   * Whether the node is expanded
   */
  expanded?: boolean;
  /**
   * Whether the node is selected
   */
  selected?: boolean;
  /**
   * Whether the node is being edited
   */
  editing?: boolean;
}

export interface MindMapConnection {
  /**
   * Unique ID of the connection
   */
  id: string;
  /**
   * Source node ID
   */
  sourceId: string;
  /**
   * Target node ID
   */
  targetId: string;
  /**
   * Label for the connection
   */
  label?: string;
  /**
   * Color of the connection
   */
  color?: string;
  /**
   * Width of the connection
   */
  width?: number;
  /**
   * Style of the connection (solid, dashed, dotted)
   */
  style?: 'solid' | 'dashed' | 'dotted';
  /**
   * Custom data for the connection
   */
  data?: Record<string, any>;
}

export interface MindMapOptions {
  /**
   * Initial nodes
   */
  initialNodes?: MindMapNode[];
  /**
   * Initial connections
   */
  initialConnections?: MindMapConnection[];
  /**
   * Default node width
   */
  defaultNodeWidth?: number;
  /**
   * Default node height
   */
  defaultNodeHeight?: number;
  /**
   * Default node background color
   */
  defaultNodeBackgroundColor?: string;
  /**
   * Default node text color
   */
  defaultNodeTextColor?: string;
  /**
   * Default node border color
   */
  defaultNodeBorderColor?: string;
  /**
   * Default node border width
   */
  defaultNodeBorderWidth?: number;
  /**
   * Default node border radius
   */
  defaultNodeBorderRadius?: number;
  /**
   * Default node font size
   */
  defaultNodeFontSize?: number;
  /**
   * Default node font weight
   */
  defaultNodeFontWeight?: string | number;
  /**
   * Default connection color
   */
  defaultConnectionColor?: string;
  /**
   * Default connection width
   */
  defaultConnectionWidth?: number;
  /**
   * Default connection style
   */
  defaultConnectionStyle?: 'solid' | 'dashed' | 'dotted';
  /**
   * Whether to auto-layout the mind map
   */
  autoLayout?: boolean;
  /**
   * Layout direction
   */
  layoutDirection?: 'horizontal' | 'vertical' | 'radial';
  /**
   * Node spacing in the layout
   */
  nodeSpacing?: number;
  /**
   * Level spacing in the layout
   */
  levelSpacing?: number;
  /**
   * Callback when nodes change
   */
  onNodesChange?: (nodes: MindMapNode[]) => void;
  /**
   * Callback when connections change
   */
  onConnectionsChange?: (connections: MindMapConnection[]) => void;
  /**
   * Callback when a node is added
   */
  onNodeAdd?: (node: MindMapNode) => void;
  /**
   * Callback when a node is updated
   */
  onNodeUpdate?: (node: MindMapNode) => void;
  /**
   * Callback when a node is deleted
   */
  onNodeDelete?: (nodeId: string) => void;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (node: MindMapNode | null) => void;
  /**
   * Callback when a connection is added
   */
  onConnectionAdd?: (connection: MindMapConnection) => void;
  /**
   * Callback when a connection is updated
   */
  onConnectionUpdate?: (connection: MindMapConnection) => void;
  /**
   * Callback when a connection is deleted
   */
  onConnectionDelete?: (connectionId: string) => void;
}

export interface UseMindMapReturn {
  /**
   * All nodes in the mind map
   */
  nodes: MindMapNode[];
  /**
   * All connections in the mind map
   */
  connections: MindMapConnection[];
  /**
   * Currently selected node
   */
  selectedNode: MindMapNode | null;
  /**
   * Add a node
   */
  addNode: (node: Partial<MindMapNode> & { parentId: string | null }) => MindMapNode;
  /**
   * Update a node
   */
  updateNode: (nodeId: string, updates: Partial<MindMapNode>) => void;
  /**
   * Delete a node
   */
  deleteNode: (nodeId: string) => void;
  /**
   * Select a node
   */
  selectNode: (nodeId: string | null) => void;
  /**
   * Add a connection
   */
  addConnection: (connection: Partial<MindMapConnection> & { sourceId: string; targetId: string }) => MindMapConnection;
  /**
   * Update a connection
   */
  updateConnection: (connectionId: string, updates: Partial<MindMapConnection>) => void;
  /**
   * Delete a connection
   */
  deleteConnection: (connectionId: string) => void;
  /**
   * Get children of a node
   */
  getNodeChildren: (nodeId: string) => MindMapNode[];
  /**
   * Get parent of a node
   */
  getNodeParent: (nodeId: string) => MindMapNode | null;
  /**
   * Get connections for a node
   */
  getNodeConnections: (nodeId: string) => MindMapConnection[];
  /**
   * Move a node
   */
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;
  /**
   * Toggle node expansion
   */
  toggleNodeExpansion: (nodeId: string) => void;
  /**
   * Start editing a node
   */
  startNodeEdit: (nodeId: string) => void;
  /**
   * Stop editing a node
   */
  stopNodeEdit: (nodeId: string, text?: string) => void;
  /**
   * Export mind map as JSON
   */
  exportToJSON: () => string;
  /**
   * Import mind map from JSON
   */
  importFromJSON: (json: string) => void;
  /**
   * Auto-layout the mind map
   */
  autoLayout: () => void;
  /**
   * Get props for the mind map container
   */
  getContainerProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
  };
}

/**
 * Hook for creating a mind map
 */
export function useMindMap(options: MindMapOptions = {}): UseMindMapReturn {
  const {
    initialNodes = [],
    initialConnections = [],
    defaultNodeWidth = 150,
    defaultNodeHeight = 50,
    defaultNodeBackgroundColor = '#ffffff',
    defaultNodeTextColor = '#000000',
    defaultNodeBorderColor = '#cccccc',
    defaultNodeBorderWidth = 1,
    defaultNodeBorderRadius = 5,
    defaultNodeFontSize = 14,
    defaultNodeFontWeight = 'normal',
    defaultConnectionColor = '#666666',
    defaultConnectionWidth = 2,
    defaultConnectionStyle = 'solid',
    autoLayout: autoLayoutEnabled = true,
    layoutDirection = 'horizontal',
    nodeSpacing = 50,
    levelSpacing = 150,
    onNodesChange,
    onConnectionsChange,
    onNodeAdd,
    onNodeUpdate,
    onNodeDelete,
    onNodeSelect,
    onConnectionAdd,
    onConnectionUpdate,
    onConnectionDelete,
  } = options;

  const [nodes, setNodes] = useState<MindMapNode[]>(initialNodes);
  const [connections, setConnections] = useState<MindMapConnection[]>(initialConnections);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify when nodes change
  useEffect(() => {
    onNodesChange?.(nodes);
  }, [nodes, onNodesChange]);

  // Notify when connections change
  useEffect(() => {
    onConnectionsChange?.(connections);
  }, [connections, onConnectionsChange]);

  // Auto-layout on initial render if enabled
  useEffect(() => {
    if (autoLayoutEnabled && nodes.length > 0) {
      autoLayout();
    }
  }, []);

  // Add a node
  const addNode = useCallback((nodeData: Partial<MindMapNode> & { parentId: string | null }): MindMapNode => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate position based on parent if available
    let position = { x: 0, y: 0 };
    if (nodeData.parentId) {
      const parentNode = nodes.find(n => n.id === nodeData.parentId);
      if (parentNode) {
        position = {
          x: parentNode.position.x + (layoutDirection === 'vertical' ? 0 : levelSpacing),
          y: parentNode.position.y + (layoutDirection === 'vertical' ? levelSpacing : 0),
        };
      }
    }
    
    const newNode: MindMapNode = {
      id,
      text: nodeData.text || 'New Node',
      parentId: nodeData.parentId,
      position: nodeData.position || position,
      width: nodeData.width || defaultNodeWidth,
      height: nodeData.height || defaultNodeHeight,
      backgroundColor: nodeData.backgroundColor || defaultNodeBackgroundColor,
      textColor: nodeData.textColor || defaultNodeTextColor,
      borderColor: nodeData.borderColor || defaultNodeBorderColor,
      borderWidth: nodeData.borderWidth || defaultNodeBorderWidth,
      borderRadius: nodeData.borderRadius || defaultNodeBorderRadius,
      fontSize: nodeData.fontSize || defaultNodeFontSize,
      fontWeight: nodeData.fontWeight || defaultNodeFontWeight,
      data: nodeData.data || {},
      expanded: nodeData.expanded !== undefined ? nodeData.expanded : true,
      selected: false,
      editing: false,
    };
    
    setNodes(prev => [...prev, newNode]);
    onNodeAdd?.(newNode);
    
    // Create connection to parent if available
    if (nodeData.parentId) {
      addConnection({
        sourceId: nodeData.parentId,
        targetId: id,
        color: defaultConnectionColor,
        width: defaultConnectionWidth,
        style: defaultConnectionStyle,
      });
    }
    
    // Auto-layout if enabled
    if (autoLayoutEnabled) {
      setTimeout(() => autoLayout(), 0);
    }
    
    return newNode;
  }, [
    nodes, 
    defaultNodeWidth, 
    defaultNodeHeight, 
    defaultNodeBackgroundColor, 
    defaultNodeTextColor, 
    defaultNodeBorderColor, 
    defaultNodeBorderWidth, 
    defaultNodeBorderRadius, 
    defaultNodeFontSize, 
    defaultNodeFontWeight,
    defaultConnectionColor,
    defaultConnectionWidth,
    defaultConnectionStyle,
    layoutDirection,
    levelSpacing,
    autoLayoutEnabled,
    onNodeAdd
  ]);

  // Update a node
  const updateNode = useCallback((nodeId: string, updates: Partial<MindMapNode>) => {
    setNodes(prev => {
      const index = prev.findIndex(n => n.id === nodeId);
      if (index === -1) return prev;
      
      const updatedNode = { ...prev[index], ...updates };
      const newNodes = [...prev];
      newNodes[index] = updatedNode;
      
      onNodeUpdate?.(updatedNode);
      return newNodes;
    });
  }, [onNodeUpdate]);

  // Delete a node
  const deleteNode = useCallback((nodeId: string) => {
    // Get all descendant nodes to delete
    const getDescendantIds = (id: string): string[] => {
      const children = nodes.filter(n => n.parentId === id);
      return [
        id,
        ...children.flatMap(child => getDescendantIds(child.id)),
      ];
    };
    
    const nodeIdsToDelete = getDescendantIds(nodeId);
    
    // Delete nodes
    setNodes(prev => {
      const newNodes = prev.filter(n => !nodeIdsToDelete.includes(n.id));
      return newNodes;
    });
    
    // Delete connections
    setConnections(prev => {
      const newConnections = prev.filter(
        c => !nodeIdsToDelete.includes(c.sourceId) && !nodeIdsToDelete.includes(c.targetId)
      );
      return newConnections;
    });
    
    // Clear selection if deleted
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      onNodeSelect?.(null);
    }
    
    onNodeDelete?.(nodeId);
    
    // Auto-layout if enabled
    if (autoLayoutEnabled) {
      setTimeout(() => autoLayout(), 0);
    }
  }, [nodes, connections, selectedNode, autoLayoutEnabled, onNodeDelete, onNodeSelect]);

  // Select a node
  const selectNode = useCallback((nodeId: string | null) => {
    // Clear previous selection
    setNodes(prev => 
      prev.map(node => 
        node.selected ? { ...node, selected: false } : node
      )
    );
    
    if (!nodeId) {
      setSelectedNode(null);
      onNodeSelect?.(null);
      return;
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      updateNode(nodeId, { selected: true });
      setSelectedNode(node);
      onNodeSelect?.(node);
    }
  }, [nodes, updateNode, onNodeSelect]);

  // Add a connection
  const addConnection = useCallback((connectionData: Partial<MindMapConnection> & { sourceId: string; targetId: string }): MindMapConnection => {
    const id = `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newConnection: MindMapConnection = {
      id,
      sourceId: connectionData.sourceId,
      targetId: connectionData.targetId,
      label: connectionData.label || '',
      color: connectionData.color || defaultConnectionColor,
      width: connectionData.width || defaultConnectionWidth,
      style: connectionData.style || defaultConnectionStyle,
      data: connectionData.data || {},
    };
    
    setConnections(prev => [...prev, newConnection]);
    onConnectionAdd?.(newConnection);
    
    return newConnection;
  }, [defaultConnectionColor, defaultConnectionWidth, defaultConnectionStyle, onConnectionAdd]);

  // Update a connection
  const updateConnection = useCallback((connectionId: string, updates: Partial<MindMapConnection>) => {
    setConnections(prev => {
      const index = prev.findIndex(c => c.id === connectionId);
      if (index === -1) return prev;
      
      const updatedConnection = { ...prev[index], ...updates };
      const newConnections = [...prev];
      newConnections[index] = updatedConnection;
      
      onConnectionUpdate?.(updatedConnection);
      return newConnections;
    });
  }, [onConnectionUpdate]);

  // Delete a connection
  const deleteConnection = useCallback((connectionId: string) => {
    setConnections(prev => {
      const newConnections = prev.filter(c => c.id !== connectionId);
      onConnectionDelete?.(connectionId);
      return newConnections;
    });
  }, [onConnectionDelete]);

  // Get children of a node
  const getNodeChildren = useCallback((nodeId: string) => {
    return nodes.filter(node => node.parentId === nodeId);
  }, [nodes]);

  // Get parent of a node
  const getNodeParent = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.parentId) return null;
    
    return nodes.find(n => n.id === node.parentId) || null;
  }, [nodes]);

  // Get connections for a node
  const getNodeConnections = useCallback((nodeId: string) => {
    return connections.filter(conn => conn.sourceId === nodeId || conn.targetId === nodeId);
  }, [connections]);

  // Move a node
  const moveNode = useCallback((nodeId: string, position: { x: number; y: number }) => {
    updateNode(nodeId, { position });
  }, [updateNode]);

  // Toggle node expansion
  const toggleNodeExpansion = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      updateNode(nodeId, { expanded: !node.expanded });
      
      // Auto-layout if enabled
      if (autoLayoutEnabled) {
        setTimeout(() => autoLayout(), 0);
      }
    }
  }, [nodes, updateNode, autoLayoutEnabled]);

  // Start editing a node
  const startNodeEdit = useCallback((nodeId: string) => {
    updateNode(nodeId, { editing: true });
  }, [updateNode]);

  // Stop editing a node
  const stopNodeEdit = useCallback((nodeId: string, text?: string) => {
    const updates: Partial<MindMapNode> = { editing: false };
    if (text !== undefined) {
      updates.text = text;
    }
    updateNode(nodeId, updates);
  }, [updateNode]);

  // Export mind map as JSON
  const exportToJSON = useCallback(() => {
    return JSON.stringify({ nodes, connections });
  }, [nodes, connections]);

  // Import mind map from JSON
  const importFromJSON = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && Array.isArray(data.nodes)) {
        setNodes(data.nodes);
      }
      if (data.connections && Array.isArray(data.connections)) {
        setConnections(data.connections);
      }
      
      // Auto-layout if enabled
      if (autoLayoutEnabled) {
        setTimeout(() => autoLayout(), 0);
      }
    } catch (err) {
      console.error('Failed to import mind map from JSON:', err);
    }
  }, [autoLayoutEnabled]);

  // Auto-layout the mind map
  const autoLayout = useCallback(() => {
    // Find root nodes (nodes without parents or with non-existent parents)
    const rootNodes = nodes.filter(node => 
      !node.parentId || !nodes.some(n => n.id === node.parentId)
    );
    
    if (rootNodes.length === 0) return;
    
    // Helper function to layout a subtree
    const layoutSubtree = (
      nodeId: string, 
      x: number, 
      y: number, 
      level: number, 
      index: number, 
      siblingCount: number
    ) => {
      // Update node position
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const nodeWidth = node.width || defaultNodeWidth;
      const nodeHeight = node.height || defaultNodeHeight;
      
      let newX = x;
      let newY = y;
      
      // Adjust position based on layout direction
      if (layoutDirection === 'horizontal') {
        newX = x + level * levelSpacing;
        newY = y + (index - (siblingCount - 1) / 2) * nodeSpacing;
      } else if (layoutDirection === 'vertical') {
        newX = x + (index - (siblingCount - 1) / 2) * nodeSpacing;
        newY = y + level * levelSpacing;
      } else if (layoutDirection === 'radial') {
        const angle = (index / siblingCount) * 2 * Math.PI;
        const radius = level * levelSpacing;
        newX = x + radius * Math.cos(angle);
        newY = y + radius * Math.sin(angle);
      }
      
      // Update node position
      updateNode(nodeId, { position: { x: newX, y: newY } });
      
      // Skip children if node is collapsed
      if (node.expanded === false) return;
      
      // Layout children
      const children = getNodeChildren(nodeId);
      children.forEach((child, childIndex) => {
        layoutSubtree(
          child.id, 
          newX, 
          newY, 
          level + 1, 
          childIndex, 
          children.length
        );
      });
    };
    
    // Layout each root node and its subtree
    rootNodes.forEach((rootNode, index) => {
      const startX = 100;
      const startY = 100 + index * (defaultNodeHeight + nodeSpacing);
      layoutSubtree(rootNode.id, startX, startY, 0, index, rootNodes.length);
    });
  }, [
    nodes, 
    defaultNodeWidth, 
    defaultNodeHeight, 
    layoutDirection, 
    levelSpacing, 
    nodeSpacing, 
    updateNode, 
    getNodeChildren
  ]);

  // Get props for the mind map container
  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      style: {
        position: 'relative' as const,
        width: '100%',
        height: '100%',
        overflow: 'auto' as const,
      },
    };
  }, []);

  return {
    nodes,
    connections,
    selectedNode,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addConnection,
    updateConnection,
    deleteConnection,
    getNodeChildren,
    getNodeParent,
    getNodeConnections,
    moveNode,
    toggleNodeExpansion,
    startNodeEdit,
    stopNodeEdit,
    exportToJSON,
    importFromJSON,
    autoLayout,
    getContainerProps,
  };
}

export default useMindMap;
