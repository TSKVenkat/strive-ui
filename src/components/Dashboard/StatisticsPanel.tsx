import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';

export interface StatisticItem {
  /**
   * Unique identifier for the statistic
   */
  id: string;
  /**
   * Label for the statistic
   */
  label: string;
  /**
   * Current value of the statistic
   */
  value: number;
  /**
   * Previous value for comparison
   */
  previousValue?: number;
  /**
   * Format function for the value
   */
  formatter?: (value: number) => string;
  /**
   * Whether higher values are better (affects color)
   */
  higherIsBetter?: boolean;
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  /**
   * Color for the statistic
   */
  color?: string;
  /**
   * Optional description or additional information
   */
  description?: string;
  /**
   * Optional historical data for visualization
   */
  history?: Array<{ label: string; value: number }>;
}

export interface StatisticGroup {
  /**
   * Unique identifier for the group
   */
  id: string;
  /**
   * Title for the group
   */
  title: string;
  /**
   * Statistics in this group
   */
  statistics: StatisticItem[];
  /**
   * Whether the group is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether the group is initially collapsed
   */
  initiallyCollapsed?: boolean;
  /**
   * Description for the group
   */
  description?: string;
}

export interface StatisticsPanelProps {
  /**
   * Title for the panel
   */
  title?: string;
  /**
   * Statistics to display
   */
  statistics?: StatisticItem[];
  /**
   * Grouped statistics
   */
  groups?: StatisticGroup[];
  /**
   * Layout for the statistics ('grid' or 'list')
   */
  layout?: 'grid' | 'list';
  /**
   * Number of columns in grid layout
   */
  columns?: number;
  /**
   * Whether to show comparison with previous values
   */
  showComparison?: boolean;
  /**
   * Whether to show mini visualizations
   */
  showVisualizations?: boolean;
  /**
   * Default formatter for values
   */
  defaultFormatter?: (value: number) => string;
  /**
   * Whether to show the panel header
   */
  showHeader?: boolean;
  /**
   * Whether the panel is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether the panel is initially collapsed
   */
  initiallyCollapsed?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Click handler for a statistic item
   */
  onStatisticClick?: (id: string) => void;
}

const Panel = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin: 0;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const PanelContent = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing[3]};
`;

const StatisticsGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const StatisticsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatisticItem = styled.div<{ $clickable: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  
  &:hover {
    background-color: ${({ theme, $clickable }) => $clickable ? theme.colors.neutral[100] : theme.colors.neutral[50]};
  }
`;

const StatisticHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatisticLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const IconWrapper = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $color }) => $color ? `${$color}20` : theme.colors.neutral[200]};
  color: ${({ theme, $color }) => $color || theme.colors.neutral[700]};
`;

const StatisticValue = styled.div`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ComparisonIndicator = styled.span<{ $positive: boolean; $negative: boolean }>`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme, $positive, $negative }) => 
    $positive ? theme.colors.success.main : 
    $negative ? theme.colors.error.main : 
    theme.colors.neutral[500]};
`;

const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const MiniVisualization = styled.div`
  height: 30px;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const VisualizationSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const VisualizationPath = styled(motion.path)<{ $color?: string }>`
  fill: none;
  stroke: ${({ theme, $color }) => $color || theme.colors.primary.main};
  stroke-width: 1.5;
