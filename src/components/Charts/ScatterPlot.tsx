import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Chart, ChartProps, ChartData } from './Chart';

export interface ScatterPlotProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Point size range [min, max] for bubble sizing
   */
  pointSizeRange?: [number, number];
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (x: number, y: number, size: number, label: string, seriesName: string) => string;
  /**
   * Whether to show trend line
   */
  showTrendLine?: boolean;
  /**
   * X-axis min value
   */
  xAxisMin?: number;
  /**
   * X-axis max value
   */
  xAxisMax?: number;
  /**
   * Y-axis min value
   */
  yAxisMin?: number;
  /**
   * Y-axis max value
   */
  yAxisMax?: number;
}

// Styled components
const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const GridLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
  stroke-dasharray: 4;
`;

const AxisLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[300]};
  stroke-width: 1;
`;

const AxisLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[600]};
  text-anchor: middle;
`;

const YAxisLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[600]};
  text-anchor: end;
  dominant-baseline: middle;
`;

const DataPoint = styled(motion.circle)<{ $color: string }>`
  fill: ${({ $color }) => $color};
  fill-opacity: 0.7;
  stroke: ${({ $color }) => $color};
  stroke-width: 1;
  cursor: pointer;
  transition: r 0.2s ease, fill-opacity 0.2s ease;
  
  &:hover {
    fill-opacity: 1;
  }
`;

const TrendLine = styled(motion.line)<{ $color: string }>`
  stroke: ${({ $color }) => $color};
  stroke-width: 2;
  stroke-dasharray: 4;
  opacity: 0.6;
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

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
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
`;

const TooltipValue = styled.span`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-left: auto;
`;

/**
 * ScatterPlot component displays data as points on a two-dimensional chart,
 * with customization options and interactive features.
 */
