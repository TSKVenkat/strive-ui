import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Chart, ChartProps, ChartData } from './Chart';

export interface RadarChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show area fill
   */
  showArea?: boolean;
  /**
   * Whether to show data points
   */
  showPoints?: boolean;
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
   * Custom tooltip formatter
   */
  tooltipFormatter?: (value: number, label: string, seriesName: string) => string;
  /**
   * Number of concentric circles to show
   */
  gridLevels?: number;
  /**
   * Whether to show axis labels
   */
  showAxisLabels?: boolean;
  /**
   * Whether to show values on axes
   */
  showAxisValues?: boolean;
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

const GridCircle = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
`;

const GridLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-width: 1;
`;

const AxisLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  text-anchor: middle;
  dominant-baseline: middle;
`;

const AxisValue = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.neutral[600]};
  text-anchor: middle;
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
 * RadarChart component displays multivariate data as a two-dimensional chart
 * with quantitative variables represented on axes starting from the same point.
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  showArea = true,
  showPoints = true,
  pointSize = 4,
  lineThickness = 2,
  areaOpacity = 0.2,
  showTooltips = true,
  tooltipFormatter,
  gridLevels = 5,
  showAxisLabels = true,
  showAxisValues = true,
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
    
    // Calculate center and radius
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.8; // 80% of the available space
    
    // Number of axes (categories)
    const axisCount = data.labels.length;
    
    // Calculate max value for scaling
    let maxValue = 0;
    data.series.forEach(series => {
      series.data.forEach(value => {
        if (value > maxValue) maxValue = value;
      });
    });
    
    // Ensure maxValue is not zero
    maxValue = maxValue || 1;
    
    // Calculate axis coordinates
    const axes = data.labels.map((label, i) => {
      const angle = (Math.PI * 2 * i) / axisCount - Math.PI / 2; // Start from top (- PI/2)
      return {
        label,
        angle,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    // Calculate grid levels
    const levels = Array.from({ length: gridLevels }, (_, i) => {
      const levelRadius = radius * ((i + 1) / gridLevels);
      return {
        radius: levelRadius,
        value: maxValue * ((i + 1) / gridLevels),
      };
    });
    
    // Calculate data points for each series
    const seriesPoints = data.series.map((series, seriesIndex) => {
      const points = series.data.map((value, i) => {
        const normalizedValue = value / maxValue;
        const angle = axes[i].angle;
        const distance = normalizedValue * radius;
        
        return {
          x: centerX + distance * Math.cos(angle),
          y: centerY + distance * Math.sin(angle),
          value,
          label: data.labels[i],
          angle,
          normalizedValue,
        };
      });
      
      return {
        name: series.name,
        color: series.color || chartProps.colors?.[seriesIndex % (chartProps.colors?.length || 1)] || '#000',
        points,
      };
    });
    
    return {
      width,
      height,
      centerX,
      centerY,
      radius,
      maxValue,
      axes,
      levels,
      seriesPoints,
    };
  };
  
    // Generate path for data line
  const generateLinePath = (points: NonNullable<ReturnType<typeof calculateChart>>['seriesPoints'][0]['points']) => {
    return points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z'; // Close the path
  };

  // Generate path for data area
  const generateAreaPath = (points: NonNullable<ReturnType<typeof calculateChart>>['seriesPoints'][0]['points']) => {
    return generateLinePath(points);
  };
  
  // Handle point hover
  const handlePointHover = (event: React.MouseEvent, seriesIndex: number, pointIndex: number, chart: ReturnType<typeof calculateChart>) => {
    if (!chart) return;
    
    const point = chart.seriesPoints[seriesIndex].points[pointIndex];
    
    setTooltipData({
      x: point.x,
      y: point.y,
      label: point.label,
      values: chart.seriesPoints.map(series => ({
        name: series.name,
        value: series.points[pointIndex].value,
        color: series.color,
      })),
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
    
    const { width, height, centerX, centerY, radius, maxValue, axes, levels, seriesPoints } = chart;
    
    return (
      <>
        <ChartSvg ref={svgRef}>
          {/* Grid circles */}
          {levels.map((level, i) => (
            <GridCircle
              key={`circle-${i}`}
              cx={centerX}
              cy={centerY}
              r={level.radius}
            />
          ))}
          
          {/* Grid lines (axes) */}
          {axes.map((axis, i) => (
            <GridLine
              key={`axis-${i}`}
              x1={centerX}
              y1={centerY}
              x2={axis.x}
              y2={axis.y}
            />
          ))}
          
          {/* Axis labels */}
          {showAxisLabels && axes.map((axis, i) => {
            // Position label slightly outside the chart
            const labelDistance = radius * 1.1;
            const x = centerX + labelDistance * Math.cos(axis.angle);
            const y = centerY + labelDistance * Math.sin(axis.angle);
            
            return (
              <AxisLabel
                key={`label-${i}`}
                x={x}
                y={y}
              >
                {axis.label}
              </AxisLabel>
            );
          })}
          
          {/* Axis values */}
          {showAxisValues && levels.map((level, levelIndex) => {
            // Only show values on the first axis
            if (axes.length > 0) {
              const valueAngle = axes[0].angle;
              const valueDistance = level.radius;
              const x = centerX + valueDistance * Math.cos(valueAngle) * 0.9; // Slightly inward
              const y = centerY + valueDistance * Math.sin(valueAngle) * 0.9;
              
              return (
                <AxisValue
                  key={`value-${levelIndex}`}
                  x={x}
                  y={y}
                >
                  {level.value.toLocaleString()}
                </AxisValue>
              );
            }
            return null;
          })}
          
          {/* Data */}
          {seriesPoints.map((series, seriesIndex) => (
            <React.Fragment key={`series-${seriesIndex}`}>
              {/* Area */}
              {showArea && (
                <DataArea
                  $color={series.color}
                  $opacity={areaOpacity}
                  d={generateAreaPath(series.points)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              
              {/* Line */}
              <DataLine
                $color={series.color}
                $thickness={lineThickness}
                d={generateLinePath(series.points)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              
              {/* Points */}
              {showPoints && series.points.map((point, pointIndex) => (
                <DataPoint
                  key={`point-${seriesIndex}-${pointIndex}`}
                  $color={series.color}
                  $size={pointSize}
                  cx={point.x}
                  cy={point.y}
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
              transform: 'translate(0, -100%)'
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
        type="radar"
        {...chartProps}
      >
        {renderChart()}
      </Chart>
    </div>
  );
};

export default RadarChart;
