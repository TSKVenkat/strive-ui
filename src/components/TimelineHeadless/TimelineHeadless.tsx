import React, { createContext, useContext, forwardRef, Children, isValidElement, cloneElement } from 'react';
import useTimeline, { UseTimelineOptions, UseTimelineReturn } from './useTimeline';

// Create context for the timeline
export const TimelineContext = createContext<UseTimelineReturn | null>(null);

// Hook to use timeline context
export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext must be used within a TimelineHeadless.Root component');
  }
  return context;
};

// Types for the compound components
export interface TimelineRootProps extends React.HTMLAttributes<HTMLDivElement>, UseTimelineOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The index of the item
   */
  index: number;
  
  /**
   * The component used for the item node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the connector node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the dot node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the content node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineDateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the date node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the title node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the description node
   * @default 'div'
   */
  as?: React.ElementType;
}

// Root component
const Root = forwardRef<HTMLDivElement, TimelineRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract timeline options from props
    const {
      orientation,
      alignment,
      sortOrder,
      collapseOnMobile,
      mobileBreakpoint,
      animateOnScroll,
      initialActiveIndex,
      onItemActivate,
      ...restProps
    } = props;
    
    // Use the timeline hook
    const timelineState = useTimeline({
      orientation,
      alignment,
      sortOrder,
      collapseOnMobile,
      mobileBreakpoint,
      animateOnScroll,
      initialActiveIndex,
      onItemActivate,
    });
    
    // Get timeline props from the hook
    const timelineProps = timelineState.getTimelineProps();
    
    // Count valid children to set aria-setsize
    const childrenArray = Children.toArray(children);
    const itemCount = childrenArray.filter(
      (child) => isValidElement(child) && child.type === Item
    ).length;
    
    // Clone children to pass itemCount for aria-setsize
    const enhancedChildren = Children.map(children, (child) => {
      if (isValidElement(child) && child.type === Item) {
        return cloneElement(child, {
          ...child.props,
          itemCount,
        });
      }
      return child;
    });
    
    return (
      <TimelineContext.Provider value={timelineState}>
        <Component
          ref={ref}
          className={`strive-timeline ${timelineState.orientation} ${timelineState.alignment} ${className}`}
          {...timelineProps}
          {...restProps}
        >
          {enhancedChildren}
        </Component>
      </TimelineContext.Provider>
    );
  }
);

Root.displayName = 'TimelineHeadless.Root';

// Item component
const Item = forwardRef<HTMLDivElement, TimelineItemProps & { itemCount?: number }>(
  ({ as: Component = 'div', index, children, className = '', itemCount, ...props }, ref) => {
    const timeline = useTimelineContext();
    const itemProps = timeline.getItemProps(index);
    const position = timeline.getItemPosition(index);
    const isActive = timeline.activeIndex === index;
    
    // Update aria-setsize if itemCount is provided
    if (itemCount !== undefined) {
      itemProps['aria-setsize'] = itemCount;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-timeline-item ${position} ${isActive ? 'active' : ''} ${className}`}
        data-position={position}
        data-active={isActive}
        {...itemProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Item.displayName = 'TimelineHeadless.Item';

// Connector component
const Connector = forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const timeline = useTimelineContext();
    
    return (
      <Component
        ref={ref}
        className={`strive-timeline-connector ${timeline.orientation} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Connector.displayName = 'TimelineHeadless.Connector';

// Dot component
const Dot = forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-timeline-dot ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Dot.displayName = 'TimelineHeadless.Dot';

// Content component
const Content = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-timeline-content ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'TimelineHeadless.Content';

// Date component
const Date = forwardRef<HTMLDivElement, TimelineDateProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-timeline-date ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Date.displayName = 'TimelineHeadless.Date';

// Title component
const Title = forwardRef<HTMLDivElement, TimelineTitleProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-timeline-title ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = 'TimelineHeadless.Title';

// Description component
const Description = forwardRef<HTMLDivElement, TimelineDescriptionProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-timeline-description ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Description.displayName = 'TimelineHeadless.Description';

// Assemble the compound component
export const TimelineHeadless = {
  Root,
  Item,
  Connector,
  Dot,
  Content,
  Date,
  Title,
  Description,
  useTimeline,
};

export default TimelineHeadless;
