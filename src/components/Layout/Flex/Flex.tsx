import React, { forwardRef } from 'react';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the flex container
   */
  children?: React.ReactNode;
  
  /**
   * Direction of the flex items
   * @default 'row'
   */
  direction?: FlexDirection;
  
  /**
   * Whether flex items should wrap
   * @default 'nowrap'
   */
  wrap?: FlexWrap;
  
  /**
   * Alignment of flex items along the main axis
   * @default 'flex-start'
   */
  justify?: FlexJustify;
  
  /**
   * Alignment of flex items along the cross axis
   * @default 'stretch'
   */
  align?: FlexAlign;
  
  /**
   * Alignment of flex lines when there is extra space in the cross-axis
   */
  alignContent?: FlexAlign | 'space-between' | 'space-around' | 'space-evenly';
  
  /**
   * Gap between flex items
   * @default 'none'
   */
  gap?: FlexGap;
  
  /**
   * Horizontal gap between flex items
   */
  columnGap?: FlexGap;
  
  /**
   * Vertical gap between flex items
   */
  rowGap?: FlexGap;
  
  /**
   * Whether to fill the container width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether to fill the container height
   * @default false
   */
  fullHeight?: boolean;
  
  /**
   * Whether to center items both horizontally and vertically
   * @default false
   */
  center?: boolean;
  
  /**
   * Whether to make the flex container inline
   * @default false
   */
  inline?: boolean;
  
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
 * Flex component for creating flexbox layouts
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = 'row',
      wrap = 'nowrap',
      justify = 'flex-start',
      align = 'stretch',
      alignContent,
      gap = 'none',
      columnGap,
      rowGap,
      fullWidth = false,
      fullHeight = false,
      center = false,
      inline = false,
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
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: FlexGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Override justify and align if center is true
    const justifyValue = center ? 'center' : justify;
    const alignValue = center ? 'center' : align;

    // Build the style object
    const flexStyle: React.CSSProperties = {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent: justifyValue,
      alignItems: alignValue,
      ...(alignContent && { alignContent }),
      ...(gap !== 'none' && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-flex ${className}`}
        style={flexStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Flex.displayName = 'Flex';

export interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the flex item
   */
  children?: React.ReactNode;
  
  /**
   * Flex grow factor
   * @default 0
   */
  grow?: number;
  
  /**
   * Flex shrink factor
   * @default 1
   */
  shrink?: number;
  
  /**
   * Flex basis
   * @default 'auto'
   */
  basis?: string | number;
  
  /**
   * Shorthand for flex property (grow, shrink, basis)
   */
  flex?: string | number;
  
  /**
   * Alignment of the item along the cross axis
   */
  alignSelf?: FlexAlign | 'auto';
  
  /**
   * Order of the item
   */
  order?: number;
  
  /**
   * Whether to fill the container width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether to fill the container height
   * @default false
   */
  fullHeight?: boolean;
  
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
 * FlexItem component for individual items within a Flex container
 */
export const FlexItem = forwardRef<HTMLDivElement, FlexItemProps>(
  (
    {
      children,
      grow = 0,
      shrink = 1,
      basis = 'auto',
      flex,
      alignSelf,
      order,
      fullWidth = false,
      fullHeight = false,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const itemStyle: React.CSSProperties = {
      ...(flex ? { flex } : { flexGrow: grow, flexShrink: shrink, flexBasis: basis }),
      ...(alignSelf && { alignSelf }),
      ...(order !== undefined && { order }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-flex-item ${className}`}
        style={itemStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

FlexItem.displayName = 'FlexItem';
