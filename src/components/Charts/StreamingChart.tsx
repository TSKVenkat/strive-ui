import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface StreamingDataPoint {
  /**
   * Timestamp for the data point
   */
  timestamp: number;
  /**
   * Value for the data point
   */
  value: number;
}

export interface StreamingSeries {
  /**
   * Name of the data series
   */
  name: string;
  /**
   * Data points in the series
   */
  data: StreamingDataPoint[];
  /**
   * Color for the series
   */
  color?: string;
}

export interface StreamingChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Series data for the chart
   */
  series: StreamingSeries[];
  /**
   * Width of the chart container
   */
  width?: number | string;
  /**
   * Height of the chart container
   */
  height?: number | string;
  /**
   * Maximum number of data points to display
   */
  maxPoints?: number;
  /**
   * Time window to display in milliseconds
   */
  timeWindow?: number;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (point: StreamingDataPoint, seriesName: string) => React.ReactNode;
  /**
   * Whether to show the x-axis
   */
  showXAxis?: boolean;
  /**
   * Whether to show the y-axis
   */
  showYAxis?: boolean;
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  /**
   * Whether to show a legend
   */
  showLegend?: boolean;
  /**
   * Whether to animate new data points
   */
  animate?: boolean;
  /**
   * Whether to auto-scale the y-axis
   */
  autoScale?: boolean;
  /**
   * Fixed y-axis range [min, max]
   */
  yRange?: [number, number];
  /**
   * Custom formatter for y-axis values
   */
  yFormatter?: (value: number) => string;
  /**
   * Custom formatter for x-axis timestamps
   */
  xFormatter?: (timestamp: number) => string;
  /**
   * Chart type ('line', 'area', 'bar')
   */
  chartType?: 'line' | 'area' | 'bar';
  /**
   * Line style ('solid', 'dashed', 'dotted')
   */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  /**
   * Line width in pixels
   */
  lineWidth?: number;
  /**
   * Whether to show data points
   */
  showPoints?: boolean;
  /**
   * Whether to connect data gaps with lines
   */
  connectNulls?: boolean;
  /**
   * Whether to update in real-time
   */
  realtime?: boolean;
  /**
   * Update interval in milliseconds
   */
  updateInterval?: number;
  /**
   * Callback to fetch new data
   */
  fetchData?: () => Promise<StreamingDataPoint[]>;
}

const ChartContainer = styled.div<{ $width: number | string; $height: number | string }>`
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Path = styled(motion.path)<{ $lineStyle: 'solid' | 'dashed' | 'dotted' }>`
  fill: none;
  stroke-width: 2;
  stroke-dasharray: ${({ $lineStyle }) => 
    $lineStyle === 'dashed' ? '5,5' : 
    $lineStyle === 'dotted' ? '2,2' : 
    'none'};
`;

const AreaPath = styled(motion.path)`
  opacity: 0.2;
`;

const Bar = styled(motion.rect)`
  opacity: 0.8;
`;

const Point = styled(motion.circle)`
  stroke-width: 2;
  stroke: ${({ theme }) => theme.colors.common.white};
  cursor: pointer;
  
  &:hover {
    r: 5;
  }
`;

const AxisLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[300]};
  stroke-width: 1;
`;

const GridLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
  stroke-dasharray: 2, 2;
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

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${({ $color }) => $color};
  border-radius: 2px;
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
 * StreamingChart component for visualizing real-time or streaming data
 * with automatic updates and time-based windowing.
 */
