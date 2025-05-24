import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface MetricDataPoint {
  /**
   * Label for the data point (e.g., date or time)
   */
  label: string;
  /**
   * Value of the metric at this point
   */
  value: number;
}

export interface MetricCardProps {
  /**
   * Title of the metric
   */
  title: string;
  /**
   * Current value of the metric
   */
  value: number;
  /**
   * Target value for the metric
   */
  target?: number;
  /**
   * Historical data for the metric
   */
  history?: MetricDataPoint[];
  /**
   * Format function for the value
   */
  valueFormatter?: (value: number) => string;
  /**
   * Format function for the percentage
   */
  percentageFormatter?: (value: number) => string;
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
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
   * Whether to show a sparkline chart
   */
  showSparkline?: boolean;
  /**
   * Whether to show the full history table
   */
  showHistoryTable?: boolean;
  /**
   * Additional metrics to display
   */
  additionalMetrics?: {
    label: string;
    value: number;
    formatter?: (value: number) => string;
  }[];
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
  min-width: 250px;
  border-left: 4px solid ${({ theme, $color }) => $color || theme.colors.primary.main};
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

const TargetIndicator = styled.div<{ $positive: boolean; $negative: boolean }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme, $positive, $negative }) => 
    $positive ? theme.colors.success.main : 
    $negative ? theme.colors.error.main : 
    theme.colors.neutral[500]};
`;

const SparklineContainer = styled.div`
  height: 40px;
  margin: ${({ theme }) => theme.spacing[2]} 0;
  position: relative;
`;

const SparklineSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const SparklinePath = styled(motion.path)<{ $positive: boolean }>`
  fill: none;
  stroke: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.main : theme.colors.error.main};
  stroke-width: 1.5;
`;

const SparklineArea = styled(motion.path)<{ $positive: boolean }>`
  fill: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.light : theme.colors.error.light};
  opacity: 0.3;
`;

const SparklineDot = styled.circle<{ $positive: boolean }>`
  fill: ${({ theme, $positive }) => 
    $positive ? theme.colors.success.main : theme.colors.error.main};
`;

const TargetLine = styled.line`
  stroke: ${({ theme }) => theme.colors.neutral[400]};
  stroke-width: 1;
  stroke-dasharray: 2, 2;
`;

const TargetLabel = styled.text`
  font-size: 9px;
  fill: ${({ theme }) => theme.colors.neutral[500]};
  text-anchor: end;
`;

const AdditionalMetricsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const MetricItem = styled.div`
  flex: 1;
  min-width: 80px;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-top: auto;
`;

const HistoryToggle = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary.main};
  cursor: pointer;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const HistoryTable = styled(motion.table)`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: 12px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const TableCell = styled.td`
  padding: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const TableValueCell = styled(TableCell)<{ $positive: boolean; $negative: boolean }>`
  color: ${({ theme, $positive, $negative }) => 
    $positive ? theme.colors.success.main : 
    $negative ? theme.colors.error.main : 
    theme.colors.neutral[800]};
  text-align: right;
