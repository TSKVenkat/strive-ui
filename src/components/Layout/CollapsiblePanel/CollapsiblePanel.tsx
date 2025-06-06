import React, { forwardRef, useState, useRef, useEffect } from 'react';

export type CollapsibleDirection = 'vertical' | 'horizontal';
export type CollapsibleAnimation = 'slide' | 'fade' | 'both' | 'none';

export interface CollapsiblePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the collapsible panel
   */
  children: React.ReactNode;
  
  /**
   * The header content that will always be visible
   */
  header: React.ReactNode;
  
  /**
   * Whether the panel is expanded
   * @default false
   */
  expanded?: boolean;
  
  /**
   * The default expanded state (for uncontrolled component)
   * @default false
   */
  defaultExpanded?: boolean;
  
  /**
   * The direction of the collapse
   * @default 'vertical'
   */
  direction?: CollapsibleDirection;
  
  /**
   * The animation type
   * @default 'slide'
   */
  animation?: CollapsibleAnimation;
  
  /**
   * The duration of the animation in milliseconds
   * @default 300
   */
  animationDuration?: number;
  
  /**
   * Whether to disable the panel
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether to show a border around the panel
   * @default false
   */
  bordered?: boolean;
  
  /**
   * The border color
   * @default '#e0e0e0'
   */
  borderColor?: string;
  
  /**
   * Whether to add a shadow to the panel
   * @default false
   */
  shadowed?: boolean;
  
  /**
   * Whether to add rounded corners to the panel
   * @default false
   */
  rounded?: boolean | string;
  
  /**
   * Whether to show an icon in the header
   * @default true
   */
  showIcon?: boolean;
  
  /**
   * Custom icon for the expanded state
   */
  expandedIcon?: React.ReactNode;
  
  /**
   * Custom icon for the collapsed state
   */
  collapsedIcon?: React.ReactNode;
  
  /**
   * Callback when the panel is expanded or collapsed
   */
  onToggle?: (expanded: boolean) => void;
  
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
 * CollapsiblePanel component for creating expandable and collapsible content sections
 */
