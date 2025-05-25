import React, { forwardRef } from 'react';

export type TimelineVariant = 'vertical' | 'horizontal' | 'alternating' | 'centered';
export type TimelineAlignment = 'left' | 'right' | 'center';
export type TimelineGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type TimelineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface TimelineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The timeline items to render
   */
  children: React.ReactNode;
  
  /**
   * Timeline variant
   * @default 'vertical'
   */
  variant?: TimelineVariant;
  
  /**
   * Alignment of timeline items (for vertical variant)
   * @default 'left'
   */
  align?: TimelineAlignment;
  
  /**
   * Gap between timeline items
   * @default 'md'
   */
  gap?: TimelineGap;
  
  /**
   * Size of the timeline connector and dots
   * @default 'md'
   */
  size?: TimelineSize;
  
  /**
   * Color of the timeline connector
   * @default '#e0e0e0'
   */
  connectorColor?: string;
  
  /**
   * Color of the timeline dots
   * @default '#1976d2'
   */
  dotColor?: string;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether to reverse the order of items
   * @default false
   */
  reverse?: boolean;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * TimelineLayout component for creating timeline layouts
 */
export const TimelineLayout = forwardRef<HTMLDivElement, TimelineLayoutProps>(
  (
    {
      children,
      variant = 'vertical',
      align = 'left',
      gap = 'md',
      size = 'md',
      connectorColor = '#e0e0e0',
      dotColor = '#1976d2',
      fullWidth = true,
      reverse = false,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: TimelineGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };
    
    // Map size values to dot and connector sizes
    const sizeMap = {
      xs: { dot: '0.5rem', connector: '1px' },
      sm: { dot: '0.75rem', connector: '2px' },
      md: { dot: '1rem', connector: '2px' },
      lg: { dot: '1.25rem', connector: '3px' },
      xl: { dot: '1.5rem', connector: '4px' },
    };
    
    // Get dot and connector sizes
    const dotSize = sizeMap[size].dot;
    const connectorSize = sizeMap[size].connector;

    // Build the style object based on variant
    let timelineStyle: React.CSSProperties = {
      position: 'relative',
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    // Process children to apply timeline styles
    const processedChildren = React.Children.toArray(children).filter(React.isValidElement);
    
    // Reverse items if needed
    const orderedChildren = reverse ? [...processedChildren].reverse() : processedChildren;
    
    // Apply styles based on variant
    switch (variant) {
      case 'vertical':
        timelineStyle = {
          ...timelineStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: getGapValue(gap),
          paddingTop: getGapValue(gap),
          paddingBottom: getGapValue(gap),
        };
        
        // Add a vertical line (connector)
        const verticalConnectorStyle: React.CSSProperties = {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: connectorSize,
          backgroundColor: connectorColor,
          ...(align === 'left' && { left: `calc(${dotSize} / 2)`, transform: 'translateX(-50%)' }),
          ...(align === 'right' && { right: `calc(${dotSize} / 2)`, transform: 'translateX(50%)' }),
          ...(align === 'center' && { left: '50%', transform: 'translateX(-50%)' }),
        };
        
        return (
          <Component
            ref={ref}
            className={`strive-timeline strive-timeline-${variant} strive-timeline-${align} ${className}`}
            style={timelineStyle}
            {...rest}
          >
            <div className="strive-timeline-connector" style={verticalConnectorStyle} />
            {orderedChildren.map((child, index) => {
              if (!React.isValidElement(child)) return null;
              
              const isFirst = index === 0;
              const isLast = index === orderedChildren.length - 1;
              
              const itemStyle: React.CSSProperties = {
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                ...(align === 'left' && { paddingLeft: `calc(${dotSize} * 2)` }),
                ...(align === 'right' && { paddingRight: `calc(${dotSize} * 2)`, flexDirection: 'row-reverse' }),
                ...(align === 'center' && { 
                  justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                  paddingLeft: index % 2 === 0 ? `calc(50% + ${dotSize})` : 0,
                  paddingRight: index % 2 === 1 ? `calc(50% + ${dotSize})` : 0,
                }),
              };
              
              const dotStyle: React.CSSProperties = {
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: dotColor,
                top: 0,
                ...(align === 'left' && { left: 0 }),
                ...(align === 'right' && { right: 0 }),
                ...(align === 'center' && { left: '50%', transform: 'translateX(-50%)' }),
              };
              
              return (
                <div key={index} className="strive-timeline-item" style={itemStyle}>
                  <div className="strive-timeline-dot" style={dotStyle} />
                  <div className="strive-timeline-content" style={{ flex: 1 }}>
                    {child}
                  </div>
                </div>
              );
            })}
          </Component>
        );
        
      case 'horizontal':
        timelineStyle = {
          ...timelineStyle,
          display: 'flex',
          flexDirection: 'row',
          gap: getGapValue(gap),
          paddingLeft: getGapValue(gap),
          paddingRight: getGapValue(gap),
          overflowX: 'auto',
        };
        
        // Add a horizontal line (connector)
        const horizontalConnectorStyle: React.CSSProperties = {
          position: 'absolute',
          left: 0,
          right: 0,
          height: connectorSize,
          backgroundColor: connectorColor,
          ...(align === 'left' && { top: `calc(${dotSize} / 2)`, transform: 'translateY(-50%)' }),
          ...(align === 'right' && { bottom: `calc(${dotSize} / 2)`, transform: 'translateY(50%)' }),
          ...(align === 'center' && { top: '50%', transform: 'translateY(-50%)' }),
        };
        
        return (
          <Component
            ref={ref}
            className={`strive-timeline strive-timeline-${variant} strive-timeline-${align} ${className}`}
            style={timelineStyle}
            {...rest}
          >
            <div className="strive-timeline-connector" style={horizontalConnectorStyle} />
            {orderedChildren.map((child, index) => {
              if (!React.isValidElement(child)) return null;
              
              const isFirst = index === 0;
              const isLast = index === orderedChildren.length - 1;
              
              const itemStyle: React.CSSProperties = {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: '0 0 auto',
                width: `calc((100% - (${getGapValue(gap)} * ${orderedChildren.length - 1})) / ${orderedChildren.length})`,
                minWidth: '200px',
                ...(align === 'left' && { paddingTop: `calc(${dotSize} * 2)` }),
                ...(align === 'right' && { paddingBottom: `calc(${dotSize} * 2)`, flexDirection: 'column-reverse' }),
                ...(align === 'center' && { 
                  alignItems: 'center',
                  paddingTop: index % 2 === 0 ? `calc(${dotSize} * 2)` : 0,
                  paddingBottom: index % 2 === 1 ? `calc(${dotSize} * 2)` : 0,
                  flexDirection: index % 2 === 1 ? 'column-reverse' : 'column',
                }),
              };
              
              const dotStyle: React.CSSProperties = {
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: dotColor,
                ...(align === 'left' && { top: 0, left: '50%', transform: 'translateX(-50%)' }),
                ...(align === 'right' && { bottom: 0, left: '50%', transform: 'translateX(-50%)' }),
                ...(align === 'center' && { 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  ...(index % 2 === 0 ? { top: 0 } : { bottom: 0 }),
                }),
              };
              
              return (
                <div key={index} className="strive-timeline-item" style={itemStyle}>
                  <div className="strive-timeline-dot" style={dotStyle} />
                  <div className="strive-timeline-content" style={{ flex: 1 }}>
                    {child}
                  </div>
                </div>
              );
            })}
          </Component>
        );
        
      case 'alternating':
        timelineStyle = {
          ...timelineStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: getGapValue(gap),
          paddingTop: getGapValue(gap),
          paddingBottom: getGapValue(gap),
        };
        
        // Add a vertical line (connector)
        const alternatingConnectorStyle: React.CSSProperties = {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: connectorSize,
          backgroundColor: connectorColor,
          left: '50%',
          transform: 'translateX(-50%)',
        };
        
        return (
          <Component
            ref={ref}
            className={`strive-timeline strive-timeline-${variant} ${className}`}
            style={timelineStyle}
            {...rest}
          >
            <div className="strive-timeline-connector" style={alternatingConnectorStyle} />
            {orderedChildren.map((child, index) => {
              if (!React.isValidElement(child)) return null;
              
              const isFirst = index === 0;
              const isLast = index === orderedChildren.length - 1;
              const isEven = index % 2 === 0;
              
              const itemStyle: React.CSSProperties = {
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: isEven ? 'flex-end' : 'flex-start',
              };
              
              const contentStyle: React.CSSProperties = {
                width: 'calc(50% - 20px)',
                paddingLeft: isEven ? 0 : `calc(${dotSize} * 2)`,
                paddingRight: isEven ? `calc(${dotSize} * 2)` : 0,
                textAlign: isEven ? 'right' : 'left' as 'right' | 'left',
              };
              
              const dotStyle: React.CSSProperties = {
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: dotColor,
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              };
              
              return (
                <div key={index} className="strive-timeline-item" style={itemStyle}>
                  <div className="strive-timeline-dot" style={dotStyle} />
                  <div className="strive-timeline-content" style={contentStyle}>
                    {child}
                  </div>
                </div>
              );
            })}
          </Component>
        );
        
      case 'centered':
        timelineStyle = {
          ...timelineStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: getGapValue(gap),
          paddingTop: getGapValue(gap),
          paddingBottom: getGapValue(gap),
        };
        
        // Add a vertical line (connector)
        const centeredConnectorStyle: React.CSSProperties = {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: connectorSize,
          backgroundColor: connectorColor,
          left: '50%',
          transform: 'translateX(-50%)',
        };
        
        return (
          <Component
            ref={ref}
            className={`strive-timeline strive-timeline-${variant} ${className}`}
            style={timelineStyle}
            {...rest}
          >
            <div className="strive-timeline-connector" style={centeredConnectorStyle} />
            {orderedChildren.map((child, index) => {
              if (!React.isValidElement(child)) return null;
              
              const isFirst = index === 0;
              const isLast = index === orderedChildren.length - 1;
              
              const itemStyle: React.CSSProperties = {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: `calc(${dotSize} * 2)`,
                textAlign: 'center',
                maxWidth: '500px',
              };
              
              const dotStyle: React.CSSProperties = {
                position: 'absolute',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: dotColor,
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              };
              
              return (
                <div key={index} className="strive-timeline-item" style={itemStyle}>
                  <div className="strive-timeline-dot" style={dotStyle} />
                  <div className="strive-timeline-content" style={{ flex: 1 }}>
                    {child}
                  </div>
                </div>
              );
            })}
          </Component>
        );
    }
  }
);

TimelineLayout.displayName = 'TimelineLayout';

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the timeline item
   */
  children?: React.ReactNode;
  
  /**
   * Title of the timeline item
   */
  title?: React.ReactNode;
  
  /**
   * Subtitle or date of the timeline item
   */
  subtitle?: React.ReactNode;
  
  /**
   * Icon to display in the timeline dot
   */
  icon?: React.ReactNode;
  
  /**
   * Custom dot color for this item
   */
  dotColor?: string;
  
  /**
   * Whether the item is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the item is completed
   * @default false
   */
  completed?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * TimelineItem component for individual items within a TimelineLayout
 */
export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      children,
      title,
      subtitle,
      icon,
      dotColor,
      active = false,
      completed = false,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const itemStyle: React.CSSProperties = {
      ...style,
    };

    // Build the class name
    const itemClassName = `strive-timeline-item ${active ? 'strive-timeline-item-active' : ''} ${completed ? 'strive-timeline-item-completed' : ''} ${className}`;

    return (
      <div
        ref={ref}
        className={itemClassName}
        style={itemStyle}
        {...rest}
      >
        {title && <div className="strive-timeline-item-title" style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{title}</div>}
        {subtitle && <div className="strive-timeline-item-subtitle" style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{subtitle}</div>}
        {children}
      </div>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';
