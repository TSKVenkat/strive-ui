import React, { forwardRef } from 'react';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type GridJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type GridFlow = 'row' | 'column' | 'row-dense' | 'column-dense';
export type GridAreas = string;
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
export type GridAutoRows = 'auto' | 'min' | 'max' | 'fr' | string;
export type GridAutoColumns = 'auto' | 'min' | 'max' | 'fr' | string;
export type GridTemplateRows = string;
export type GridTemplateColumns = string;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid
   */
  children?: React.ReactNode;
  
  /**
   * Number of columns in the grid
   * @default 12
   */
  columns?: GridColumns;
  
  /**
   * Gap between grid items
   * @default 'md'
   */
  gap?: GridGap;
  
  /**
   * Horizontal gap between grid items
   */
  columnGap?: GridGap;
  
  /**
   * Vertical gap between grid items
   */
  rowGap?: GridGap;
  
  /**
   * Alignment of grid items along the vertical axis
   */
  alignItems?: GridAlign;
  
  /**
   * Alignment of grid items along the horizontal axis
   */
  justifyItems?: GridAlign;
  
  /**
   * Alignment of the entire grid along the vertical axis
   */
  alignContent?: GridJustify;
  
  /**
   * Alignment of the entire grid along the horizontal axis
   */
  justifyContent?: GridJustify;
  
  /**
   * Direction in which grid items are placed
   */
  gridFlow?: GridFlow;
  
  /**
   * Named grid areas
   */
  gridAreas?: GridAreas;
  
  /**
   * Controls how auto-placed items are flowed into the grid
   */
  autoFlow?: GridAutoFlow;
  
  /**
   * Size of implicitly created rows
   */
  autoRows?: GridAutoRows;
  
  /**
   * Size of implicitly created columns
   */
  autoColumns?: GridAutoColumns;
  
  /**
   * Defines the size of rows in the grid
   */
  templateRows?: GridTemplateRows;
  
  /**
   * Defines the size of columns in the grid
   */
  templateColumns?: GridTemplateColumns;
  
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
   * Responsive column configuration for different breakpoints
   */
  responsive?: {
    sm?: Partial<GridProps>;
    md?: Partial<GridProps>;
    lg?: Partial<GridProps>;
    xl?: Partial<GridProps>;
    '2xl'?: Partial<GridProps>;
  };
}

/**
 * Grid component for creating grid layouts using CSS Grid
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = 12,
      gap = 'md',
      columnGap,
      rowGap,
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
      gridFlow,
      gridAreas,
      autoFlow,
      autoRows,
      autoColumns,
      templateRows,
      templateColumns,
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
    const getGapValue = (gapValue: GridGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Convert columns to grid-template-columns
    const getColumnsTemplate = (cols: GridColumns) => {
      if (cols === 'auto') return 'auto';
      if (cols === 'none') return 'none';
      return `repeat(${cols}, minmax(0, 1fr))`;
    };

    // Convert justify values to CSS values
    const getJustifyValue = (justify: GridJustify) => {
      const justifyMap = {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        between: 'space-between',
        around: 'space-around',
        evenly: 'space-evenly',
      };
      return justifyMap[justify] || justify;
    };

    // Build the style object
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gap: getGapValue(gap),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(alignItems && { alignItems }),
      ...(justifyItems && { justifyItems }),
      ...(alignContent && { alignContent: getJustifyValue(alignContent) }),
      ...(justifyContent && { justifyContent: getJustifyValue(justifyContent) }),
      ...(gridFlow && { gridAutoFlow: gridFlow }),
      ...(gridAreas && { gridTemplateAreas: gridAreas }),
      ...(autoFlow && { gridAutoFlow: autoFlow }),
      ...(autoRows && { gridAutoRows: autoRows }),
      ...(autoColumns && { gridAutoColumns: autoColumns }),
      ...(templateRows && { gridTemplateRows: templateRows }),
      ...(templateColumns && { gridTemplateColumns: templateColumns || getColumnsTemplate(columns) }),
      ...style,
    };

    // If templateColumns is not provided, use columns prop
    if (!templateColumns && columns) {
      gridStyle.gridTemplateColumns = getColumnsTemplate(columns);
    }

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-grid ${className}`}
        style={gridStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid item
   */
  children?: React.ReactNode;
  
  /**
   * Number of columns the item spans
   * @default 1
   */
  span?: number;
  
  /**
   * Starting column of the item
   */
  colStart?: number | 'auto';
  
  /**
   * Ending column of the item
   */
  colEnd?: number | 'auto';
  
  /**
   * Starting row of the item
   */
  rowStart?: number | 'auto';
  
  /**
   * Ending row of the item
   */
  rowEnd?: number | 'auto';
  
  /**
   * Grid area for the item
   */
  area?: string;
  
  /**
   * Alignment of the item along the vertical axis
   */
  alignSelf?: GridAlign;
  
  /**
   * Alignment of the item along the horizontal axis
   */
  justifySelf?: GridAlign;
  
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
    sm?: Partial<GridItemProps>;
    md?: Partial<GridItemProps>;
    lg?: Partial<GridItemProps>;
    xl?: Partial<GridItemProps>;
    '2xl'?: Partial<GridItemProps>;
  };
}

/**
 * GridItem component for individual items within a Grid
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      span = 1,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      area,
      alignSelf,
      justifySelf,
      as: Component = 'div',
      className = '',
      responsive,
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const itemStyle: React.CSSProperties = {
      ...(span && { gridColumn: `span ${span} / span ${span}` }),
      ...(colStart && { gridColumnStart: colStart }),
      ...(colEnd && { gridColumnEnd: colEnd }),
      ...(rowStart && { gridRowStart: rowStart }),
      ...(rowEnd && { gridRowEnd: rowEnd }),
      ...(area && { gridArea: area }),
      ...(alignSelf && { alignSelf }),
      ...(justifySelf && { justifySelf }),
      ...style,
    };

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-grid-item ${className}`}
        style={itemStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GridItem.displayName = 'GridItem';
