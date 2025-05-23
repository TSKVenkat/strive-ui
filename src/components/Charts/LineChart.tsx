import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Chart, ChartProps, ChartData } from './Chart';

export interface LineChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show area fill
   */
  showArea?: boolean;
  /**
   * Whether to show data points
   */
  showPoints?: boolean;
  /**
   * Whether to use curved lines
   */
  curved?: boolean;
  /**
   * Point size
   */
  pointSize?: number;
  /**
   * Line thickness
   */
  lineThickness?: number;
  /**
   * Area opacity
   */
  areaOpacity?: number;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Whether to enable zoom
   */
  enableZoom?: boolean;
  /**
   * Whether to enable pan
   */
  enablePan?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (value: number, label: string, seriesName: string) => string;
  /**
   * Y-axis min value
   */
  yAxisMin?: number;
  /**
   * Y-axis max value
   */
  yAxisMax?: number;
  /**
   * Whether to show the y-axis zero line
   */
  showYAxisZeroLine?: boolean;
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

const DataLine = styled(motion.path)<{ $color: string; $thickness: number }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: ${({ $thickness }) => $thickness}px;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const DataArea = styled(motion.path)<{ $color: string; $opacity: number }>`
  fill: ${({ $color }) => $color};
  fill-opacity: ${({ $opacity }) => $opacity};
  stroke: none;
`;

