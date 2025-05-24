import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  icon?: string;
  notes?: string;
  collapsed?: boolean;
}

export interface MindMapProps {
  /**
   * Root node of the mind map
   */
  rootNode: MindMapNode;
  /**
   * Width of the mind map container
   */
  width?: number | string;
  /**
   * Height of the mind map container
   */
  height?: number | string;
  /**
   * Horizontal spacing between nodes
   */
  horizontalSpacing?: number;
  /**
   * Vertical spacing between nodes
   */
  verticalSpacing?: number;
  /**
   * Whether to show node notes on hover
   */
  showNotes?: boolean;
  /**
   * Whether to enable node selection
   */
  selectable?: boolean;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string) => void;
  /**
   * Whether to enable node collapsing
   */
  collapsible?: boolean;
  /**
   * Callback when a node is collapsed or expanded
   */
  onNodeToggle?: (nodeId: string, collapsed: boolean) => void;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
  /**
   * Custom node renderer
   */
  renderNode?: (node: MindMapNode, isSelected: boolean, toggleCollapse: () => void) => React.ReactNode;
}

const MindMapContainer = styled.div<{ $width: number | string; $height: number | string }>`
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  overflow: auto;
  position: relative;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const NodeContainer = styled(motion.g)<{ $interactive: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
`;

const NodeRect = styled(motion.rect)<{ $selected: boolean; $color: string }>`
  fill: ${({ $color }) => $color};
  stroke: ${({ theme, $selected }) => $selected ? theme.colors.primary.main : theme.colors.neutral[300]};
  stroke-width: ${({ $selected }) => $selected ? 2 : 1};
  rx: 8;
  ry: 8;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
`;

const NodeLabel = styled.text`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const NodeIcon = styled.image`
  pointer-events: none;
`;

const Connection = styled(motion.path)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[400]};
  stroke-width: 1.5;
`;

const CollapseButton = styled.circle`
  fill: ${({ theme }) => theme.colors.common.white};
  stroke: ${({ theme }) => theme.colors.neutral[400]};
  stroke-width: 1;
  cursor: pointer;
  
  &:hover {
    fill: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const CollapseIcon = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const TooltipContainer = styled(motion.div)`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  pointer-events: none;
  z-index: 10;
  max-width: 250px;
`;

const TooltipHeader = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 4px;
`;

const TooltipContent = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

/**
 * MindMap component for visualizing hierarchical relationships in a mind map format.
 */
