import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface CandlestickDataPoint {
  /**
   * Date or label for the candlestick
   */
  date: string | Date;
  /**
   * Opening price
   */
  open: number;
  /**
   * Highest price
   */
  high: number;
  /**
   * Lowest price
   */
  low: number;
  /**
   * Closing price
   */
  close: number;
  /**
   * Optional volume data
   */
  volume?: number;
}

export interface CandlestickChartProps extends Omit<ChartProps, 'type' | 'children'> {
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (dataPoint: CandlestickDataPoint) => React.ReactNode;
  /**
   * Whether to show volume bars
   */
  showVolume?: boolean;
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  /**
   * Whether to show crosshair on hover
   */
  showCrosshair?: boolean;
  /**
   * Color for up candles (close > open)
   */
  upColor?: string;
  /**
   * Color for down candles (close < open)
   */
  downColor?: string;
  /**
   * Color for volume bars
   */
  volumeColor?: string;
  /**
   * Height ratio for volume section (0-1)
   */
  volumeHeightRatio?: number;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
  /**
   * Custom price formatter
   */
  priceFormatter?: (value: number) => string;
  /**
   * Custom date formatter
   */
  dateFormatter?: (date: string | Date) => string;
  /**
   * Custom volume formatter
   */
  volumeFormatter?: (volume: number) => string;
}

// Styled components
const CandlestickContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Candle = styled(motion.g)`
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CandleWick = styled(motion.line)`
  stroke-width: 1;
`;

const CandleBody = styled(motion.rect)`
  stroke-width: 1;
`;

const VolumeBar = styled(motion.rect)`
  opacity: 0.5;
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

const CrosshairLine = styled(motion.line)`
  stroke: ${({ theme }) => theme.colors.neutral[500]};
  stroke-width: 1;
  stroke-dasharray: 3, 3;
  pointer-events: none;
`;

const CrosshairLabel = styled(motion.g)`
  pointer-events: none;
`;

const CrosshairRect = styled.rect`
  fill: ${({ theme }) => theme.colors.neutral[800]};
  rx: 2;
  ry: 2;
`;

const CrosshairText = styled.text`
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.common.white};
  text-anchor: middle;
  dominant-baseline: middle;
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

const TooltipValue = styled.span<{ $isUp?: boolean; $isDown?: boolean }>`
  color: ${({ theme, $isUp, $isDown }) => 
    $isUp ? theme.colors.success.main : 
    $isDown ? theme.colors.error.main : 
    theme.colors.neutral[800]};