`;

const VisualizationArea = styled(motion.path)<{ $color?: string }>`
  fill: ${({ theme, $color }) => $color || theme.colors.primary.main};
  opacity: 0.1;
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} 0`};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const GroupTitle = styled.h4`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0;
`;

const GroupDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const GroupContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

/**
 * StatisticsPanel component displays multiple related statistics in a structured layout
 * with optional grouping, visualizations, and comparisons.
 */
export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  title,
  statistics = [],
  groups = [],
  layout = 'grid',
  columns = 3,
  showComparison = true,
  showVisualizations = true,
  defaultFormatter = (value) => value.toLocaleString(),
  showHeader = true,
  collapsible = false,
  initiallyCollapsed = false,
  className,
  onStatisticClick
}) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [groupCollapsedState, setGroupCollapsedState] = useState<Record<string, boolean>>(
    groups.reduce((acc, group) => {
      acc[group.id] = group.initiallyCollapsed || false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  // Toggle panel collapse state
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Toggle group collapse state
  const toggleGroupCollapse = (groupId: string) => {
    setGroupCollapsedState(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  // Format a value using the provided formatter or default
  const formatValue = (value: number, formatter?: (value: number) => string) => {
    return formatter ? formatter(value) : defaultFormatter(value);
  };
  
  // Calculate percentage change
  const calculateChange = (current: number, previous?: number) => {
    if (previous === undefined || previous === 0) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  
  // Render comparison indicator
  const renderComparison = (current: number, previous?: number, higherIsBetter = true) => {
    if (!showComparison || previous === undefined) return null;
    
    const change = calculateChange(current, previous);
    if (change === null) return null;
    
    const isPositive = (change > 0 && higherIsBetter) || (change < 0 && !higherIsBetter);
    const isNegative = (change < 0 && higherIsBetter) || (change > 0 && !higherIsBetter);
    
    return (
      <ComparisonIndicator
        $positive={isPositive}
        $negative={isNegative}
      >
        {change > 0 ? '↑ ' : '↓ '}
        {Math.abs(change).toFixed(1)}%
      </ComparisonIndicator>
    );
  };
  
  // Generate visualization path
  const generateVisualizationPath = (history?: Array<{ label: string; value: number }>) => {
    if (!history || history.length < 2) return { linePath: '', areaPath: '' };
    
    const values = history.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 100;
    const height = 30;
    
    const points = history.map((point, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return { x, y };
    });
    
    let linePath = '';
    let areaPath = '';
    
    points.forEach((point, index) => {
      if (index === 0) {
        linePath += `M ${point.x} ${point.y}`;
        areaPath += `M ${point.x} ${height} L ${point.x} ${point.y}`;
      } else {
        linePath += ` L ${point.x} ${point.y}`;
        areaPath += ` L ${point.x} ${point.y}`;
      }
    });
    
    // Close the area path
    areaPath += ` L ${points[points.length - 1].x} ${height} Z`;
    
    return { linePath, areaPath };
  };
  
  // Render a single statistic item
  const renderStatistic = (statistic: StatisticItem) => {
    const { linePath, areaPath } = generateVisualizationPath(statistic.history);
    
    return (
      <StatisticItem
        key={statistic.id}
        $clickable={!!onStatisticClick}
        onClick={() => onStatisticClick && onStatisticClick(statistic.id)}
      >
        <StatisticHeader>
          <StatisticLabel>{statistic.label}</StatisticLabel>
          {statistic.icon && (
            <IconWrapper $color={statistic.color}>
              {statistic.icon}
            </IconWrapper>
          )}
        </StatisticHeader>
        
        <StatisticValue>
          {formatValue(statistic.value, statistic.formatter)}
          {renderComparison(statistic.value, statistic.previousValue, statistic.higherIsBetter)}
        </StatisticValue>
        
        {statistic.description && (
          <Description>{statistic.description}</Description>
        )}
        
        {showVisualizations && statistic.history && statistic.history.length > 1 && (
          <MiniVisualization>
            <VisualizationSvg viewBox="0 0 100 30" preserveAspectRatio="none">
              <VisualizationArea
                d={areaPath}
                $color={statistic.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 0.5 }}
              />
              <VisualizationPath
                d={linePath}
                $color={statistic.color}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
            </VisualizationSvg>
          </MiniVisualization>
        )}
      </StatisticItem>
    );
  };
  
  // Render statistics in a grid or list layout
  const renderStatistics = (items: StatisticItem[]) => {
    if (layout === 'grid') {
      return (
        <StatisticsGrid $columns={columns}>
          {items.map(renderStatistic)}
        </StatisticsGrid>
      );
    } else {
      return (
        <StatisticsList>
          {items.map(renderStatistic)}
        </StatisticsList>
      );
    }
  };
  
  // Render a group of statistics
  const renderGroup = (group: StatisticGroup) => {
    const isCollapsed = groupCollapsedState[group.id];
    
    return (
      <GroupContainer key={group.id}>
        {group.title && (
          <GroupHeader>
            <GroupTitle>{group.title}</GroupTitle>
            {group.collapsible && (
              <CollapseButton onClick={() => toggleGroupCollapse(group.id)}>
                {isCollapsed ? '+' : '-'}
              </CollapseButton>
            )}
          </GroupHeader>
        )}
        
        {group.description && (
          <GroupDescription>{group.description}</GroupDescription>
        )}
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStatistics(group.statistics)}
            </motion.div>
          )}
        </AnimatePresence>
      </GroupContainer>
    );
  };
  
  return (
    <Panel
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showHeader && (title || collapsible) && (
        <PanelHeader>
          {title && <PanelTitle>{title}</PanelTitle>}
          {collapsible && (
            <CollapseButton onClick={toggleCollapse}>
              {collapsed ? '+' : '-'}
            </CollapseButton>
          )}
        </PanelHeader>
      )}
      
      <AnimatePresence>
        {!collapsed && (
          <PanelContent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Render ungrouped statistics */}
            {statistics.length > 0 && renderStatistics(statistics)}
            
            {/* Render grouped statistics */}
            {groups.map(renderGroup)}
          </PanelContent>
        )}
      </AnimatePresence>
    </Panel>
  );
};

// Create a polymorphic component version using the Box component
export const PolymorphicStatisticsPanel = Box as typeof Box & {
  StatisticsPanel: typeof StatisticsPanel;
};

PolymorphicStatisticsPanel.StatisticsPanel = StatisticsPanel;

export default StatisticsPanel;
