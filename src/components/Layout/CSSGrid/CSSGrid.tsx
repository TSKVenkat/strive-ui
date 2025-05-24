import React, { forwardRef } from 'react';

export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type GridJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type GridFlow = 'row' | 'column' | 'row-dense' | 'column-dense';
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

export interface CSSGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid
   */
  children?: React.ReactNode;
  
  /**
   * CSS grid-template-columns property
   * @example "1fr 2fr 1fr" or "repeat(3, 1fr)" or "auto 1fr"
   */
  columns?: string;
  
  /**
   * CSS grid-template-rows property
   * @example "auto 1fr auto" or "repeat(3, 200px)"
   */
  rows?: string;
  
  /**
   * CSS grid-template-areas property
   * @example '"header header" "sidebar content" "footer footer"'
   */
  areas?: string;
  
  /**
   * Gap between grid items
   * @default 'none'
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
   * CSS align-items property
   */
  alignItems?: GridAlign;
  
  /**
   * CSS justify-items property
   */
  justifyItems?: GridAlign;
  
  /**
   * CSS align-content property
   */
  alignContent?: GridJustify;
  
  /**
   * CSS justify-content property
   */
  justifyContent?: GridJustify;
  
  /**
   * CSS grid-auto-flow property
   */
  autoFlow?: GridAutoFlow;
  
  /**
   * CSS grid-auto-rows property
   */
  autoRows?: string;
  
  /**
   * CSS grid-auto-columns property
   */
  autoColumns?: string;
  
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
   * Inline grid display
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
  
  /**
   * Responsive props for different breakpoints
   */
  responsive?: {
    sm?: Partial<CSSGridProps>;
    md?: Partial<CSSGridProps>;
    lg?: Partial<CSSGridProps>;
    xl?: Partial<CSSGridProps>;
  };
}

/**
 * CSSGrid component for creating modern CSS Grid layouts
 */
export const CSSGrid = forwardRef<HTMLDivElement, CSSGridProps>(
  (
    {
      children,
      columns,
      rows,
      areas,
      gap = 'none',
      columnGap,
      rowGap,
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
      autoFlow,
      autoRows,
      autoColumns,
      fullWidth = false,
      fullHeight = false,
      inline = false,
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
      display: inline ? 'inline-grid' : 'grid',
      ...(columns && { gridTemplateColumns: columns }),
      ...(rows && { gridTemplateRows: rows }),
      ...(areas && { gridTemplateAreas: areas }),
      ...(gap !== 'none' && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(alignItems && { alignItems }),
      ...(justifyItems && { justifyItems }),
      ...(alignContent && { alignContent: getJustifyValue(alignContent) }),
      ...(justifyContent && { justifyContent: getJustifyValue(justifyContent) }),
      ...(autoFlow && { gridAutoFlow: autoFlow }),
      ...(autoRows && { gridAutoRows: autoRows }),
      ...(autoColumns && { gridAutoColumns: autoColumns }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-css-grid ${className}`}
        style={gridStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

CSSGrid.displayName = 'CSSGrid';

export interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid cell
   */
  children?: React.ReactNode;
  
  /**
   * CSS grid-column property
   * @example "1 / 3" or "span 2" or "1 / -1"
   */
  column?: string;
  
  /**
   * CSS grid-row property
   * @example "1 / 3" or "span 2" or "1 / -1"
   */
  row?: string;
  
  /**
   * CSS grid-area property
   * @example "header" or "content" or "footer"
   */
  area?: string;
  
  /**
   * CSS justify-self property
   */
  justifySelf?: GridAlign;
  
  /**
   * CSS align-self property
   */
  alignSelf?: GridAlign;
  
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
   * Responsive props for different breakpoints
   */
  responsive?: {
    sm?: Partial<GridCellProps>;
    md?: Partial<GridCellProps>;
    lg?: Partial<GridCellProps>;
    xl?: Partial<GridCellProps>;
  };
}

/**
 * GridCell component for individual cells within a CSSGrid
 */
export const GridCell = forwardRef<HTMLDivElement, GridCellProps>(
  (
    {
      children,
      column,
      row,
      area,
      justifySelf,
      alignSelf,
      as: Component = 'div',
      className = '',
      responsive,
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const cellStyle: React.CSSProperties = {
      ...(column && { gridColumn: column }),
      ...(row && { gridRow: row }),
      ...(area && { gridArea: area }),
      ...(justifySelf && { justifySelf }),
      ...(alignSelf && { alignSelf }),
      ...style,
    };

    // Media queries for responsive props would be handled via CSS classes in a real implementation
    // For this example, we'll just use the base props

    return (
      <Component
        ref={ref}
        className={`strive-grid-cell ${className}`}
        style={cellStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GridCell.displayName = 'GridCell';