export const MindMap: React.FC<MindMapProps> = ({
  rootNode,
  width = '100%',
  height = 500,
  horizontalSpacing = 100,
  verticalSpacing = 60,
  showNotes = true,
  selectable = true,
  onNodeSelect,
  collapsible = true,
  onNodeToggle,
  animateOnDataChange = true,
  renderNode
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    node: MindMapNode;
  } | null>(null);
  const [nodeStates, setNodeStates] = useState<Map<string, { collapsed: boolean }>>(new Map());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Initialize node states from props
  useEffect(() => {
    const initNodeStates = (node: MindMapNode) => {
      setNodeStates(prev => {
        const newStates = new Map(prev);
        newStates.set(node.id, { collapsed: !!node.collapsed });
        
        if (node.children) {
          node.children.forEach(child => initNodeStates(child));
        }
        
        return newStates;
      });
    };
    
    initNodeStates(rootNode);
  }, [rootNode]);
  
  // Calculate node positions
  const calculateNodePositions = () => {
    const positions = new Map<string, { x: number; y: number; width: number; height: number }>();
    const nodeWidth = 150;
    const nodeHeight = 40;
    
    const calculateSubtreeSize = (node: MindMapNode, level: number): { width: number; height: number } => {
      if (!node) return { width: 0, height: 0 };
      
      const isCollapsed = nodeStates.get(node.id)?.collapsed || false;
      
      // Store position for this node
      positions.set(node.id, {
        x: 0, // Will be adjusted later
        y: 0, // Will be adjusted later
        width: nodeWidth,
        height: nodeHeight
      });
      
      // If node is collapsed or has no children, return its own size
      if (isCollapsed || !node.children || node.children.length === 0) {
        return { width: nodeWidth, height: nodeHeight };
      }
      
      // Calculate sizes of children
      let totalChildHeight = 0;
      let maxChildWidth = 0;
      
      node.children.forEach(child => {
        const childSize = calculateSubtreeSize(child, level + 1);
        totalChildHeight += childSize.height;
        maxChildWidth = Math.max(maxChildWidth, childSize.width);
      });
      
      // Add spacing between children
      if (node.children.length > 1) {
        totalChildHeight += verticalSpacing * (node.children.length - 1);
      }
      
      return {
        width: nodeWidth + horizontalSpacing + maxChildWidth,
        height: Math.max(nodeHeight, totalChildHeight)
      };
    };
    
    const positionNodes = (node: MindMapNode, x: number, y: number, level: number) => {
      if (!node) return;
      
      const isCollapsed = nodeStates.get(node.id)?.collapsed || false;
      
      // Position this node
      positions.set(node.id, {
        x,
        y,
        width: nodeWidth,
        height: nodeHeight
      });
      
      // If node is collapsed or has no children, we're done
      if (isCollapsed || !node.children || node.children.length === 0) {
        return;
      }
      
      // Calculate total height of children
      let totalChildHeight = 0;
      node.children.forEach(child => {
        const childPos = positions.get(child.id);
        if (childPos) {
          totalChildHeight += childPos.height;
        }
      });
      
      // Add spacing between children
      if (node.children.length > 1) {
        totalChildHeight += verticalSpacing * (node.children.length - 1);
      }
      
      // Position children
      let currentY = y - totalChildHeight / 2;
      
      node.children.forEach(child => {
        const childPos = positions.get(child.id);
        if (childPos) {
          positionNodes(
            child,
            x + nodeWidth + horizontalSpacing,
            currentY + childPos.height / 2,
            level + 1
          );
          currentY += childPos.height + verticalSpacing;
        }
      });
    };
    
    // Calculate sizes first
    calculateSubtreeSize(rootNode, 0);
    
    // Then position nodes
    const rootSize = positions.get(rootNode.id);
    if (rootSize) {
      positionNodes(rootNode, 50, rootSize.height / 2 + 50, 0);
    }
    
    return positions;
  };
  
  // Generate connections between nodes
  const generateConnections = (positions: Map<string, { x: number; y: number; width: number; height: number }>) => {
    const connections: { id: string; path: string }[] = [];
    
    const addConnections = (node: MindMapNode) => {
      if (!node) return;
      
      const isCollapsed = nodeStates.get(node.id)?.collapsed || false;
      
      // If node is collapsed or has no children, we're done
      if (isCollapsed || !node.children || node.children.length === 0) {
        return;
      }
      
      const parentPos = positions.get(node.id);
      if (!parentPos) return;
      
      // Add connections to each child
      node.children.forEach(child => {
        const childPos = positions.get(child.id);
        if (childPos) {
          // Calculate connection points
          const startX = parentPos.x + parentPos.width;
          const startY = parentPos.y;
          const endX = childPos.x;
          const endY = childPos.y;
          
          // Generate curved path
          const path = `
            M ${startX} ${startY}
            C ${startX + horizontalSpacing / 2} ${startY},
              ${endX - horizontalSpacing / 2} ${endY},
              ${endX} ${endY}
          `;
          
          connections.push({
            id: `${node.id}-${child.id}`,
            path
          });
          
          // Recursively add connections for this child
          addConnections(child);
        }
      });
    };
    
    addConnections(rootNode);
    
    return connections;
  };
  
  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!selectable) return;
    
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
    
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };
  
  // Handle collapse/expand button click
  const handleCollapseClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    if (!collapsible) return;
    
    setNodeStates(prev => {
      const newStates = new Map(prev);
      const currentState = newStates.get(nodeId);
      const newCollapsed = !(currentState?.collapsed || false);
      
      newStates.set(nodeId, { collapsed: newCollapsed });
      
      if (onNodeToggle) {
        onNodeToggle(nodeId, newCollapsed);
      }
      
      return newStates;
    });
  };
  
  // Handle node hover
  const handleNodeHover = (event: React.MouseEvent, node: MindMapNode) => {
    if (!showNotes || !node.notes) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      node
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Get color for a node
  const getNodeColor = (node: MindMapNode) => {
    if (node.color) return node.color;
    
    // Default colors based on level
    const colors = [
      '#3f51b5', // Root
      '#4caf50', // Level 1
      '#ff9800', // Level 2
      '#9c27b0', // Level 3
      '#00bcd4', // Level 4
      '#f44336', // Level 5
    ];
    
    // Calculate node level
    const getNodeLevel = (currentNode: MindMapNode, targetId: string, level = 0): number => {
      if (currentNode.id === targetId) return level;
      
      if (currentNode.children) {
        for (const child of currentNode.children) {
          const foundLevel = getNodeLevel(child, targetId, level + 1);
          if (foundLevel >= 0) return foundLevel;
        }
      }
      
      return -1;
    };
    
    const level = getNodeLevel(rootNode, node.id);
    return colors[level % colors.length];
  };
  
  // Render mind map
  const renderMindMap = () => {
    const positions = calculateNodePositions();
    const connections = generateConnections(positions);
    
    // Calculate SVG dimensions
    const maxX = Math.max(...Array.from(positions.values()).map(pos => pos.x + pos.width));
    const maxY = Math.max(...Array.from(positions.values()).map(pos => pos.y + pos.height));
    
    const svgWidth = maxX + 50;
    const svgHeight = maxY + 50;
    
    // Render nodes recursively
    const renderNodes = (node: MindMapNode) => {
      const position = positions.get(node.id);
      if (!position) return null;
      
      const isSelected = node.id === selectedNode;
      const isCollapsed = nodeStates.get(node.id)?.collapsed || false;
      const hasChildren = node.children && node.children.length > 0;
      const color = getNodeColor(node);
      
      // Use custom node renderer if provided
      if (renderNode) {
        return (
          <NodeContainer
            key={node.id}
            $interactive={selectable}
            onClick={() => handleNodeClick(node.id)}
            onMouseEnter={(e) => handleNodeHover(e, node)}
            onMouseLeave={handleMouseLeave}
            transform={`translate(${position.x}, ${position.y - position.height / 2})`}
          >
            {renderNode(node, isSelected, () => handleCollapseClick({ stopPropagation: () => {} } as React.MouseEvent, node.id))}
          </NodeContainer>
        );
      }
      
      return (
        <NodeContainer
          key={node.id}
          $interactive={selectable}
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={(e) => handleNodeHover(e, node)}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <NodeRect
            x={position.x}
            y={position.y - position.height / 2}
            width={position.width}
            height={position.height}
            $selected={isSelected}
            $color={color}
            opacity={0.8}
          />
          
          {node.icon && (
            <NodeIcon
              href={node.icon}
              x={position.x + 10}
              y={position.y - position.height / 2 + 10}
              width={20}
              height={20}
            />
          )}
          
          <NodeLabel
            x={position.x + position.width / 2}
            y={position.y}
          >
            {node.label}
          </NodeLabel>
          
          {collapsible && hasChildren && (
            <g
              onClick={(e) => handleCollapseClick(e, node.id)}
              transform={`translate(${position.x + position.width - 15}, ${position.y - position.height / 2 + 15})`}
            >
              <CollapseButton r={8} />
              <CollapseIcon>
                {isCollapsed ? '+' : '-'}
              </CollapseIcon>
            </g>
          )}
        </NodeContainer>
      );
    };
    
    // Render nodes recursively
    const renderAllNodes = (node: MindMapNode): React.ReactNode[] => {
      const result = [renderNodes(node)];
      
      const isCollapsed = nodeStates.get(node.id)?.collapsed || false;
      
      if (!isCollapsed && node.children) {
        node.children.forEach(child => {
          result.push(...renderAllNodes(child));
        });
      }
      
      return result;
    };
    
    return (
      <MindMapContainer ref={containerRef} $width={width} $height={height}>
        <MapSvg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Connections */}
          <AnimatePresence>
            {connections.map(connection => (
              <Connection
                key={connection.id}
                d={connection.path}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                exit={{ opacity: 0, pathLength: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>
          
          {/* Nodes */}
          <AnimatePresence>
            {renderAllNodes(rootNode)}
          </AnimatePresence>
        </MapSvg>
        
        {/* Tooltip */}
        {tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
              top: tooltipData.y,
              transform: 'translate(-50%, -100%)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipHeader>{tooltipData.node.label}</TooltipHeader>
            <TooltipContent>{tooltipData.node.notes}</TooltipContent>
          </TooltipContainer>
        )}
      </MindMapContainer>
    );
  };
  
  return renderMindMap();
};

export default MindMap;