export const StreamingChart: React.FC<StreamingChartProps> = ({
  series,
  width = '100%',
  height = 300,
  maxPoints = 100,
  timeWindow = 60000, // 1 minute
  showTooltips = true,
  tooltipFormatter,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  showLegend = true,
  animate = true,
  autoScale = true,
  yRange,
  yFormatter = (value) => value.toLocaleString(),
  xFormatter = (timestamp) => new Date(timestamp).toLocaleTimeString(),
  chartType = 'line',
  lineStyle = 'solid',
  lineWidth = 2,
  showPoints = true,
  connectNulls = true,
  realtime = true,
  updateInterval = 1000,
  fetchData,
  ...chartProps
}) => {
  const [seriesData, setSeriesData] = useState<StreamingSeries[]>(series);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    point: StreamingDataPoint;
    seriesName: string;
    seriesColor: string;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Update data with new points
  useEffect(() => {
    if (!realtime || !fetchData) return;
    
    const updateData = async () => {
      try {
        const newPoints = await fetchData();
        
        setSeriesData(prevSeries => {
          return prevSeries.map(series => {
            // Add new points to the series
            const newData = [...series.data, ...newPoints];
            
            // Apply time window filter
            const now = Date.now();
            const filteredData = newData.filter(
              point => now - point.timestamp <= timeWindow
            );
            
            // Limit number of points
            const limitedData = filteredData.slice(-maxPoints);
            
            return {
              ...series,
              data: limitedData
            };
          });
        });
      } catch (error) {
        console.error('Error fetching streaming data:', error);
      }
    };
    
    const intervalId = setInterval(updateData, updateInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [realtime, fetchData, updateInterval, timeWindow, maxPoints]);
  
  // Calculate chart dimensions
  const calculateChartDimensions = () => {
    if (!svgRef.current) return { width: 0, height: 0, padding: 0 };
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    const padding = 40; // Padding for axes and labels
    
    return { width: svgWidth, height: svgHeight, padding };
  };
  
  // Calculate scales for axes
  const calculateScales = () => {
    const { width, height, padding } = calculateChartDimensions();
    
    // Find min and max timestamps across all series
    let minTimestamp = Infinity;
    let maxTimestamp = -Infinity;
    
    // Find min and max values across all series
    let minValue = Infinity;
    let maxValue = -Infinity;
    
    seriesData.forEach(series => {
      series.data.forEach(point => {
        minTimestamp = Math.min(minTimestamp, point.timestamp);
        maxTimestamp = Math.max(maxTimestamp, point.timestamp);
        minValue = Math.min(minValue, point.value);
        maxValue = Math.max(maxValue, point.value);
      });
    });
    
    // If no data, use defaults
    if (minTimestamp === Infinity) {
      const now = Date.now();
      minTimestamp = now - timeWindow;
      maxTimestamp = now;
    }
    
    if (minValue === Infinity) {
      minValue = 0;
      maxValue = 100;
    }
    
    // Add padding to value range
    const valueRange = maxValue - minValue;
    const valuePadding = valueRange * 0.1;
    let yMin = minValue - valuePadding;
    let yMax = maxValue + valuePadding;
    
    // Use fixed y-range if provided
    if (yRange) {
      [yMin, yMax] = yRange;
    }
    
    // Ensure min and max are different
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    
    // X scale (time)
    const xScale = (timestamp: number) => {
      return padding + ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * (width - padding * 2);
    };
    
    // Y scale (value)
    const yScale = (value: number) => {
      return height - padding - ((value - yMin) / (yMax - yMin)) * (height - padding * 2);
    };
    
    return { xScale, yScale, minTimestamp, maxTimestamp, yMin, yMax };
  };
  
  // Generate path for a series
  const generatePath = (series: StreamingSeries) => {
    const { xScale, yScale } = calculateScales();
    
    if (series.data.length === 0) return '';
    
    let path = '';
    
    series.data.forEach((point, index) => {
      const x = xScale(point.timestamp);
      const y = yScale(point.value);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };
  
  // Generate area path for a series
  const generateAreaPath = (series: StreamingSeries) => {
    const { xScale, yScale } = calculateScales();
    const { height, padding } = calculateChartDimensions();
    
    if (series.data.length === 0) return '';
    
    let path = '';
    const baselineY = height - padding;
    
    // Start at the baseline
    path += `M ${xScale(series.data[0].timestamp)} ${baselineY}`;
    
    // Draw line to the first point
    path += ` L ${xScale(series.data[0].timestamp)} ${yScale(series.data[0].value)}`;
    
    // Draw lines between all points
    series.data.forEach((point, index) => {
      if (index > 0) {
        path += ` L ${xScale(point.timestamp)} ${yScale(point.value)}`;
      }
    });
    
    // Draw line back to the baseline
    path += ` L ${xScale(series.data[series.data.length - 1].timestamp)} ${baselineY}`;
    
    // Close the path
    path += ' Z';
    
    return path;
  };
  
  // Generate grid lines
  const generateGridLines = () => {
    if (!showGrid) return { xGridLines: [], yGridLines: [] };
    
    const { width, height, padding } = calculateChartDimensions();
    const { yMin, yMax, minTimestamp, maxTimestamp } = calculateScales();
    
    // Y grid lines
    const yGridLines: { y: number; value: number }[] = [];
    const yStep = (yMax - yMin) / 5;
    
    for (let i = 0; i <= 5; i++) {
      const value = yMin + i * yStep;
      const y = height - padding - ((value - yMin) / (yMax - yMin)) * (height - padding * 2);
      
      yGridLines.push({ y, value });
    }
    
    // X grid lines (time)
    const xGridLines: { x: number; timestamp: number }[] = [];
    const timeRange = maxTimestamp - minTimestamp;
    const timeStep = timeRange / 5;
    
    for (let i = 0; i <= 5; i++) {
      const timestamp = minTimestamp + i * timeStep;
      const x = padding + (i / 5) * (width - padding * 2);
      
      xGridLines.push({ x, timestamp });
    }
    
    return { xGridLines, yGridLines };
  };
  
  // Handle point hover
  const handlePointHover = (event: React.MouseEvent, point: StreamingDataPoint, seriesName: string, seriesColor: string) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      point,
      seriesName,
      seriesColor
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (point: StreamingDataPoint, seriesName: string, seriesColor: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(point, seriesName);
    }
    
    return (
      <>
        <TooltipHeader>{seriesName}</TooltipHeader>
        <TooltipContent>
          <TooltipRow>
            <TooltipLabel>Time:</TooltipLabel>
            <TooltipValue>{xFormatter(point.timestamp)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Value:</TooltipLabel>
            <TooltipValue>{yFormatter(point.value)}</TooltipValue>
          </TooltipRow>
        </TooltipContent>
      </>
    );
  };
  
  // Render streaming chart
  const renderStreamingChart = () => {
    const { width, height, padding } = calculateChartDimensions();
    const { xGridLines, yGridLines } = generateGridLines();
    
    return (
      <ChartContainer ref={containerRef} $width={width} $height={height}>
        <ChartSvg ref={svgRef} width="100%" height="100%">
          {/* Grid lines */}
          {showGrid && (
            <g>
              {/* X grid lines */}
              {xGridLines.map((line, index) => (
                <GridLine
                  key={`x-grid-${index}`}
                  x1={line.x}
                  y1={padding}
                  x2={line.x}
                  y2={height - padding}
                />
              ))}
              
              {/* Y grid lines */}
              {yGridLines.map((line, index) => (
                <GridLine
                  key={`y-grid-${index}`}
                  x1={padding}
                  y1={line.y}
                  x2={width - padding}
                  y2={line.y}
                />
              ))}
            </g>
          )}
          
          {/* X axis */}
          {showXAxis && (
            <g>
              <AxisLine
                x1={padding}
                y1={height - padding}
                x2={width - padding}
                y2={height - padding}
              />
              
              {/* X axis labels */}
              {xGridLines.map((line, index) => (
                <AxisLabel
                  key={`x-label-${index}`}
                  x={line.x}
                  y={height - padding + 15}
                >
                  {xFormatter(line.timestamp)}
                </AxisLabel>
              ))}
            </g>
          )}
          
          {/* Y axis */}
          {showYAxis && (
            <g>
              <AxisLine
                x1={padding}
                y1={padding}
                x2={padding}
                y2={height - padding}
              />
              
              {/* Y axis labels */}
              {yGridLines.map((line, index) => (
                <YAxisLabel
                  key={`y-label-${index}`}
                  x={padding - 10}
                  y={line.y}
                >
                  {yFormatter(line.value)}
                </YAxisLabel>
              ))}
            </g>
          )}
          
          {/* Data series */}
          <g>
            {seriesData.map((series, seriesIndex) => {
              const color = series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#3f51b5';
              
              if (chartType === 'area') {
                return (
                  <g key={`series-${seriesIndex}`}>
                    {/* Area */}
                    <AreaPath
                      d={generateAreaPath(series)}
                      fill={color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Line */}
                    <Path
                      d={generatePath(series)}
                      stroke={color}
                      strokeWidth={lineWidth}
                      $lineStyle={lineStyle}
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Points */}
                    {showPoints && series.data.map((point, pointIndex) => {
                      const { xScale, yScale } = calculateScales();
                      const x = xScale(point.timestamp);
                      const y = yScale(point.value);
                      
                      return (
                        <Point
                          key={`point-${seriesIndex}-${pointIndex}`}
                          cx={x}
                          cy={y}
                          r={3}
                          fill={color}
                          onMouseEnter={(e) => handlePointHover(e, point, series.name, color)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })}
                  </g>
                );
              } else if (chartType === 'bar') {
                const { xScale, yScale } = calculateScales();
                const { width, padding } = calculateChartDimensions();
                const barWidth = Math.max(2, (width - padding * 2) / maxPoints * 0.8);
                
                return (
                  <g key={`series-${seriesIndex}`}>
                    {series.data.map((point, pointIndex) => {
                      const x = xScale(point.timestamp) - barWidth / 2;
                      const y = yScale(point.value);
                      const height = yScale(0) - y;
                      
                      return (
                        <Bar
                          key={`bar-${seriesIndex}-${pointIndex}`}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill={color}
                          onMouseEnter={(e) => handlePointHover(e, point, series.name, color)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 0.8, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ transformOrigin: `${x + barWidth / 2}px ${yScale(0)}px` }}
                        />
                      );
                    })}
                  </g>
                );
              } else {
                // Default: line chart
                return (
                  <g key={`series-${seriesIndex}`}>
                    {/* Line */}
                    <Path
                      d={generatePath(series)}
                      stroke={color}
                      strokeWidth={lineWidth}
                      $lineStyle={lineStyle}
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Points */}
                    {showPoints && series.data.map((point, pointIndex) => {
                      const { xScale, yScale } = calculateScales();
                      const x = xScale(point.timestamp);
                      const y = yScale(point.value);
                      
                      return (
                        <Point
                          key={`point-${seriesIndex}-${pointIndex}`}
                          cx={x}
                          cy={y}
                          r={3}
                          fill={color}
                          onMouseEnter={(e) => handlePointHover(e, point, series.name, color)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })}
                  </g>
                );
              }
            })}
          </g>
        </ChartSvg>
        
        {/* Legend */}
        {showLegend && (
          <Legend>
            {seriesData.map((series, index) => {
              const color = series.color || chartProps.colors?.[index % (chartProps.colors?.length || 1)] || '#3f51b5';
              
              return (
                <LegendItem key={`legend-${index}`}>
                  <LegendColor $color={color} />
                  {series.name}
                </LegendItem>
              );
            })}
          </Legend>
        )}
        
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
            {formatTooltipContent(tooltipData.point, tooltipData.seriesName, tooltipData.seriesColor)}
          </TooltipContainer>
        )}
      </ChartContainer>
    );
  };
  
    // Convert to Chart component format for compatibility
  const chartData = {
    labels: seriesData[0]?.data.map(d => xFormatter(d.timestamp)) || [],
    series: seriesData.map(s => ({
      name: s.name,
      data: s.data.map(d => d.value)
    }))
  };

  // Separate data from chartProps to avoid overwrite
  const { data: _, ...restChartProps } = chartProps;

  return (
    <Chart
      data={chartData}
      type="streaming"
      {...restChartProps}
    >
      {renderStreamingChart()}
    </Chart>
  );
};

export default StreamingChart;