export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  pointSizeRange = [4, 20],
  showTooltips = true,
  tooltipFormatter,
  showTrendLine = false,
  xAxisMin,
  xAxisMax,
  yAxisMin,
  yAxisMax,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    pointX: number;
    pointY: number;
    pointSize: number;
    label: string;
    seriesName: string;
    color: string;
  } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate chart dimensions and scales
  const calculateChart = () => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const container = containerRef.current;
    
    // Get SVG dimensions
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate padding
    const padding = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60
    };
    
    // Calculate chart area dimensions
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find min and max values for x-axis and y-axis
    let minX = xAxisMin !== undefined ? xAxisMin : Number.MAX_VALUE;
    let maxX = xAxisMax !== undefined ? xAxisMax : Number.MIN_VALUE;
    let minY = yAxisMin !== undefined ? yAxisMin : Number.MAX_VALUE;
    let maxY = yAxisMax !== undefined ? yAxisMax : Number.MIN_VALUE;
    let maxSize = Number.MIN_VALUE;
    
    // Prepare scatter data
    const scatterData = data.series.flatMap((series, seriesIndex) => {
      return series.data.map((value, valueIndex) => {
        // For scatter plots, we expect data to be [x, y, size?]
        const x = Array.isArray(value) ? value[0] : valueIndex;
        const y = Array.isArray(value) ? value[1] : value;
        const size = Array.isArray(value) && value.length > 2 ? value[2] : 1;
        
        if (xAxisMin === undefined && x < minX) minX = x;
        if (xAxisMax === undefined && x > maxX) maxX = x;
        if (yAxisMin === undefined && y < minY) minY = y;
        if (yAxisMax === undefined && y > maxY) maxY = y;
        if (size > maxSize) maxSize = size;
        
        return {
          x,
          y,
          size,
          label: data.labels[valueIndex] || '',
          seriesName: series.name,
          color: series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000',
          seriesIndex,
          valueIndex,
        };
      });
    });
    
    // Add some padding to the min/max values
    const xPadding = (maxX - minX) * 0.1;
    const yPadding = (maxY - minY) * 0.1;
    
    if (xAxisMin === undefined) minX = minX - xPadding;
    if (xAxisMax === undefined) maxX = maxX + xPadding;
    if (yAxisMin === undefined) minY = minY - yPadding;
    if (yAxisMax === undefined) maxY = maxY + yPadding;
    
    // Ensure min and max values are different
    if (minX === maxX) {
      minX = minX - 1;
      maxX = maxX + 1;
    }
    if (minY === maxY) {
      minY = minY - 1;
      maxY = maxY + 1;
    }
    
    // Calculate scales
    const xScale = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * chartWidth;
    const yScale = (y: number) => padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;
    const sizeScale = (size: number) => {
      const normalizedSize = (size / maxSize);
      return pointSizeRange[0] + normalizedSize * (pointSizeRange[1] - pointSizeRange[0]);
    };
    
    // Calculate grid lines
    const xAxisTicks = 5;
    const yAxisTicks = 5;
    const xAxisStep = (maxX - minX) / xAxisTicks;
    const yAxisStep = (maxY - minY) / yAxisTicks;
    const xAxisValues = Array.from({ length: xAxisTicks + 1 }, (_, i) => minX + i * xAxisStep);
    const yAxisValues = Array.from({ length: yAxisTicks + 1 }, (_, i) => minY + i * yAxisStep);
    
    // Calculate trend line if needed
    let trendLine = null;
    if (showTrendLine && scatterData.length > 1) {
      // Simple linear regression
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      const n = scatterData.length;
      
      scatterData.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
      });
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const x1 = minX;
      const y1 = slope * x1 + intercept;
      const x2 = maxX;
      const y2 = slope * x2 + intercept;
      
      trendLine = {
        x1: xScale(x1),
        y1: yScale(y1),
        x2: xScale(x2),
        y2: yScale(y2)
      };
    }
    
    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      minX,
      maxX,
      minY,
      maxY,
      xScale,
      yScale,
      sizeScale,
      xAxisValues,
      yAxisValues,
      scatterData,
      trendLine
    };
  };
  
  // Handle point hover
  const handlePointHover = (event: React.MouseEvent, point: ReturnType<typeof calculateChart>['scatterData'][0], chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return;
    
    const { xScale, yScale } = chart;
    
    setTooltipData({
      x: xScale(point.x),
      y: yScale(point.y),
      pointX: point.x,
      pointY: point.y,
      pointSize: point.size,
      label: point.label,
      seriesName: point.seriesName,
      color: point.color
    });
  };
  
  // Handle point leave
  const handlePointLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (x: number, y: number, size: number, label: string, seriesName: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(x, y, size, label, seriesName);
    }
    return `X: ${x.toLocaleString()}, Y: ${y.toLocaleString()}${size > 1 ? `, Size: ${size.toLocaleString()}` : ''}`;
  };
  
  // Render chart
  const renderChart = () => {
    const chart = calculateChart();
    if (!chart) return null;
    
    const { 
      width, height, padding, chartWidth, chartHeight, 
      xScale, yScale, sizeScale, 
      xAxisValues, yAxisValues, 
      scatterData, trendLine 
    } = chart;
    
    return (
      <>
        <ChartSvg ref={svgRef}>
          {/* Grid lines */}
          {chartProps.showGrid && (
            <>
              {/* Vertical grid lines */}
              {xAxisValues.map((value, i) => (
                <GridLine
                  key={`vgrid-${i}`}
                  x1={xScale(value)}
                  y1={padding.top}
                  x2={xScale(value)}
                  y2={padding.top + chartHeight}
                />
              ))}
              
              {/* Horizontal grid lines */}
              {yAxisValues.map((value, i) => (
                <GridLine
                  key={`hgrid-${i}`}
                  x1={padding.left}
                  y1={yScale(value)}
                  x2={padding.left + chartWidth}
                  y2={yScale(value)}
                />
              ))}
            </>
          )}
          
          {/* Axes */}
          {chartProps.showXAxis && (
            <>
              {/* X-axis line */}
              <AxisLine
                x1={padding.left}
                y1={padding.top + chartHeight}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight}
              />
              
              {/* X-axis labels */}
              {xAxisValues.map((value, i) => (
                <AxisLabel
                  key={`xlabel-${i}`}
                  x={xScale(value)}
                  y={padding.top + chartHeight + 20}
                >
                  {value.toLocaleString()}
                </AxisLabel>
              ))}
            </>
          )}
          
          {chartProps.showYAxis && (
            <>
              {/* Y-axis line */}
              <AxisLine
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + chartHeight}
              />
              
              {/* Y-axis labels */}
              {yAxisValues.map((value, i) => (
                <YAxisLabel
                  key={`ylabel-${i}`}
                  x={padding.left - 10}
                  y={yScale(value)}
                >
                  {value.toLocaleString()}
                </YAxisLabel>
              ))}
            </>
          )}
          
          {/* Trend line */}
          {showTrendLine && trendLine && (
            <TrendLine
              $color="#666"
              x1={trendLine.x1}
              y1={trendLine.y1}
              x2={trendLine.x2}
              y2={trendLine.y2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          )}
          
          {/* Data points */}
          {scatterData.map((point, i) => (
            <DataPoint
              key={`point-${i}`}
              $color={point.color}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={sizeScale(point.size)}
              onMouseEnter={(e) => handlePointHover(e, point, chart)}
              onMouseLeave={handlePointLeave}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.01 }}
            />
          ))}
        </ChartSvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
              top: tooltipData.y,
              transform: 'translate(10px, -50%)'
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipHeader>
              {tooltipData.label || tooltipData.seriesName}
            </TooltipHeader>
            <TooltipItem>
              <TooltipColor $color={tooltipData.color} />
              <TooltipLabel>Value:</TooltipLabel>
              <TooltipValue>
                {formatTooltipContent(
                  tooltipData.pointX, 
                  tooltipData.pointY, 
                  tooltipData.pointSize,
                  tooltipData.label,
                  tooltipData.seriesName
                )}
              </TooltipValue>
            </TooltipItem>
          </TooltipContainer>
        )}
      </>
    );
  };
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Chart
        data={data}
        type="scatter"
        {...chartProps}
      >
        {renderChart()}
      </Chart>
    </div>
  );
};

export default ScatterPlot;
