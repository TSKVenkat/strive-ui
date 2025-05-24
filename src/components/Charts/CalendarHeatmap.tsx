import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface CalendarHeatmapData {
  /**
   * Date of the data point
   */
  date: Date;
  /**
   * Value for the date
   */
  value: number;
  /**
   * Optional label for the date
   */
  label?: string;
}

export interface CalendarHeatmapProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Calendar heatmap data
   */
  data: CalendarHeatmapData[];
  /**
   * Start date for the calendar
   */
  startDate?: Date;
  /**
   * End date for the calendar
   */
  endDate?: Date;
  /**
   * View mode ('year' | 'month' | 'week')
   */
  viewMode?: 'year' | 'month' | 'week';
  /**
   * Whether to show month labels
   */
  showMonthLabels?: boolean;
  /**
   * Whether to show day labels
   */
  showDayLabels?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (date: Date, value: number, label?: string) => string;
  /**
   * Color range for the heatmap
   */
  colorRange?: string[];
  /**
   * Whether to use a logarithmic scale for color mapping
   */
  logScale?: boolean;
  /**
   * Whether to show a color legend
   */
  showColorLegend?: boolean;
  /**
   * Cell size in pixels
   */
  cellSize?: number;
  /**
   * Cell padding in pixels
   */
  cellPadding?: number;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const CalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: auto repeat(53, auto);
  grid-template-rows: auto repeat(7, auto);
`;

const MonthLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  text-align: center;
  padding: 4px;
`;

const DayLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: right;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Cell = styled(motion.div)<{ $color: string; $size: number; $padding: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin: ${({ $padding }) => $padding}px;
  background-color: ${({ $color }) => $color};
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const ColorLegend = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const ColorGradient = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ColorBox = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${({ $color }) => $color};
  margin-right: 2px;
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.neutral[700]};
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
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

/**
 * CalendarHeatmap component displays data over time in a calendar view,
 * with color intensity representing values.
 */
