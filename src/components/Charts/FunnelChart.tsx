import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface FunnelChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show data labels
   */
  showLabels?: boolean;
  /**
   * Label position ('inside' | 'outside')
   */
  labelPosition?: 'inside' | 'outside';
  /**
   * Custom label formatter
   */
  labelFormatter?: (value: number, percentage: number, label: string) => string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (value: number, percentage: number, label: string) => string;
  /**
   * Whether to show percentages
   */
  showPercentages?: boolean;
  /**
   * Whether to show the funnel as inverted
   */
  inverted?: boolean;
  /**
   * Whether to display as a stacked funnel
   */
  stacked?: boolean;
  /**
   * Gap between funnel sections
   */
  sectionGap?: number;
  /**
   * Whether to enable section selection
   */
  selectable?: boolean;
  /**
   * Callback when a section is selected
   */
  onSectionSelect?: (index: number, selected: boolean) => void;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const FunnelContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const FunnelSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const FunnelSection = styled(motion.path)<{ $interactive: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SectionLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.common.white};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const OuterLabel = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.neutral[700]};
  dominant-baseline: middle;
  pointer-events: none;
`;

const LabelLine = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.colors.neutral[400]};
  stroke-width: 1;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TooltipColor = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
  margin-right: 6px;
`;

const TooltipLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-right: 6px;
  display: flex;
  align-items: center;
`;

const TooltipValue = styled.span`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

/**
 * FunnelChart component displays data as a funnel to visualize stages in a process,
 * with customization options and interactive features.
 */
