import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface GaugeChartProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Current value
   */
  value: number;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Threshold values for color changes
   */
  thresholds?: Array<{
    value: number;
    color: string;
  }>;
  /**
   * Start angle in degrees (0 is at the bottom)
   */
  startAngle?: number;
  /**
   * End angle in degrees
   */
  endAngle?: number;
  /**
   * Thickness of the gauge arc as a percentage of the radius (0-1)
   */
  thickness?: number;
  /**
   * Whether to show the value
   */
  showValue?: boolean;
  /**
   * Custom value formatter
   */
  valueFormatter?: (value: number) => string;
  /**
   * Whether to show ticks
   */
  showTicks?: boolean;
  /**
   * Number of major ticks
   */
  majorTicks?: number;
  /**
   * Number of minor ticks between major ticks
   */
  minorTicks?: number;
  /**
   * Whether to show labels at major ticks
   */
  showTickLabels?: boolean;
  /**
   * Custom tick label formatter
   */
  tickLabelFormatter?: (value: number) => string;
  /**
   * Whether to animate on value change
   */
  animate?: boolean;
  /**
   * Animation duration in seconds
   */
  animationDuration?: number;
  /**
   * Optional label to display below the value
   */
  label?: string;
}

// Styled components
const GaugeContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GaugeSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const GaugeBackground = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[200]};
  stroke-linecap: round;
`;

const GaugeArc = styled(motion.path)<{ $color: string }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-linecap: round;
`;

const GaugeTick = styled.line<{ $isMajor: boolean }>`
  stroke: ${({ theme, $isMajor }) => $isMajor ? theme.colors.neutral[500] : theme.colors.neutral[300]};
  stroke-width: ${({ $isMajor }) => $isMajor ? 2 : 1};
`;

const GaugeTickLabel = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.neutral[600]};
  text-anchor: middle;
  dominant-baseline: middle;
`;

const GaugeValue = styled.div`
  position: absolute;
  bottom: 30%;
  font-size: 28px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[800]};
  text-align: center;
`;

const GaugeLabel = styled.div`
  position: absolute;
  bottom: 20%;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
