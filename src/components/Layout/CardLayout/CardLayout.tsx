import React, { forwardRef } from 'react';

export type CardLayoutVariant = 'grid' | 'list' | 'compact' | 'featured';
export type CardLayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export interface CardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The cards to render in the layout
   */
  children: React.ReactNode;
  
  /**
   * Layout variant
   * @default 'grid'
   */
  variant?: CardLayoutVariant;
  
  /**
   * Number of columns in grid variant
   * @default 3
   */
  columns?: number;
  
  /**
   * Gap between cards
   * @default 'md'
   */
  gap?: CardLayoutGap;
  
  /**
   * Horizontal gap between cards
   */
  columnGap?: CardLayoutGap;
  
  /**
   * Vertical gap between cards
   */
  rowGap?: CardLayoutGap;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether cards should have equal height
   * @default false
   */
  equalHeight?: boolean;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Responsive configuration for different breakpoints
   */
  responsive?: {
    sm?: Partial<CardLayoutProps>;
    md?: Partial<CardLayoutProps>;
    lg?: Partial<CardLayoutProps>;
    xl?: Partial<CardLayoutProps>;
  };
}

/**
 * CardLayout component for creating card-based layouts
 */
export const CardLayout = forwardRef<HTMLDivElement, CardLayoutProps>(
  (
    {
      children,
      variant = 'grid',
      columns = 3,
      gap = 'md',
      columnGap,
      rowGap,
      fullWidth = true,
      equalHeight = false,
      as: Component = 'div',
      className = '',
      responsive,
      style,
      ...rest
    },
    ref
  ) => {
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: CardLayoutGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Build the style object based on variant
    let layoutStyle: React.CSSProperties = {
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    // Apply styles based on variant
    switch (variant) {
      case 'grid':
        layoutStyle = {
          ...layoutStyle,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          ...(gap !== 'none' && !columnGap && !rowGap && { gap: getGapValue(gap) }),
          ...(columnGap && { columnGap: getGapValue(columnGap) }),
          ...(rowGap && { rowGap: getGapValue(rowGap) }),
        };
        break;
        
      case 'list':
        layoutStyle = {
          ...layoutStyle,
          display: 'flex',
          flexDirection: 'column',
          ...(gap !== 'none' && !rowGap && { gap: getGapValue(gap) }),
          ...(rowGap && { gap: getGapValue(rowGap) }),
        };
        break;
        
      case 'compact':
        layoutStyle = {
          ...layoutStyle,
          display: 'flex',
          flexDirection: 'column',
          ...(gap !== 'none' && !rowGap && { gap: getGapValue(gap) }),
          ...(rowGap && { gap: getGapValue(rowGap) }),
        };
        break;
        
      case 'featured':
        // Featured layout has a larger first item
        layoutStyle = {
          ...layoutStyle,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          ...(gap !== 'none' && !columnGap && !rowGap && { gap: getGapValue(gap) }),
          ...(columnGap && { columnGap: getGapValue(columnGap) }),
          ...(rowGap && { rowGap: getGapValue(rowGap) }),
        };
        break;
    }

    // Process children to apply equal height if needed
    const processedChildren = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;

      let cardStyle: React.CSSProperties = {};
      
      // Apply equal height
      if (equalHeight) {
        cardStyle.height = '100%';
      }
      
      // Apply featured layout styles to first child
      if (variant === 'featured' && index === 0) {
        cardStyle.gridColumn = `span ${Math.min(columns, 2)}`;
      }
      
      // Apply compact layout styles
      if (variant === 'compact') {
        cardStyle.padding = '0.5rem';
      }

      return React.cloneElement(child, {
        style: {
          ...cardStyle,
          ...child.props.style,
        },
        className: `strive-card ${child.props.className || ''}`,
      });
    });

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-card-layout strive-card-layout-${variant} ${className}`}
        style={layoutStyle}
        {...rest}
      >
        {processedChildren}
      </Component>
    );
  }
);

CardLayout.displayName = 'CardLayout';
