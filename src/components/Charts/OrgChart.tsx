import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface OrgChartNode {
  /**
   * Unique ID for the node
   */
  id: string;
  /**
   * Display name for the node
   */
  name: string;
  /**
   * Optional title/role for the node
   */
  title?: string;
  /**
   * Optional parent node ID
   */
  parentId?: string;
  /**
   * Optional image URL
   */
  imageUrl?: string;
  /**
   * Optional custom color for the node
   */
  color?: string;
  /**
   * Optional custom data to display
   */
  data?: Record<string, string>;
}

export interface OrgChartProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Organization chart nodes
   */
  nodes: OrgChartNode[];
  /**
   * Layout direction ('vertical' | 'horizontal')
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Whether to show node images
   */
  showImages?: boolean;
  /**
   * Whether to show node titles
   */
  showTitles?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (node: OrgChartNode) => string;
  /**
   * Whether to enable node selection
   */
  selectable?: boolean;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string) => void;
  /**
   * Whether to show connecting lines
   */
  showLines?: boolean;
  /**
   * Node spacing in pixels
   */
  nodeSpacing?: number;
  /**
   * Level spacing in pixels
   */
  levelSpacing?: number;
  /**
   * Whether to collapse/expand nodes
   */
  collapsible?: boolean;
  /**
   * IDs of initially collapsed nodes
   */
  initialCollapsed?: string[];
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const OrgContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrgSvg = styled.svg`
  overflow: visible;
`;

