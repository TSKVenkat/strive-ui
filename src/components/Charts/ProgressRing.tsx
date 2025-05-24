import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface ProgressRingProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
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
   * Ring thickness as a percentage of the radius (0-1)
   */
  thickness?: number;
  /**
   * Whether to show the value
   */
  showValue?: boolean;
  /**
   * Custom value formatter
   */
  valueFormatter?: (value: number, percentage: number) => string;
  /**
   * Whether to animate on value change
   */
  animate?: boolean;
  /**
   * Animation duration in seconds
   */
  animationDuration?: number;
  /**
   * Ring color
   */
  color?: string;
  /**
   * Background ring color
   */
  backgroundColor?: string;
  /**
   * Optional label to display below the value
   */
  label?: string;
  /**
   * Whether to round the ends of the progress arc
   */
  roundedEnds?: boolean;
  /**
   * Whether to show a gradient color
   */
  showGradient?: boolean;
  /**
   * Gradient start color (only used if showGradient is true)
   */
  gradientStartColor?: string;
  /**
   * Gradient end color (only used if showGradient is true)
   */
  gradientEndColor?: string;
  /**
   * Whether to show a shadow
   */
  showShadow?: boolean;
  /**
   * Whether to show a pulse animation when value changes
   */
  showPulse?: boolean;
}

// Styled components
const RingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RingSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Start from top */
`;

const RingBackground = styled.circle<{ $thickness: number }>`
  fill: none;
  stroke-width: ${({ $thickness }) => $thickness}px;
`;

const RingProgress = styled(motion.circle)<{ 
  $thickness: number; 
  $roundedEnds: boolean;
  $showShadow: boolean;
}>`
  fill: none;
  stroke-width: ${({ $thickness }) => $thickness}px;
  stroke-linecap: ${({ $roundedEnds }) => $roundedEnds ? 'round' : 'butt'};
  ${({ $showShadow, theme }) => $showShadow && `
    filter: drop-shadow(0 0 3px ${theme.colors.primary.main});
  `}
`;

const ValueContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[800]};
  text-align: center;
`;

const Label = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
  margin-top: 4px;
`;

const PulseCircle = styled(motion.circle)`
  fill: none;
  stroke-width: 1px;
`;

/**
 * ProgressRing component displays a circular progress indicator,
 * with customization options and interactive features.
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  min = 0,
  max = 100,
  thickness = 0.1,
  showValue = true,
  valueFormatter = (value, percentage) => `${percentage}%`,
  animate = true,
  animationDuration = 1,
  color,
  backgroundColor,
  label,
  roundedEnds = true,
  showGradient = false,
  gradientStartColor,
  gradientEndColor,
  showShadow = false,
  showPulse = false,
  ...chartProps
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect value changes for pulse animation
  useEffect(() => {
    if (value !== prevValue && showPulse) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevValue(value);
  }, [value, prevValue, showPulse]);
  
  // Ensure value is within range
  const normalizedValue = Math.max(min, Math.min(max, value));
  
  // Calculate percentage
  const percentage = Math.round(((normalizedValue - min) / (max - min)) * 100);
  
  // Calculate ring dimensions
  const calculateRing = () => {
    if (!svgRef.current || !containerRef.current) return null;
    
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    
    // Calculate center and radius
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.8; // 80% of the available space
    
    // Calculate stroke width based on thickness
    const strokeWidth = radius * thickness;
    
    // Calculate circumference
    const circumference = 2 * Math.PI * radius;
    
    // Calculate stroke dash offset based on percentage
    const dashOffset = circumference * (1 - percentage / 100);
    
    return {
      width,
      height,
      centerX,
      centerY,
      radius,
      strokeWidth,
      circumference,
      dashOffset
    };
  };
  
  // Get theme-aware colors
  const getColors = () => {
    // These would normally come from the theme
    const themeColors = {
      primary: '#3f51b5',
      background: '#e0e0e0'
    };
    
    return {
      ringColor: color || chartProps.colors?.[0] || themeColors.primary,
      bgColor: backgroundColor || themeColors.background,
      gradientStart: gradientStartColor || color || chartProps.colors?.[0] || themeColors.primary,
      gradientEnd: gradientEndColor || (chartProps.colors?.[1] || '#7986cb')
    };
  };
  
  // Render ring
  const renderRing = () => {
    const ring = calculateRing();
    if (!ring) return null;
    
    const { 
      width, height, centerX, centerY, radius, 
      strokeWidth, circumference, dashOffset 
    } = ring;
    
    const { ringColor, bgColor, gradientStart, gradientEnd } = getColors();
    
    const gradientId = `progress-ring-gradient-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`;
    
    return (
      <>
        <RingSvg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
          {/* Gradient definition */}
          {showGradient && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
          )}
          
          {/* Background ring */}
          <RingBackground
            cx={centerX}
            cy={centerY}
            r={radius}
            $thickness={strokeWidth}
            stroke={bgColor}
          />
          
          {/* Progress ring */}
          <RingProgress
            cx={centerX}
            cy={centerY}
            r={radius}
            $thickness={strokeWidth}
            $roundedEnds={roundedEnds}
            $showShadow={showShadow}
            stroke={showGradient ? `url(#${gradientId})` : ringColor}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animate ? dashOffset : circumference }}
            transition={{ duration: animationDuration, ease: "easeOut" }}
          />
          
          {/* Pulse animation */}
          {isPulsing && showPulse && (
            <PulseCircle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={ringColor}
              initial={{ opacity: 0.8, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </RingSvg>
        
        {/* Value and label */}
        {(showValue || label) && (
          <ValueContainer>
            {showValue && (
              <Value>
                {valueFormatter(normalizedValue, percentage)}
              </Value>
            )}
            
            {label && (
              <Label>
                {label}
              </Label>
            )}
          </ValueContainer>
        )}
      </>
    );
  };
  
  // Convert to Chart component format
  const chartData = {
    labels: ['Value'],
    series: [{
      name: label || 'Progress',
      data: [normalizedValue]
    }]
  };
  
  return (
    <RingContainer ref={containerRef}>
      <Chart
        data={chartData}
        type="progressRing"
        {...chartProps}
      >
        {renderRing()}
      </Chart>
    </RingContainer>
  );
};

export default ProgressRing;
