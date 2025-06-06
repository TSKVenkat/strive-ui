import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface FlowNode {
  /**
   * Unique ID for the node
   */
  id: string;
  /**
   * Display name for the node
   */
  name: string;
  /**
   * Node type
   */
  type: 'start' | 'end' | 'process' | 'decision' | 'input' | 'output' | 'custom';
  /**
   * X position (0-100)
   */
  x: number;
  /**
   * Y position (0-100)
   */
  y: number;
  /**
   * Optional custom color for the node
   */
  color?: string;
  /**
   * Optional custom icon or image URL
   */
  icon?: string;
  /**
   * Optional custom shape for custom node types
   */
  shape?: 'rectangle' | 'circle' | 'diamond' | 'parallelogram' | 'hexagon';
  /**
   * Optional custom width
   */
  width?: number;
  /**
   * Optional custom height
   */
  height?: number;
}

export interface FlowConnection {
  /**
   * Unique ID for the connection
   */
  id: string;
  /**
   * Source node ID
   */
  source: string;
  /**
   * Target node ID
   */
  target: string;
  /**
   * Optional label for the connection
   */
  label?: string;
  /**
   * Connection type
   */
  type?: 'straight' | 'curved' | 'orthogonal';
  /**
   * Optional custom color for the connection
   */
  color?: string;
  /**
   * Optional line style
   */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  /**
   * Whether the connection has an arrow
   */
  hasArrow?: boolean;
}

export interface FlowDiagramProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Flow diagram nodes
   */
  nodes: FlowNode[];
  /**
   * Flow diagram connections
   */
  connections: FlowConnection[];
  /**
   * Whether to show node labels
   */
  showNodeLabels?: boolean;
  /**
   * Whether to show connection labels
   */
  showConnectionLabels?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom node tooltip formatter
   */
  nodeTooltipFormatter?: (node: FlowNode) => string;
  /**
   * Custom connection tooltip formatter
   */
  connectionTooltipFormatter?: (connection: FlowConnection, sourceNode: FlowNode, targetNode: FlowNode) => string;
  /**
   * Whether to enable node selection
   */
  selectable?: boolean;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string) => void;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
  /**
   * Grid size for snap-to-grid
   */
  gridSize?: number;
  /**
   * Whether to show the grid
   */
  showGrid?: boolean;
}

// Styled components
const FlowContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const FlowSvg = styled.svg`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const Grid = styled.g`
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
`;

const NodeShape = styled(motion.g)<{ $interactive: boolean }>`
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
  dominant-baseline: middle;
  pointer-events: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ConnectionPath = styled(motion.path)<{ $lineStyle: 'solid' | 'dashed' | 'dotted' }>`
  fill: none;
  stroke-dasharray: ${({ $lineStyle }) => 
    $lineStyle === 'dashed' ? '5,5' : 
    $lineStyle === 'dotted' ? '2,2' : 
    'none'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ConnectionLabel = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  background-color: ${({ theme }) => theme.colors.common.white};
`;

