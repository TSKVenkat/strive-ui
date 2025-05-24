import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface NetworkNode {
  /**
   * Unique ID for the node
   */
  id: string;
  /**
   * Display name for the node
   */
  name: string;
  /**
   * Optional value/weight for the node (affects size)
   */
  value?: number;
  /**
   * Optional group/category for the node (affects color)
   */
  group?: string;
  /**
   * Optional fixed x-position
   */
  x?: number;
  /**
   * Optional fixed y-position
   */
  y?: number;
  /**
   * Optional custom color for the node
   */
  color?: string;
  /**
   * Optional custom icon or image URL
   */
  icon?: string;
}

export interface NetworkLink {
  /**
   * Source node ID
   */
  source: string;
  /**
   * Target node ID
   */
  target: string;
  /**
   * Optional value/weight for the link (affects width)
   */
  value?: number;
  /**
   * Optional label for the link
   */
  label?: string;
  /**
   * Optional custom color for the link
   */
  color?: string;
  /**
   * Optional link type (affects line style)
   */
  type?: 'solid' | 'dashed' | 'dotted';
}

export interface NetworkGraphProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Network nodes
   */
  nodes: NetworkNode[];
  /**
   * Network links
   */
  links: NetworkLink[];
  /**
   * Whether to show node labels
   */
  showNodeLabels?: boolean;
  /**
   * Whether to show link labels
   */
  showLinkLabels?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom node tooltip formatter
   */
  nodeTooltipFormatter?: (node: NetworkNode) => string;
  /**
   * Custom link tooltip formatter
   */
  linkTooltipFormatter?: (link: NetworkLink, sourceNode: NetworkNode, targetNode: NetworkNode) => string;
  /**
   * Whether to enable node dragging
   */
  enableDragging?: boolean;
  /**
   * Whether to enable zooming and panning
   */
  enableZoom?: boolean;
  /**
   * Whether to enable node selection
   */
  selectable?: boolean;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string) => void;
  /**
   * Whether to use directed links (with arrows)
   */
  directed?: boolean;
  /**
   * Whether to use force simulation
   */
  useForceSimulation?: boolean;
  /**
   * Minimum node size
   */
  minNodeSize?: number;
  /**
   * Maximum node size
   */
  maxNodeSize?: number;
  /**
   * Minimum link width
   */
  minLinkWidth?: number;
  /**
   * Maximum link width
   */
  maxLinkWidth?: number;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const GraphSvg = styled.svg`
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const NodeCircle = styled(motion.circle)<{ $interactive: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NodeLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
  dominant-baseline: text-after-edge;
  pointer-events: none;
  text-shadow: 0 0 3px ${({ theme }) => theme.colors.common.white};
`;

const NodeIcon = styled.image`
  pointer-events: none;
`;

