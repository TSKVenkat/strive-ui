import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, ChartProps } from './Chart';

export interface GanttTask {
  /**
   * Unique ID for the task
   */
  id: string;
  /**
   * Task name
   */
  name: string;
  /**
   * Start date
   */
  start: Date;
  /**
   * End date
   */
  end: Date;
  /**
   * Task progress (0-100)
   */
  progress?: number;
  /**
   * Dependencies (IDs of tasks that must be completed before this one)
   */
  dependencies?: string[];
  /**
   * Task type or category
   */
  type?: string;
  /**
   * Optional color for the task
   */
  color?: string;
}

export interface GanttChartProps extends Omit<ChartProps, 'type' | 'children' | 'data'> {
  /**
   * Tasks to display in the Gantt chart
   */
  tasks: GanttTask[];
  /**
   * View mode ('day' | 'week' | 'month')
   */
  viewMode?: 'day' | 'week' | 'month';
  /**
   * Whether to show the timeline header
   */
  showHeader?: boolean;
  /**
   * Whether to show the task list
   */
  showTaskList?: boolean;
  /**
   * Whether to show progress bars
   */
  showProgress?: boolean;
  /**
   * Whether to show dependencies
   */
  showDependencies?: boolean;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (task: GanttTask) => string;
  /**
   * Whether to enable task selection
   */
  selectable?: boolean;
  /**
   * Callback when a task is selected
   */
  onTaskSelect?: (taskId: string) => void;
  /**
   * Whether to show today's date line
   */
  showTodayLine?: boolean;
  /**
   * Whether to animate on data change
   */
  animateOnDataChange?: boolean;
}

// Styled components
const GanttContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GanttHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const TaskListHeader = styled.div`
  width: 200px;
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const TimelineHeader = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TimeUnit = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[700]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
`;

const GanttBody = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
`;

const TaskList = styled.div`
  width: 200px;
  min-width: 200px;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  overflow-y: auto;
`;

const TaskItem = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timeline = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
`;

const TimeGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
`;

const TimeGridLine = styled.div`
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const TaskRow = styled.div`
  position: relative;
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const TaskBar = styled(motion.div)<{ $color: string; $selected: boolean }>`
  position: absolute;
  height: 24px;
  top: 8px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  box-shadow: ${({ theme, $selected }) => $selected ? theme.shadows.md : theme.shadows.sm};
  border: ${({ $selected }) => $selected ? '2px solid #fff' : 'none'};
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px 0 0 4px;
  pointer-events: none;
`;

const TaskLabel = styled.div`
  position: absolute;
  top: 0;
  left: 4px;
  right: 4px;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.common.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const DependencyLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const TodayLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${({ theme }) => theme.colors.error.main};
  z-index: 2;
