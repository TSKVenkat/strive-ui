import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface ComparativeDataSeries {
  /**
   * Name of the data series
   */
  name: string;
  /**
   * Data values
   */
  data: number[];
  /**
   * Optional color for the series
   */
  color?: string;
}

export interface ComparativeChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Labels for the x-axis
   */
  labels: string[];
  /**
   * Data series to compare
   */
  series: ComparativeDataSeries[];
  /**
   * Comparison mode
   */
  mode?: 'side-by-side' | 'overlay' | 'stacked' | 'percentage';
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  /**
   * Whether to show difference indicators
   */
  showDifference?: boolean;
  /**
   * Whether to show percentage change
   */
  showPercentageChange?: boolean;
  /**
   * Custom value formatter
   */
  valueFormatter?: (value: number) => string;
  /**
   * Custom percentage formatter
   */
  percentageFormatter?: (value: number) => string;
}

const ChartContainer = styled.div`
  width: 100%;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Bar = styled(motion.rect)`
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Line = styled(motion.path)`
  fill: none;
  stroke-width: 2;
`;

const Point = styled(motion.circle)`
  cursor: pointer;
  stroke: white;
  stroke-width: 2;
  
  &:hover {
    r: 6;
  }
`;

const DifferenceRect = styled(motion.rect)<{ $positive: boolean }>`
  fill: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.main : theme.colors.error.main};
  opacity: 0.2;
`;

const DifferenceLine = styled(motion.line)<{ $positive: boolean }>`
  stroke: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.main : theme.colors.error.main};
  stroke-width: 1;
  stroke-dasharray: 3, 3;
`;

const DifferenceLabel = styled.text<{ $positive: boolean }>`
  font-size: 10px;
  fill: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.main : theme.colors.error.main};
  text-anchor: middle;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

const TooltipValue = styled.span<{ $positive?: boolean; $negative?: boolean }>`
  color: ${({ theme, $positive, $negative }) => 
    $positive ? theme.colors.success.main : 
    $negative ? theme.colors.error.main : 
    theme.colors.neutral[800]};
