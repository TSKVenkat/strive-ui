import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps, ChartData } from './Chart';

export interface BarChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to use horizontal bars
   */
  horizontal?: boolean;
  /**
   * Whether to use grouped bars
   */
  grouped?: boolean;
  /**
   * Whether to stack bars
   */
  stacked?: boolean;
  /**
   * Bar border radius
   */
  borderRadius?: number;
  /**
   * Bar padding
   */
  barPadding?: number;
  /**
   * Group padding
   */
  groupPadding?: number;
  /**
   * Whether to show data labels
   */
  showDataLabels?: boolean;
  /**
   * Data label formatter
   */
  dataLabelFormatter?: (value: number) => string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
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

const DataLabel = styled.text`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: middle;
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
 * BarChart component displays data as a bar chart with various
 * customization options and interactive features.
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  horizontal = false,
  grouped = false,
  stacked = false,
  borderRadius = 4,
  barPadding = 0.1,
  groupPadding = 0.2,
  showDataLabels = false,
  dataLabelFormatter = (value) => value.toString(),
  showTooltips = true,
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
    let minValue = yAxisMin !== undefined ? yAxisMin : 0;
    let maxValue = yAxisMax !== undefined ? yAxisMax : 0;
    
    if (yAxisMin === undefined || yAxisMax === undefined) {
      if (stacked) {
        // For stacked bars, calculate the sum of values for each category
        data.labels.forEach((_, labelIndex) => {
          let sum = 0;
          data.series.forEach(series => {
            sum += series.data[labelIndex];
          });
          if (sum > maxValue) maxValue = sum;
        });
      } else {
        // For regular or grouped bars, find the max value
        data.series.forEach(series => {
          series.data.forEach(value => {
            if (value > maxValue) maxValue = value;
            if (value < minValue) minValue = value;
          });
        });
      }
      
      // Add some padding to the max value
      maxValue = maxValue * 1.1;
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
    const getBarWidth = () => {
      const totalBars = grouped ? data.labels.length : (data.labels.length * data.series.length);
      const availableWidth = chartWidth - (totalBars * barPadding * chartWidth);
      
      if (grouped) {
        const groupCount = data.labels.length;
        const barsPerGroup = data.series.length;
        const groupWidth = availableWidth / groupCount;
        const barWidth = (groupWidth * (1 - groupPadding)) / barsPerGroup;
        return barWidth;
      }
      
      return availableWidth / totalBars;
    };
    
    const getBarX = (labelIndex: number, seriesIndex: number) => {
      if (grouped) {
        const groupCount = data.labels.length;
        const barsPerGroup = data.series.length;
        const groupWidth = chartWidth / groupCount;
        const barWidth = getBarWidth();
        const groupStart = padding.left + (labelIndex * groupWidth);
        const groupPaddingWidth = groupWidth * groupPadding / 2;
        return groupStart + groupPaddingWidth + (seriesIndex * barWidth);
      }
      
      if (stacked) {
        const groupCount = data.labels.length;
        const groupWidth = chartWidth / groupCount;
        const barWidth = getBarWidth();
        const groupStart = padding.left + (labelIndex * groupWidth);
        const groupPaddingWidth = (groupWidth - barWidth) / 2;
        return groupStart + groupPaddingWidth;
      }
      
      const totalBars = data.labels.length * data.series.length;
      const barIndex = (labelIndex * data.series.length) + seriesIndex;
      return padding.left + (barIndex * (getBarWidth() + (barPadding * chartWidth / totalBars)));
    };
    
    const getBarY = (value: number, labelIndex: number, seriesIndex: number) => {
      if (stacked && seriesIndex > 0) {
        // For stacked bars, calculate the sum of previous values
        let previousSum = 0;
        for (let i = 0; i < seriesIndex; i++) {
          previousSum += data.series[i].data[labelIndex];
        }
        const stackedValue = value + previousSum;
        return padding.top + chartHeight - ((stackedValue - minValue) / (maxValue - minValue)) * chartHeight;
      }
      
      return padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
    };
    
    const getBarHeight = (value: number) => {
      return ((value - minValue) / (maxValue - minValue)) * chartHeight;
    };
    
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
      getBarWidth,
      getBarX,
      getBarY,
      getBarHeight,
      yAxisValues
    };
  };
  
  // Handle bar hover
  const handleBarHover = (event: React.MouseEvent, labelIndex: number, seriesIndex: number, value: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const barX = chart.getBarX(labelIndex, seriesIndex);
    const barY = chart.getBarY(value, labelIndex, seriesIndex);
    
    setTooltipData({
      x: barX + chart.getBarWidth() / 2,
      y: barY,
      label: data.labels[labelIndex],
      values: [
        {
          name: data.series[seriesIndex].name,
          value,
          color: data.series[seriesIndex].color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000'
        }
      ]
    });
  };
  
  // Handle bar leave
  const handleBarLeave = () => {
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
    
    const { width, height, padding, chartWidth, chartHeight, minValue, maxValue, getBarWidth, getBarX, getBarY, getBarHeight, yAxisValues } = chart;
    
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
                  x1={padding.left + (i * (chartWidth / data.labels.length))}
                  y1={padding.top}
                  x2={padding.left + (i * (chartWidth / data.labels.length))}
                  y2={padding.top + chartHeight}
                />
              ))}
              
              {/* Horizontal grid lines */}
              {yAxisValues.map((value, i) => (
                <GridLine
                  key={`hgrid-${i}`}
                  x1={padding.left}
                  y1={padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight}
                  x2={padding.left + chartWidth}
                  y2={padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight}
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
                  x={padding.left + (i * (chartWidth / data.labels.length)) + (chartWidth / data.labels.length / 2)}
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
                  y={padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight}
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
              y1={padding.top + chartHeight - ((0 - minValue) / (maxValue - minValue)) * chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight - ((0 - minValue) / (maxValue - minValue)) * chartHeight}
              style={{ strokeWidth: 2 }}
            />
          )}
          
          {/* Bars */}
          {data.series.map((series, seriesIndex) => (
            <g key={`series-${seriesIndex}`}>
              {series.data.map((value, labelIndex) => {
                const barX = getBarX(labelIndex, seriesIndex);
                const barY = getBarY(value, labelIndex, seriesIndex);
                const barWidth = getBarWidth();
                const barHeight = getBarHeight(value);
                
                return (
                  <g key={`bar-${seriesIndex}-${labelIndex}`}>
                    <motion.rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx={borderRadius}
                      ry={borderRadius}
                      fill={series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000'}
                      onMouseEnter={(e) => handleBarHover(e, labelIndex, seriesIndex, value, chart)}
                      onMouseLeave={handleBarLeave}
                      initial={{ height: 0, y: padding.top + chartHeight }}
                      animate={{ height: barHeight, y: barY }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    
                    {showDataLabels && (
                      <DataLabel
                        x={barX + barWidth / 2}
                        y={barY - 5}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {dataLabelFormatter(value)}
                      </DataLabel>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </ChartSvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
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
        type="bar"
        {...chartProps}
      >
        {renderChart()}
      </Chart>
    </div>
  );
};

export default BarChart;
