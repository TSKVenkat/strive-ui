import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface TreemapData {
  /**
   * Name of the item
   */
  name: string;
  /**
   * Value of the item (determines size)
   */
  value: number;
  /**
   * Optional color for the item
   */
  color?: string;
  /**
   * Optional children items for hierarchical treemaps
   */
  children?: TreemapData[];
}

export interface TreemapChartProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Treemap data structure
   */
  data: TreemapData[];
  /**
   * Padding between items
   */
  padding?: number;
  /**
   * Whether to show labels
   */
  showLabels?: boolean;
  /**
   * Whether to show values
   */
  showValues?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (name: string, value: number, path: string[]) => string;
  /**
   * Whether to enable drill down
   */
  enableDrillDown?: boolean;
  /**
   * Whether to show breadcrumbs for navigation
   */
  showBreadcrumbs?: boolean;
  /**
   * Color scheme for the treemap
   */
  colorScheme?: 'categorical' | 'sequential' | 'diverging';
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const TreemapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const BreadcrumbItem = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: underline;
  }
  
  &:not(:last-child)::after {
    content: '/';
    margin: 0 ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const TreemapRect = styled(motion.rect)<{ $interactive: boolean }>`
  stroke: ${({ theme }) => theme.colors.common.white};
  stroke-width: 1;
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TreemapLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.common.white};
  pointer-events: none;
  text-anchor: middle;
  dominant-baseline: middle;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const TreemapValue = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.common.white};
  pointer-events: none;
  text-anchor: middle;
  dominant-baseline: middle;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
 * TreemapChart component displays hierarchical data as nested rectangles,
 * with the area of each rectangle proportional to its value.
 */
export const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  padding = 2,
  showLabels = true,
  showValues = true,
  showTooltips = true,
  tooltipFormatter,
  enableDrillDown = true,
  showBreadcrumbs = true,
  colorScheme = 'categorical',
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [currentData, setCurrentData] = useState<TreemapData[]>(data);
  const [path, setPath] = useState<{ name: string; data: TreemapData[] }[]>([{ name: 'Root', data }]);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    name: string;
    value: number;
    path: string[];
  } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate treemap layout using squarified algorithm
  const calculateTreemap = () => {
    if (!svgRef.current || !containerRef.current) return [];
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate total value
    const totalValue = currentData.reduce((sum, item) => sum + item.value, 0);
    
    // Sort data by value (descending)
    const sortedData = [...currentData].sort((a, b) => b.value - a.value);
    
    // Squarified treemap algorithm
    const squarify = (items: TreemapData[], x: number, y: number, w: number, h: number) => {
      if (items.length === 0) return [];
      
      const result: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        data: TreemapData;
      }> = [];
      
      // Scale values to fit the available area
      const scale = (w * h) / totalValue;
      
      let remainingItems = [...items];
      
      // Process items in batches to create more square-like rectangles
      while (remainingItems.length > 0) {
        const row: TreemapData[] = [];
        let rowValue = 0;
        
        // Determine the shorter dimension
        const isWider = w >= h;
        const shorterDim = isWider ? h : w;
        
        // Add items to the current row until aspect ratio worsens
        let bestAspectRatio = Infinity;
        
        for (let i = 0; i < remainingItems.length; i++) {
          const item = remainingItems[i];
          const newRowValue = rowValue + item.value;
          
          if (newRowValue === 0) continue;
          
          // Calculate worst aspect ratio in the row
          const rowArea = newRowValue * scale;
          const rowWidth = isWider ? rowArea / h : w;
          const rowHeight = isWider ? h : rowArea / w;
          
          let worstRatio = 0;
          for (const rowItem of [...row, item]) {
            const itemArea = rowItem.value * scale;
            const itemWidth = isWider ? itemArea / rowHeight : rowWidth;
            const itemHeight = isWider ? rowHeight : itemArea / rowWidth;
            const itemRatio = Math.max(itemWidth / itemHeight, itemHeight / itemWidth);
            worstRatio = Math.max(worstRatio, itemRatio);
          }
          
          // If adding this item makes the aspect ratio worse and we already have items,
          // stop adding to this row
          if (i > 0 && worstRatio > bestAspectRatio) {
            break;
          }
          
          bestAspectRatio = worstRatio;
          row.push(item);
          rowValue = newRowValue;
        }
        
        // Remove processed items from the remaining set
        remainingItems = remainingItems.slice(row.length);
        
        // Layout the current row
        const rowArea = rowValue * scale;
        let currentX = x;
        let currentY = y;
        
        if (isWider) {
          // Layout horizontally
          const rowWidth = rowArea / h;
          
          for (const item of row) {
            const itemHeight = h;
            const itemWidth = (item.value / rowValue) * rowWidth;
            
            result.push({
              x: currentX + padding / 2,
              y: currentY + padding / 2,
              width: itemWidth - padding,
              height: itemHeight - padding,
              data: item,
            });
            
            currentX += itemWidth;
          }
          
          // Update dimensions for next row
          x += rowWidth;
          w -= rowWidth;
        } else {
          // Layout vertically
          const rowHeight = rowArea / w;
          
          for (const item of row) {
            const itemWidth = w;
            const itemHeight = (item.value / rowValue) * rowHeight;
            
            result.push({
              x: currentX + padding / 2,
              y: currentY + padding / 2,
              width: itemWidth - padding,
              height: itemHeight - padding,
              data: item,
            });
            
            currentY += itemHeight;
          }
          
          // Update dimensions for next row
          y += rowHeight;
          h -= rowHeight;
        }
      }
      
      return result;
    };
    
    return squarify(sortedData, 0, 0, width, height);
  };
  
  // Handle rectangle click for drill down
  const handleRectClick = (item: TreemapData) => {
    if (!enableDrillDown || !item.children || item.children.length === 0) return;
    
    setCurrentData(item.children);
    setPath([...path, { name: item.name, data: item.children }]);
  };
  
  // Handle breadcrumb click for navigation
  const handleBreadcrumbClick = (index: number) => {
    if (index >= path.length) return;
    
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
    setCurrentData(newPath[newPath.length - 1].data);
  };
  
  // Handle rectangle hover
  const handleRectHover = (event: React.MouseEvent, item: TreemapData, rect: { x: number; y: number; width: number; height: number }) => {
    if (!showTooltips) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Calculate tooltip position
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    
    // Build path
    const tooltipPath = path.map(p => p.name).slice(1).concat(item.name);
    
    setTooltipData({
      x,
      y,
      name: item.name,
      value: item.value,
      path: tooltipPath,
    });
  };
  
  // Handle rectangle leave
  const handleRectLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (name: string, value: number, path: string[]) => {
    if (tooltipFormatter) {
      return tooltipFormatter(name, value, path);
    }
    return `Value: ${value.toLocaleString()}`;
  };
  
  // Get color for an item based on the color scheme
  const getItemColor = (item: TreemapData, index: number) => {
    if (item.color) return item.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    switch (colorScheme) {
      case 'sequential':
        // Lighter to darker shades of the first color
        const baseColor = colors[0];
        const shade = 0.5 + (index / currentData.length) * 0.5;
        return baseColor; // In a real implementation, would adjust the shade
      
      case 'diverging':
        // Use first half of colors for first half of data, second half for second half
        const midpoint = Math.floor(colors.length / 2);
        const normalizedIndex = Math.floor((index / currentData.length) * colors.length);
        return colors[normalizedIndex];
      
      case 'categorical':
      default:
        // Use colors in sequence
        return colors[index % colors.length];
    }
  };
  
  // Render chart
  const renderTreemap = () => {
    const treemapItems = calculateTreemap();
    
    return (
      <>
        {showBreadcrumbs && path.length > 1 && (
          <BreadcrumbsContainer>
            {path.map((item, i) => (
              <BreadcrumbItem 
                key={i} 
                onClick={() => handleBreadcrumbClick(i)}
              >
                {item.name}
              </BreadcrumbItem>
            ))}
          </BreadcrumbsContainer>
        )}
        
        <svg ref={svgRef} width="100%" height={showBreadcrumbs && path.length > 1 ? "calc(100% - 40px)" : "100%"}>
          <AnimatePresence>
            {treemapItems.map((item, i) => {
              const hasChildren = item.data.children && item.data.children.length > 0;
              const color = getItemColor(item.data, i);
              
              // Check if rectangle is large enough for labels
              const canFitLabel = item.width > 60 && item.height > 30;
              const canFitValue = item.width > 60 && item.height > 50;
              
              return (
                <g key={`${item.data.name}-${i}`}>
                  <TreemapRect
                    $interactive={!!(enableDrillDown && hasChildren)}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fill={color}
                    onClick={() => handleRectClick(item.data)}
                    onMouseEnter={(e) => handleRectHover(e, item.data, item)}
                    onMouseLeave={handleRectLeave}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                  />
                  
                  {showLabels && canFitLabel && (
                    <TreemapLabel
                      x={item.x + item.width / 2}
                      y={item.y + (showValues && canFitValue ? item.height / 2 - 8 : item.height / 2)}
                    >
                      {item.data.name}
                    </TreemapLabel>
                  )}
                  
                  {showValues && canFitValue && (
                    <TreemapValue
                      x={item.x + item.width / 2}
                      y={item.y + (showLabels && canFitLabel ? item.height / 2 + 12 : item.height / 2)}
                    >
                      {item.data.value.toLocaleString()}
                    </TreemapValue>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
        </svg>
        
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
            <TooltipHeader>{tooltipData.name}</TooltipHeader>
            <TooltipContent>
              {formatTooltipContent(tooltipData.name, tooltipData.value, tooltipData.path)}
            </TooltipContent>
          </TooltipContainer>
        )}
      </>
    );
  };
  
  // Convert data to Chart component format
  const chartData = {
    labels: currentData.map(item => item.name),
    series: [{
      name: path[path.length - 1].name,
      data: currentData.map(item => item.value)
    }]
  };
  
  return (
    <TreemapContainer ref={containerRef}>
      <Chart
        data={chartData}
        type="treemap"
        {...chartProps}
      >
        {renderTreemap()}
      </Chart>
    </TreemapContainer>
  );
};

export default TreemapChart;