export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  showLabels = true,
  labelPosition = 'inside',
  labelFormatter = (value, percentage) => `${value.toLocaleString()} (${percentage.toFixed(1)}%)`,
  showTooltips = true,
  tooltipFormatter,
  showPercentages = true,
  inverted = false,
  stacked = false,
  sectionGap = 2,
  selectable = false,
  onSectionSelect,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    percentage: number;
    color: string;
  } | null>(null);
  
  const [selectedSections, setSelectedSections] = useState<Record<number, boolean>>({});
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total value
  const total = data.series.reduce((sum, series) => {
    return sum + series.data.reduce((seriesSum, value) => seriesSum + value, 0);
  }, 0);
  
  // Prepare funnel data
  const funnelData = data.series.flatMap((series, seriesIndex) => {
    return series.data.map((value, valueIndex) => {
      const label = data.labels[valueIndex] || '';
      return {
        value,
        label,
        color: series.color || chartProps.colors?.[valueIndex % (chartProps.colors?.length || 1)] || '#000',
        seriesIndex,
        valueIndex,
      };
    });
  }).filter(item => item.value > 0);
  
  // Sort funnel data by value (descending for normal funnel, ascending for inverted)
  const sortedFunnelData = inverted
    ? [...funnelData].sort((a, b) => a.value - b.value)
    : [...funnelData].sort((a, b) => b.value - a.value);
  
  // Calculate funnel dimensions
  const calculateFunnel = () => {
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
      right: labelPosition === 'outside' ? 120 : 20,
      bottom: 20,
      left: labelPosition === 'outside' ? 120 : 20
    };
    
    // Calculate funnel area dimensions
    const funnelWidth = width - padding.left - padding.right;
    const funnelHeight = height - padding.top - padding.bottom;
    
    // Calculate section heights
    const sectionHeight = (funnelHeight - (sortedFunnelData.length - 1) * sectionGap) / sortedFunnelData.length;
    
    // Calculate sections
    const maxValue = Math.max(...sortedFunnelData.map(item => item.value));
    
    const sections = sortedFunnelData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const sectionWidth = (item.value / maxValue) * funnelWidth;
      const x = padding.left + (funnelWidth - sectionWidth) / 2;
      const y = padding.top + index * (sectionHeight + sectionGap);
      
      return {
        ...item,
        percentage,
        x,
        y,
        width: sectionWidth,
        height: sectionHeight,
        path: `
          M ${x} ${y}
          L ${x + sectionWidth} ${y}
          L ${x + sectionWidth} ${y + sectionHeight}
          L ${x} ${y + sectionHeight}
          Z
        `
      };
    });
    
    return {
      width,
      height,
      padding,
      funnelWidth,
      funnelHeight,
      sections
    };
  };
  
  // Handle section hover
  const handleSectionHover = (event: React.MouseEvent, section: ReturnType<typeof calculateFunnel>['sections'][0]) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setHoveredSection(section.valueIndex);
    setTooltipData({
      x: section.x + section.width / 2,
      y: section.y + section.height / 2,
      label: section.label,
      value: section.value,
      percentage: section.percentage,
      color: section.color,
    });
  };
  
  // Handle section leave
  const handleSectionLeave = () => {
    setHoveredSection(null);
    setTooltipData(null);
  };
  
  // Handle section click
  const handleSectionClick = (section: ReturnType<typeof calculateFunnel>['sections'][0]) => {
    if (!selectable) return;
    
    setSelectedSections(prev => {
      const newSelected = {
        ...prev,
        [section.valueIndex]: !prev[section.valueIndex],
      };
      
      if (onSectionSelect) {
        onSectionSelect(section.valueIndex, newSelected[section.valueIndex]);
      }
      
      return newSelected;
    });
  };
  
  // Format tooltip content
  const formatTooltipContent = (value: number, percentage: number, label: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, percentage, label);
    }
    return `${value.toLocaleString()} (${percentage.toFixed(1)}%)`;
  };
  
  // Calculate label position
  const calculateLabelPosition = (section: ReturnType<typeof calculateFunnel>['sections'][0]) => {
    if (labelPosition === 'inside') {
      return {
        x: section.x + section.width / 2,
        y: section.y + section.height / 2,
      };
    } else {
      // Outside label
      const side = section.x > window.innerWidth / 2 ? 'right' : 'left';
      const anchorPoint = {
        x: side === 'left' ? section.x : section.x + section.width,
        y: section.y + section.height / 2,
      };
      const labelPoint = {
        x: side === 'left' ? section.x - 10 : section.x + section.width + 10,
        y: section.y + section.height / 2,
      };
      
      return {
        anchorPoint,
        labelPoint,
        textAnchor: side === 'left' ? 'end' : 'start',
      };
    }
  };
  
  // Render funnel
  const renderFunnel = () => {
    const funnel = calculateFunnel();
    if (!funnel) return null;
    
    const { sections } = funnel;
    
    const anySelected = Object.values(selectedSections).some(selected => selected);
    
    return (
      <>
        <FunnelSvg ref={svgRef}>
          <AnimatePresence>
            {sections.map((section, i) => {
              const isSelected = selectedSections[section.valueIndex];
              const isHovered = hoveredSection === section.valueIndex;
              const isActive = !anySelected || isSelected;
              
              return (
                <g key={`section-${i}`}>
                  <FunnelSection
                    $interactive={selectable}
                    d={section.path}
                    fill={section.color}
                    stroke={isHovered || isSelected ? '#fff' : 'none'}
                    strokeWidth={2}
                    opacity={isActive ? 1 : 0.3}
                    onMouseEnter={(e) => handleSectionHover(e, section)}
                    onMouseLeave={handleSectionLeave}
                    onClick={() => handleSectionClick(section)}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      scaleX: 1,
                      transition: { duration: 0.5, delay: i * 0.1 } 
                    }}
                    exit={{ opacity: 0, scaleX: 0 }}
                  />
                  
                  {showLabels && labelPosition === 'inside' && section.width > 60 && (
                    <SectionLabel
                      x={calculateLabelPosition(section).x}
                      y={calculateLabelPosition(section).y}
                      opacity={isActive ? 1 : 0.3}
                    >
                      {labelFormatter(section.value, section.percentage, section.label)}
                    </SectionLabel>
                  )}
                  
                  {showLabels && labelPosition === 'outside' && (
                    <>
                      <LabelLine
                        d={`
                          M ${calculateLabelPosition(section).anchorPoint.x},${calculateLabelPosition(section).anchorPoint.y}
                          L ${calculateLabelPosition(section).labelPoint.x},${calculateLabelPosition(section).labelPoint.y}
                        `}
                        opacity={isActive ? 1 : 0.3}
                      />
                      <OuterLabel
                        x={calculateLabelPosition(section).labelPoint.x}
                        y={calculateLabelPosition(section).labelPoint.y}
                        textAnchor={calculateLabelPosition(section).textAnchor}
                        opacity={isActive ? 1 : 0.3}
                      >
                        {section.label}: {labelFormatter(section.value, section.percentage, section.label)}
                      </OuterLabel>
                    </>
                  )}
                </g>
              );
            })}
          </AnimatePresence>
        </FunnelSvg>
        
        {/* Tooltip */}
        {showTooltips && tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
              top: tooltipData.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipHeader>{tooltipData.label}</TooltipHeader>
            <TooltipContent>
              <TooltipLabel>
                <TooltipColor $color={tooltipData.color} />
                Value:
              </TooltipLabel>
              <TooltipValue>
                {formatTooltipContent(tooltipData.value, tooltipData.percentage, tooltipData.label)}
              </TooltipValue>
            </TooltipContent>
          </TooltipContainer>
        )}
      </>
    );
  };
  
  return (
    <FunnelContainer ref={containerRef}>
      <Chart
        data={data}
        type="funnel"
        {...chartProps}
      >
        {renderFunnel()}
      </Chart>
    </FunnelContainer>
  );
};

export default FunnelChart;
