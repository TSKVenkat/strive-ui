import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface BoxPlotDataPoint {
  /**
   * Label for the box plot
   */
  label: string;
  /**
   * Minimum value
   */
  min: number;
  /**
   * First quartile (25th percentile)
   */
  q1: number;
  /**
   * Median (50th percentile)
   */
  median: number;
  /**
   * Third quartile (75th percentile)
   */
  q3: number;
  /**
   * Maximum value
   */
  max: number;
  /**
   * Optional outliers
   */
  outliers?: number[];
  /**
   * Optional custom color
   */
  color?: string;
}

export interface BoxPlotChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (dataPoint: BoxPlotDataPoint) => React.ReactNode;
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  /**
   * Whether to show outliers
   */
  showOutliers?: boolean;
  /**
   * Whether to show notches for confidence intervals
   */
  showNotches?: boolean;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
  /**
   * Custom value formatter
   */
  valueFormatter?: (value: number) => string;
  /**
   * Box width as a ratio of available space (0-1)
   */
  boxWidthRatio?: number;
}

// Styled components
const BoxPlotContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const BoxPlot = styled(motion.g)`
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const BoxRect = styled(motion.rect)`
  stroke-width: 1;
`;

const MedianLine = styled(motion.line)`
  stroke-width: 2;
`;

const WhiskerLine = styled(motion.line)`
  stroke-width: 1;
`;

const WhiskerCap = styled(motion.line)`
  stroke-width: 1;
`;

const Outlier = styled(motion.circle)`
  stroke-width: 1;
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