`;

/**
 * ComparativeChart component for comparing multiple data series with features
 * like synchronized axes, difference highlighting, and percentage change visualization.
 */
export const ComparativeChart: React.FC<ComparativeChartProps> = ({
  labels,
  series,
  mode = 'side-by-side',
  showTooltips = true,
  showLegend = true,
  showGrid = true,
  showDifference = true,
  showPercentageChange = true,
  valueFormatter = (value) => value.toLocaleString(),
  percentageFormatter = (value) => `${value.toFixed(1)}%`,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    values: { name: string; value: number; color: string }[];
    differences?: { value: number; percentage: number }[];
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
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
    
    // Find min and max values across all series
    let minValue = 0;
    let maxValue = 0;
    
    if (mode === 'stacked') {
      // For stacked mode, calculate sum of values at each index
      for (let i = 0; i < labels.length; i++) {
        const sum = series.reduce((acc, s) => acc + (s.data[i] || 0), 0);
        maxValue = Math.max(maxValue, sum);
      }
    } else if (mode === 'percentage') {
      // For percentage mode, the range is always 0-100
      maxValue = 100;
    } else {
      // For side-by-side and overlay modes
      series.forEach(s => {
        s.data.forEach(value => {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        });
      });
    }
    
    // Add padding to value range
    const valueRange = maxValue - minValue;
    const valuePadding = valueRange * 0.1;
    const yMin = Math.min(0, minValue - valuePadding);
    const yMax = maxValue + valuePadding;
    
    // X scale
    const xScale = (index: number) => {
      const availableWidth = width - padding * 2;
      
      if (mode === 'side-by-side') {
        const groupWidth = availableWidth / labels.length;
        const barWidth = groupWidth * 0.8 / series.length;
        return padding + index * groupWidth + groupWidth * 0.1;
      } else {
        const barWidth = availableWidth / labels.length * 0.8;
        return padding + index * (availableWidth / labels.length) + (availableWidth / labels.length) * 0.1;
      }
    };
    
    // Y scale
    const yScale = (value: number) => {
      return height - padding - ((value - yMin) / (yMax - yMin)) * (height - padding * 2);
    };
    
    // Bar width
    const getBarWidth = () => {
      const availableWidth = width - padding * 2;
      
      if (mode === 'side-by-side') {
        const groupWidth = availableWidth / labels.length;
        return groupWidth * 0.8 / series.length;
      } else {
        return availableWidth / labels.length * 0.8;
      }
    };
    
    return { xScale, yScale, yMin, yMax, getBarWidth };
  };
  
  // Generate grid lines
  const generateGridLines = () => {
    if (!showGrid) return [];
    
    const { width, height, padding } = calculateChartDimensions();
    const { yMin, yMax } = calculateScales();
    
    const gridLines: { y: number; value: number }[] = [];
    const step = (yMax - yMin) / 5;
    
    for (let i = 0; i <= 5; i++) {
      const value = yMin + i * step;
      const y = height - padding - ((value - yMin) / (yMax - yMin)) * (height - padding * 2);
      
      gridLines.push({ y, value });
    }
    
    return gridLines;
  };
  
  // Calculate differences between series
  const calculateDifferences = () => {
    if (series.length < 2 || !showDifference) return null;
    
    const differences = [];
    
    for (let i = 0; i < labels.length; i++) {
      const value1 = series[0].data[i] || 0;
      const value2 = series[1].data[i] || 0;
      const diff = value2 - value1;
      const percentage = value1 !== 0 ? (diff / Math.abs(value1)) * 100 : 0;
      
      differences.push({ value: diff, percentage });
    }
    
    return differences;
  };
  
  // Handle bar or point hover
  const handleElementHover = (event: React.MouseEvent, index: number) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const values = series.map((s, i) => ({
      name: s.name,
      value: s.data[index] || 0,
      color: s.color || chartProps.colors?.[i % (chartProps.colors?.length || 1)] || '#3f51b5'
    }));
    
    const differences = calculateDifferences();
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      label: labels[index],
      values,
      differences: differences ? [differences[index]] : undefined
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Render comparative chart
  const renderComparativeChart = () => {
    const { width, height, padding } = calculateChartDimensions();
    const { xScale, yScale, getBarWidth } = calculateScales();
    const gridLines = generateGridLines();
    const differences = calculateDifferences();
    
    return (
      <ChartContainer ref={containerRef}>
        <ChartSvg ref={svgRef} width="100%" height="100%">
          {/* Grid lines */}
          {gridLines.map((line, index) => (
            <GridLine
              key={`grid-${index}`}
              x1={padding}
              y1={line.y}
              x2={width - padding}
              y2={line.y}
            />
          ))}
          
          {/* X axis */}
          <AxisLine
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
          />
          
          {/* Y axis */}
          <AxisLine
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
          />
          
          {/* X axis labels */}
          {labels.map((label, index) => (
            <AxisLabel
              key={`x-label-${index}`}
              x={xScale(index) + getBarWidth() * (mode === 'side-by-side' ? series.length / 2 : 0.5)}
              y={height - padding + 15}
            >
              {label}
            </AxisLabel>
          ))}
          
          {/* Y axis labels */}
          {gridLines.map((line, index) => (
            <YAxisLabel
              key={`y-label-${index}`}
              x={padding - 10}
              y={line.y}
            >
              {valueFormatter(line.value)}
            </YAxisLabel>
          ))}
          
          {/* Render data series based on mode */}
          {mode === 'side-by-side' && (
            <g>
              {series.map((s, seriesIndex) => {
                const color = s.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#3f51b5';
                const barWidth = getBarWidth();
                
                return (
                  <g key={`series-${seriesIndex}`}>
                    {s.data.map((value, index) => {
                      const x = xScale(index) + seriesIndex * barWidth;
                      const y = yScale(Math.max(0, value));
                      const height = Math.abs(yScale(0) - yScale(value));
                      
                      return (
                        <Bar
                          key={`bar-${seriesIndex}-${index}`}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill={color}
                          onMouseEnter={(e) => handleElementHover(e, index)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, y: yScale(0), height: 0 }}
                          animate={{ opacity: 1, y, height }}
                          exit={{ opacity: 0, y: yScale(0), height: 0 }}
                          transition={{ duration: 0.5, delay: seriesIndex * 0.1 }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}
          
          {mode === 'overlay' && (
            <g>
              {series.map((s, seriesIndex) => {
                const color = s.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#3f51b5';
                
                // Generate path for line
                let path = '';
                s.data.forEach((value, index) => {
                  const x = xScale(index) + getBarWidth() / 2;
                  const y = yScale(value);
                  
                  if (index === 0) {
                    path += `M ${x} ${y}`;
                  } else {
                    path += ` L ${x} ${y}`;
                  }
                });
                
                return (
                  <g key={`series-${seriesIndex}`}>
                    <Line
                      d={path}
                      stroke={color}
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ duration: 0.5, delay: seriesIndex * 0.1 }}
                    />
                    
                    {s.data.map((value, index) => {
                      const x = xScale(index) + getBarWidth() / 2;
                      const y = yScale(value);
                      
                      return (
                        <Point
                          key={`point-${seriesIndex}-${index}`}
                          cx={x}
                          cy={y}
                          r={4}
                          fill={color}
                          onMouseEnter={(e) => handleElementHover(e, index)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.3, delay: seriesIndex * 0.1 + index * 0.02 }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}
          
          {mode === 'stacked' && (
            <g>
              {labels.map((label, labelIndex) => {
                let accumulatedValue = 0;
                
                return (
                  <g key={`stack-${labelIndex}`}>
                    {series.map((s, seriesIndex) => {
                      const color = s.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#3f51b5';
                      const value = s.data[labelIndex] || 0;
                      const barWidth = getBarWidth();
                      const x = xScale(labelIndex);
                      const y = yScale(accumulatedValue + value);
                      const height = yScale(accumulatedValue) - yScale(accumulatedValue + value);
                      
                      const result = (
                        <Bar
                          key={`bar-${seriesIndex}-${labelIndex}`}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill={color}
                          onMouseEnter={(e) => handleElementHover(e, labelIndex)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, y: yScale(accumulatedValue), height: 0 }}
                          animate={{ opacity: 1, y, height }}
                          exit={{ opacity: 0, y: yScale(accumulatedValue), height: 0 }}
                          transition={{ duration: 0.5, delay: seriesIndex * 0.1 }}
                        />
                      );
                      
                      accumulatedValue += value;
                      return result;
                    })}
                  </g>
                );
              })}
            </g>
          )}
          
          {mode === 'percentage' && (
            <g>
              {labels.map((label, labelIndex) => {
                const total = series.reduce((sum, s) => sum + (s.data[labelIndex] || 0), 0);
                let accumulatedPercentage = 0;
                
                return (
                  <g key={`percentage-${labelIndex}`}>
                    {series.map((s, seriesIndex) => {
                      const color = s.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#3f51b5';
                      const value = s.data[labelIndex] || 0;
                      const percentage = total > 0 ? (value / total) * 100 : 0;
                      const barWidth = getBarWidth();
                      const x = xScale(labelIndex);
                      const y = yScale(accumulatedPercentage + percentage);
                      const height = yScale(accumulatedPercentage) - yScale(accumulatedPercentage + percentage);
                      
                      const result = (
                        <Bar
                          key={`bar-${seriesIndex}-${labelIndex}`}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill={color}
                          onMouseEnter={(e) => handleElementHover(e, labelIndex)}
                          onMouseLeave={handleMouseLeave}
                          initial={{ opacity: 0, y: yScale(accumulatedPercentage), height: 0 }}
                          animate={{ opacity: 1, y, height }}
                          exit={{ opacity: 0, y: yScale(accumulatedPercentage), height: 0 }}
                          transition={{ duration: 0.5, delay: seriesIndex * 0.1 }}
                        />
                      );
                      
                      accumulatedPercentage += percentage;
                      return result;
                    })}
                  </g>
                );
              })}
            </g>
          )}
          
          {/* Difference indicators */}
          {differences && mode === 'side-by-side' && (
            <g>
              {differences.map((diff, index) => {
                const barWidth = getBarWidth();
                const x1 = xScale(index) + barWidth / 2;
                const x2 = xScale(index) + barWidth * 1.5;
                const y1 = yScale(series[0].data[index] || 0);
                const y2 = yScale(series[1].data[index] || 0);
                const isPositive = diff.value >= 0;
                
                return (
                  <g key={`diff-${index}`}>
                    <DifferenceLine
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      $positive={isPositive}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    />
                    
                    {showPercentageChange && (
                      <DifferenceLabel
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 10}
                        $positive={isPositive}
                      >
                        {isPositive ? '+' : ''}{percentageFormatter(diff.percentage)}
                      </DifferenceLabel>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </ChartSvg>
        
        {/* Legend */}
        {showLegend && (
          <Legend>
            {series.map((s, index) => {
              const color = s.color || chartProps.colors?.[index % (chartProps.colors?.length || 1)] || '#3f51b5';
              
              return (
                <LegendItem key={`legend-${index}`}>
                  <LegendColor $color={color} />
                  {s.name}
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
            <TooltipHeader>{tooltipData.label}</TooltipHeader>
            <TooltipContent>
              {tooltipData.values.map((value, index) => (
                <TooltipRow key={`value-${index}`}>
                  <TooltipLabel>{value.name}:</TooltipLabel>
                  <TooltipValue>{valueFormatter(value.value)}</TooltipValue>
                </TooltipRow>
              ))}
              
              {tooltipData.differences && tooltipData.differences.length > 0 && (
                <>
                  <TooltipRow>
                    <TooltipLabel>Difference:</TooltipLabel>
                    <TooltipValue
                      $positive={tooltipData.differences[0].value > 0}
                      $negative={tooltipData.differences[0].value < 0}
                    >
                      {tooltipData.differences[0].value > 0 ? '+' : ''}
                      {valueFormatter(tooltipData.differences[0].value)}
                    </TooltipValue>
                  </TooltipRow>
                  
                  {showPercentageChange && (
                    <TooltipRow>
                      <TooltipLabel>Change:</TooltipLabel>
                      <TooltipValue
                        $positive={tooltipData.differences[0].percentage > 0}
                        $negative={tooltipData.differences[0].percentage < 0}
                      >
                        {tooltipData.differences[0].percentage > 0 ? '+' : ''}
                        {percentageFormatter(tooltipData.differences[0].percentage)}
                      </TooltipValue>
                    </TooltipRow>
                  )}
                </>
              )}
            </TooltipContent>
          </TooltipContainer>
        )}
      </ChartContainer>
    );
  };
  
  return (
    <Chart
      data={{ labels, series: series.map(s => ({ name: s.name, data: s.data })) }}
      type="comparative"
      {...chartProps}
    >
      {renderComparativeChart()}
    </Chart>
  );
};

export default ComparativeChart;
