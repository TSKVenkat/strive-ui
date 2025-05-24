import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface WaterfallDataPoint {
  /**
   * Label for the data point
   */
  label: string;
  /**
   * Value for the data point
   */
  value: number;
  /**
   * Whether this is a summary column
   */
  isSummary?: boolean;
  /**
   * Optional custom color for this data point
   */
  color?: string;
}

export interface WaterfallChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show connecting lines between bars
   */
  showConnectors?: boolean;
  /**
   * Whether to show value labels on bars
   */
  showValues?: boolean;
  /**
   * Custom value formatter
   */
  valueFormatter?: (value: number) => string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (dataPoint: WaterfallDataPoint, runningTotal: number) => React.ReactNode;
  /**
   * Color for positive values
   */
  positiveColor?: string;
  /**
   * Color for negative values
   */
  negativeColor?: string;
  /**
   * Color for summary values
   */
  summaryColor?: string;
  /**
   * Color for connectors
   */
  connectorColor?: string;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const WaterfallContainer = styled.div`
  width: 100%;
  height: 100%;
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

const Connector = styled(motion.line)`
  stroke-dasharray: 3, 3;
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

const ValueLabel = styled.text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
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

const TooltipValue = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-top: 4px;
`;

/**
 * WaterfallChart component visualizes how an initial value is affected by a series of
 * positive or negative values, with optional summary columns and customization options.
 */
export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  showConnectors = true,
  showValues = true,
  valueFormatter = (value) => value.toLocaleString(),
  showTooltips = true,
  tooltipFormatter,
  positiveColor,
  negativeColor,
  summaryColor,
  connectorColor,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    dataPoint: WaterfallDataPoint;
    runningTotal: number;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Extract waterfall data from chart data
  const waterfallData: WaterfallDataPoint[] = data.series[0].data.map((value, index) => {
    if (typeof value === 'object' && 'label' in value && 'value' in value) {
      return value as WaterfallDataPoint;
    }
    
    // If data is not in the expected format, create a default data point
    return {
      label: data.labels[index] || `Item ${index + 1}`,
      value: typeof value === 'number' ? value : 0
    };
  });
  
  // Calculate running totals for each data point
  const calculateRunningTotals = () => {
    const totals: number[] = [];
    let runningTotal = 0;
    
    waterfallData.forEach((dataPoint, index) => {
      if (index === 0 || dataPoint.isSummary) {
        // First item or summary item sets the running total
        runningTotal = dataPoint.value;
      } else {
        // Other items add to the running total
        runningTotal += dataPoint.value;
      }
      
      totals.push(runningTotal);
    });
    
    return totals;
  };
  
  const runningTotals = calculateRunningTotals();
  
  // Calculate chart dimensions
  const calculateChartDimensions = () => {
    if (!svgRef.current) return { width: 0, height: 0, padding: 0 };
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    const padding = 40; // Padding for axes and labels
    
    return { width: svgWidth, height: svgHeight, padding };
  };
  
  // Calculate scales for x and y axes
  const calculateScales = () => {
    const { width, height, padding } = calculateChartDimensions();
    
    // X scale
    const xScale = (index: number) => {
      const availableWidth = width - padding * 2;
      const barWidth = availableWidth / waterfallData.length;
      return padding + index * barWidth + barWidth / 2;
    };
    
    // Calculate min and max values for y scale
    const allValues = [...runningTotals, 0]; // Include 0 to ensure the scale includes the origin
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Add some padding to the min and max values
    const yPadding = (maxValue - minValue) * 0.1;
    const yMin = minValue - yPadding;
    const yMax = maxValue + yPadding;
    
    // Y scale
    const yScale = (value: number) => {
      const availableHeight = height - padding * 2;
      return height - padding - ((value - yMin) / (yMax - yMin)) * availableHeight;
    };
    
    // Bar width
    const barWidth = (width - padding * 2) / waterfallData.length * 0.8; // 80% of available space
    
    return { xScale, yScale, yMin, yMax, barWidth };
  };
  
  // Generate bars for the waterfall chart
  const generateBars = () => {
    const { xScale, yScale, barWidth } = calculateScales();
    
    const bars: {
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      dataPoint: WaterfallDataPoint;
      runningTotal: number;
    }[] = [];
    
    waterfallData.forEach((dataPoint, index) => {
      const x = xScale(index) - barWidth / 2;
      
      let y: number;
      let height: number;
      let color: string;
      
      if (index === 0 || dataPoint.isSummary) {
        // First item or summary item
        y = yScale(Math.max(0, dataPoint.value));
        height = Math.abs(yScale(0) - yScale(dataPoint.value));
        color = dataPoint.color || summaryColor || chartProps.colors?.[2] || '#9c27b0';
      } else {
        // Regular item
        const startValue = runningTotals[index] - dataPoint.value;
        const endValue = runningTotals[index];
        
        if (dataPoint.value >= 0) {
          // Positive value
          y = yScale(endValue);
          height = yScale(startValue) - yScale(endValue);
          color = dataPoint.color || positiveColor || chartProps.colors?.[0] || '#4caf50';
        } else {
          // Negative value
          y = yScale(startValue);
          height = yScale(endValue) - yScale(startValue);
          color = dataPoint.color || negativeColor || chartProps.colors?.[1] || '#f44336';
        }
      }
      
      bars.push({
        id: `bar-${index}`,
        x,
        y,
        width: barWidth,
        height,
        color,
        dataPoint,
        runningTotal: runningTotals[index]
      });
    });
    
    return bars;
  };
  
  // Generate connectors between bars
  const generateConnectors = () => {
    const { xScale, yScale } = calculateScales();
    const { barWidth } = calculateScales();
    
    const connectors: {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[] = [];
    
    waterfallData.forEach((dataPoint, index) => {
      if (index === 0 || dataPoint.isSummary || index === waterfallData.length - 1) {
        // Skip first, last, and summary items
        return;
      }
      
      const prevTotal = runningTotals[index - 1];
      const currentTotal = runningTotals[index];
      
      const x1 = xScale(index - 1) + barWidth / 2;
      const y1 = yScale(prevTotal);
      const x2 = xScale(index) - barWidth / 2;
      const y2 = yScale(prevTotal);
      
      connectors.push({
        id: `connector-${index}`,
        x1,
        y1,
        x2,
        y2
      });
    });
    
    return connectors;
  };
  
  // Generate grid lines
  const generateGridLines = () => {
    const { width, height, padding } = calculateChartDimensions();
    const { yScale, yMin, yMax } = calculateScales();
    
    const gridLines: {
      id: string;
      y: number;
      value: number;
    }[] = [];
    
    // Calculate step size for grid lines
    const range = yMax - yMin;
    const targetSteps = 5;
    const rawStep = range / targetSteps;
    
    // Round step to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalizedStep = rawStep / magnitude;
    
    let step: number;
    if (normalizedStep < 1.5) {
      step = magnitude;
    } else if (normalizedStep < 3) {
      step = 2 * magnitude;
    } else if (normalizedStep < 7) {
      step = 5 * magnitude;
    } else {
      step = 10 * magnitude;
    }
    
    // Generate grid lines
    const firstLine = Math.ceil(yMin / step) * step;
    
    for (let value = firstLine; value <= yMax; value += step) {
      const y = yScale(value);
      
      gridLines.push({
        id: `grid-${value}`,
        y,
        value
      });
    }
    
    return gridLines;
  };
  
  // Handle bar hover
  const handleBarHover = (event: React.MouseEvent, bar: { dataPoint: WaterfallDataPoint; runningTotal: number }) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      dataPoint: bar.dataPoint,
      runningTotal: bar.runningTotal
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (dataPoint: WaterfallDataPoint, runningTotal: number) => {
    if (tooltipFormatter) {
      return tooltipFormatter(dataPoint, runningTotal);
    }
    
    return (
      <>
        <TooltipHeader>{dataPoint.label}</TooltipHeader>
        <TooltipContent>
          {dataPoint.isSummary ? 'Total' : 'Value'}: {valueFormatter(dataPoint.value)}
        </TooltipContent>
        {!dataPoint.isSummary && (
          <TooltipValue>
            Running Total: {valueFormatter(runningTotal)}
          </TooltipValue>
        )}
      </>
    );
  };
  
  // Render waterfall chart
  const renderWaterfallChart = () => {
    const { width, height, padding } = calculateChartDimensions();
    const { xScale, yScale } = calculateScales();
    
    const bars = generateBars();
    const connectors = showConnectors ? generateConnectors() : [];
    const gridLines = generateGridLines();
    
    return (
      <WaterfallContainer ref={containerRef}>
        <ChartSvg ref={svgRef} width="100%" height="100%">
          {/* Grid lines */}
          {gridLines.map(line => (
            <g key={line.id}>
              <GridLine
                x1={padding}
                y1={line.y}
                x2={width - padding}
                y2={line.y}
              />
              <AxisLabel
                x={padding - 10}
                y={line.y}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {valueFormatter(line.value)}
              </AxisLabel>
            </g>
          ))}
          
          {/* X axis */}
          <AxisLine
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
          />
          
          {/* X axis labels */}
          {waterfallData.map((dataPoint, index) => (
            <AxisLabel
              key={`x-label-${index}`}
              x={xScale(index)}
              y={height - padding + 15}
            >
              {dataPoint.label}
            </AxisLabel>
          ))}
          
          {/* Connectors */}
          <AnimatePresence>
            {connectors.map(connector => (
              <Connector
                key={connector.id}
                x1={connector.x1}
                y1={connector.y1}
                x2={connector.x2}
                y2={connector.y2}
                stroke={connectorColor || '#666'}
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </AnimatePresence>
          
          {/* Bars */}
          <AnimatePresence>
            {bars.map((bar, index) => (
              <g key={bar.id}>
                <Bar
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={bar.color}
                  onMouseEnter={(e) => handleBarHover(e, bar)}
                  onMouseLeave={handleMouseLeave}
                  initial={{ opacity: 0, y: yScale(0), height: 0 }}
                  animate={{ opacity: 1, y: bar.y, height: bar.height }}
                  exit={{ opacity: 0, y: yScale(0), height: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
                
                {/* Value labels */}
                {showValues && (
                  <ValueLabel
                    x={bar.x + bar.width / 2}
                    y={bar.y + (bar.dataPoint.value >= 0 ? bar.height / 2 + 5 : -5)}
                    dominantBaseline={bar.dataPoint.value >= 0 ? 'middle' : 'auto'}
                  >
                    {valueFormatter(bar.dataPoint.value)}
                  </ValueLabel>
                )}
              </g>
            ))}
          </AnimatePresence>
        </ChartSvg>
        
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
            {formatTooltipContent(tooltipData.dataPoint, tooltipData.runningTotal)}
          </TooltipContainer>
        )}
      </WaterfallContainer>
    );
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on window resize
      setTooltipData(null);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Chart
      data={data}
      type="waterfall"
      {...chartProps}
    >
      {renderWaterfallChart()}
    </Chart>
  );
};

export default WaterfallChart;