`;

/**
 * GaugeChart component displays a single value as a gauge or speedometer,
 * with customization options and interactive features.
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  thresholds = [
    { value: 33, color: '#4caf50' }, // Green
    { value: 66, color: '#ff9800' }, // Orange
    { value: 100, color: '#f44336' } // Red
  ],
  startAngle = -90,
  endAngle = 90,
  thickness = 0.15,
  showValue = true,
  valueFormatter = (value) => value.toLocaleString(),
  showTicks = true,
  majorTicks = 5,
  minorTicks = 1,
  showTickLabels = true,
  tickLabelFormatter = (value) => value.toLocaleString(),
  animate = true,
  animationDuration = 1,
  label,
  ...chartProps
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ensure value is within range
  const normalizedValue = Math.max(min, Math.min(max, value));
  
  // Calculate gauge dimensions
  const calculateGauge = () => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate center and radius
    const centerX = width / 2;
    const centerY = height * 0.6; // Position slightly above center
    const radius = Math.min(width / 2, height * 0.8) * 0.9; // 90% of the available space
    
    // Calculate angles in radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    const angleRange = endAngleRad - startAngleRad;
    
    // Calculate value as percentage
    const valuePercentage = (normalizedValue - min) / (max - min);
    const valueAngleRad = startAngleRad + valuePercentage * angleRange;
    
    // Calculate arc paths
    const innerRadius = radius * (1 - thickness);
    
    const generateArcPath = (startAngle: number, endAngle: number) => {
      const startX = centerX + Math.cos(startAngle) * radius;
      const startY = centerY + Math.sin(startAngle) * radius;
      const endX = centerX + Math.cos(endAngle) * radius;
      const endY = centerY + Math.sin(endAngle) * radius;
      
      const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      
      return `
        M ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `;
    };
    
    // Calculate ticks
    const totalTicks = majorTicks * (minorTicks + 1) - minorTicks;
    const tickAngles = Array.from({ length: totalTicks }, (_, i) => {
      const tickPercentage = i / (totalTicks - 1);
      return startAngleRad + tickPercentage * angleRange;
    });
    
    const ticks = tickAngles.map((angle, i) => {
      const isMajor = i % (minorTicks + 1) === 0;
      const outerX = centerX + Math.cos(angle) * radius;
      const outerY = centerY + Math.sin(angle) * radius;
      const innerX = centerX + Math.cos(angle) * (radius - (isMajor ? radius * 0.1 : radius * 0.05));
      const innerY = centerY + Math.sin(angle) * (radius - (isMajor ? radius * 0.1 : radius * 0.05));
      
      // Calculate label position
      const labelRadius = radius * 1.15;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      
      // Calculate tick value
      const tickValue = min + (i / (totalTicks - 1)) * (max - min);
      
      return {
        isMajor,
        outerX,
        outerY,
        innerX,
        innerY,
        labelX,
        labelY,
        value: tickValue
      };
    });
    
    // Determine gauge color based on thresholds
    const getGaugeColor = () => {
      // Sort thresholds by value
      const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);
      
      // Find the appropriate threshold
      for (const threshold of sortedThresholds) {
        if (normalizedValue <= threshold.value) {
          return threshold.color;
        }
      }
      
      // Default to the last threshold color
      return sortedThresholds[sortedThresholds.length - 1]?.color || '#3f51b5';
    };
    
    return {
      width,
      height,
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngleRad,
      endAngleRad,
      valueAngleRad,
      backgroundPath: generateArcPath(startAngleRad, endAngleRad),
      valuePath: generateArcPath(startAngleRad, valueAngleRad),
      ticks,
      color: getGaugeColor()
    };
  };
  
  // Render gauge
  const renderGauge = () => {
    const gauge = calculateGauge();
    if (!gauge) return null;
    
    const { 
      width, height, centerX, centerY, radius, 
      backgroundPath, valuePath, ticks, color 
    } = gauge;
    
    return (
      <>
        <GaugeSvg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
          {/* Background arc */}
          <GaugeBackground
            d={backgroundPath}
            strokeWidth={radius * thickness}
          />
          
          {/* Value arc */}
          <GaugeArc
            $color={color}
            d={valuePath}
            strokeWidth={radius * thickness}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animate ? 1 : 0 }}
            transition={{ duration: animationDuration, ease: "easeOut" }}
          />
          
          {/* Ticks */}
          {showTicks && ticks.map((tick, i) => (
            <React.Fragment key={`tick-${i}`}>
              <GaugeTick
                $isMajor={tick.isMajor}
                x1={tick.innerX}
                y1={tick.innerY}
                x2={tick.outerX}
                y2={tick.outerY}
              />
              
              {showTickLabels && tick.isMajor && (
                <GaugeTickLabel
                  x={tick.labelX}
                  y={tick.labelY}
                >
                  {tickLabelFormatter(tick.value)}
                </GaugeTickLabel>
              )}
            </React.Fragment>
          ))}
        </GaugeSvg>
        
        {/* Value display */}
        {showValue && (
          <GaugeValue>
            {valueFormatter(normalizedValue)}
          </GaugeValue>
        )}
        
        {/* Label */}
        {label && (
          <GaugeLabel>
            {label}
          </GaugeLabel>
        )}
      </>
    );
  };
  
  // Convert to Chart component format
  const chartData = {
    labels: ['Value'],
    series: [{
      name: label || 'Gauge',
      data: [normalizedValue]
    }]
  };
  
  return (
    <GaugeContainer ref={containerRef}>
      <Chart
        data={chartData}
        type="gauge"
        {...chartProps}
      >
        {renderGauge()}
      </Chart>
    </GaugeContainer>
  );
};

export default GaugeChart;