const TooltipContainer = styled(motion.div)`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  pointer-events: none;
  z-index: 10;
  min-width: 150px;
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
 * BoxPlotChart component visualizes statistical data distribution with quartiles,
 * medians, and outliers.
 */
export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  data,
  showTooltips = true,
  tooltipFormatter,
  showGrid = true,
  showOutliers = true,
  showNotches = false,
  animateOnDataChange = true,
  valueFormatter = (value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  boxWidthRatio = 0.6,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    dataPoint: BoxPlotDataPoint;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Extract box plot data from chart data
  const boxPlotData: BoxPlotDataPoint[] = data.series[0].data.map((value, index) => {
    if (typeof value === 'object' && 'min' in value && 'q1' in value && 'median' in value && 'q3' in value && 'max' in value) {
      return {
        label: data.labels[index] || `Item ${index + 1}`,
        ...value as BoxPlotDataPoint
      };
    }
    
    // If data is not in the expected format, create a default data point
    return {
      label: data.labels[index] || `Item ${index + 1}`,
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0
    };
  });
  
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
    
    // X scale
    const xScale = (index: number) => {
      const availableWidth = width - padding * 2;
      const barSpacing = availableWidth / boxPlotData.length;
      return padding + index * barSpacing + barSpacing / 2;
    };
    
    // Calculate min and max values for y scale
    const allValues: number[] = [];
    
    boxPlotData.forEach(d => {
      allValues.push(d.min, d.q1, d.median, d.q3, d.max);
      if (d.outliers) {
        allValues.push(...d.outliers);
      }
    });
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Add some padding to the min and max values
    const valuePadding = (maxValue - minValue) * 0.1;
    const yMin = minValue - valuePadding;
    const yMax = maxValue + valuePadding;
    
    // Y scale
    const yScale = (value: number) => {
      const availableHeight = height - padding * 2;
      return height - padding - ((value - yMin) / (yMax - yMin)) * availableHeight;
    };
    
    // Box width
    const boxWidth = (width - padding * 2) / boxPlotData.length * boxWidthRatio;
    
    return { xScale, yScale, yMin, yMax, boxWidth };
  };
  
  // Generate box plots
  const generateBoxPlots = () => {
    const { xScale, yScale, boxWidth } = calculateScales();
    
    const boxPlots = boxPlotData.map((dataPoint, index) => {
      const x = xScale(index);
      const minY = yScale(dataPoint.min);
      const q1Y = yScale(dataPoint.q1);
      const medianY = yScale(dataPoint.median);
      const q3Y = yScale(dataPoint.q3);
      const maxY = yScale(dataPoint.max);
      
      // Calculate IQR (Interquartile Range) for notches
      const iqr = dataPoint.q3 - dataPoint.q1;
      const notchWidth = showNotches ? boxWidth * 0.3 : 0;
      
      // Calculate notch positions
      const notchMedian = dataPoint.median;
      const notchLower = notchMedian - 1.57 * iqr / Math.sqrt(boxPlotData.length);
      const notchUpper = notchMedian + 1.57 * iqr / Math.sqrt(boxPlotData.length);
      
      const notchLowerY = yScale(notchLower);
      const notchUpperY = yScale(notchUpper);
      
      // Get color
      const color = dataPoint.color || chartProps.colors?.[index % (chartProps.colors?.length || 1)] || '#3f51b5';
      
      return {
        id: `boxplot-${index}`,
        x,
        minY,
        q1Y,
        medianY,
        q3Y,
        maxY,
        notchLowerY,
        notchUpperY,
        boxWidth,
        notchWidth,
        color,
        dataPoint
      };
    });
    
    return boxPlots;
  };
  
  // Generate grid lines
  const generateGridLines = () => {
    if (!showGrid) return [];
    
    const { width, padding } = calculateChartDimensions();
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
  
  // Handle box plot hover
  const handleBoxPlotHover = (event: React.MouseEvent, boxPlot: { dataPoint: BoxPlotDataPoint; x: number }) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      dataPoint: boxPlot.dataPoint
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (dataPoint: BoxPlotDataPoint) => {
    if (tooltipFormatter) {
      return tooltipFormatter(dataPoint);
    }
    
    return (
      <>
        <TooltipHeader>{dataPoint.label}</TooltipHeader>
        <TooltipContent>
          <TooltipRow>
            <TooltipLabel>Minimum:</TooltipLabel>
            <TooltipValue>{valueFormatter(dataPoint.min)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Q1 (25%):</TooltipLabel>
            <TooltipValue>{valueFormatter(dataPoint.q1)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Median:</TooltipLabel>
            <TooltipValue>{valueFormatter(dataPoint.median)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Q3 (75%):</TooltipLabel>
            <TooltipValue>{valueFormatter(dataPoint.q3)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Maximum:</TooltipLabel>
            <TooltipValue>{valueFormatter(dataPoint.max)}</TooltipValue>
          </TooltipRow>
          {dataPoint.outliers && dataPoint.outliers.length > 0 && (
            <TooltipRow>
              <TooltipLabel>Outliers:</TooltipLabel>
              <TooltipValue>
                {dataPoint.outliers.map(o => valueFormatter(o)).join(', ')}
              </TooltipValue>
            </TooltipRow>
          )}
        </TooltipContent>
      </>
    );
  };
  
  // Render box plot chart
  const renderBoxPlotChart = () => {
    const { width, height, padding } = calculateChartDimensions();
    const { xScale } = calculateScales();
    
    const boxPlots = generateBoxPlots();
    const gridLines = generateGridLines();
    
    return (
      <BoxPlotContainer ref={containerRef}>
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
          
          {/* Y axis */}
          <AxisLine
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
          />
          
          {/* X axis labels */}
          {boxPlotData.map((dataPoint, index) => (
            <AxisLabel
              key={`x-label-${index}`}
              x={xScale(index)}
              y={height - padding + 15}
            >
              {dataPoint.label}
            </AxisLabel>
          ))}
          
          {/* Box plots */}
          <AnimatePresence>
            {boxPlots.map((boxPlot, index) => (
              <BoxPlot
                key={boxPlot.id}
                onMouseEnter={(e) => handleBoxPlotHover(e, boxPlot)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Box */}
                <BoxRect
                  x={boxPlot.x - boxPlot.boxWidth / 2}
                  y={boxPlot.q3Y}
                  width={boxPlot.boxWidth}
                  height={boxPlot.q1Y - boxPlot.q3Y}
                  fill={boxPlot.color}
                  fillOpacity={0.3}
                  stroke={boxPlot.color}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ transformOrigin: `${boxPlot.x}px ${(boxPlot.q1Y + boxPlot.q3Y) / 2}px` }}
                />
                
                {/* Median line */}
                <MedianLine
                  x1={boxPlot.x - boxPlot.boxWidth / 2}
                  y1={boxPlot.medianY}
                  x2={boxPlot.x + boxPlot.boxWidth / 2}
                  y2={boxPlot.medianY}
                  stroke={boxPlot.color}
                  strokeOpacity={0.8}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                />
                
                {/* Upper whisker */}
                <WhiskerLine
                  x1={boxPlot.x}
                  y1={boxPlot.q3Y}
                  x2={boxPlot.x}
                  y2={boxPlot.maxY}
                  stroke={boxPlot.color}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                />
                
                {/* Upper whisker cap */}
                <WhiskerCap
                  x1={boxPlot.x - boxPlot.boxWidth / 4}
                  y1={boxPlot.maxY}
                  x2={boxPlot.x + boxPlot.boxWidth / 4}
                  y2={boxPlot.maxY}
                  stroke={boxPlot.color}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.4 }}
                />
                
                {/* Lower whisker */}
                <WhiskerLine
                  x1={boxPlot.x}
                  y1={boxPlot.q1Y}
                  x2={boxPlot.x}
                  y2={boxPlot.minY}
                  stroke={boxPlot.color}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                />
                
                {/* Lower whisker cap */}
                <WhiskerCap
                  x1={boxPlot.x - boxPlot.boxWidth / 4}
                  y1={boxPlot.minY}
                  x2={boxPlot.x + boxPlot.boxWidth / 4}
                  y2={boxPlot.minY}
                  stroke={boxPlot.color}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.4 }}
                />
                
                {/* Outliers */}
                {showOutliers && boxPlot.dataPoint.outliers && boxPlot.dataPoint.outliers.map((outlier, i) => {
                  const outlierY = calculateScales().yScale(outlier);
                  
                  return (
                    <Outlier
                      key={`outlier-${i}`}
                      cx={boxPlot.x}
                      cy={outlierY}
                      r={3}
                      fill="white"
                      stroke={boxPlot.color}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.5 + i * 0.02 }}
                    />
                  );
                })}
              </BoxPlot>
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
            {formatTooltipContent(tooltipData.dataPoint)}
          </TooltipContainer>
        )}
      </BoxPlotContainer>
    );
  };
  
  return (
    <Chart
      data={data}
      type="boxPlot"
      {...chartProps}
    >
      {renderBoxPlotChart()}
    </Chart>
  );
};

export default BoxPlotChart;