const LinkLine = styled(motion.line)<{ $type: 'solid' | 'dashed' | 'dotted' }>`
  stroke-dasharray: ${({ $type }) => 
    $type === 'dashed' ? '5,5' : 
    $type === 'dotted' ? '2,2' : 
    'none'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LinkPath = styled(motion.path)<{ $type: 'solid' | 'dashed' | 'dotted' }>`
  fill: none;
  stroke-dasharray: ${({ $type }) => 
    $type === 'dashed' ? '5,5' : 
    $type === 'dotted' ? '2,2' : 
    'none'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LinkLabel = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  text-shadow: 0 0 3px ${({ theme }) => theme.colors.common.white};
`;

const TooltipContainer = styled(motion.div)`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  pointer-events: none;
  z-index: 10;
  min-width: 120px;
`;

const TooltipHeader = styled.div`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 4px;
`;

const TooltipContent = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const ZoomButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  cursor: pointer;
  font-size: 18px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &:active {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

/**
 * NetworkGraph component displays nodes and links in a network/graph structure,
 * with customization options and interactive features.
 */
export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  links,
  showNodeLabels = true,
  showLinkLabels = false,
  showTooltips = true,
  nodeTooltipFormatter,
  linkTooltipFormatter,
  enableDragging = true,
  enableZoom = true,
  selectable = true,
  onNodeSelect,
  directed = false,
  useForceSimulation = true,
  minNodeSize = 6,
  maxNodeSize = 20,
  minLinkWidth = 1,
  maxLinkWidth = 5,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize node positions
  useEffect(() => {
    if (!useForceSimulation) return;
    
    // Simple force-directed layout simulation
    const simulation = () => {
      const positions: Record<string, { x: number; y: number }> = {};
      
      // Initialize positions randomly if not fixed
      nodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
          positions[node.id] = { x: node.x, y: node.y };
        } else {
          positions[node.id] = { 
            x: Math.random() * 800 - 400, 
            y: Math.random() * 600 - 300 
          };
        }
      });
      
      // Run simulation steps
      for (let i = 0; i < 100; i++) {
        // Repulsive forces between nodes
        nodes.forEach(node1 => {
          nodes.forEach(node2 => {
            if (node1.id === node2.id) return;
            
            const dx = positions[node2.id].x - positions[node1.id].x;
            const dy = positions[node2.id].y - positions[node1.id].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 1000 / (distance * distance);
            
            if (node1.x === undefined) {
              positions[node1.id].x -= dx * force / 100;
            }
            if (node1.y === undefined) {
              positions[node1.id].y -= dy * force / 100;
            }
          });
        });
        
        // Attractive forces along links
        links.forEach(link => {
          const source = nodes.find(n => n.id === link.source);
          const target = nodes.find(n => n.id === link.target);
          
          if (!source || !target) return;
          
          const dx = positions[target.id].x - positions[source.id].x;
          const dy = positions[target.id].y - positions[source.id].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = distance / 50;
          
          if (source.x === undefined) {
            positions[source.id].x += dx * force;
          }
          if (source.y === undefined) {
            positions[source.id].y += dy * force;
          }
          
          if (target.x === undefined) {
            positions[target.id].x -= dx * force;
          }
          if (target.y === undefined) {
            positions[target.id].y -= dy * force;
          }
        });
      }
      
      return positions;
    };
    
    setNodePositions(simulation());
  }, [nodes, links, useForceSimulation]);
  
  // Handle SVG mouse down for panning
  const handleSvgMouseDown = (event: React.MouseEvent) => {
    if (!enableZoom) return;
    
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle SVG mouse move for panning
  const handleSvgMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableZoom) return;
    
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle SVG mouse up for panning
  const handleSvgMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle node mouse down for dragging
  const handleNodeMouseDown = (event: React.MouseEvent, nodeId: string) => {
    if (!enableDragging) return;
    
    event.stopPropagation();
    setDraggingNode(nodeId);
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle node mouse move for dragging
  const handleNodeMouseMove = (event: React.MouseEvent) => {
    if (!draggingNode || !enableDragging) return;
    
    const dx = (event.clientX - dragStart.x) / zoom;
    const dy = (event.clientY - dragStart.y) / zoom;
    
    setNodePositions(prev => ({
      ...prev,
      [draggingNode]: {
        x: prev[draggingNode].x + dx,
        y: prev[draggingNode].y + dy
      }
    }));
    
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  
  // Handle node mouse up for dragging
  const handleNodeMouseUp = () => {
    setDraggingNode(null);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };
  
  // Handle reset view
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  
  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!selectable) return;
    
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
    
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };
  
  // Handle node hover
  const handleNodeHover = (event: React.MouseEvent, node: NetworkNode) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      content: formatNodeTooltip(node)
    });
  };
  
  // Handle link hover
  const handleLinkHover = (event: React.MouseEvent, link: NetworkLink) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
      content: formatLinkTooltip(link, sourceNode, targetNode)
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format node tooltip
  const formatNodeTooltip = (node: NetworkNode) => {
    if (nodeTooltipFormatter) {
      return nodeTooltipFormatter(node);
    }
    
    return (
      <>
        <TooltipHeader>{node.name}</TooltipHeader>
        <TooltipContent>
          {node.group && <div>Group: {node.group}</div>}
          {node.value !== undefined && <div>Value: {node.value}</div>}
        </TooltipContent>
      </>
    );
  };
  
  // Format link tooltip
  const formatLinkTooltip = (link: NetworkLink, sourceNode: NetworkNode, targetNode: NetworkNode) => {
    if (linkTooltipFormatter) {
      return linkTooltipFormatter(link, sourceNode, targetNode);
    }
    
    return (
      <>
        <TooltipHeader>{sourceNode.name} → {targetNode.name}</TooltipHeader>
        <TooltipContent>
          {link.label && <div>{link.label}</div>}
          {link.value !== undefined && <div>Value: {link.value}</div>}
        </TooltipContent>
      </>
    );
  };
  
  // Get color for a node
  const getNodeColor = (node: NetworkNode, index: number) => {
    if (node.color) return node.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    // Use group for consistent coloring if available
    if (node.group) {
      const groupIndex = [...new Set(nodes.map(n => n.group))].indexOf(node.group);
      return colors[groupIndex % colors.length];
    }
    
    return colors[index % colors.length];
  };
  
  // Get size for a node
  const getNodeSize = (node: NetworkNode) => {
    if (node.value === undefined) return (minNodeSize + maxNodeSize) / 2;
    
    const values = nodes.map(n => n.value).filter(v => v !== undefined) as number[];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    if (minValue === maxValue) return (minNodeSize + maxNodeSize) / 2;
    
    const normalizedValue = (node.value - minValue) / (maxValue - minValue);
    return minNodeSize + normalizedValue * (maxNodeSize - minNodeSize);
  };
  
  // Get color for a link
  const getLinkColor = (link: NetworkLink, sourceIndex: number, targetIndex: number) => {
    if (link.color) return link.color;
    
    // Use a neutral color for links
    return '#999';
  };
  
  // Get width for a link
  const getLinkWidth = (link: NetworkLink) => {
    if (link.value === undefined) return (minLinkWidth + maxLinkWidth) / 2;
    
    const values = links.map(l => l.value).filter(v => v !== undefined) as number[];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    if (minValue === maxValue) return (minLinkWidth + maxLinkWidth) / 2;
    
    const normalizedValue = (link.value - minValue) / (maxValue - minValue);
    return minLinkWidth + normalizedValue * (maxLinkWidth - minLinkWidth);
  };
  
  // Calculate SVG viewBox
  const calculateViewBox = () => {
    if (!svgRef.current) return '0 0 1000 1000';
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    const viewBoxWidth = width / zoom;
    const viewBoxHeight = height / zoom;
    
    const viewBoxX = centerX - viewBoxWidth / 2 - pan.x / zoom;
    const viewBoxY = centerY - viewBoxHeight / 2 - pan.y / zoom;
    
    return `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
  };
  
  // Render network graph
  const renderGraph = () => {
    // Check if node positions are initialized
    if (Object.keys(nodePositions).length === 0) return null;
    
    // Create a map of node IDs to indices
    const nodeIndices = new Map(nodes.map((node, index) => [node.id, index]));
    
    return (
      <GraphContainer 
        ref={containerRef}
        onMouseMove={draggingNode ? handleNodeMouseMove : handleSvgMouseMove}
        onMouseUp={draggingNode ? handleNodeMouseUp : handleSvgMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setDraggingNode(null);
          handleMouseLeave();
        }}
      >
        <GraphSvg 
          ref={svgRef} 
          viewBox={calculateViewBox()}
          onMouseDown={handleSvgMouseDown}
        >
          {/* Define arrow marker for directed links */}
          {directed && (
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="6"
                refY="2"
                orient="auto"
              >
                <path d="M0,0 L6,2 L0,4 Z" fill="#999" />
              </marker>
            </defs>
          )}
          
          {/* Links */}
          <AnimatePresence>
            {links.map((link, i) => {
              const sourceIndex = nodeIndices.get(link.source) || 0;
              const targetIndex = nodeIndices.get(link.target) || 0;
              
              const sourceNode = nodes[sourceIndex];
              const targetNode = nodes[targetIndex];
              
              const sourcePos = nodePositions[link.source];
              const targetPos = nodePositions[link.target];
              
              if (!sourcePos || !targetPos) return null;
              
              const linkColor = getLinkColor(link, sourceIndex, targetIndex);
              const linkWidth = getLinkWidth(link);
              const linkType = link.type || 'solid';
              
              // For directed links, use a curved path
              if (directed) {
                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate control point for curved path
                const midX = (sourcePos.x + targetPos.x) / 2;
                const midY = (sourcePos.y + targetPos.y) / 2;
                const normalX = -dy / distance * 30; // Perpendicular to the line
                const normalY = dx / distance * 30;
                
                const controlX = midX + normalX;
                const controlY = midY + normalY;
                
                // Calculate path
                const path = `
                  M ${sourcePos.x} ${sourcePos.y}
                  Q ${controlX} ${controlY} ${targetPos.x} ${targetPos.y}
                `;
                
                return (
                  <g key={`link-${i}`}>
                    <LinkPath
                      d={path}
                      stroke={linkColor}
                      strokeWidth={linkWidth}
                      $type={linkType}
                      markerEnd="url(#arrowhead)"
                      onMouseEnter={(e) => handleLinkHover(e, link)}
                      onMouseLeave={handleMouseLeave}
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.01 }}
                    />
                    
                    {showLinkLabels && link.label && (
                      <LinkLabel
                        x={controlX}
                        y={controlY}
                      >
                        {link.label}
                      </LinkLabel>
                    )}
                  </g>
                );
              }
              
              // For undirected links, use a straight line
              return (
                <g key={`link-${i}`}>
                  <LinkLine
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={linkColor}
                    strokeWidth={linkWidth}
                    $type={linkType}
                    onMouseEnter={(e) => handleLinkHover(e, link)}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {showLinkLabels && link.label && (
                    <LinkLabel
                      x={(sourcePos.x + targetPos.x) / 2}
                      y={(sourcePos.y + targetPos.y) / 2}
                    >
                      {link.label}
                    </LinkLabel>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
          
          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node, i) => {
              const nodeColor = getNodeColor(node, i);
              const nodeSize = getNodeSize(node);
              const isSelected = node.id === selectedNode;
              const position = nodePositions[node.id];
              
              if (!position) return null;
              
              return (
                <g key={`node-${i}`}>
                  <NodeCircle
                    cx={position.x}
                    cy={position.y}
                    r={nodeSize}
                    fill={nodeColor}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                    $interactive={selectable || enableDragging}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={(e) => handleNodeHover(e, node)}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                  />
                  
                  {node.icon && (
                    <NodeIcon
                      href={node.icon}
                      x={position.x - nodeSize / 2}
                      y={position.y - nodeSize / 2}
                      width={nodeSize}
                      height={nodeSize}
                    />
                  )}
                  
                  {showNodeLabels && (
                    <NodeLabel
                      x={position.x}
                      y={position.y + nodeSize + 5}
                    >
                      {node.name}
                    </NodeLabel>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
        </GraphSvg>
        
        {/* Zoom controls */}
        {enableZoom && (
          <ZoomControls>
            <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
            <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
            <ZoomButton onClick={handleResetView}>⟲</ZoomButton>
          </ZoomControls>
        )}
        
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
            {tooltipData.content}
          </TooltipContainer>
        )}
      </GraphContainer>
    );
  };
  
  // Convert to Chart component format for compatibility
  const chartData = {
    labels: nodes.map(node => node.name),
    series: [{
      name: 'Value',
      data: nodes.map(node => node.value || 1)
    }]
  };
  
  return (
    <Chart
      data={chartData}
      type="network"
      {...chartProps}
    >
      {renderGraph()}
    </Chart>
  );
};

export default NetworkGraph;
