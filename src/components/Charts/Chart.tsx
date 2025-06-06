import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';

// Types
export interface ChartData {
  /**
   * Data labels
   */
  labels: string[];
  /**
   * Data series
   */
  series: Array<{
    /**
     * Series name
     */
    name: string;
    /**
     * Series data
     */
    data: number[];
    /**
     * Series color
     */
    color?: string;
  }>;
}

export interface ChartProps {
  /**
   * Chart data
   */
  data: ChartData;
  /**
   * Chart type
   */
  type?: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radar' | 'gauge';
  /**
   * Chart width
   */
  width?: number | string;
  /**
   * Chart height
   */
  height?: number | string;
  /**
   * Chart title
   */
  title?: string;
  /**
   * Chart subtitle
   */
  subtitle?: string;
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  /**
   * Legend position
   */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Whether to show the grid
   */
  showGrid?: boolean;
  /**
   * Whether to show the x-axis
   */
  showXAxis?: boolean;
  /**
   * Whether to show the y-axis
   */
  showYAxis?: boolean;
  /**
   * Whether to show the tooltip
   */
  showTooltip?: boolean;
  /**
   * Whether to animate the chart
   */
  animate?: boolean;
  /**
   * Animation duration
   */
  animationDuration?: number;
  /**
   * Whether to stack the data
   */
  stacked?: boolean;
  /**
   * Color palette
   */
  colors?: string[];
  /**
   * Custom tooltip component
   */
  customTooltip?: React.ReactNode;
  /**
   * Custom legend component
   */
  customLegend?: React.ReactNode;
  /**
   * Whether to show data labels
   */
  showDataLabels?: boolean;
  /**
   * Whether to show the chart is loading
   */
  loading?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Whether to make the chart responsive
   */
  responsive?: boolean;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Styled components
const ChartContainer = styled(Box)<{ $width: string | number; $height: string | number; $responsive: boolean }>`
  position: relative;
  width: ${({ $width, $responsive }) => $responsive ? '100%' : typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing[4]};
  overflow: hidden;
`;

const ChartHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]};
`;

const ChartSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0;
`;

const ChartContent = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
`;

const Legend = styled.div<{ $position: string }>`
  display: flex;
  flex-wrap: wrap;
  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return 'margin-bottom: 16px;';
      case 'bottom':
        return 'margin-top: 16px;';
      case 'left':
        return 'flex-direction: column; margin-right: 16px;';
      case 'right':
        return 'flex-direction: column; margin-left: 16px;';
      default:
        return '';
    }
  }}
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const LegendLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-align: center;
`;

const NoDataIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const NoDataText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin: 0;
`;

/**
 * Chart component provides a flexible base for various chart types
 * with customization options and interactive features.
 */
export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'line',
  width = '100%',
  height = 400,
  title,
  subtitle,
  showLegend = true,
  legendPosition = 'bottom',
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  animate = true,
  animationDuration = 0.5,
  stacked = false,
  colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ffeb3b', '#795548'],
  customTooltip,
  customLegend,
  showDataLabels = false,
  loading = false,
  loadingComponent,
  responsive = true,
  css,
  children
}) => {
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if data is empty
  const isDataEmpty = !data || !data.series || data.series.length === 0 || !data.labels || data.labels.length === 0;
  
  // Default loading component
  const defaultLoadingComponent = (
    <LoadingOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </LoadingOverlay>
  );
  
  // Default legend component
  const defaultLegend = (
    <Legend $position={legendPosition}>
      {data.series.map((series, index) => (
        <LegendItem 
          key={index}
          onMouseEnter={() => setHoveredSeries(index)}
          onMouseLeave={() => setHoveredSeries(null)}
        >
          <LegendColor $color={series.color || colors[index % colors.length]} />
          <LegendLabel>{series.name}</LegendLabel>
        </LegendItem>
      ))}
    </Legend>
  );
  
  // Empty state component
  const emptyState = (
    <NoDataMessage>
      <NoDataIcon>📊</NoDataIcon>
      <NoDataText>No data available</NoDataText>
    </NoDataMessage>
  );
  
  return (
    <ChartContainer 
      ref={containerRef}
      $width={width}
      $height={height}
      $responsive={responsive}
      css={css}
    >
      {title && (
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
          {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
        </ChartHeader>
      )}
      
      {showLegend && legendPosition === 'top' && (customLegend || defaultLegend)}
      
      <ChartContent>
        {isDataEmpty ? (
          emptyState
        ) : (
          <>
            {/* Chart content will be rendered by specific chart type components */}
            {children}
            
            <AnimatePresence>
              {loading && (loadingComponent || defaultLoadingComponent)}
            </AnimatePresence>
          </>
        )}
      </ChartContent>
      
      {showLegend && legendPosition === 'bottom' && (customLegend || defaultLegend)}
    </ChartContainer>
  );
};

export default Chart;