export const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  (
    {
      children,
      header,
      expanded: controlledExpanded,
      defaultExpanded = false,
      direction = 'vertical',
      animation = 'slide',
      animationDuration = 300,
      disabled = false,
      bordered = false,
      borderColor = '#e0e0e0',
      shadowed = false,
      rounded = false,
      showIcon = true,
      expandedIcon,
      collapsedIcon,
      onToggle,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // State for uncontrolled component
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
    
    // Determine if the component is controlled or uncontrolled
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : uncontrolledExpanded;
    
    // Ref for measuring content height/width
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentSize, setContentSize] = useState(0);
    
    // Calculate border radius
    const getBorderRadius = () => {
      if (!rounded) return undefined;
      if (rounded === true) return '0.25rem';
      return rounded;
    };
    
    // Update content size when expanded state changes or on resize
    useEffect(() => {
      const updateContentSize = () => {
        if (contentRef.current) {
          if (direction === 'vertical') {
            setContentSize(contentRef.current.scrollHeight);
          } else {
            setContentSize(contentRef.current.scrollWidth);
          }
        }
      };
      
      updateContentSize();
      
      // Add resize listener
      window.addEventListener('resize', updateContentSize);
      
      return () => {
        window.removeEventListener('resize', updateContentSize);
      };
    }, [expanded, direction, children]);
    
    // Handle toggle
    const handleToggle = () => {
      if (disabled) return;
      
      const newExpanded = !expanded;
      
      if (!isControlled) {
        setUncontrolledExpanded(newExpanded);
      }
      
      if (onToggle) {
        onToggle(newExpanded);
      }
    };
    
    // Default icons
    const defaultExpandedIcon = (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    );
    
    const defaultCollapsedIcon = (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    );
    
    // Determine which icon to show
    const icon = expanded 
      ? (expandedIcon || defaultExpandedIcon) 
      : (collapsedIcon || defaultCollapsedIcon);
    
    // Build the container style
    const containerStyle: React.CSSProperties = {
      overflow: 'hidden',
      ...(bordered && {
        border: `1px solid ${borderColor}`,
      }),
      ...(rounded && {
        borderRadius: getBorderRadius(),
      }),
      ...(shadowed && {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }),
      ...style,
    };
    
    // Build the header style
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '0.75rem 1rem',
      userSelect: 'none',
      opacity: disabled ? 0.6 : 1,
      ...(bordered && {
        borderBottom: expanded ? `1px solid ${borderColor}` : 'none',
      }),
    };
    
    // Build the content style
    const contentStyle: React.CSSProperties = {
      overflow: 'hidden',
      transition: animation !== 'none' 
        ? `${animation === 'both' || animation === 'slide' ? (direction === 'vertical' ? 'max-height' : 'max-width') : ''} ${animationDuration}ms ease, ${animation === 'both' || animation === 'fade' ? 'opacity' : ''} ${animationDuration}ms ease`
        : 'none',
      ...(direction === 'vertical' ? {
        maxHeight: expanded ? `${contentSize}px` : '0',
      } : {
        maxWidth: expanded ? `${contentSize}px` : '0',
      }),
      opacity: (animation === 'both' || animation === 'fade') ? (expanded ? 1 : 0) : 1,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-collapsible-panel ${expanded ? 'expanded' : 'collapsed'} ${className}`}
        style={containerStyle}
        {...rest}
      >
        <div 
          className="strive-collapsible-header" 
          style={headerStyle}
          onClick={handleToggle}
          aria-expanded={expanded}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <div className="strive-collapsible-header-content">
            {header}
          </div>
          {showIcon && (
            <div 
              className="strive-collapsible-icon"
              style={{
                transition: 'transform 0.3s ease',
                transform: direction === 'horizontal' && expanded ? 'rotate(-90deg)' : '',
              }}
            >
              {icon}
            </div>
          )}
        </div>
        
        <div 
          ref={contentRef}
          className="strive-collapsible-content"
          style={contentStyle}
        >
          <div className="strive-collapsible-content-inner" style={{ padding: '1rem' }}>
            {children}
          </div>
        </div>
      </Component>
    );
  }
);

CollapsiblePanel.displayName = 'CollapsiblePanel';

/**
 * CollapsibleGroup component for creating a group of collapsible panels
 */
export interface CollapsibleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The collapsible panels to render
   */
  children: React.ReactNode;
  
  /**
   * Whether to allow multiple panels to be expanded at once
   * @default false
   */
  allowMultiple?: boolean;
  
  /**
   * The index of the panel that should be expanded by default
   * @default -1 (none)
   */
  defaultExpandedIndex?: number;
  
  /**
   * The indexes of the panels that should be expanded by default (when allowMultiple is true)
   * @default []
   */
  defaultExpandedIndexes?: number[];
  
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

export const CollapsibleGroup = forwardRef<HTMLDivElement, CollapsibleGroupProps>(
  (
    {
      children,
      allowMultiple = false,
      defaultExpandedIndex = -1,
      defaultExpandedIndexes = [],
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Initialize expanded state
    const initialExpandedState = allowMultiple 
      ? defaultExpandedIndexes.reduce((acc, index) => {
          acc[index] = true;
          return acc;
        }, {} as Record<number, boolean>)
      : { [defaultExpandedIndex]: true };
    
    const [expandedState, setExpandedState] = useState<Record<number, boolean>>(initialExpandedState);
    
    // Handle toggle
    const handleToggle = (index: number, expanded: boolean) => {
      if (allowMultiple) {
        setExpandedState((prev) => ({
          ...prev,
          [index]: expanded,
        }));
      } else {
        // Close all other panels
        const newState: Record<number, boolean> = {};
        if (expanded) {
          newState[index] = true;
        }
        setExpandedState(newState);
      }
    };
    
    // Clone children with expanded state
    const childrenWithProps = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child) && child.type === CollapsiblePanel) {
        return React.cloneElement(child as React.ReactElement<any>, {
          expanded: expandedState[index] || false,
          onToggle: (expanded: boolean) => {
            handleToggle(index, expanded);
            if (child.props.onToggle) {
              child.props.onToggle(expanded);
            }
          },
        });
      }
      return child;
    });
    
    return (
      <Component
        ref={ref}
        className={`strive-collapsible-group ${className}`}
        style={style}
        {...rest}
      >
        {childrenWithProps}
      </Component>
    );
  }
);

CollapsibleGroup.displayName = 'CollapsibleGroup';
