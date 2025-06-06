import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps, ChartData } from './Chart';

export interface PieChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Inner radius for creating a donut chart (0 for pie chart)
   */
  innerRadius?: number;
  /**
   * Outer radius as a percentage of the chart's minimum dimension
   */
  outerRadius?: number;
  /**
   * Starting angle in degrees
   */
  startAngle?: number;
  /**
   * Ending angle in degrees
   */
  endAngle?: number;
  /**
   * Padding between slices in degrees
   */
  padAngle?: number;
  /**
   * Corner radius for slices
   */
  cornerRadius?: number;
  /**
   * Whether to show data labels
   */
  showLabels?: boolean;
  /**
   * Position of the labels ('inside' | 'outside')
   */
  labelPosition?: 'inside' | 'outside';
  /**
   * Custom label formatter
   */
  labelFormatter?: (value: number, percentage: number, label: string) => string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (value: number, percentage: number, label: string) => string;
  /**
   * Whether to show the total in the center (for donut charts)
   */
  showTotal?: boolean;
  /**
   * Custom total formatter
   */
  totalFormatter?: (total: number) => string;
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  /**
   * Legend position ('top' | 'right' | 'bottom' | 'left')
   */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Whether to enable slice selection
   */
  selectable?: boolean;
  /**
   * Callback when a slice is selected
   */
  onSliceSelect?: (index: number, selected: boolean) => void;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const SliceLabel = styled.text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.common.white};
  text-anchor: middle;
  pointer-events: none;
`;

const OuterLabel = styled.text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: start;
  pointer-events: none;
`;

const LabelLine = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[400]};
  stroke-width: 1;
  pointer-events: none;
`;

const TotalLabel = styled.text`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const TotalSubLabel = styled.text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[600]};
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TooltipColor = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  margin-right: 6px;
`;

const TooltipLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-right: 6px;
  display: flex;
  align-items: center;
`;

const TooltipValue = styled.span`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const LegendContainer = styled.div<{ $position: 'top' | 'right' | 'bottom' | 'left' }>`
  display: flex;
  flex-direction: ${({ $position }) => 
    $position === 'top' || $position === 'bottom' ? 'row' : 'column'};
  flex-wrap: ${({ $position }) => 
    $position === 'top' || $position === 'bottom' ? 'wrap' : 'nowrap'};
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }
`;

const LegendColor = styled.div<{ $color: string; $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
  margin-right: 6px;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`;

