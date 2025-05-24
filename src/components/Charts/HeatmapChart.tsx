import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface HeatmapData {
  /**
   * X-axis labels
   */
  xLabels: string[];
  /**
   * Y-axis labels
   */
  yLabels: string[];
  /**
   * Data values as a 2D array [y][x]
   */
  values: number[][];
}

export interface HeatmapChartProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Heatmap data structure
   */
  data: HeatmapData;
  /**
   * Whether to show cell values
   */
  showValues?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (value: number, xLabel: string, yLabel: string) => string;
  /**
   * Color range for the heatmap
   */
  colorRange?: [string, string];
  /**
   * Whether to use a logarithmic scale for color mapping
   */
  logScale?: boolean;
  /**
   * Whether to show a color legend
   */
  showColorLegend?: boolean;
  /**
   * Cell padding
   */
  cellPadding?: number;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const HeatmapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const XAxisLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: hanging;
`;

const YAxisLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: end;
  dominant-baseline: middle;
`;

const HeatmapCell = styled(motion.rect)`
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CellValue = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.common.white};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const ColorLegend = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const ColorGradient = styled.div<{ $startColor: string; $endColor: string }>`
  width: 150px;
  height: 20px;
  background: linear-gradient(to right, ${({ $startColor }) => $startColor}, ${({ $endColor }) => $endColor});
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.neutral[700]};
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
 * HeatmapChart component displays data as a colored grid where each cell's color
 * represents its value, with customization options and interactive features.
 */