export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  startDate,
  endDate,
  viewMode = 'year',
  showMonthLabels = true,
  showDayLabels = true,
  showTooltips = true,
  tooltipFormatter,
  colorRange = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  logScale = false,
  showColorLegend = true,
  cellSize = 12,
  cellPadding = 2,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    date: Date;
    value: number;
    label?: string;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate date range
  const calculateDateRange = () => {
    const today = new Date();
    
    let start = startDate;
    let end = endDate;
    
    if (!start || !end) {
      switch (viewMode) {
        case 'year':
          start = start || new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          end = end || today;
          break;
        case 'month':
          start = start || new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = end || new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
        case 'week':
          const day = today.getDay();
          start = start || new Date(today.getFullYear(), today.getMonth(), today.getDate() - day - 7);
          end = end || new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - day));
          break;
      }
    }
    
    // Adjust start date to the beginning of the week
    const adjustedStart = new Date(start);
    const startDay = adjustedStart.getDay();
    adjustedStart.setDate(adjustedStart.getDate() - startDay);
    
    return { start: adjustedStart, end };
  };
  
  // Generate dates for the calendar
  const generateCalendarDates = () => {
    const { start, end } = calculateDateRange();
    const dates: Date[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };
  
  // Get value for a date
  const getValueForDate = (date: Date) => {
    const dataPoint = data.find(d => 
      d.date.getFullYear() === date.getFullYear() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getDate() === date.getDate()
    );
    
    return dataPoint ? dataPoint.value : 0;
  };
  
  // Get label for a date
  const getLabelForDate = (date: Date) => {
    const dataPoint = data.find(d => 
      d.date.getFullYear() === date.getFullYear() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getDate() === date.getDate()
    );
    
    return dataPoint?.label;
  };
  
  // Find min and max values
  const getValueRange = () => {
    if (data.length === 0) return { min: 0, max: 0 };
    
    let min = Infinity;
    let max = -Infinity;
    
    data.forEach(d => {
      if (d.value < min) min = d.value;
      if (d.value > max) max = d.value;
    });
    
    return { min, max };
  };
  
  // Get color for a value
  const getColorForValue = (value: number) => {
    if (value === 0) return colorRange[0];
    
    const { min, max } = getValueRange();
    
    // Normalize value between 0 and 1
    let normalizedValue;
    
    if (logScale && min > 0 && max > 0 && value > 0) {
      // Logarithmic scale
      const logMin = Math.log(min);
      const logMax = Math.log(max);
      const logValue = Math.log(value);
      normalizedValue = (logValue - logMin) / (logMax - logMin);
    } else {
      // Linear scale
      normalizedValue = (value - min) / (max - min);
    }
    
    // Clamp between 0 and 1
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));
    
    // Map to color range
    const colorIndex = Math.floor(normalizedValue * (colorRange.length - 1));
    return colorRange[colorIndex + 1]; // Skip the first color (for zero values)
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle cell hover
  const handleCellHover = (event: React.MouseEvent, date: Date) => {
    if (!showTooltips) return;
    
    const value = getValueForDate(date);
    const label = getLabelForDate(date);
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      date,
      value,
      label
    });
  };
  
  // Handle cell leave
  const handleCellLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (date: Date, value: number, label?: string) => {
    if (tooltipFormatter) {
      return tooltipFormatter(date, value, label);
    }
    
    return `Value: ${value.toLocaleString()}${label ? `\n${label}` : ''}`;
  };
  
  // Render calendar
  const renderCalendar = () => {
    const calendarDates = generateCalendarDates();
    const { min, max } = getValueRange();
    
    // Group dates by week
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    calendarDates.forEach((date, i) => {
      currentWeek.push(date);
      
      if (date.getDay() === 6 || i === calendarDates.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Get month labels
    const monthLabels: { month: number; x: number }[] = [];
    calendarDates.forEach((date, i) => {
      if (date.getDate() === 1 || i === 0) {
        monthLabels.push({
          month: date.getMonth(),
          x: Math.floor(i / 7)
        });
      }
    });
    
    return (
      <CalendarContainer ref={containerRef}>
        <CalendarGrid>
          {/* Empty cell in top-left corner */}
          <div></div>
          
          {/* Month labels */}
          {showMonthLabels && monthLabels.map((label, i) => (
            <MonthLabel
              key={i}
              style={{
                gridColumn: `${label.x + 2} / span ${i < monthLabels.length - 1 ? monthLabels[i + 1].x - label.x : 53 - label.x}`
              }}
            >
              {new Date(0, label.month).toLocaleString('default', { month: 'short' })}
            </MonthLabel>
          ))}
          
          {/* Day labels */}
          {showDayLabels && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <DayLabel
              key={day}
              style={{
                gridRow: i + 2
              }}
            >
              {day}
            </DayLabel>
          ))}
          
          {/* Calendar cells */}
          <AnimatePresence>
            {weeks.map((week, weekIndex) => (
              week.map((date, dayIndex) => {
                const value = getValueForDate(date);
                const color = value > 0 ? getColorForValue(value) : colorRange[0];
                
                return (
                  <Cell
                    key={date.toISOString()}
                    $color={color}
                    $size={cellSize}
                    $padding={cellPadding}
                    style={{
                      gridColumn: weekIndex + 2,
                      gridRow: dayIndex + 2
                    }}
                    onMouseEnter={(e) => handleCellHover(e, date)}
                    onMouseLeave={handleCellLeave}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                  />
                );
              })
            ))}
          </AnimatePresence>
        </CalendarGrid>
        
        {/* Color legend */}
        {showColorLegend && (
          <ColorLegend>
            <ColorGradient>
              {colorRange.map((color, i) => (
                <ColorBox key={i} $color={color} />
              ))}
            </ColorGradient>
            <LegendLabels>
              <span>Less</span>
              <span>More</span>
            </LegendLabels>
          </ColorLegend>
        )}
        
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
            <TooltipHeader>{formatDate(tooltipData.date)}</TooltipHeader>
            <TooltipContent>
              {formatTooltipContent(tooltipData.date, tooltipData.value, tooltipData.label)}
            </TooltipContent>
          </TooltipContainer>
        )}
      </CalendarContainer>
    );
  };
  
  // Convert to Chart component format for compatibility
  const chartData = {
    labels: data.map(d => formatDate(d.date)),
    series: [{
      name: 'Value',
      data: data.map(d => d.value)
    }]
  };
  
  return (
    <Chart
      data={chartData}
      type="calendarHeatmap"
      {...chartProps}
    >
      {renderCalendar()}
    </Chart>
  );
};

export default CalendarHeatmap;
