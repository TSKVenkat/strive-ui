import React, { forwardRef } from 'react';

export type ListLayoutVariant = 'default' | 'compact' | 'divided' | 'bordered' | 'card' | 'grid';
export type ListLayoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ListLayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export interface ListLayoutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'size'> {
  /**
   * The list items to render
   */
  children: React.ReactNode;
  
  /**
   * Layout variant
   * @default 'default'
   */
  variant?: ListLayoutVariant;
  
  /**
   * Size of the list items
   * @default 'md'
   */
  size?: ListLayoutSize;
  
  /**
   * Gap between list items
   * @default 'md'
   */
  gap?: ListLayoutGap;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether to render as an ordered list
   * @default false
   */
  ordered?: boolean;
  
  /**
   * Whether to render as a horizontal list
   * @default false
   */
  horizontal?: boolean;
  
  /**
   * Number of columns when variant is 'grid'
   * @default 2
   */
  columns?: number;
  
  /**
   * The component used for the root node
   * @default based on ordered prop
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
    sm?: Partial<ListLayoutProps>;
    md?: Partial<ListLayoutProps>;
    lg?: Partial<ListLayoutProps>;
    xl?: Partial<ListLayoutProps>;
  };
}

/**
 * ListLayout component for creating various list layouts
 */
export const ListLayout = forwardRef<HTMLElement, ListLayoutProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      gap = 'md',
      fullWidth = true,
      ordered = false,
      horizontal = false,
      columns = 2,
      as,
      className = '',
      responsive,
      style,
      ...rest
    },
    ref
  ) => {
    // Determine the component type based on props
    const Component = as || (ordered ? 'ol' : 'ul');
    
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
    const getGapValue = (gapValue: ListLayoutGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Map size values to padding values
    const sizePaddingMap = {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
    };

    // Build the base style object
    let listStyle: React.CSSProperties = {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    // Apply styles based on horizontal prop
    if (horizontal) {
      listStyle = {
        ...listStyle,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: getGapValue(gap),
      };
    } else if (variant === 'grid') {
      listStyle = {
        ...listStyle,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: getGapValue(gap),
      };
    } else {
      listStyle = {
        ...listStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: getGapValue(gap),
      };
    }

    // Process children to apply styles based on variant
    const processedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      let itemStyle: React.CSSProperties = {};
      let itemClassName = 'strive-list-item';
      
      // Apply styles based on variant
      switch (variant) {
        case 'compact':
          itemStyle = {
            ...itemStyle,
            padding: sizePaddingMap[size],
          };
          itemClassName += ' strive-list-item-compact';
          break;
          
        case 'divided':
          itemStyle = {
            ...itemStyle,
            padding: sizePaddingMap[size],
            borderBottom: '1px solid #e0e0e0',
          };
          itemClassName += ' strive-list-item-divided';
          break;
          
        case 'bordered':
          itemStyle = {
            ...itemStyle,
            padding: sizePaddingMap[size],
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          };
          itemClassName += ' strive-list-item-bordered';
          break;
          
        case 'card':
          itemStyle = {
            ...itemStyle,
            padding: sizePaddingMap[size],
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          };
          itemClassName += ' strive-list-item-card';
          break;
          
        default:
          itemStyle = {
            ...itemStyle,
            padding: sizePaddingMap[size],
          };
          itemClassName += ' strive-list-item-default';
          break;
      }

      return React.cloneElement(child, {
        style: {
          ...itemStyle,
          ...child.props.style,
        },
        className: `${itemClassName} ${child.props.className || ''}`,
      });
    });

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-list-layout strive-list-layout-${variant} strive-list-size-${size} ${horizontal ? 'strive-list-horizontal' : ''} ${className}`}
        style={listStyle}
        {...rest}
      >
        {processedChildren}
      </Component>
    );
  }
);

ListLayout.displayName = 'ListLayout';

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /**
   * The content of the list item
   */
  children?: React.ReactNode;
  
  /**
   * Whether the item is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * ListItem component for individual items within a ListLayout
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      children,
      active = false,
      disabled = false,
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
    const itemClassName = `strive-list-item ${active ? 'strive-list-item-active' : ''} ${disabled ? 'strive-list-item-disabled' : ''} ${className}`;

    return (
      <li
        ref={ref}
        className={itemClassName}
        style={itemStyle}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';
