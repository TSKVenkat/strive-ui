import React, { forwardRef } from 'react';

export type StackDirection = 'horizontal' | 'vertical';
export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type StackAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type StackWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface StackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the stack
   */
  children: React.ReactNode;
  
  /**
   * The direction of the stack
   * @default 'vertical'
   */
  direction?: StackDirection;
  
  /**
   * The spacing between stack items
   * @default 'md'
   */
  spacing?: StackSpacing;
  
  /**
   * Whether to add dividers between stack items
   * @default false
   */
  dividers?: boolean;
  
  /**
   * The color of the dividers
   * @default '#e0e0e0'
   */
  dividerColor?: string;
  
  /**
   * The alignment of stack items along the cross axis
   */
  align?: StackAlign;
  
  /**
   * The justification of stack items along the main axis
   */
  justify?: StackJustify;
  
  /**
   * Whether to wrap stack items
   * @default 'nowrap'
   */
  wrap?: StackWrap;
  
  /**
   * Whether the stack should take up the full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the stack should take up the full height
   * @default false
   */
  fullHeight?: boolean;
  
  /**
   * Whether to reverse the order of stack items
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
 * StackLayout component for stacking elements vertically or horizontally with consistent spacing
 */
export const StackLayout = forwardRef<HTMLDivElement, StackLayoutProps>(
  (
    {
      children,
      direction = 'vertical',
      spacing = 'md',
      dividers = false,
      dividerColor = '#e0e0e0',
      align,
      justify,
      wrap = 'nowrap',
      fullWidth = false,
      fullHeight = false,
      reverse = false,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map spacing values to actual CSS values
    const spacingMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert spacing value to CSS
    const getSpacingValue = (spacingValue: StackSpacing) => {
      if (!spacingValue || spacingValue === 'none') return '0';
      return spacingMap[spacingValue as keyof typeof spacingMap] || spacingValue;
    };

    // Map align values to CSS values
    const alignMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    };

    // Map justify values to CSS values
    const justifyMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };

    // Build the style object
    const stackStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction === 'vertical' 
        ? (reverse ? 'column-reverse' : 'column') 
        : (reverse ? 'row-reverse' : 'row'),
      gap: getSpacingValue(spacing),
      ...(align && { alignItems: alignMap[align] }),
      ...(justify && { justifyContent: justifyMap[justify] }),
      ...(wrap && { flexWrap: wrap }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    // If dividers are enabled, we need to render them between each child
    if (dividers && React.Children.count(children) > 0) {
      const childrenArray = React.Children.toArray(children);
      const dividerStyle: React.CSSProperties = {
        backgroundColor: dividerColor,
        ...(direction === 'vertical' 
          ? { width: '100%', height: '1px' } 
          : { width: '1px', height: '100%' }),
      };

      const stackWithDividers = childrenArray.reduce((acc: React.ReactNode[], child, index) => {
        if (index !== 0) {
          acc.push(
            <div 
              key={`divider-${index}`} 
              className="strive-stack-divider"
              style={dividerStyle}
            />
          );
        }
        acc.push(child);
        return acc;
      }, []);

      return (
        <Component
          ref={ref}
          className={`strive-stack-layout ${direction} ${className}`}
          style={stackStyle}
          {...rest}
        >
          {stackWithDividers}
        </Component>
      );
    }

    return (
      <Component
        ref={ref}
        className={`strive-stack-layout ${direction} ${className}`}
        style={stackStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

StackLayout.displayName = 'StackLayout';

/**
 * StackItem component for use within StackLayout
 */
export interface StackItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the stack item
   */
  children: React.ReactNode;
  
  /**
   * Whether the item should grow to fill available space
   * @default false
   */
  grow?: boolean;
  
  /**
   * Whether the item should shrink if needed
   * @default true
   */
  shrink?: boolean;
  
  /**
   * The basis (initial size) of the item
   * @default 'auto'
   */
  basis?: string;
  
  /**
   * The order of the item
   */
  order?: number;
  
  /**
   * The alignment of the item
   */
  align?: StackAlign;
  
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

export const StackItem = forwardRef<HTMLDivElement, StackItemProps>(
  (
    {
      children,
      grow = false,
      shrink = true,
      basis = 'auto',
      order,
      align,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map align values to CSS values
    const alignMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    };

    // Build the style object
    const itemStyle: React.CSSProperties = {
      flexGrow: grow ? 1 : 0,
      flexShrink: shrink ? 1 : 0,
      flexBasis: basis,
      ...(order !== undefined && { order }),
      ...(align && { alignSelf: alignMap[align] }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-stack-item ${className}`}
        style={itemStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

StackItem.displayName = 'StackItem';