const NodeContainer = styled(motion.g)<{ $interactive: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
`;

const NodeRect = styled.rect`
  fill: ${({ theme }) => theme.colors.common.white};
  stroke: ${({ theme }) => theme.colors.neutral[300]};
  stroke-width: 1;
  rx: 5;
  ry: 5;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
`;

const NodeSelectedBorder = styled(motion.rect)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary.main};
  stroke-width: 2;
  rx: 5;
  ry: 5;
`;

const NodeName = styled.text`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const NodeTitle = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[600]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const NodeImage = styled.image`
  pointer-events: none;
`;

const NodeColorBar = styled.rect`
  pointer-events: none;
`;

const ConnectingLine = styled(motion.path)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[300]};
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
  min-width: 200px;
`;

const TooltipHeader = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 4px;
`;

const TooltipTitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: 8px;
`;

const TooltipData = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TooltipLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const TooltipValue = styled.span``;

/**
 * OrgChart component displays hierarchical organizational structures,
 * with customization options and interactive features.
 */
export const OrgChart: React.FC<OrgChartProps> = ({
  nodes,
  direction = 'vertical',
  showImages = true,
  showTitles = true,
  showTooltips = true,
  tooltipFormatter,
  selectable = true,
  onNodeSelect,
  showLines = true,
  nodeSpacing = 60,
  levelSpacing = 100,
  collapsible = true,
  initialCollapsed = [],
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set(initialCollapsed));
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    node: OrgChartNode;
  } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Build tree structure from flat nodes
  const buildTree = () => {
    // Create a map of nodes by ID
    const nodeMap = new Map<string, OrgChartNode & { children: string[] }>();
    
    // Initialize nodes with empty children array
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    
    // Find root nodes (nodes without a parent)
    const rootNodes: string[] = [];
    
    // Populate children arrays
    nodes.forEach(node => {
      if (!node.parentId) {
        rootNodes.push(node.id);
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node.id);
        } else {
          // If parent doesn't exist, treat as root
          rootNodes.push(node.id);
        }
      }
    });
    
    return { nodeMap, rootNodes };
  };
  
  // Calculate node positions
  const calculateNodePositions = () => {
    const { nodeMap, rootNodes } = buildTree();
    
    // Node dimensions
    const nodeWidth = 180;
    const nodeHeight = showTitles ? 80 : 60;
    const imageHeight = 40;
    
    // Calculate positions recursively
    const positions = new Map<string, { x: number; y: number; width: number; height: number }>();
    
    const calculateSubtreeSize = (nodeId: string, level: number): { width: number; height: number } => {
      const node = nodeMap.get(nodeId);
      if (!node) return { width: 0, height: 0 };
      
      // Check if node is collapsed
      if (level > 0 && collapsedNodes.has(nodeId)) {
        positions.set(nodeId, { 
          x: 0, // Will be adjusted later
          y: level * (nodeHeight + levelSpacing),
          width: nodeWidth,
          height: nodeHeight
        });
        return { width: nodeWidth, height: nodeHeight };
      }
      
      // Calculate sizes of children
      const childSizes: { width: number; height: number }[] = [];
      let totalChildWidth = 0;
      let maxChildHeight = 0;
      
      for (const childId of node.children) {
        const childSize = calculateSubtreeSize(childId, level + 1);
        childSizes.push(childSize);
        totalChildWidth += childSize.width;
        maxChildHeight = Math.max(maxChildHeight, childSize.height);
      }
      
      // Add spacing between children
      if (node.children.length > 1) {
        totalChildWidth += nodeSpacing * (node.children.length - 1);
      }
      
      // Calculate width and height of this subtree
      const subtreeWidth = Math.max(nodeWidth, totalChildWidth);
      const subtreeHeight = nodeHeight + (maxChildHeight > 0 ? levelSpacing + maxChildHeight : 0);
      
      // Store position of this node
      positions.set(nodeId, { 
        x: 0, // Will be adjusted later
        y: level * (nodeHeight + levelSpacing),
        width: nodeWidth,
        height: nodeHeight
      });
      
      return { width: subtreeWidth, height: subtreeHeight };
    };
    
    const positionSubtree = (nodeId: string, left: number): number => {
      const node = nodeMap.get(nodeId);
      if (!node) return left;
      
      const subtreeSize = calculateSubtreeSize(nodeId, 0);
      const nodePos = positions.get(nodeId);
      
      if (!nodePos) return left;
      
      // Center node over its children
      const nodeCenter = left + subtreeSize.width / 2;
      nodePos.x = nodeCenter - nodeWidth / 2;
      
      // Check if node is collapsed
      if (collapsedNodes.has(nodeId)) {
        return left + subtreeSize.width + nodeSpacing;
      }
      
      // Position children
      let childLeft = left;
      for (let i = 0; i < node.children.length; i++) {
        const childId = node.children[i];
        childLeft = positionSubtree(childId, childLeft);
        
        // Add spacing after each child except the last
        if (i < node.children.length - 1) {
          childLeft += nodeSpacing;
        }
      }
      
      return left + subtreeSize.width;
    };
    
    // Calculate sizes for all subtrees
    let totalWidth = 0;
    for (const rootId of rootNodes) {
      const subtreeSize = calculateSubtreeSize(rootId, 0);
      totalWidth += subtreeSize.width;
    }
    
    // Add spacing between root nodes
    if (rootNodes.length > 1) {
      totalWidth += nodeSpacing * (rootNodes.length - 1);
    }
    
    // Position all subtrees
    let left = 0;
    for (let i = 0; i < rootNodes.length; i++) {
      const rootId = rootNodes[i];
      left = positionSubtree(rootId, left);
      
      // Add spacing after each root except the last
      if (i < rootNodes.length - 1) {
        left += nodeSpacing;
      }
    }
    
    // For horizontal layout, swap x and y coordinates
    if (direction === 'horizontal') {
      const horizontalPositions = new Map<string, { x: number; y: number; width: number; height: number }>();
      
      positions.forEach((pos, id) => {
        horizontalPositions.set(id, {
          x: pos.y,
          y: pos.x,
          width: pos.height,
          height: pos.width
        });
      });
      
      return { positions: horizontalPositions, width: totalWidth, nodeMap, rootNodes };
    }
    
    return { positions, width: totalWidth, nodeMap, rootNodes };
  };
  
  // Generate connecting lines between nodes
  const generateConnectingLines = (positions: Map<string, { x: number; y: number; width: number; height: number }>, nodeMap: Map<string, OrgChartNode & { children: string[] }>) => {
    const lines: { id: string; path: string }[] = [];
    
    nodeMap.forEach((node, nodeId) => {
      // Skip if node is collapsed
      if (collapsedNodes.has(nodeId)) return;
      
      const nodePos = positions.get(nodeId);
      if (!nodePos) return;
      
      // Calculate start point (bottom center of parent)
      const startX = nodePos.x + nodePos.width / 2;
      const startY = nodePos.y + nodePos.height;
      
      // Draw lines to each child
      node.children.forEach(childId => {
        const childPos = positions.get(childId);
        if (!childPos) return;
        
        // Calculate end point (top center of child)
        const endX = childPos.x + childPos.width / 2;
        const endY = childPos.y;
        
        // Generate path
        let path: string;
        
        if (direction === 'vertical') {
          // Vertical layout - curved line down
          const midY = startY + (endY - startY) / 2;
          path = `
            M ${startX} ${startY}
            C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}
          `;
        } else {
          // Horizontal layout - curved line right
          const midX = startX + (endX - startX) / 2;
          path = `
            M ${startX} ${startY}
            C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}
          `;
        }
        
        lines.push({ id: `${nodeId}-${childId}`, path });
      });
    });
    
    return lines;
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
    
    setCollapsedNodes(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(nodeId)) {
        newCollapsed.delete(nodeId);
      } else {
        newCollapsed.add(nodeId);
      }
      return newCollapsed;
    });
  };
  
  // Handle node hover
  const handleNodeHover = (event: React.MouseEvent, node: OrgChartNode) => {
    if (!showTooltips) return;
    
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
  
  // Format tooltip content
  const formatTooltipContent = (node: OrgChartNode) => {
    if (tooltipFormatter) {
      return tooltipFormatter(node);
    }
    
    return (
      <>
        <TooltipHeader>{node.name}</TooltipHeader>
        {node.title && <TooltipTitle>{node.title}</TooltipTitle>}
        {node.data && (
          <TooltipData>
            {Object.entries(node.data).map(([key, value]) => (
              <TooltipRow key={key}>
                <TooltipLabel>{key}:</TooltipLabel>
                <TooltipValue>{value}</TooltipValue>
              </TooltipRow>
            ))}
          </TooltipData>
        )}
      </>
    );
  };
  
  // Get color for a node
  const getNodeColor = (node: OrgChartNode) => {
    if (node.color) return node.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    // Use a consistent color based on node ID
    const hashCode = node.id.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    
    return colors[Math.abs(hashCode) % colors.length];
  };
  
  // Render org chart
  const renderOrgChart = () => {
    const { positions, width, nodeMap, rootNodes } = calculateNodePositions();
    
    // Calculate SVG dimensions
    const maxX = Math.max(...Array.from(positions.values()).map(pos => pos.x + pos.width));
    const maxY = Math.max(...Array.from(positions.values()).map(pos => pos.y + pos.height));
    
    const svgWidth = maxX + 40; // Add padding
    const svgHeight = maxY + 40; // Add padding
    
    // Generate connecting lines
    const lines = showLines ? generateConnectingLines(positions, nodeMap) : [];
    
    return (
      <OrgContainer ref={containerRef}>
        <OrgSvg 
          ref={svgRef} 
          width={svgWidth} 
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Connecting lines */}
          <AnimatePresence>
            {lines.map(line => (
              <ConnectingLine
                key={line.id}
                d={line.path}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                exit={{ opacity: 0, pathLength: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>
          
          {/* Nodes */}
          <AnimatePresence>
            {Array.from(positions.entries()).map(([nodeId, position]) => {
              const node = nodeMap.get(nodeId);
              if (!node) return null;
              
              const isSelected = nodeId === selectedNode;
              const hasChildren = node.children.length > 0;
              const isCollapsed = collapsedNodes.has(nodeId);
              const color = getNodeColor(node);
              
              // Calculate node dimensions
              const nodeWidth = position.width;
              const nodeHeight = position.height;
              const imageSize = 40;
              
              return (
                <NodeContainer
                  key={nodeId}
                  $interactive={selectable}
                  onClick={() => handleNodeClick(nodeId)}
                  onMouseEnter={(e) => handleNodeHover(e, node)}
                  onMouseLeave={handleMouseLeave}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Node background */}
                  <NodeRect
                    x={position.x}
                    y={position.y}
                    width={nodeWidth}
                    height={nodeHeight}
                  />
                  
                  {/* Color bar */}
                  <NodeColorBar
                    x={position.x}
                    y={position.y}
                    width={nodeWidth}
                    height={4}
                    fill={color}
                  />
                  
                  {/* Selected border */}
                  {isSelected && (
                    <NodeSelectedBorder
                      x={position.x}
                      y={position.y}
                      width={nodeWidth}
                      height={nodeHeight}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  
                  {/* Node image */}
                  {showImages && node.imageUrl && (
                    <NodeImage
                      href={node.imageUrl}
                      x={position.x + (nodeWidth - imageSize) / 2}
                      y={position.y + 10}
                      width={imageSize}
                      height={imageSize}
                      clipPath="url(#circle-clip)"
                    />
                  )}
                  
                  {/* Node name */}
                  <NodeName
                    x={position.x + nodeWidth / 2}
                    y={position.y + (showImages && node.imageUrl ? 70 : 30)}
                  >
                    {node.name}
                  </NodeName>
                  
                  {/* Node title */}
                  {showTitles && node.title && (
                    <NodeTitle
                      x={position.x + nodeWidth / 2}
                      y={position.y + (showImages && node.imageUrl ? 90 : 50)}
                    >
                      {node.title}
                    </NodeTitle>
                  )}
                  
                  {/* Collapse/expand button */}
                  {collapsible && hasChildren && (
                    <g
                      onClick={(e) => handleCollapseClick(e, nodeId)}
                      transform={`translate(${position.x + nodeWidth - 15}, ${position.y + nodeHeight - 15})`}
                    >
                      <CollapseButton r={10} />
                      <CollapseIcon>
                        {isCollapsed ? '+' : '-'}
                      </CollapseIcon>
                    </g>
                  )}
                </NodeContainer>
              );
            })}
          </AnimatePresence>
          
          {/* Clip path for circular images */}
          <defs>
            <clipPath id="circle-clip">
              <circle cx="20" cy="20" r="20" />
            </clipPath>
          </defs>
        </OrgSvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
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
            {formatTooltipContent(tooltipData.node)}
          </TooltipContainer>
        )}
      </OrgContainer>
    );
  };
  
  // Convert to Chart component format for compatibility
  const chartData = {
    labels: nodes.map(node => node.name),
    series: [{
      name: 'Organization',
      data: nodes.map(() => 1)
    }]
  };
  
  return (
    <Chart
      data={chartData}
      type="orgChart"
      {...chartProps}
    >
      {renderOrgChart()}
    </Chart>
  );
};

export default OrgChart;