const ConnectionLabelBackground = styled.rect`
  fill: ${({ theme }) => theme.colors.common.white};
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
  rx: 2;
  ry: 2;
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

/**
 * FlowDiagram component displays nodes and connections in a flowchart-like structure,
 * with customization options and interactive features.
 */
export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  nodes,
  connections,
  showNodeLabels = true,
  showConnectionLabels = true,
  showTooltips = true,
  nodeTooltipFormatter,
  connectionTooltipFormatter,
  selectable = true,
  onNodeSelect,
  animateOnDataChange = true,
  gridSize = 20,
  showGrid = false,
  ...chartProps
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Convert percentage positions to SVG coordinates
  const getNodePosition = (node: FlowNode) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    
    return {
      x: (node.x / 100) * svgWidth,
      y: (node.y / 100) * svgHeight
    };
  };
  
  // Get node dimensions based on type
  const getNodeDimensions = (node: FlowNode) => {
    const baseWidth = 120;
    const baseHeight = 60;
    
    const width = node.width || baseWidth;
    const height = node.height || baseHeight;
    
    return { width, height };
  };
  
  // Generate node shape path based on type
  const generateNodeShape = (node: FlowNode, position: { x: number; y: number }, dimensions: { width: number; height: number }) => {
    const { x, y } = position;
    const { width, height } = dimensions;
    
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    switch (node.type) {
      case 'start':
      case 'end':
        // Ellipse
        return {
          shape: 'ellipse',
          props: {
            cx: x,
            cy: y,
            rx: halfWidth,
            ry: halfHeight
          }
        };
      
      case 'decision':
        // Diamond
        return {
          shape: 'polygon',
          props: {
            points: `
              ${x},${y - halfHeight}
              ${x + halfWidth},${y}
              ${x},${y + halfHeight}
              ${x - halfWidth},${y}
            `
          }
        };
      
      case 'input':
      case 'output':
        // Parallelogram
        const offset = width / 6;
        return {
          shape: 'polygon',
          props: {
            points: `
              ${x - halfWidth + offset},${y - halfHeight}
              ${x + halfWidth},${y - halfHeight}
              ${x + halfWidth - offset},${y + halfHeight}
              ${x - halfWidth},${y + halfHeight}
            `
          }
        };
      
      case 'custom':
        // Custom shape based on node.shape
        switch (node.shape) {
          case 'circle':
            return {
              shape: 'circle',
              props: {
                cx: x,
                cy: y,
                r: Math.min(halfWidth, halfHeight)
              }
            };
          
          case 'diamond':
            return {
              shape: 'polygon',
              props: {
                points: `
                  ${x},${y - halfHeight}
                  ${x + halfWidth},${y}
                  ${x},${y + halfHeight}
                  ${x - halfWidth},${y}
                `
              }
            };
          
          case 'parallelogram':
            const customOffset = width / 6;
            return {
              shape: 'polygon',
              props: {
                points: `
                  ${x - halfWidth + customOffset},${y - halfHeight}
                  ${x + halfWidth},${y - halfHeight}
                  ${x + halfWidth - customOffset},${y + halfHeight}
                  ${x - halfWidth},${y + halfHeight}
                `
              }
            };
          
          case 'hexagon':
            const hexOffset = width / 4;
            return {
              shape: 'polygon',
              props: {
                points: `
                  ${x - halfWidth + hexOffset},${y - halfHeight}
                  ${x + halfWidth - hexOffset},${y - halfHeight}
                  ${x + halfWidth},${y}
                  ${x + halfWidth - hexOffset},${y + halfHeight}
                  ${x - halfWidth + hexOffset},${y + halfHeight}
                  ${x - halfWidth},${y}
                `
              }
            };
          
          case 'rectangle':
          default:
            return {
              shape: 'rect',
              props: {
                x: x - halfWidth,
                y: y - halfHeight,
                width,
                height,
                rx: 5,
                ry: 5
              }
            };
        }
      
      case 'process':
      default:
        // Rectangle
        return {
          shape: 'rect',
          props: {
            x: x - halfWidth,
            y: y - halfHeight,
            width,
            height,
            rx: 5,
            ry: 5
          }
        };
    }
  };
  
  // Generate connection path
  const generateConnectionPath = (connection: FlowConnection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return '';
    
    const sourcePos = getNodePosition(sourceNode);
    const targetPos = getNodePosition(targetNode);
    
    const sourceDim = getNodeDimensions(sourceNode);
    const targetDim = getNodeDimensions(targetNode);
    
    // Calculate connection points
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const angle = Math.atan2(dy, dx);
    
    // Determine source and target connection points based on angle
    let sourceX, sourceY, targetX, targetY;
    
    // Source connection point
    if (sourceNode.type === 'start' || sourceNode.type === 'end' || 
        (sourceNode.type === 'custom' && sourceNode.shape === 'circle')) {
      // For circular nodes, use angle to find point on circle
      const radius = Math.min(sourceDim.width, sourceDim.height) / 2;
      sourceX = sourcePos.x + Math.cos(angle) * radius;
      sourceY = sourcePos.y + Math.sin(angle) * radius;
    } else {
      // For rectangular nodes, find intersection with rectangle
      const halfWidth = sourceDim.width / 2;
      const halfHeight = sourceDim.height / 2;
      
      // Determine which edge to connect to
      if (Math.abs(Math.cos(angle)) * halfHeight > Math.abs(Math.sin(angle)) * halfWidth) {
        // Connect to left or right edge
        sourceX = sourcePos.x + Math.sign(Math.cos(angle)) * halfWidth;
        sourceY = sourcePos.y + Math.tan(angle) * Math.sign(Math.cos(angle)) * halfWidth;
      } else {
        // Connect to top or bottom edge
        sourceX = sourcePos.x + Math.tan(Math.PI / 2 - angle) * Math.sign(Math.sin(angle)) * halfHeight;
        sourceY = sourcePos.y + Math.sign(Math.sin(angle)) * halfHeight;
      }
    }
    
    // Target connection point
    if (targetNode.type === 'start' || targetNode.type === 'end' || 
        (targetNode.type === 'custom' && targetNode.shape === 'circle')) {
      // For circular nodes, use angle to find point on circle
      const radius = Math.min(targetDim.width, targetDim.height) / 2;
      targetX = targetPos.x - Math.cos(angle) * radius;
      targetY = targetPos.y - Math.sin(angle) * radius;
    } else {
      // For rectangular nodes, find intersection with rectangle
      const halfWidth = targetDim.width / 2;
      const halfHeight = targetDim.height / 2;
      
      // Determine which edge to connect to
      if (Math.abs(Math.cos(angle)) * halfHeight > Math.abs(Math.sin(angle)) * halfWidth) {
        // Connect to left or right edge
        targetX = targetPos.x - Math.sign(Math.cos(angle)) * halfWidth;
        targetY = targetPos.y - Math.tan(angle) * Math.sign(Math.cos(angle)) * halfWidth;
      } else {
        // Connect to top or bottom edge
        targetX = targetPos.x - Math.tan(Math.PI / 2 - angle) * Math.sign(Math.sin(angle)) * halfHeight;
        targetY = targetPos.y - Math.sign(Math.sin(angle)) * halfHeight;
      }
    }
    
    // Generate path based on connection type
    switch (connection.type) {
      case 'curved':
        // Bezier curve
        const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
        const controlPointDistance = distance / 3;
        
        const controlX1 = sourceX + Math.cos(angle) * controlPointDistance;
        const controlY1 = sourceY + Math.sin(angle) * controlPointDistance;
        
        const controlX2 = targetX - Math.cos(angle) * controlPointDistance;
        const controlY2 = targetY - Math.sin(angle) * controlPointDistance;
        
        return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
      
      case 'orthogonal':
        // Orthogonal (right-angle) path
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;
        
        // Determine if horizontal or vertical first
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal first
          return `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
        } else {
          // Vertical first
          return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
        }
      
      case 'straight':
      default:
        // Straight line
        return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    }
  };
  
  // Calculate connection label position
  const calculateConnectionLabelPosition = (connection: FlowConnection) => {
    const path = generateConnectionPath(connection);
    
    // Find midpoint of the path
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    
    const pathLength = pathElement.getTotalLength();
    const midPoint = pathElement.getPointAtLength(pathLength / 2);
    
    return { x: midPoint.x, y: midPoint.y };
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
  const handleNodeHover = (event: React.MouseEvent, node: FlowNode) => {
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
  
  // Handle connection hover
  const handleConnectionHover = (event: React.MouseEvent, connection: FlowConnection) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
      content: formatConnectionTooltip(connection, sourceNode, targetNode)
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format node tooltip
  const formatNodeTooltip = (node: FlowNode) => {
    if (nodeTooltipFormatter) {
      return nodeTooltipFormatter(node);
    }
    
    return (
      <>
        <TooltipHeader>{node.name}</TooltipHeader>
        <TooltipContent>
          <div>Type: {node.type}</div>
        </TooltipContent>
      </>
    );
  };
  
  // Format connection tooltip
  const formatConnectionTooltip = (connection: FlowConnection, sourceNode: FlowNode, targetNode: FlowNode) => {
    if (connectionTooltipFormatter) {
      return connectionTooltipFormatter(connection, sourceNode, targetNode);
    }
    
    return (
      <>
        <TooltipHeader>{sourceNode.name} → {targetNode.name}</TooltipHeader>
        <TooltipContent>
          {connection.label && <div>{connection.label}</div>}
          <div>Type: {connection.type || 'straight'}</div>
        </TooltipContent>
      </>
    );
  };
  
  // Get color for a node
  const getNodeColor = (node: FlowNode) => {
    if (node.color) return node.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    // Use node type for color
    switch (node.type) {
      case 'start':
        return '#4caf50'; // Green
      case 'end':
        return '#f44336'; // Red
      case 'decision':
        return '#ff9800'; // Orange
      case 'input':
        return '#2196f3'; // Blue
      case 'output':
        return '#9c27b0'; // Purple
      case 'process':
      default:
        return '#3f51b5'; // Indigo
    }
  };
  
  // Get color for a connection
  const getConnectionColor = (connection: FlowConnection) => {
    if (connection.color) return connection.color;
    
    // Default connection color
    return '#666';
  };
  
  // Generate grid
  const generateGrid = () => {
    if (!svgRef.current) return null;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const horizontalLines: React.ReactElement[] = [];
    const verticalLines: React.ReactElement[] = [];
    
    for (let x = 0; x <= width; x += gridSize) {
      verticalLines.push(
        <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} />
      );
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      horizontalLines.push(
        <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} />
      );
    }
    
    return (
      <Grid>
        {horizontalLines}
        {verticalLines}
      </Grid>
    );
  };
  
  // Render flow diagram
  const renderFlow = () => {
    return (
      <FlowContainer ref={containerRef}>
        <FlowSvg ref={svgRef}>
          {/* Grid */}
          {showGrid && generateGrid()}
          
          {/* Connections */}
          <AnimatePresence>
            {connections.map((connection, i) => {
              const path = generateConnectionPath(connection);
              const color = getConnectionColor(connection);
              const lineStyle = connection.lineStyle || 'solid';
              
              return (
                <g key={`connection-${connection.id}`}>
                  <ConnectionPath
                    d={path}
                    stroke={color}
                    strokeWidth={2}
                    $lineStyle={lineStyle}
                    markerEnd={connection.hasArrow ? 'url(#arrowhead)' : undefined}
                    onMouseEnter={(e) => handleConnectionHover(e, connection)}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    exit={{ opacity: 0, pathLength: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.01 }}
                  />
                  
                  {showConnectionLabels && connection.label && (
                    (() => {
                      const labelPos = calculateConnectionLabelPosition(connection);
                      const labelWidth = connection.label.length * 6 + 10;
                      const labelHeight = 16;
                      
                      return (
                        <>
                          <ConnectionLabelBackground
                            x={labelPos.x - labelWidth / 2}
                            y={labelPos.y - labelHeight / 2}
                            width={labelWidth}
                            height={labelHeight}
                          />
                          <ConnectionLabel
                            x={labelPos.x}
                            y={labelPos.y}
                          >
                            {connection.label}
                          </ConnectionLabel>
                        </>
                      );
                    })()
                  )}
                </g>
              );
            })}
          </AnimatePresence>
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
            >
              <path d="M0,0 L6,2 L0,4 Z" fill="#666" />
            </marker>
          </defs>
          
          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node, i) => {
              const position = getNodePosition(node);
              const dimensions = getNodeDimensions(node);
              const shape = generateNodeShape(node, position, dimensions);
              const color = getNodeColor(node);
              const isSelected = node.id === selectedNode;
              
              // Create the appropriate shape element
              const ShapeElement = (() => {
                const props = {
                  ...shape.props,
                  fill: color,
                  stroke: isSelected ? '#fff' : '#000',
                  strokeWidth: isSelected ? 2 : 1
                };
                
                switch (shape.shape) {
                  case 'circle':
                    return <circle {...props} />;
                  case 'ellipse':
                    return <ellipse {...props} />;
                  case 'polygon':
                    return <polygon {...props} />;
                  case 'rect':
                  default:
                    return <rect {...props} />;
                }
              })();
              
              return (
                <NodeShape
                  key={`node-${node.id}`}
                  $interactive={selectable}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={(e) => handleNodeHover(e, node)}
                  onMouseLeave={handleMouseLeave}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                >
                  {ShapeElement}
                  
                  {showNodeLabels && (
                    <NodeLabel
                      x={position.x}
                      y={position.y}
                    >
                      {node.name}
                    </NodeLabel>
                  )}
                  
                  {node.icon && (
                    <image
                      href={node.icon}
                      x={position.x - 12}
                      y={position.y - 12}
                      width={24}
                      height={24}
                      pointerEvents="none"
                    />
                  )}
                </NodeShape>
              );
            })}
          </AnimatePresence>
        </FlowSvg>
        
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
      </FlowContainer>
    );
  };
  
  // Convert to Chart component format for compatibility
  const chartData = {
    labels: nodes.map(node => node.name),
    series: [{
      name: 'Nodes',
      data: nodes.map(() => 1)
    }]
  };
  
  return (
    <Chart
      data={chartData}
      type="area"
      {...chartProps}
    >
      {renderFlow()}
    </Chart>
  );
};

export default FlowDiagram;