`;

const TooltipContainer = styled(motion.div)`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  pointer-events: none;
  z-index: 10;
  min-width: 200px;
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
`;

/**
 * GanttChart component displays tasks over time with dependencies,
 * with customization options and interactive features.
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  viewMode = 'week',
  showHeader = true,
  showTaskList = true,
  showProgress = true,
  showDependencies = true,
  showTooltips = true,
  tooltipFormatter,
  selectable = true,
  onTaskSelect,
  showTodayLine = true,
  animateOnDataChange = true,
  ...chartProps
}) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    task: GanttTask;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Calculate date range for the chart
  const calculateDateRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21)
      };
    }
    
    let minDate = new Date(Math.min(...tasks.map(task => task.start.getTime())));
    let maxDate = new Date(Math.max(...tasks.map(task => task.end.getTime())));
    
    // Add padding
    switch (viewMode) {
      case 'day':
        minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() - 2);
        maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 2);
        break;
      case 'week':
        minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() - 7);
        maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 7);
        break;
      case 'month':
        minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 1, 1);
        maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
        break;
    }
    
    return { start: minDate, end: maxDate };
  };
  
  // Generate time units for the header
  const generateTimeUnits = () => {
    const { start, end } = calculateDateRange();
    const units: Date[] = [];
    
    switch (viewMode) {
      case 'day':
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          units.push(new Date(d));
        }
        break;
      case 'week':
        // Start from the beginning of the week
        const weekStart = new Date(start);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        for (let d = new Date(weekStart); d <= end; d.setDate(d.getDate() + 7)) {
          units.push(new Date(d));
        }
        break;
      case 'month':
        for (let d = new Date(start.getFullYear(), start.getMonth(), 1); 
             d <= end; 
             d.setMonth(d.getMonth() + 1)) {
          units.push(new Date(d));
        }
        break;
    }
    
    return units;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    switch (viewMode) {
      case 'day':
        return `${date.getDate()}/${date.getMonth() + 1}`;
      case 'week':
        return `Week ${Math.ceil((date.getDate() + date.getDay()) / 7)} - ${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'month':
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }
  };
  
  // Calculate task position and width
  const calculateTaskPosition = (task: GanttTask) => {
    const { start, end } = calculateDateRange();
    const timeUnits = generateTimeUnits();
    
    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const taskStartDays = (task.start.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
    
    const unitWidth = timelineRef.current ? timelineRef.current.clientWidth / timeUnits.length : 0;
    
    let left: number;
    let width: number;
    
    switch (viewMode) {
      case 'day':
        left = taskStartDays * unitWidth;
        width = Math.max(taskDuration * unitWidth, 8); // Minimum width
        break;
      case 'week':
        const weeksFromStart = taskStartDays / 7;
        const durationInWeeks = taskDuration / 7;
        left = weeksFromStart * unitWidth;
        width = Math.max(durationInWeeks * unitWidth, 8);
        break;
      case 'month':
        const monthsFromStart = (task.start.getMonth() - start.getMonth()) + 
                               (task.start.getFullYear() - start.getFullYear()) * 12;
        const durationInMonths = (task.end.getMonth() - task.start.getMonth()) + 
                                (task.end.getFullYear() - task.start.getFullYear()) * 12;
        left = monthsFromStart * unitWidth;
        width = Math.max(durationInMonths * unitWidth, 8);
        break;
    }
    
    return { left, width };
  };
  
  // Calculate today line position
  const calculateTodayPosition = () => {
    const { start, end } = calculateDateRange();
    const timeUnits = generateTimeUnits();
    const today = new Date();
    
    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceStart = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    const unitWidth = timelineRef.current ? timelineRef.current.clientWidth / timeUnits.length : 0;
    
    let left: number;
    
    switch (viewMode) {
      case 'day':
        left = daysSinceStart * unitWidth;
        break;
      case 'week':
        const weeksSinceStart = daysSinceStart / 7;
        left = weeksSinceStart * unitWidth;
        break;
      case 'month':
        const monthsSinceStart = (today.getMonth() - start.getMonth()) + 
                                (today.getFullYear() - start.getFullYear()) * 12;
        left = monthsSinceStart * unitWidth;
        break;
    }
    
    return left;
  };
  
  // Handle task click
  const handleTaskClick = (taskId: string) => {
    if (!selectable) return;
    
    setSelectedTask(taskId);
    
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };
  
  // Handle task hover
  const handleTaskHover = (event: React.MouseEvent, task: GanttTask) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      task
    });
  };
  
  // Handle task leave
  const handleTaskLeave = () => {
    setTooltipData(null);
  };
  
  // Format tooltip content
  const formatTooltipContent = (task: GanttTask) => {
    if (tooltipFormatter) {
      return tooltipFormatter(task);
    }
    
    return (
      <>
        <TooltipRow>
          <span>Start:</span>
          <span>{task.start.toLocaleDateString()}</span>
        </TooltipRow>
        <TooltipRow>
          <span>End:</span>
          <span>{task.end.toLocaleDateString()}</span>
        </TooltipRow>
        {task.progress !== undefined && (
          <TooltipRow>
            <span>Progress:</span>
            <span>{task.progress}%</span>
          </TooltipRow>
        )}
        {task.type && (
          <TooltipRow>
            <span>Type:</span>
            <span>{task.type}</span>
          </TooltipRow>
        )}
      </>
    );
  };
  
  // Get color for a task
  const getTaskColor = (task: GanttTask, index: number) => {
    if (task.color) return task.color;
    
    const colors = chartProps.colors || [
      '#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', 
      '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#e91e63'
    ];
    
    // Use type for consistent coloring if available
    if (task.type) {
      const typeIndex = Array.from(new Set(tasks.map(t => t.type))).indexOf(task.type);
      return colors[typeIndex % colors.length];
    }
    
    return colors[index % colors.length];
  };
  
  // Render Gantt chart
  const renderGantt = () => {
    const timeUnits = generateTimeUnits();
    
    return (
      <GanttContainer ref={containerRef}>
        {/* Header */}
        {showHeader && (
          <GanttHeader>
            {showTaskList && <TaskListHeader>Task</TaskListHeader>}
            <TimelineHeader>
              {timeUnits.map((unit, i) => (
                <TimeUnit 
                  key={i} 
                  style={{ width: `${100 / timeUnits.length}%` }}
                >
                  {formatDate(unit)}
                </TimeUnit>
              ))}
            </TimelineHeader>
          </GanttHeader>
        )}
        
        {/* Body */}
        <GanttBody>
          {/* Task List */}
          {showTaskList && (
            <TaskList>
              {tasks.map((task, i) => (
                <TaskItem key={task.id}>
                  {task.name}
                </TaskItem>
              ))}
            </TaskList>
          )}
          
          {/* Timeline */}
          <Timeline ref={timelineRef}>
            {/* Time grid */}
            <TimeGrid>
              {timeUnits.map((unit, i) => (
                <TimeGridLine 
                  key={i} 
                  style={{ width: `${100 / timeUnits.length}%` }}
                />
              ))}
            </TimeGrid>
            
            {/* Today line */}
            {showTodayLine && (
              <TodayLine style={{ left: `${calculateTodayPosition()}px` }} />
            )}
            
            {/* Tasks */}
            {tasks.map((task, i) => {
              const { left, width } = calculateTaskPosition(task);
              const isSelected = task.id === selectedTask;
              
              return (
                <TaskRow key={task.id}>
                  <TaskBar
                    $color={getTaskColor(task, i)}
                    $selected={isSelected}
                    style={{ left: `${left}px`, width: `${width}px` }}
                    onClick={() => handleTaskClick(task.id)}
                    onMouseEnter={(e) => handleTaskHover(e, task)}
                    onMouseLeave={handleTaskLeave}
                    initial={{ opacity: 0, scaleY: 0.5 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.5 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    {showProgress && task.progress !== undefined && (
                      <ProgressBar $progress={task.progress} />
                    )}
                    <TaskLabel>{task.name}</TaskLabel>
                  </TaskBar>
                </TaskRow>
              );
            })}
            
            {/* Dependencies */}
            {showDependencies && (
              <DependencyLine>
                {tasks.filter(task => task.dependencies && task.dependencies.length > 0).map(task => {
                  const { left: targetLeft, width: targetWidth } = calculateTaskPosition(task);
                  const targetTaskIndex = tasks.findIndex(t => t.id === task.id);
                  
                  return task.dependencies?.map((depId, i) => {
                    const sourceTask = tasks.find(t => t.id === depId);
                    if (!sourceTask) return null;
                    
                    const sourceTaskIndex = tasks.findIndex(t => t.id === depId);
                    const { left: sourceLeft, width: sourceWidth } = calculateTaskPosition(sourceTask);
                    
                    // Calculate path
                    const sourceX = sourceLeft + sourceWidth;
                    const sourceY = sourceTaskIndex * 40 + 20;
                    const targetX = targetLeft;
                    const targetY = targetTaskIndex * 40 + 20;
                    
                    const path = `
                      M ${sourceX} ${sourceY}
                      C ${sourceX + 20} ${sourceY},
                        ${targetX - 20} ${targetY},
                        ${targetX} ${targetY}
                    `;
                    
                    return (
                      <path
                        key={`${task.id}-${depId}`}
                        d={path}
                        fill="none"
                        stroke="#999"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  });
                })}
                
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="4"
                    refX="6"
                    refY="2"
                    orient="auto"
                  >
                    <path d="M0,0 L6,2 L0,4 Z" fill="#999" />
                  </marker>
                </defs>
              </DependencyLine>
            )}
          </Timeline>
        </GanttBody>
        
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
            <TooltipHeader>{tooltipData.task.name}</TooltipHeader>
            <TooltipContent>
              {formatTooltipContent(tooltipData.task)}
            </TooltipContent>
          </TooltipContainer>
        )}
      </GanttContainer>
    );
  };
  
  return (
    <Chart
      data={{
        labels: tasks.map(task => task.name),
        series: [{
          name: 'Duration',
          data: tasks.map(task => (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24))
        }]
      }}
      type="gantt"
      {...chartProps}
    >
      {renderGantt()}
    </Chart>
  );
};

export default GanttChart;