const DataPoint = styled(motion.circle)<{ $color: string; $size: number }>`
  fill: ${({ theme }) => theme.colors.common.white};
  stroke: ${({ $color }) => $color};
  stroke-width: 2;
  r: ${({ $size }) => $size}px;
  cursor: pointer;
  transition: r 0.2s ease;
  
  &:hover {
    r: ${({ $size }) => $size + 2}px;
  }
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
 * LineChart component displays data as a line chart with various
 * customization options and interactive features.
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  showArea = false,
  showPoints = true,
  curved = true,
  pointSize = 4,
  lineThickness = 2,
  areaOpacity = 0.2,
  showTooltips = true,
  enableZoom = false,
  enablePan = false,
  tooltipFormatter,
  yAxisMin,
  yAxisMax,
  showYAxisZeroLine = true,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    values: Array<{ name: string; value: number; color: string }>;
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
    
    // Find min and max values for y-axis
    let minValue = yAxisMin !== undefined ? yAxisMin : Number.MAX_VALUE;
    let maxValue = yAxisMax !== undefined ? yAxisMax : Number.MIN_VALUE;
    
    if (yAxisMin === undefined || yAxisMax === undefined) {
      data.series.forEach(series => {
        series.data.forEach(value => {
          if (value < minValue) minValue = value;
          if (value > maxValue) maxValue = value;
        });
      });
      
      // Add some padding to the min/max values
      const valuePadding = (maxValue - minValue) * 0.1;
      if (yAxisMin === undefined) minValue = Math.max(0, minValue - valuePadding);
      if (yAxisMax === undefined) maxValue = maxValue + valuePadding;
    }
    
    // Ensure min and max values are different
    if (minValue === maxValue) {
      if (minValue === 0) {
        maxValue = 1;
      } else {
        minValue = minValue * 0.9;
        maxValue = maxValue * 1.1;
      }
    }
    
    // Calculate scales
    const xScale = (index: number) => padding.left + (index / (data.labels.length - 1)) * chartWidth;
    const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    
    // Calculate grid lines
    const yAxisTicks = 5;
    const yAxisStep = (maxValue - minValue) / yAxisTicks;
    const yAxisValues = Array.from({ length: yAxisTicks + 1 }, (_, i) => minValue + i * yAxisStep);
    
    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      minValue,
      maxValue,
      xScale,
      yScale,
      yAxisValues
    };
  };
  
  // Generate path for line
  const generateLinePath = (series: ChartData['series'][0], index: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return '';
    
    const { xScale, yScale } = chart;
    
    if (curved) {
      // Generate curved line using cardinal spline
      let path = `M ${xScale(0)} ${yScale(series.data[0])}`;
      
      for (let i = 1; i < series.data.length; i++) {
        const x1 = xScale(i - 1);
        const y1 = yScale(series.data[i - 1]);
        const x2 = xScale(i);
        const y2 = yScale(series.data[i]);
        
        // Calculate control points
        const controlPointX1 = x1 + (x2 - x1) / 3;
        const controlPointX2 = x1 + 2 * (x2 - x1) / 3;
        
        path += ` C ${controlPointX1} ${y1}, ${controlPointX2} ${y2}, ${x2} ${y2}`;
      }
      
      return path;
    } else {
      // Generate straight line
      return series.data.map((value, i) => 
        `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(value)}`
      ).join(' ');
    }
  };
  
  // Generate path for area
  const generateAreaPath = (series: ChartData['series'][0], index: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return '';
    
    const { xScale, yScale, chartHeight, padding } = chart;
    const baseY = yScale(0) > padding.top + chartHeight ? padding.top + chartHeight : yScale(0);
    
    const linePath = generateLinePath(series, index, chart);
    return `${linePath} L ${xScale(series.data.length - 1)} ${baseY} L ${xScale(0)} ${baseY} Z`;
  };
  
  // Handle point hover
  const handlePointHover = (event: React.MouseEvent, seriesIndex: number, pointIndex: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return;
    
    const { xScale, yScale } = chart;
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const x = xScale(pointIndex);
    const y = yScale(data.series[seriesIndex].data[pointIndex]);
    
    setTooltipData({
      x: x,
      y: y,
      label: data.labels[pointIndex],
      values: data.series.map((series, i) => ({
        name: series.name,
        value: series.data[pointIndex],
        color: series.color || chartProps.colors?.[i % (chartProps.colors?.length || 1)] || '#000'
      }))
    });
  };
  
  // Handle point leave
  const handlePointLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip value
  const formatTooltipValue = (value: number, label: string, seriesName: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, label, seriesName);
    }
    return value.toLocaleString();
  };
  
  // Render chart
  const renderChart = () => {
    const chart = calculateChart();
    if (!chart) return null;
    
    const { width, height, padding, chartWidth, chartHeight, minValue, maxValue, xScale, yScale, yAxisValues } = chart;
    
    return (
      <>
        <ChartSvg ref={svgRef}>
          {/* Grid lines */}
          {chartProps.showGrid && (
            <>
              {/* Vertical grid lines */}
              {data.labels.map((_, i) => (
                <GridLine
                  key={`vgrid-${i}`}
                  x1={xScale(i)}
                  y1={padding.top}
                  x2={xScale(i)}
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
              {data.labels.map((label, i) => (
                <AxisLabel
                  key={`xlabel-${i}`}
                  x={xScale(i)}
                  y={padding.top + chartHeight + 20}
                >
                  {label}
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
          
          {/* Zero line */}
          {showYAxisZeroLine && minValue <= 0 && maxValue >= 0 && (
            <AxisLine
              x1={padding.left}
              y1={yScale(0)}
              x2={padding.left + chartWidth}
              y2={yScale(0)}
              style={{ strokeWidth: 2 }}
            />
          )}
          
          {/* Data */}
          {data.series.map((series, seriesIndex) => (
            <React.Fragment key={`series-${seriesIndex}`}>
              {/* Area */}
              {showArea && (
                <DataArea
                  $color={series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000'}
                  $opacity={areaOpacity}
                  d={generateAreaPath(series, seriesIndex, chart)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              
              {/* Line */}
              <DataLine
                $color={series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000'}
                $thickness={lineThickness}
                d={generateLinePath(series, seriesIndex, chart)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              
              {/* Points */}
              {showPoints && series.data.map((value, pointIndex) => (
                <DataPoint
                  key={`point-${seriesIndex}-${pointIndex}`}
                  $color={series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000'}
                  $size={pointSize}
                  cx={xScale(pointIndex)}
                  cy={yScale(value)}
                  onMouseEnter={(e) => handlePointHover(e, seriesIndex, pointIndex, chart)}
                  onMouseLeave={handlePointLeave}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + pointIndex * 0.02 }}
                />
              ))}
            </React.Fragment>
          ))}
        </ChartSvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x + 10,
              top: tooltipData.y - 10,
              transform: 'translate(-50%, -100%)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipHeader>{tooltipData.label}</TooltipHeader>
            {tooltipData.values.map((item, i) => (
              <TooltipItem key={i}>
                <TooltipColor $color={item.color} />
                <TooltipLabel>{item.name}:</TooltipLabel>
                <TooltipValue>
                  {formatTooltipValue(item.value, tooltipData.label, item.name)}
                </TooltipValue>
              </TooltipItem>
            ))}
          </TooltipContainer>
        )}
      </>
    );
  };
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Chart
        data={data}
        type="line"
        {...chartProps}
      >
        {renderChart()}
      </Chart>
    </div>
  );
};

export default LineChart;