`;

/**
 * MetricCard component displays detailed metrics with historical context,
 * sparkline visualization, and additional related metrics.
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  target,
  history = [],
  valueFormatter = (val) => val.toLocaleString(),
  percentageFormatter = (val) => `${val.toFixed(1)}%`,
  icon,
  higherIsBetter = true,
  warningThreshold,
  dangerThreshold,
  color,
  showSparkline = true,
  showHistoryTable = true,
  additionalMetrics = [],
  info,
  onClick
}) => {
  const [showHistory, setShowHistory] = useState(false);
  
  // Calculate percentage from target
  const calculateTargetPercentage = () => {
    if (target === undefined || target === 0) return 0;
    return ((value - target) / Math.abs(target)) * 100;
  };
  
  const targetPercentage = calculateTargetPercentage();
  
  // Determine if target comparison is positive based on higherIsBetter setting
  const isPositiveTarget = higherIsBetter ? value >= (target || 0) : value <= (target || 0);
  const isNegativeTarget = !isPositiveTarget;
  
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
  
  // Generate sparkline path
  const generateSparklinePath = () => {
    if (!history.length) return { linePath: '', areaPath: '' };
    
    const values = history.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 100;
    const height = 40;
    
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
    
    return { linePath, areaPath, points };
  };
  
  // Calculate target position on sparkline
  const calculateTargetPosition = () => {
    if (target === undefined || !history.length) return null;
    
    const values = history.map(point => point.value);
    const min = Math.min(...values, target);
    const max = Math.max(...values, target);
    const range = max - min || 1;
    
    const height = 40;
    const y = height - ((target - min) / range) * height;
    
    return y;
  };
  
  const { linePath, areaPath, points } = generateSparklinePath();
  const targetPosition = calculateTargetPosition();
  
  // Toggle history table visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Determine if a value is positive compared to the previous value
  const isPositiveChange = (current: number, previous?: number) => {
    if (previous === undefined) return higherIsBetter;
    return higherIsBetter ? current >= previous : current <= previous;
  };
  
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
        
        {target !== undefined && (
          <TargetIndicator
            $positive={isPositiveTarget}
            $negative={isNegativeTarget}
          >
            {isPositiveTarget ? '↑ ' : '↓ '}
            {targetPercentage >= 0 ? '+' : ''}
            {percentageFormatter(targetPercentage)} vs target
          </TargetIndicator>
        )}
      </ValueContainer>
      
      {showSparkline && history.length > 1 && (
        <SparklineContainer>
          <SparklineSvg viewBox="0 0 100 40" preserveAspectRatio="none">
            {/* Target line */}
            {targetPosition !== null && (
              <>
                <TargetLine x1="0" y1={targetPosition} x2="100" y2={targetPosition} />
                <TargetLabel x="98" y={targetPosition - 2}>Target</TargetLabel>
              </>
            )}
            
            {/* Area under the line */}
            <SparklineArea
              d={areaPath}
              $positive={isPositiveChange(value, history[0].value)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Line */}
            <SparklinePath
              d={linePath}
              $positive={isPositiveChange(value, history[0].value)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* End point */}
            {points && points.length > 0 && (
              <SparklineDot
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="2"
                $positive={isPositiveChange(value, history[history.length - 2]?.value)}
              />
            )}
          </SparklineSvg>
        </SparklineContainer>
      )}
      
      {additionalMetrics.length > 0 && (
        <AdditionalMetricsContainer>
          {additionalMetrics.map((metric, index) => (
            <MetricItem key={index}>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>
                {metric.formatter ? metric.formatter(metric.value) : valueFormatter(metric.value)}
              </MetricValue>
            </MetricItem>
          ))}
        </AdditionalMetricsContainer>
      )}
      
      {info && <InfoText>{info}</InfoText>}
      
      {showHistoryTable && history.length > 0 && (
        <>
          <HistoryToggle onClick={toggleHistory}>
            {showHistory ? 'Hide History' : 'Show History'}
          </HistoryToggle>
          
          <AnimatePresence>
            {showHistory && (
              <HistoryTable
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <thead>
                  <tr>
                    <TableHeader>Period</TableHeader>
                    <TableHeader style={{ textAlign: 'right' }}>Value</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {history.map((point, index) => {
                    const previousValue = history[index - 1]?.value;
                    const isPositive = isPositiveChange(point.value, previousValue);
                    const isNegative = !isPositive && previousValue !== undefined;
                    
                    return (
                      <tr key={index}>
                        <TableCell>{point.label}</TableCell>
                        <TableValueCell
                          $positive={isPositive}
                          $negative={isNegative}
                        >
                          {valueFormatter(point.value)}
                        </TableValueCell>
                      </tr>
                    );
                  })}
                </tbody>
              </HistoryTable>
            )}
          </AnimatePresence>
        </>
      )}
    </Card>
  );
};

export default MetricCard;
