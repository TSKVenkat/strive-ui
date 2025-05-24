import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface KPICardProps {
  /**
   * Title of the KPI
   */
  title: string;
  /**
   * Current value of the KPI
   */
  value: number;
  /**
   * Previous value for comparison
   */
  previousValue?: number;
  /**
   * Format function for the value
   */
  valueFormatter?: (value: number) => string;
  /**
   * Format function for the change percentage
   */
  percentageFormatter?: (value: number) => string;
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  /**
   * Whether to show the change indicator
   */
  showChange?: boolean;
  /**
   * Whether higher values are better (affects color)
   */
  higherIsBetter?: boolean;
  /**
   * Threshold for warning color
   */
  warningThreshold?: number;
  /**
   * Threshold for danger color
   */
  dangerThreshold?: number;
  /**
   * Custom color for the card
   */
  color?: string;
  /**
   * Whether to show a mini chart
   */
  showMiniChart?: boolean;
  /**
   * Data for the mini chart
   */
  chartData?: number[];
  /**
   * Additional information or context
   */
  info?: string;
  /**
   * Click handler for the card
   */
  onClick?: () => void;
}

const Card = styled(motion.div)<{ $clickable: boolean; $color?: string }>`
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  min-width: 200px;
  border-top: 3px solid ${({ theme, $color }) => $color || theme.colors.primary.main};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  
  &:hover {
    box-shadow: ${({ theme, $clickable }) => $clickable ? theme.shadows.md : theme.shadows.sm};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const ChangeIndicator = styled.div<{ $positive: boolean; $negative: boolean; $neutral: boolean }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme, $positive, $negative, $neutral }) => 
    $positive ? theme.colors.success.main : 
    $negative ? theme.colors.error.main : 
    theme.colors.neutral[500]};
`;

const ArrowIcon = styled.span<{ $direction: 'up' | 'down' | 'neutral' }>`
  margin-right: 4px;
  font-size: 14px;
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-top: auto;
`;

const MiniChart = styled.div`
  height: 40px;
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: flex-end;
`;

const ChartBar = styled.div<{ $height: number; $positive: boolean }>`
  flex: 1;
  height: ${({ $height }) => `${$height}%`};
  background-color: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.light : theme.colors.error.light};
  margin: 0 1px;
  border-radius: 1px;
`;

/**
 * KPICard component displays a key performance indicator with current value,
 * trend indicator, and optional mini chart.
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  valueFormatter = (val) => val.toLocaleString(),
  percentageFormatter = (val) => `${val.toFixed(1)}%`,
  icon,
  showChange = true,
  higherIsBetter = true,
  warningThreshold,
  dangerThreshold,
  color,
  showMiniChart = false,
  chartData = [],
  info,
  onClick
}) => {
  // Calculate percentage change
  const calculateChange = () => {
    if (previousValue === undefined || previousValue === 0) return 0;
    return ((value - previousValue) / Math.abs(previousValue)) * 100;
  };
  
  const change = calculateChange();
  
  // Determine if change is positive based on higherIsBetter setting
  const isPositiveChange = higherIsBetter ? change > 0 : change < 0;
  const isNegativeChange = higherIsBetter ? change < 0 : change > 0;
  const isNeutralChange = change === 0;
  
  // Determine arrow direction
  const getArrowDirection = (): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };
  
  const arrowDirection = getArrowDirection();
  
  // Determine card color based on thresholds
  const getCardColor = () => {
    if (color) return color;
    
    if (dangerThreshold !== undefined) {
      if (higherIsBetter && value <= dangerThreshold) return '#f44336'; // Red
      if (!higherIsBetter && value >= dangerThreshold) return '#f44336'; // Red
    }
    
    if (warningThreshold !== undefined) {
      if (higherIsBetter && value <= warningThreshold) return '#ff9800'; // Orange
      if (!higherIsBetter && value >= warningThreshold) return '#ff9800'; // Orange
    }
    
    return '#4caf50'; // Green
  };
  
  // Render arrow icon
  const renderArrowIcon = () => {
    switch (arrowDirection) {
      case 'up':
        return <ArrowIcon $direction="up">↑</ArrowIcon>;
      case 'down':
        return <ArrowIcon $direction="down">↓</ArrowIcon>;
      default:
        return <ArrowIcon $direction="neutral">→</ArrowIcon>;
    }
  };
  
  // Normalize chart data for display
  const normalizeChartData = () => {
    if (!chartData.length) return [];
    
    const max = Math.max(...chartData);
    return chartData.map(value => (value / max) * 100);
  };
  
  const normalizedChartData = normalizeChartData();
  
  return (
    <Card 
      $clickable={!!onClick} 
      $color={getCardColor()}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <Title>{title}</Title>
        {icon && <IconWrapper>{icon}</IconWrapper>}
      </CardHeader>
      
      <ValueContainer>
        <Value>{valueFormatter(value)}</Value>
        
        {showChange && previousValue !== undefined && (
          <ChangeIndicator
            $positive={isPositiveChange}
            $negative={isNegativeChange}
            $neutral={isNeutralChange}
          >
            {renderArrowIcon()}
            {percentageFormatter(Math.abs(change))}
          </ChangeIndicator>
        )}
      </ValueContainer>
      
      {showMiniChart && normalizedChartData.length > 0 && (
        <MiniChart>
          {normalizedChartData.map((height, index) => (
            <ChartBar 
              key={index} 
              $height={height} 
              $positive={chartData[index] >= (chartData[index - 1] || 0)}
            />
          ))}
        </MiniChart>
      )}
      
      {info && <InfoText>{info}</InfoText>}
    </Card>
  );
};

export default KPICard;
