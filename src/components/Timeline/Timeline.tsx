import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface TimelineItem {
  /** Unique identifier for the timeline item */
  id: string | number;
  /** Title of the timeline item */
  title: string;
  /** Description or content of the timeline item */
  content: React.ReactNode;
  /** Date or time of the timeline item */
  date?: string;
  /** Icon to display for the timeline item */
  icon?: React.ReactNode;
  /** Additional metadata for the timeline item */
  meta?: React.ReactNode;
  /** Whether the timeline item is active */
  active?: boolean;
  /** Whether the timeline item is completed */
  completed?: boolean;
  /** Custom color for the timeline item */
  color?: string;
}

export interface TimelineProps {
  /** Array of timeline items */
  items: TimelineItem[];
  /** Orientation of the timeline */
  orientation?: 'vertical' | 'horizontal';
  /** Alignment of the timeline items (vertical orientation only) */
  align?: 'left' | 'right' | 'alternate';
  /** Whether to animate the timeline items on mount */
  animate?: boolean;
  /** Whether to show the connector line */
  showConnector?: boolean;
  /** Custom connector color */
  connectorColor?: string;
  /** Custom connector width */
  connectorWidth?: string;
  /** Custom dot size */
  dotSize?: string;
  /** Additional className for the container */
  className?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
}

const Container = styled.div<{
  orientation: 'vertical' | 'horizontal';
}>`
  display: flex;
  flex-direction: ${({ orientation }) => (orientation === 'vertical' ? 'column' : 'row')};
  position: relative;
  width: 100%;
  ${({ orientation }) => orientation === 'horizontal' && `
    overflow-x: auto;
    padding-bottom: 16px;
  `}
`;

const TimelineConnector = styled.div<{
  orientation: 'vertical' | 'horizontal';
  connectorColor?: string;
  connectorWidth?: string;
}>`
  position: absolute;
  background-color: ${({ theme, connectorColor }) => connectorColor || theme.colors.neutral[300]};
  
  ${({ orientation, connectorWidth }) => orientation === 'vertical' ? `
    width: ${connectorWidth || '2px'};
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  ` : `
    height: ${connectorWidth || '2px'};
    left: 0;
    right: 0;
    top: 24px;
  `}
`;

const TimelineItemContainer = styled(motion.div)<{
  orientation: 'vertical' | 'horizontal';
  align: 'left' | 'right' | 'alternate';
  index: number;
}>`
  display: flex;
  position: relative;
  
  ${({ orientation, align, index }) => orientation === 'vertical' ? `
    flex-direction: ${align === 'right' ? 'row' : align === 'left' ? 'row-reverse' : index % 2 === 0 ? 'row' : 'row-reverse'};
    margin-bottom: 32px;
    
    &:last-child {
      margin-bottom: 0;
    }
  ` : `
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 150px;
    
    &:first-child {
      .timeline-dot-container {
        &::before {
          display: none;
        }
      }
    }
    
    &:last-child {
      .timeline-dot-container {
        &::after {
          display: none;
        }
      }
    }
  `}
`;

const TimelineDot = styled.div<{
  active?: boolean;
  completed?: boolean;
  color?: string;
  dotSize?: string;
}>`
  width: ${({ dotSize }) => dotSize || '24px'};
  height: ${({ dotSize }) => dotSize || '24px'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active, completed, color }) => 
    color || (active 
      ? theme.colors.primary[600] 
      : completed 
        ? theme.colors.success 
        : theme.colors.neutral[400])};
  color: ${({ theme }) => theme.colors.neutral[100]};
  z-index: 1;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimelineDotContainer = styled.div<{
  orientation: 'vertical' | 'horizontal';
  connectorColor?: string;
  connectorWidth?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  ${({ orientation, connectorColor, connectorWidth }) => orientation === 'vertical' ? `
    padding: 0 16px;
  ` : `
    padding: 16px 0;
    
    &::before, &::after {
      content: '';
      position: absolute;
      height: ${connectorWidth || '2px'};
      background-color: ${connectorColor || '#e0e0e0'};
      top: 50%;
      transform: translateY(-50%);
    }
    
    &::before {
      left: -50%;
      right: 50%;
    }
    
    &::after {
      left: 50%;
      right: -50%;
    }
  `}
`;

const TimelineContent = styled.div<{
  orientation: 'vertical' | 'horizontal';
  align: 'left' | 'right' | 'alternate';
  index: number;
}>`
  flex: 1;
  padding: ${({ orientation }) => orientation === 'vertical' ? '0 16px' : '16px 8px'};
  ${({ orientation, align, index }) => orientation === 'vertical' && `
    text-align: ${align === 'right' ? 'left' : align === 'left' ? 'right' : index % 2 === 0 ? 'left' : 'right'};
  `}
  ${({ orientation }) => orientation === 'horizontal' && `
    text-align: center;
  `}
`;

const TimelineTitle = styled.h3`
  margin: 0 0 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const TimelineDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const TimelineDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: 4px;
`;

const TimelineMeta = styled.div`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor" />
  </svg>
);

export const Timeline = ({
  items,
  orientation = 'vertical',
  align = 'alternate',
  animate = true,
  showConnector = true,
  connectorColor,
  connectorWidth,
  dotSize,
  className,
  style,
}: TimelineProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: orientation === 'vertical' ? 20 : 0,
      x: orientation === 'horizontal' ? 20 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container 
      orientation={orientation} 
      className={className} 
      style={style}
      role="list"
      aria-label="Timeline"
      as={animate ? motion.div : 'div'}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
    >
      {showConnector && (
        <TimelineConnector 
          orientation={orientation}
          connectorColor={connectorColor}
          connectorWidth={connectorWidth}
        />
      )}
      
      {items.map((item, index) => (
        <TimelineItemContainer
          key={item.id}
          orientation={orientation}
          align={align}
          index={index}
          variants={animate ? itemVariants : undefined}
          role="listitem"
          aria-current={item.active ? 'step' : undefined}
        >
          <TimelineDotContainer 
            orientation={orientation}
            connectorColor={connectorColor}
            connectorWidth={connectorWidth}
            className="timeline-dot-container"
          >
            <TimelineDot 
              active={item.active} 
              completed={item.completed}
              color={item.color}
              dotSize={dotSize}
            >
              {item.icon || (item.completed ? <CheckIcon /> : null)}
            </TimelineDot>
          </TimelineDotContainer>
          
          <TimelineContent 
            orientation={orientation} 
            align={align} 
            index={index}
          >
            {item.date && <TimelineDate>{item.date}</TimelineDate>}
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineDescription>{item.content}</TimelineDescription>
            {item.meta && <TimelineMeta>{item.meta}</TimelineMeta>}
          </TimelineContent>
        </TimelineItemContainer>
      ))}
    </Container>
  );
};

Timeline.displayName = 'Timeline';