`;

/**
 * CandlestickChart component visualizes financial data with open, high, low, and close values,
 * with optional volume display and interactive features.
 */
export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  showTooltips = true,
  tooltipFormatter,
  showVolume = true,
  showGrid = true,
  showCrosshair = true,
  upColor = '#4caf50',
  downColor = '#f44336',
  volumeColor = '#607d8b',
  volumeHeightRatio = 0.2,
  animateOnDataChange = true,
  priceFormatter = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  dateFormatter = (date) => date instanceof Date ? date.toLocaleDateString() : date,
  volumeFormatter = (volume) => volume.toLocaleString(),
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    dataPoint: CandlestickDataPoint;
  } | null>(null);
  
  const [crosshairPosition, setCrosshairPosition] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    visible: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Extract candlestick data from chart data
  const candlestickData: CandlestickDataPoint[] = data.series[0].data.map((value, index) => {
    if (typeof value === 'object' && 'open' in value && 'high' in value && 'low' in value && 'close' in value) {
      return {
        ...value as CandlestickDataPoint,
        date: (value as any).date || data.labels[index] || new Date().toISOString()
      };
    }
    
    // If data is not in the expected format, create a default data point
    return {
      date: data.labels[index] || new Date().toISOString(),
      open: 0,
      high: 0,
      low: 0,
      close: 0
    };
  });
  
  // Calculate chart dimensions
  const calculateChartDimensions = () => {
    if (!svgRef.current) return { width: 0, height: 0, padding: 0, priceHeight: 0, volumeHeight: 0 };
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    const padding = 40; // Padding for axes and labels
    
    let priceHeight, volumeHeight;
    
    if (showVolume) {
      volumeHeight = (svgHeight - padding * 2) * volumeHeightRatio;
      priceHeight = (svgHeight - padding * 2) - volumeHeight;
    } else {
      priceHeight = svgHeight - padding * 2;
      volumeHeight = 0;
    }
    
    return { width: svgWidth, height: svgHeight, padding, priceHeight, volumeHeight };
  };
  
  // Calculate scales for axes
  const calculateScales = () => {
    const { width, height, padding, priceHeight, volumeHeight } = calculateChartDimensions();
    
    // X scale
    const xScale = (index: number) => {
      const availableWidth = width - padding * 2;
      const barWidth = availableWidth / candlestickData.length;
      return padding + index * barWidth + barWidth / 2;
    };
    
    // Calculate min and max values for price scale
    const highValues = candlestickData.map(d => d.high);
    const lowValues = candlestickData.map(d => d.low);
    
    const maxPrice = Math.max(...highValues);
    const minPrice = Math.min(...lowValues);
    
    // Add some padding to the min and max values
    const pricePadding = (maxPrice - minPrice) * 0.1;
    const priceMin = minPrice - pricePadding;
    const priceMax = maxPrice + pricePadding;
    
    // Price scale
    const priceScale = (value: number) => {
      return padding + priceHeight - ((value - priceMin) / (priceMax - priceMin)) * priceHeight;
    };
    
    // Calculate min and max values for volume scale
    const volumeValues = candlestickData.map(d => d.volume || 0);
    const maxVolume = Math.max(...volumeValues);
    
    // Volume scale
    const volumeScale = (value: number) => {
      if (!showVolume || maxVolume === 0) return height - padding;
      
      const volumeTop = padding + priceHeight;
      return volumeTop + volumeHeight - (value / maxVolume) * volumeHeight;
    };
    
    // Bar width
    const barWidth = (width - padding * 2) / candlestickData.length * 0.8; // 80% of available space
    
    return { 
      xScale, 
      priceScale, 
      volumeScale, 
      priceMin, 
      priceMax, 
      maxVolume, 
      barWidth 
    };
  };
  
  // Generate candles for the chart
  const generateCandles = () => {
    const { xScale, priceScale, barWidth } = calculateScales();
    
    const candles = candlestickData.map((dataPoint, index) => {
      const x = xScale(index);
      const open = priceScale(dataPoint.open);
      const high = priceScale(dataPoint.high);
      const low = priceScale(dataPoint.low);
      const close = priceScale(dataPoint.close);
      
      const isUp = dataPoint.close > dataPoint.open;
      const color = isUp ? upColor : downColor;
      
      // Calculate body dimensions
      const bodyTop = Math.min(open, close);
      const bodyBottom = Math.max(open, close);
      const bodyHeight = Math.max(bodyBottom - bodyTop, 1); // Ensure minimum height of 1px
      
      return {
        id: `candle-${index}`,
        x,
        high,
        low,
        bodyTop,
        bodyHeight,
        color,
        isUp,
        dataPoint,
        barWidth
      };
    });
    
    return candles;
  };
  
  // Generate volume bars
  const generateVolumeBars = () => {
    if (!showVolume) return [];
    
    const { xScale, volumeScale, barWidth } = calculateScales();
    const { height, padding } = calculateChartDimensions();
    
    const volumeBars = candlestickData.map((dataPoint, index) => {
      const volume = dataPoint.volume || 0;
      const x = xScale(index) - barWidth / 2;
      const y = volumeScale(volume);
      const barHeight = height - padding - y;
      
      const isUp = dataPoint.close > dataPoint.open;
      const color = isUp ? upColor : downColor;
      
      return {
        id: `volume-${index}`,
        x,
        y,
        width: barWidth,
        height: barHeight,
        color: volumeColor || color
      };
    });
    
    return volumeBars;
  };
  
  // Generate price grid lines
  const generatePriceGridLines = () => {
    if (!showGrid) return [];
    
    const { width, padding, priceHeight } = calculateChartDimensions();
    const { priceScale, priceMin, priceMax } = calculateScales();
    
    const gridLines: {
      id: string;
      y: number;
      value: number;
    }[] = [];
    
    // Calculate step size for grid lines
    const range = priceMax - priceMin;
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
    const firstLine = Math.ceil(priceMin / step) * step;
    
    for (let value = firstLine; value <= priceMax; value += step) {
      const y = priceScale(value);
      
      // Only add lines within the price chart area
      if (y >= padding && y <= padding + priceHeight) {
        gridLines.push({
          id: `grid-${value}`,
          y,
          value
        });
      }
    }
    
    return gridLines;
  };
  
  // Handle candle hover
  const handleCandleHover = (event: React.MouseEvent, candle: { dataPoint: CandlestickDataPoint; x: number }) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      dataPoint: candle.dataPoint
    });
    
    if (showCrosshair) {
      setCrosshairPosition({
        x: candle.x,
        y: event.nativeEvent.offsetY,
        visible: true
      });
    }
  };
  
  // Handle mouse move on chart
  const handleChartMouseMove = (event: React.MouseEvent) => {
    if (!showCrosshair || tooltipData) return;
    
    setCrosshairPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
      visible: true
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
    setCrosshairPosition(prev => ({ ...prev, visible: false }));
  };
  
  // Format tooltip content
  const formatTooltipContent = (dataPoint: CandlestickDataPoint) => {
    if (tooltipFormatter) {
      return tooltipFormatter(dataPoint);
    }
    
    const isUp = dataPoint.close > dataPoint.open;
    const isDown = dataPoint.close < dataPoint.open;
    const change = dataPoint.close - dataPoint.open;
    const changePercent = (change / dataPoint.open) * 100;
    
    return (
      <>
        <TooltipHeader>{dateFormatter(dataPoint.date)}</TooltipHeader>
        <TooltipContent>
          <TooltipRow>
            <TooltipLabel>Open:</TooltipLabel>
            <TooltipValue>{priceFormatter(dataPoint.open)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>High:</TooltipLabel>
            <TooltipValue>{priceFormatter(dataPoint.high)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Low:</TooltipLabel>
            <TooltipValue>{priceFormatter(dataPoint.low)}</TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Close:</TooltipLabel>
            <TooltipValue $isUp={isUp} $isDown={isDown}>
              {priceFormatter(dataPoint.close)}
            </TooltipValue>
          </TooltipRow>
          <TooltipRow>
            <TooltipLabel>Change:</TooltipLabel>
            <TooltipValue $isUp={isUp} $isDown={isDown}>
              {change >= 0 ? '+' : ''}{priceFormatter(change)} ({changePercent >= 0 ? '+' : ''}
              {changePercent.toFixed(2)}%)
            </TooltipValue>
          </TooltipRow>
          {dataPoint.volume !== undefined && (
            <TooltipRow>
              <TooltipLabel>Volume:</TooltipLabel>
              <TooltipValue>{volumeFormatter(dataPoint.volume)}</TooltipValue>
            </TooltipRow>
          )}
        </TooltipContent>
      </>
    );
  };
  
  // Render candlestick chart
  const renderCandlestickChart = () => {
    const { width, height, padding, priceHeight } = calculateChartDimensions();
    const { xScale } = calculateScales();
    
    const candles = generateCandles();
    const volumeBars = generateVolumeBars();
    const gridLines = generatePriceGridLines();
    
    return (
      <CandlestickContainer 
        ref={containerRef}
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ChartSvg ref={svgRef} width="100%" height="100%">
          {/* Price grid lines */}
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
                {priceFormatter(line.value)}
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
          
          {/* Price/Volume divider */}
          {showVolume && (
            <AxisLine
              x1={padding}
              y1={padding + priceHeight}
              x2={width - padding}
              y2={padding + priceHeight}
              strokeDasharray="4,4"
            />
          )}
          
          {/* X axis labels */}
          {candlestickData.map((dataPoint, index) => {
            // Only show a subset of labels to prevent overcrowding
            if (index % Math.ceil(candlestickData.length / 10) !== 0) return null;
            
            return (
              <AxisLabel
                key={`x-label-${index}`}
                x={xScale(index)}
                y={height - padding + 15}
              >
                {dateFormatter(dataPoint.date)}
              </AxisLabel>
            );
          })}
          
          {/* Volume bars */}
          <AnimatePresence>
            {volumeBars.map((bar, index) => (
              <VolumeBar
                key={bar.id}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={bar.color}
                initial={{ opacity: 0, y: height - padding, height: 0 }}
                animate={{ opacity: 1, y: bar.y, height: bar.height }}
                exit={{ opacity: 0, y: height - padding, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
              />
            ))}
          </AnimatePresence>
          
          {/* Candles */}
          <AnimatePresence>
            {candles.map((candle, index) => (
              <Candle
                key={candle.id}
                onMouseEnter={(e) => handleCandleHover(e, candle)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
              >
                {/* Wick */}
                <CandleWick
                  x1={candle.x}
                  y1={candle.high}
                  x2={candle.x}
                  y2={candle.low}
                  stroke={candle.color}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Body */}
                <CandleBody
                  x={candle.x - candle.barWidth / 2}
                  y={candle.bodyTop}
                  width={candle.barWidth}
                  height={candle.bodyHeight}
                  fill={candle.isUp ? 'white' : candle.color}
                  stroke={candle.color}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformOrigin: `${candle.x}px ${candle.bodyTop + candle.bodyHeight / 2}px` }}
                />
              </Candle>
            ))}
          </AnimatePresence>
          
          {/* Crosshair */}
          {showCrosshair && crosshairPosition.visible && (
            <>
              {/* Vertical line */}
              <CrosshairLine
                x1={crosshairPosition.x}
                y1={padding}
                x2={crosshairPosition.x}
                y2={height - padding}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              {/* Horizontal line */}
              <CrosshairLine
                x1={padding}
                y1={crosshairPosition.y}
                x2={width - padding}
                y2={crosshairPosition.y}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              {/* Y-axis label */}
              <CrosshairLabel
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CrosshairRect
                  x={padding - 40}
                  y={crosshairPosition.y - 10}
                  width={35}
                  height={20}
                />
                <CrosshairText
                  x={padding - 22.5}
                  y={crosshairPosition.y}
                >
                  {(() => {
                    const { priceScale, priceMin, priceMax } = calculateScales();
                    const { priceHeight, padding } = calculateChartDimensions();
                    
                    // Only show price if within price chart area
                    if (crosshairPosition.y >= padding && crosshairPosition.y <= padding + priceHeight) {
                      const value = priceMin + (priceMax - priceMin) * 
                        (1 - (crosshairPosition.y - padding) / priceHeight);
                      return priceFormatter(value);
                    }
                    
                    return '';
                  })()}
                </CrosshairText>
              </CrosshairLabel>
            </>
          )}
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
      </CandlestickContainer>
    );
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on window resize
      setTooltipData(null);
      setCrosshairPosition(prev => ({ ...prev, visible: false }));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Chart
      data={data}
      type="candlestick"
      {...chartProps}
    >
      {renderCandlestickChart()}
    </Chart>
  );
};

export default CandlestickChart;
