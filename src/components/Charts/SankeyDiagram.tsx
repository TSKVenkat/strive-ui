import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface SankeyNode {
  /**
   * Unique ID for the node
   */
  id: string;
  /**
   * Display name for the node
   */
  name: string;
  /**
   * Optional color for the node
   */
  color?: string;
}

export interface SankeyLink {
  /**
   * Source node ID
   */
  source: string;
  /**
   * Target node ID
   */
  target: string;
  /**
   * Value/weight of the link
   */
  value: number;
  /**
   * Optional color for the link
   */
  color?: string;
}

export interface SankeyData {
  /**
   * Nodes in the Sankey diagram
   */
  nodes: SankeyNode[];
  /**
   * Links between nodes
   */
  links: SankeyLink[];
}

export interface SankeyDiagramProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Sankey diagram data
   */
  data: SankeyData;
  /**
   * Node padding
   */
  nodePadding?: number;
  /**
   * Node width
   */
  nodeWidth?: number;
  /**
   * Whether to show node labels
   */
  showNodeLabels?: boolean;
  /**
   * Whether to show link values
   */
  showLinkValues?: boolean;
  /**
   * Custom link value formatter
   */
  linkValueFormatter?: (value: number) => string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (source: string, target: string, value: number) => string;
  /**
   * Whether to use a gradient for links
   */
  useGradientLinks?: boolean;
  /**
   * Link opacity
   */
  linkOpacity?: number;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const SankeyContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const SankeySvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const NodeRect = styled(motion.rect)`
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NodeLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[800]};
  dominant-baseline: middle;
  pointer-events: none;
`;

const LinkPath = styled(motion.path)<{ $opacity: number }>`
  fill: none;
  opacity: ${({ $opacity }) => $opacity};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: ${({ $opacity }) => Math.min(1, $opacity + 0.3)};
  }
`;