export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  showValues = true,
  showTooltips = true,
  tooltipFormatter,
  colorRange = ['#e0f7fa', '#006064'],
  logScale = false,
  showColorLegend = true,
  cellPadding = 1,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    value: number;
    xLabel: string;
    yLabel: string;
  } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate chart dimensions and scales
  const calculateChart = () => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate padding for labels
    const padding = {
      top: 40,
      right: 20,
      bottom: 60,
      left: 100
    };
    
    // Calculate chart area dimensions
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Calculate cell dimensions
    const cellWidth = chartWidth / data.xLabels.length;
    const cellHeight = chartHeight / data.yLabels.length;
    
    // Find min and max values
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;
    
    for (const row of data.values) {
      for (const value of row) {
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      }
    }
    
    // Ensure min and max are different
    if (minValue === maxValue) {
      if (minValue === 0) {
        maxValue = 1;
      } else {
        minValue = minValue * 0.9;
        maxValue = maxValue * 1.1;
      }
    }
    
    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      cellWidth,
      cellHeight,
      minValue,
      maxValue
    };
  };
  
  // Interpolate color based on value
  const getColorForValue = (value: number, minValue: number, maxValue: number) => {
    // Normalize value between 0 and 1
    let normalizedValue;
    
    if (logScale && minValue > 0 && maxValue > 0 && value > 0) {
      // Logarithmic scale
      const logMin = Math.log(minValue);
      const logMax = Math.log(maxValue);
      const logValue = Math.log(value);
      normalizedValue = (logValue - logMin) / (logMax - logMin);
    } else {
      // Linear scale
      normalizedValue = (value - minValue) / (maxValue - minValue);
    }
    
    // Clamp between 0 and 1
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));
    
    // Simple linear interpolation between two colors
    // In a real implementation, you'd use a proper color interpolation library
    const startColor = {
      r: parseInt(colorRange[0].slice(1, 3), 16),
      g: parseInt(colorRange[0].slice(3, 5), 16),
      b: parseInt(colorRange[0].slice(5, 7), 16)
    };
    
    const endColor = {
      r: parseInt(colorRange[1].slice(1, 3), 16),
      g: parseInt(colorRange[1].slice(3, 5), 16),
      b: parseInt(colorRange[1].slice(5, 7), 16)
    };
    
    const r = Math.round(startColor.r + normalizedValue * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + normalizedValue * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + normalizedValue * (endColor.b - startColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  // Handle cell hover
  const handleCellHover = (event: React.MouseEvent, value: number, xIndex: number, yIndex: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return;
    
    const { padding, cellWidth, cellHeight } = chart;
    
    const x = padding.left + xIndex * cellWidth + cellWidth / 2;
    const y = padding.top + yIndex * cellHeight + cellHeight / 2;
    
    setTooltipData({
      x,
      y,
      value,
      xLabel: data.xLabels[xIndex],
      yLabel: data.yLabels[yIndex]
    });
  };
  
  // Handle cell leave
  const handleCellLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (value: number, xLabel: string, yLabel: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, xLabel, yLabel);
    }
    return `Value: ${value.toLocaleString()}`;
  };
  
  // Determine text color based on background color
  const getTextColor = (backgroundColor: string) => {
    // Extract RGB components
    const r = parseInt(backgroundColor.slice(4, backgroundColor.indexOf(',')), 10);
    const g = parseInt(backgroundColor.slice(backgroundColor.indexOf(',') + 1, backgroundColor.lastIndexOf(',')), 10);
    const b = parseInt(backgroundColor.slice(backgroundColor.lastIndexOf(',') + 1, backgroundColor.indexOf(')')), 10);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Use white text for dark backgrounds, black text for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  // Render chart
  const renderHeatmap = () => {
    const chart = calculateChart();
    if (!chart) return null;
    
    const { width, height, padding, cellWidth, cellHeight, minValue, maxValue } = chart;
    
    return (
      <>
        <ChartSvg ref={svgRef}>
          {/* X-axis labels */}
          {data.xLabels.map((label, i) => (
            <XAxisLabel
              key={`xlabel-${i}`}
              x={padding.left + i * cellWidth + cellWidth / 2}
              y={height - padding.bottom + 10}
              transform={`rotate(-45, ${padding.left + i * cellWidth + cellWidth / 2}, ${height - padding.bottom + 10})`}
            >
              {label}
            </XAxisLabel>
          ))}
          
          {/* Y-axis labels */}
          {data.yLabels.map((label, i) => (
            <YAxisLabel
              key={`ylabel-${i}`}
              x={padding.left - 10}
              y={padding.top + i * cellHeight + cellHeight / 2}
            >
              {label}
            </YAxisLabel>
          ))}
          
          {/* Heatmap cells */}
          <AnimatePresence>
            {data.values.map((row, yIndex) => (
              <React.Fragment key={`row-${yIndex}`}>
                {row.map((value, xIndex) => {
                  const cellColor = getColorForValue(value, minValue, maxValue);
                  const textColor = getTextColor(cellColor);
                  
                  return (
                    <g key={`cell-${yIndex}-${xIndex}`}>
                      <HeatmapCell
                        x={padding.left + xIndex * cellWidth + cellPadding / 2}
                        y={padding.top + yIndex * cellHeight + cellPadding / 2}
                        width={cellWidth - cellPadding}
                        height={cellHeight - cellPadding}
                        fill={cellColor}
                        onMouseEnter={(e) => handleCellHover(e, value, xIndex, yIndex, chart)}
                        onMouseLeave={handleCellLeave}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: (yIndex * data.xLabels.length + xIndex) * 0.005 }}
                      />
                      
                      {showValues && cellWidth > 30 && cellHeight > 20 && (
                        <CellValue
                          x={padding.left + xIndex * cellWidth + cellWidth / 2}
                          y={padding.top + yIndex * cellHeight + cellHeight / 2}
                          fill={textColor}
                        >
                          {value.toLocaleString()}
                        </CellValue>
                      )}
                    </g>
                  );
                })}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </ChartSvg>
        
        {/* Color legend */}
        {showColorLegend && (
          <ColorLegend>
            <ColorGradient $startColor={colorRange[0]} $endColor={colorRange[1]} />
            <LegendLabels>
              <span>{minValue.toLocaleString()}</span>
              <span>{maxValue.toLocaleString()}</span>
            </LegendLabels>
          </ColorLegend>
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
            <TooltipHeader>
              {tooltipData.xLabel} × {tooltipData.yLabel}
            </TooltipHeader>
            <TooltipContent>
              {formatTooltipContent(tooltipData.value, tooltipData.xLabel, tooltipData.yLabel)}
            </TooltipContent>
          </TooltipContainer>
        )}
      </>
    );
  };
  
  // Convert data to Chart component format
  const chartData = {
    labels: data.xLabels,
    series: data.yLabels.map((label, i) => ({
      name: label,
      data: data.values[i]
    }))
  };
  
  return (
    <HeatmapContainer ref={containerRef}>
      <Chart
        data={chartData}
        type="heatmap"
        {...chartProps}
      >
        {renderHeatmap()}
      </Chart>
    </HeatmapContainer>
  );
};

export default HeatmapChart;