const LegendLabel = styled.span<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`;

/**
 * PieChart component displays data as a pie or donut chart with various
 * customization options and interactive features.
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  innerRadius = 0,
  outerRadius = 0.9,
  startAngle = 0,
  endAngle = 360,
  padAngle = 0,
  cornerRadius = 0,
  showLabels = false,
  labelPosition = 'inside',
  labelFormatter = (value, percentage) => `${percentage.toFixed(1)}%`,
  showTooltips = true,
  tooltipFormatter,
  showTotal = false,
  totalFormatter = (total) => total.toString(),
  showLegend = true,
  legendPosition = 'bottom',
  selectable = false,
  onSliceSelect,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    percentage: number;
    color: string;
  } | null>(null);
  
  const [selectedSlices, setSelectedSlices] = useState<Record<number, boolean>>({});
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total value
  const total = data.series.reduce((sum, series) => {
    return sum + series.data.reduce((seriesSum, value) => seriesSum + value, 0);
  }, 0);
  
  // Prepare pie data
  const pieData = data.series.flatMap((series, seriesIndex) => {
    return series.data.map((value, valueIndex) => {
      const label = data.labels[valueIndex] || '';
      return {
        value,
        label,
        color: series.color || chartProps.colors?.[valueIndex % (chartProps.colors?.length || 1)] || '#000',
        seriesIndex,
        valueIndex,
      };
    });
  }).filter(item => item.value > 0);
  
  // Calculate chart dimensions and angles
  const calculateChart = (): {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    radius: number;
    innerRadius: number;
    slices: {
      startAngle: number;
      endAngle: number;
      value: number;
      percentage: number;
      label: string;
      color: string;
      index: number;
      seriesIndex: number;
      valueIndex: number;
    }[];
  } | null => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const container = containerRef.current;
    
    // Get SVG dimensions
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate center and radius
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * outerRadius;
    const innerRadiusValue = innerRadius * radius;
    
    // Convert angles to radians
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    const padAngleRad = padAngle * (Math.PI / 180);
    
    // Calculate slices
    let currentAngle = startAngleRad;
    const slices = pieData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = ((endAngleRad - startAngleRad) * (item.value / total));
      
      const slice = {
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        value: item.value,
        percentage,
        label: item.label,
        color: item.color,
        index,
        seriesIndex: item.seriesIndex,
        valueIndex: item.valueIndex,
      };
      
      currentAngle += angle + padAngleRad;
      
      return slice;
    });
    
    return {
      width,
      height,
      centerX,
      centerY,
      radius,
      innerRadius: innerRadiusValue,
      slices,
    };
  };
  
  // Generate SVG path for a slice
  const generateSlicePath = (slice: NonNullable<ReturnType<typeof calculateChart>>['slices'][0], chart: NonNullable<ReturnType<typeof calculateChart>>) => {
    const { centerX, centerY, radius, innerRadius } = chart;
    
    const startX = centerX + Math.cos(slice.startAngle) * radius;
    const startY = centerY + Math.sin(slice.startAngle) * radius;
    
    const endX = centerX + Math.cos(slice.endAngle) * radius;
    const endY = centerY + Math.sin(slice.endAngle) * radius;
    
    const innerStartX = centerX + Math.cos(slice.startAngle) * innerRadius;
    const innerStartY = centerY + Math.sin(slice.startAngle) * innerRadius;
    
    const innerEndX = centerX + Math.cos(slice.endAngle) * innerRadius;
    const innerEndY = centerY + Math.sin(slice.endAngle) * innerRadius;
    
    const largeArcFlag = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;
    
    if (innerRadius === 0) {
      // Pie slice
      return `
        M ${centerX},${centerY}
        L ${startX},${startY}
        A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
        Z
      `;
    } else {
      // Donut slice
      return `
        M ${startX},${startY}
        A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
        L ${innerEndX},${innerEndY}
        A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX},${innerStartY}
        Z
      `;
    }
  };
  
  // Calculate label position
  const calculateLabelPosition = (slice: NonNullable<ReturnType<typeof calculateChart>>['slices'][0], chart: NonNullable<ReturnType<typeof calculateChart>>) => {
    const { centerX, centerY, radius, innerRadius } = chart;
    
    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    
    if (labelPosition === 'inside') {
      const labelRadius = innerRadius > 0 
        ? innerRadius + (radius - innerRadius) / 2 
        : radius / 2;
      
      return {
        x: centerX + Math.cos(midAngle) * labelRadius,
        y: centerY + Math.sin(midAngle) * labelRadius,
      };
    } else {
      // Outside label
      const labelRadius = radius * 1.1;
      const anchorPoint = {
        x: centerX + Math.cos(midAngle) * radius,
        y: centerY + Math.sin(midAngle) * radius,
      };
      const labelPoint = {
        x: centerX + Math.cos(midAngle) * labelRadius,
        y: centerY + Math.sin(midAngle) * labelRadius,
      };
      
      // Adjust text-anchor based on position
      const textAnchor = Math.cos(midAngle) > 0 ? 'start' : 'end';
      
      return {
        anchorPoint,
        labelPoint,
        textAnchor,
      };
    }
  };
  
  // Handle slice hover
  const handleSliceHover = (event: React.MouseEvent, slice: NonNullable<ReturnType<typeof calculateChart>>['slices'][0], chart: NonNullable<ReturnType<typeof calculateChart>>) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    const tooltipRadius = chart.radius * 0.7;
    
    setHoveredSlice(slice.index);
    setTooltipData({
      x: chart.centerX + Math.cos(midAngle) * tooltipRadius,
      y: chart.centerY + Math.sin(midAngle) * tooltipRadius,
      label: slice.label,
      value: slice.value,
      percentage: slice.percentage,
      color: slice.color,
    });
  };
  
  // Handle slice leave
  const handleSliceLeave = () => {
    setHoveredSlice(null);
    setTooltipData(null);
  };
  
  // Handle slice click
  const handleSliceClick = (slice: NonNullable<ReturnType<typeof calculateChart>>['slices'][0]) => {
    if (!selectable) return;
    
    setSelectedSlices(prev => {
      const newSelected = {
        ...prev,
        [slice.index]: !prev[slice.index],
      };
      
      if (onSliceSelect) {
        onSliceSelect(slice.index, newSelected[slice.index]);
      }
      
      return newSelected;
    });
  };
  
  // Handle legend item click
  const handleLegendClick = (index: number) => {
    if (!selectable) return;
    
    setSelectedSlices(prev => {
      const newSelected = {
        ...prev,
        [index]: !prev[index],
      };
      
      if (onSliceSelect) {
        onSliceSelect(index, newSelected[index]);
      }
      
      return newSelected;
    });
  };
  
  // Format tooltip content
  const formatTooltipContent = (value: number, percentage: number, label: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, percentage, label);
    }
    return `${value.toLocaleString()} (${percentage.toFixed(1)}%)`;
  };
  
  // Render chart
  const renderChart = () => {
    const chart = calculateChart();
    if (!chart) return null;
    
    const { centerX, centerY, innerRadius } = chart;
    
    const anySliceSelected = Object.values(selectedSlices).some(selected => selected);
    
    return (
      <>
        <ChartSvg ref={svgRef}>
          {/* Slices */}
          {chart.slices.map((slice, i) => {
            const isSelected = selectedSlices[slice.index];
            const isHovered = hoveredSlice === slice.index;
            const isActive = !anySliceSelected || isSelected;
            const scale = isHovered ? 1.05 : 1;
            
            return (
              <g key={`slice-${i}`}>
                <motion.path
                  d={generateSlicePath(slice, chart)}
                  fill={slice.color}
                  stroke={isHovered || isSelected ? '#fff' : 'none'}
                  strokeWidth={2}
                  opacity={isActive ? 1 : 0.3}
                  onMouseEnter={(e) => handleSliceHover(e, slice, chart)}
                  onMouseLeave={handleSliceLeave}
                  onClick={() => handleSliceClick(slice)}
                  style={{ cursor: selectable ? 'pointer' : 'default' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale, 
                    opacity: isActive ? 1 : 0.3,
                    transition: { duration: 0.3 } 
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {showLabels && labelPosition === 'inside' && slice.percentage > 5 && (
                  <SliceLabel
                    x={calculateLabelPosition(slice, chart).x}
                    y={calculateLabelPosition(slice, chart).y}
                    opacity={isActive ? 1 : 0.3}
                  >
                    {labelFormatter(slice.value, slice.percentage, slice.label)}
                  </SliceLabel>
                )}
                
                {showLabels && labelPosition === 'outside' && slice.percentage > 3 && (
                  <>
                    <LabelLine
                      d={`
                        M ${calculateLabelPosition(slice, chart).anchorPoint?.x},${calculateLabelPosition(slice, chart).anchorPoint?.y}
                        L ${calculateLabelPosition(slice, chart).labelPoint?.x},${calculateLabelPosition(slice, chart).labelPoint?.y}
                      `}
                      opacity={isActive ? 1 : 0.3}
                    />
                    <OuterLabel
                      x={(calculateLabelPosition(slice, chart).labelPoint?.x || 0) + (Math.cos(slice.startAngle) > 0 ? 5 : -5)}
                      y={calculateLabelPosition(slice, chart).labelPoint?.y}
                      textAnchor={calculateLabelPosition(slice, chart).textAnchor}
                      opacity={isActive ? 1 : 0.3}
                    >
                      {labelFormatter(slice.value, slice.percentage, slice.label)}
                    </OuterLabel>
                  </>
                )}
              </g>
            );
          })}
          
          {/* Total in center for donut charts */}
          {showTotal && innerRadius > 0 && (
            <>
              <TotalLabel
                x={centerX}
                y={centerY - 10}
              >
                {totalFormatter(total)}
              </TotalLabel>
              <TotalSubLabel
                x={centerX}
                y={centerY + 15}
              >
                Total
              </TotalSubLabel>
            </>
          )}
        </ChartSvg>
        
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
            <TooltipHeader>{tooltipData.label}</TooltipHeader>
            <TooltipContent>
              <TooltipLabel>
                <TooltipColor $color={tooltipData.color} />
                Value:
              </TooltipLabel>
              <TooltipValue>
                {formatTooltipContent(tooltipData.value, tooltipData.percentage, tooltipData.label)}
              </TooltipValue>
            </TooltipContent>
          </TooltipContainer>
        )}
        
        {/* Legend */}
        {showLegend && (
          <LegendContainer $position={legendPosition}>
            {chart.slices.map((slice, i) => {
              const isSelected = selectedSlices[slice.index];
              const isActive = !Object.values(selectedSlices).some(selected => selected) || isSelected;
              
              return (
                <LegendItem
                  key={`legend-${i}`}
                  onClick={() => handleLegendClick(slice.index)}
                  style={{ cursor: selectable ? 'pointer' : 'default' }}
                >
                  <LegendColor $color={slice.color} $active={isActive} />
                  <LegendLabel $active={isActive}>
                    {slice.label} ({slice.percentage.toFixed(1)}%)
                  </LegendLabel>
                </LegendItem>
              );
            })}
          </LegendContainer>
        )}
      </>
    );
  };
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Chart
        data={data}
        type="pie"
        {...chartProps}
      >
        {renderChart()}
      </Chart>
    </div>
  );
};

export default PieChart;