const LinkValue = styled.text`
  font-size: 10px;
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
 * SankeyDiagram component displays flows between nodes, with the width of the
 * links proportional to the flow quantity.
 */
export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  data,
  nodePadding = 10,
  nodeWidth = 20,
  showNodeLabels = true,
  showLinkValues = false,
  linkValueFormatter = (value) => value.toLocaleString(),
  showTooltips = true,
  tooltipFormatter,
  useGradientLinks = true,
  linkOpacity = 0.5,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    source: string;
    target: string;
    value: number;
  } | null>(null);
  
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate Sankey layout
  const calculateSankey = () => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate padding
    const padding = {
      top: 20,
      right: 150, // Space for labels
      bottom: 20,
      left: 150, // Space for labels
    };
    
    // Calculate diagram area dimensions
    const diagramWidth = width - padding.left - padding.right;
    const diagramHeight = height - padding.top - padding.bottom;
    
    // Create a map of node IDs to node objects
    const nodeMap = new Map(data.nodes.map(node => [node.id, { ...node }]));
    
    // Calculate node values (sum of incoming or outgoing links)
    data.links.forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (sourceNode) {
        sourceNode.outValue = (sourceNode.outValue || 0) + link.value;
      }
      
      if (targetNode) {
        targetNode.inValue = (targetNode.inValue || 0) + link.value;
      }
    });
    
    // Identify node levels (columns)
    const nodeLevels = new Map<string, number>();
    const maxLevel = findNodeLevels(data.links, nodeLevels);
    
    // Group nodes by level
    const nodesByLevel = Array.from({ length: maxLevel + 1 }, () => [] as any[]);
    nodeMap.forEach((node, id) => {
      const level = nodeLevels.get(id) || 0;
      nodesByLevel[level].push({ ...node, id });
    });
    
    // Calculate x-positions based on levels
    const levelWidth = diagramWidth / Math.max(1, maxLevel);
    nodesByLevel.forEach((levelNodes, level) => {
      levelNodes.forEach(node => {
        node.x = padding.left + level * levelWidth;
      });
    });
    
    // Calculate node heights based on values
    const maxValue = Math.max(
      ...Array.from(nodeMap.values()).map(node => Math.max(node.inValue || 0, node.outValue || 0))
    );
    
    // Calculate y-positions and heights
    nodesByLevel.forEach((levelNodes, level) => {
      // Sort nodes by value for better layout
      levelNodes.sort((a, b) => (b.outValue || b.inValue || 0) - (a.outValue || a.inValue || 0));
      
      const totalHeight = levelNodes.reduce((sum, node) => {
        const nodeValue = Math.max(node.inValue || 0, node.outValue || 0);
        const height = (nodeValue / maxValue) * (diagramHeight - (levelNodes.length - 1) * nodePadding);
        return sum + height;
      }, 0);
      
      const startY = padding.top + (diagramHeight - totalHeight) / 2;
      
      let currentY = startY;
      levelNodes.forEach(node => {
        const nodeValue = Math.max(node.inValue || 0, node.outValue || 0);
        const height = (nodeValue / maxValue) * (diagramHeight - (levelNodes.length - 1) * nodePadding);
        
        node.y = currentY;
        node.height = height;
        node.width = nodeWidth;
        
        currentY += height + nodePadding;
      });
    });
    
    // Calculate link paths
    const links = data.links.map(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return null;
      
      // Calculate vertical position within source node
      const sourceNodeLinks = data.links.filter(l => l.source === link.source);
      const sourceIndex = sourceNodeLinks.indexOf(link);
      const sourceLinksTotalValue = sourceNodeLinks.reduce((sum, l) => sum + l.value, 0);
      const sourceStartPercentage = sourceNodeLinks
        .slice(0, sourceIndex)
        .reduce((sum, l) => sum + l.value / sourceLinksTotalValue, 0);
      const sourceLinkPercentage = link.value / sourceLinksTotalValue;
      
      const sourceY1 = sourceNode.y + sourceNode.height * sourceStartPercentage;
      const sourceY2 = sourceNode.y + sourceNode.height * (sourceStartPercentage + sourceLinkPercentage);
      
      // Calculate vertical position within target node
      const targetNodeLinks = data.links.filter(l => l.target === link.target);
      const targetIndex = targetNodeLinks.indexOf(link);
      const targetLinksTotalValue = targetNodeLinks.reduce((sum, l) => sum + l.value, 0);
      const targetStartPercentage = targetNodeLinks
        .slice(0, targetIndex)
        .reduce((sum, l) => sum + l.value / targetLinksTotalValue, 0);
      const targetLinkPercentage = link.value / targetLinksTotalValue;
      
      const targetY1 = targetNode.y + targetNode.height * targetStartPercentage;
      const targetY2 = targetNode.y + targetNode.height * (targetStartPercentage + targetLinkPercentage);
      
      // Generate path
      const sourceX = sourceNode.x + sourceNode.width;
      const targetX = targetNode.x;
      
      const path = `
        M ${sourceX} ${sourceY1}
        C ${sourceX + (targetX - sourceX) / 3} ${sourceY1},
          ${sourceX + 2 * (targetX - sourceX) / 3} ${targetY1},
          ${targetX} ${targetY1}
        L ${targetX} ${targetY2}
        C ${sourceX + 2 * (targetX - sourceX) / 3} ${targetY2},
          ${sourceX + (targetX - sourceX) / 3} ${sourceY2},
          ${sourceX} ${sourceY2}
        Z
      `;
      
      // Calculate midpoint for label
      const midX = (sourceX + targetX) / 2;
      const midY = ((sourceY1 + sourceY2) / 2 + (targetY1 + targetY2) / 2) / 2;
      
      return {
        ...link,
        path,
        sourceNode,
        targetNode,
        sourceY1,
        sourceY2,
        targetY1,
        targetY2,
        midX,
        midY,
        thickness: Math.abs(sourceY2 - sourceY1),
      };
    }).filter(Boolean) as any[];
    
    // Flatten nodes for rendering
    const nodes = nodesByLevel.flat();
    
    return {
      width,
      height,
      padding,
      diagramWidth,
      diagramHeight,
      nodes,
      links,
    };
  };
  
  // Helper function to find node levels
  const findNodeLevels = (links: SankeyLink[], levels: Map<string, number>) => {
    // Find nodes with no incoming links (sources)
    const sources = new Set(links.map(link => link.source));
    const targets = new Set(links.map(link => link.target));
    const startNodes = Array.from(sources).filter(source => !targets.has(source));
    
    // Assign level 0 to start nodes
    startNodes.forEach(node => levels.set(node, 0));
    
    // Breadth-first traversal to assign levels
    let currentNodes = startNodes;
    let currentLevel = 0;
    let maxLevel = 0;
    
    while (currentNodes.length > 0) {
      currentLevel++;
      const nextNodes: string[] = [];
      
      currentNodes.forEach(source => {
        const outgoingLinks = links.filter(link => link.source === source);
        
        outgoingLinks.forEach(link => {
          const { target } = link;
          
          // Check if target already has a level
          const existingLevel = levels.get(target);
          if (existingLevel === undefined || existingLevel < currentLevel) {
            levels.set(target, currentLevel);
            maxLevel = Math.max(maxLevel, currentLevel);
            nextNodes.push(target);
          }
        });
      });
      
      currentNodes = nextNodes;
    }
    
    return maxLevel;
  };
  
  // Handle link hover
  const handleLinkHover = (event: React.MouseEvent, link: ReturnType<typeof calculateSankey>['links'][0]) => {
    if (!showTooltips) return;
    
    setTooltipData({
      x: link.midX,
      y: link.midY,
      source: link.sourceNode.name,
      target: link.targetNode.name,
      value: link.value,
    });
  };
  
  // Handle link leave
  const handleLinkLeave = () => {
    setTooltipData(null);
  };
  
  // Handle node hover
  const handleNodeHover = (nodeId: string) => {
    setHighlightedNode(nodeId);
  };
  
  // Handle node leave
  const handleNodeLeave = () => {
    setHighlightedNode(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (source: string, target: string, value: number) => {
    if (tooltipFormatter) {
      return tooltipFormatter(source, target, value);
    }
    return `Value: ${value.toLocaleString()}`;
  };
  
  // Get color for a node
  const getNodeColor = (node: SankeyNode, index: number) => {
    if (node.color) return node.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    return colors[index % colors.length];
  };
  
  // Get color for a link
  const getLinkColor = (link: SankeyLink, sourceIndex: number, targetIndex: number) => {
    if (link.color) return link.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    if (useGradientLinks) {
      // Return gradient ID
      return `url(#link-gradient-${sourceIndex}-${targetIndex})`;
    } else {
      // Use source node color
      return colors[sourceIndex % colors.length];
    }
  };
  
  // Check if a link is connected to the highlighted node
  const isLinkHighlighted = (link: SankeyLink) => {
    if (!highlightedNode) return false;
    return link.source === highlightedNode || link.target === highlightedNode;
  };
  
  // Render Sankey diagram
  const renderSankey = () => {
    const sankey = calculateSankey();
    if (!sankey) return null;
    
    const { nodes, links } = sankey;
    
    // Create a map of node IDs to indices
    const nodeIndices = new Map(data.nodes.map((node, index) => [node.id, index]));
    
    return (
      <>
        <SankeySvg ref={svgRef}>
          {/* Define gradients for links */}
          {useGradientLinks && (
            <defs>
              {links.map((link, i) => {
                const sourceIndex = nodeIndices.get(link.source) || 0;
                const targetIndex = nodeIndices.get(link.target) || 0;
                const sourceColor = getNodeColor(data.nodes[sourceIndex], sourceIndex);
                const targetColor = getNodeColor(data.nodes[targetIndex], targetIndex);
                
                return (
                  <linearGradient
                    key={`gradient-${i}`}
                    id={`link-gradient-${sourceIndex}-${targetIndex}`}
                    gradientUnits="userSpaceOnUse"
                    x1={link.sourceNode.x + link.sourceNode.width}
                    y1={(link.sourceY1 + link.sourceY2) / 2}
                    x2={link.targetNode.x}
                    y2={(link.targetY1 + link.targetY2) / 2}
                  >
                    <stop offset="0%" stopColor={sourceColor} />
                    <stop offset="100%" stopColor={targetColor} />
                  </linearGradient>
                );
              })}
            </defs>
          )}
          
          {/* Links */}
          <AnimatePresence>
            {links.map((link, i) => {
              const sourceIndex = nodeIndices.get(link.source) || 0;
              const targetIndex = nodeIndices.get(link.target) || 0;
              const highlighted = isLinkHighlighted(link);
              
              return (
                <g key={`link-${i}`}>
                  <LinkPath
                    d={link.path}
                    fill={getLinkColor(link, sourceIndex, targetIndex)}
                    $opacity={highlighted ? Math.min(1, linkOpacity + 0.3) : linkOpacity}
                    onMouseEnter={(e) => handleLinkHover(e, link)}
                    onMouseLeave={handleLinkLeave}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: highlighted ? Math.min(1, linkOpacity + 0.3) : linkOpacity }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {showLinkValues && link.thickness > 15 && (
                    <LinkValue
                      x={link.midX}
                      y={link.midY}
                    >
                      {linkValueFormatter(link.value)}
                    </LinkValue>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
          
          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node, i) => {
              const nodeIndex = nodeIndices.get(node.id) || 0;
              const nodeColor = getNodeColor(data.nodes[nodeIndex], nodeIndex);
              
              return (
                <g key={`node-${i}`}>
                  <NodeRect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={nodeColor}
                    onMouseEnter={() => handleNodeHover(node.id)}
                    onMouseLeave={handleNodeLeave}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                  />
                  
                  {showNodeLabels && (
                    <NodeLabel
                      x={node.x < sankey.width / 2 ? node.x - 8 : node.x + node.width + 8}
                      y={node.y + node.height / 2}
                      textAnchor={node.x < sankey.width / 2 ? 'end' : 'start'}
                    >
                      {node.name}
                    </NodeLabel>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
        </SankeySvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
              top: tooltipData.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipHeader>
              {tooltipData.source} → {tooltipData.target}
            </TooltipHeader>
            <TooltipContent>
              {formatTooltipContent(tooltipData.source, tooltipData.target, tooltipData.value)}
            </TooltipContent>
          </TooltipContainer>
        )}
      </>
    );
  };
  
  // Convert to Chart component format for compatibility
  const chartData = {
    labels: data.nodes.map(node => node.name),
    series: [{
      name: 'Flow',
      data: data.links.map(link => link.value)
    }]
  };
  
  return (
    <SankeyContainer ref={containerRef}>
      <Chart
        data={chartData}
        type="sankey"
        {...chartProps}
      >
        {renderSankey()}
      </Chart>
    </SankeyContainer>
  );
};

export default SankeyDiagram;
