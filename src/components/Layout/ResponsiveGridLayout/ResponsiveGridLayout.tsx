import React, { forwardRef } from 'react';

export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'equal';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type GridJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

export interface ResponsiveGridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid
   */
  children: React.ReactNode;
  
  /**
   * The number of columns in the grid
   * @default 12
   */
  columns?: number;
  
  /**
   * The gap between grid items
   * @default 'md'
   */
  gap?: GridGap;
  
  /**
   * The horizontal gap between grid items
   */
  columnGap?: GridGap;
  
  /**
   * The vertical gap between grid items
   */
  rowGap?: GridGap;
  
  /**
   * Horizontal justification of grid items
   */
  justifyContent?: GridJustify;
  
  /**
   * Vertical alignment of grid items
   */
  alignItems?: GridAlign;
  
  /**
   * Whether the grid should take up the full width
   * @default true
   */
  fullWidth?: boolean;
  
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
 * ResponsiveGridLayout component for creating responsive grid layouts
 */
export const ResponsiveGridLayout = forwardRef<HTMLDivElement, ResponsiveGridLayoutProps>(
  (
    {
      children,
      columns = 12,
      gap = 'md',
      columnGap,
      rowGap,
      justifyContent,
      alignItems,
      fullWidth = true,
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
    const getGapValue = (gapValue: GridGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue as keyof typeof gapMap] || gapValue;
    };

    // Map justify content values to CSS values
    const justifyMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };

    // Map align items values to CSS values
    const alignMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    };

    // Build the style object
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      ...(gap !== 'none' && !columnGap && !rowGap && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(justifyContent && { justifyContent: justifyMap[justifyContent] }),
      ...(alignItems && { alignItems: alignMap[alignItems] }),
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-responsive-grid ${className}`}
        style={gridStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveGridLayout.displayName = 'ResponsiveGridLayout';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid item
   */
  children: React.ReactNode;
  
  /**
   * The number of columns the item spans
   * @default 12
   */
  span?: GridColumns;
  
  /**
   * The number of columns the item spans on extra small screens
   */
  xs?: GridColumns;
  
  /**
   * The number of columns the item spans on small screens
   */
  sm?: GridColumns;
  
  /**
   * The number of columns the item spans on medium screens
   */
  md?: GridColumns;
  
  /**
   * The number of columns the item spans on large screens
   */
  lg?: GridColumns;
  
  /**
   * The number of columns the item spans on extra large screens
   */
  xl?: GridColumns;
  
  /**
   * The number of columns the item spans on extra extra large screens
   */
  xxl?: GridColumns;
  
  /**
   * The number of columns to offset the item
   */
  offset?: number;
  
  /**
   * The number of columns to offset the item on extra small screens
   */
  offsetXs?: number;
  
  /**
   * The number of columns to offset the item on small screens
   */
  offsetSm?: number;
  
  /**
   * The number of columns to offset the item on medium screens
   */
  offsetMd?: number;
  
  /**
   * The number of columns to offset the item on large screens
   */
  offsetLg?: number;
  
  /**
   * The number of columns to offset the item on extra large screens
   */
  offsetXl?: number;
  
  /**
   * The number of columns to offset the item on extra extra large screens
   */
  offsetXxl?: number;
  
  /**
   * The order of the item
   */
  order?: number;
  
  /**
   * The order of the item on extra small screens
   */
  orderXs?: number;
  
  /**
   * The order of the item on small screens
   */
  orderSm?: number;
  
  /**
   * The order of the item on medium screens
   */
  orderMd?: number;
  
  /**
   * The order of the item on large screens
   */
  orderLg?: number;
  
  /**
   * The order of the item on extra large screens
   */
  orderXl?: number;
  
  /**
   * The order of the item on extra extra large screens
   */
  orderXxl?: number;
  
  /**
   * Whether to hide the item
   */
  hidden?: boolean;
  
  /**
   * Whether to hide the item on extra small screens
   */
  hiddenXs?: boolean;
  
  /**
   * Whether to hide the item on small screens
   */
  hiddenSm?: boolean;
  
  /**
   * Whether to hide the item on medium screens
   */
  hiddenMd?: boolean;
  
  /**
   * Whether to hide the item on large screens
   */
  hiddenLg?: boolean;
  
  /**
   * Whether to hide the item on extra large screens
   */
  hiddenXl?: boolean;
  
  /**
   * Whether to hide the item on extra extra large screens
   */
  hiddenXxl?: boolean;
  
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
 * GridItem component for use within ResponsiveGridLayout
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      span = 12,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      offset,
      offsetXs,
      offsetSm,
      offsetMd,
      offsetLg,
      offsetXl,
      offsetXxl,
      order,
      orderXs,
      orderSm,
      orderMd,
      orderLg,
      orderXl,
      orderXxl,
      hidden,
      hiddenXs,
      hiddenSm,
      hiddenMd,
      hiddenLg,
      hiddenXl,
      hiddenXxl,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Helper function to convert span to grid column value
    const getSpanValue = (spanValue: GridColumns) => {
      if (spanValue === 'auto') return 'auto';
      if (spanValue === 'equal') return '1fr';
      return `span ${spanValue}`;
    };

    // Build the base style object
    const itemStyle: React.CSSProperties = {
      gridColumn: getSpanValue(span),
      ...(offset && { marginLeft: `${(offset / 12) * 100}%` }),
      ...(order !== undefined && { order }),
      ...(hidden && { display: 'none' }),
      ...style,
    };

    // Add media query styles via CSS custom properties
    // These will be applied through a style tag in the component
    const breakpoints = {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    };

    // Create a unique ID for this component instance
    const id = React.useId();
    const styleId = `strive-grid-item-style-${id.replace(/:/g, '')}`;

    // Generate the media query styles
    const generateMediaStyles = () => {
      let styles = '';

      // Helper function to add media query styles
      const addMediaQuery = (breakpoint: GridBreakpoint, minWidth: string) => {
        const spanProp = { xs, sm, md, lg, xl, xxl }[breakpoint];
        const offsetProp = { offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl }[`offset${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof offsetXs];
        const orderProp = { orderXs, orderSm, orderMd, orderLg, orderXl, orderXxl }[`order${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof orderXs];
        const hiddenProp = { hiddenXs, hiddenSm, hiddenMd, hiddenLg, hiddenXl, hiddenXxl }[`hidden${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof hiddenXs];

        if (spanProp || offsetProp !== undefined || orderProp !== undefined || hiddenProp !== undefined) {
          styles += `@media (min-width: ${minWidth}) {\n`;
          styles += `  #${styleId} {\n`;
          
          if (spanProp) {
            styles += `    grid-column: ${getSpanValue(spanProp)};\n`;
          }
          
          if (offsetProp) {
            styles += `    margin-left: ${(offsetProp / 12) * 100}%;\n`;
          }
          
          if (orderProp !== undefined) {
            styles += `    order: ${orderProp};\n`;
          }
          
          if (hiddenProp) {
            styles += `    display: none;\n`;
          } else if (hiddenProp === false) {
            styles += `    display: block;\n`;
          }
          
          styles += `  }\n`;
          styles += `}\n`;
        }
      };

      // Add media queries for each breakpoint
      Object.entries(breakpoints).forEach(([breakpoint, minWidth]) => {
        addMediaQuery(breakpoint as GridBreakpoint, minWidth);
      });

      return styles;
    };

    // Add the style tag to the document if it doesn't exist
    React.useEffect(() => {
      if (typeof document !== 'undefined') {
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = generateMediaStyles();
          document.head.appendChild(style);
        }
      }

      // Clean up the style tag when the component unmounts
      return () => {
        if (typeof document !== 'undefined') {
          const style = document.getElementById(styleId);
          if (style) {
            document.head.removeChild(style);
          }
        }
      };
    }, [
      xs, sm, md, lg, xl, xxl,
      offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl,
      orderXs, orderSm, orderMd, orderLg, orderXl, orderXxl,
      hiddenXs, hiddenSm, hiddenMd, hiddenLg, hiddenXl, hiddenXxl,
    ]);

    return (
      <Component
        ref={ref}
        id={styleId}
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

/**
 * GridRow component for creating a row of grid items
 */
export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the row
   */
  children: React.ReactNode;
  
  /**
   * The gap between grid items
   * @default 'md'
   */
  gap?: GridGap;
  
  /**
   * The horizontal gap between grid items
   */
  columnGap?: GridGap;
  
  /**
   * The vertical gap between grid items
   */
  rowGap?: GridGap;
  
  /**
   * Horizontal justification of grid items
   */
  justifyContent?: GridJustify;
  
  /**
   * Vertical alignment of grid items
   */
  alignItems?: GridAlign;
  
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

export const GridRow = forwardRef<HTMLDivElement, GridRowProps>(
  (
    {
      children,
      gap = 'md',
      columnGap,
      rowGap,
      justifyContent,
      alignItems,
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
    const getGapValue = (gapValue: GridGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue as keyof typeof gapMap] || gapValue;
    };

    // Map justify content values to CSS values
    const justifyMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };

    // Map align items values to CSS values
    const alignMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    };

    // Build the style object
    const rowStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      ...(gap !== 'none' && !columnGap && !rowGap && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(justifyContent && { justifyContent: justifyMap[justifyContent] }),
      ...(alignItems && { alignItems: alignMap[alignItems] }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-grid-row ${className}`}
        style={rowStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GridRow.displayName = 'GridRow';

/**
 * GridCol component for creating a column within a GridRow
 */
export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the column
   */
  children: React.ReactNode;
  
  /**
   * The number of columns the item spans
   * @default 12
   */
  span?: GridColumns;
  
  /**
   * The number of columns the item spans on extra small screens
   */
  xs?: GridColumns;
  
  /**
   * The number of columns the item spans on small screens
   */
  sm?: GridColumns;
  
  /**
   * The number of columns the item spans on medium screens
   */
  md?: GridColumns;
  
  /**
   * The number of columns the item spans on large screens
   */
  lg?: GridColumns;
  
  /**
   * The number of columns the item spans on extra large screens
   */
  xl?: GridColumns;
  
  /**
   * The number of columns the item spans on extra extra large screens
   */
  xxl?: GridColumns;
  
  /**
   * The number of columns to offset the item
   */
  offset?: number;
  
  /**
   * The number of columns to offset the item on extra small screens
   */
  offsetXs?: number;
  
  /**
   * The number of columns to offset the item on small screens
   */
  offsetSm?: number;
  
  /**
   * The number of columns to offset the item on medium screens
   */
  offsetMd?: number;
  
  /**
   * The number of columns to offset the item on large screens
   */
  offsetLg?: number;
  
  /**
   * The number of columns to offset the item on extra large screens
   */
  offsetXl?: number;
  
  /**
   * The number of columns to offset the item on extra extra large screens
   */
  offsetXxl?: number;
  
  /**
   * The order of the item
   */
  order?: number;
  
  /**
   * The order of the item on extra small screens
   */
  orderXs?: number;
  
  /**
   * The order of the item on small screens
   */
  orderSm?: number;
  
  /**
   * The order of the item on medium screens
   */
  orderMd?: number;
  
  /**
   * The order of the item on large screens
   */
  orderLg?: number;
  
  /**
   * The order of the item on extra large screens
   */
  orderXl?: number;
  
  /**
   * The order of the item on extra extra large screens
   */
  orderXxl?: number;
  
  /**
   * Whether to hide the item
   */
  hidden?: boolean;
  
  /**
   * Whether to hide the item on extra small screens
   */
  hiddenXs?: boolean;
  
  /**
   * Whether to hide the item on small screens
   */
  hiddenSm?: boolean;
  
  /**
   * Whether to hide the item on medium screens
   */
  hiddenMd?: boolean;
  
  /**
   * Whether to hide the item on large screens
   */
  hiddenLg?: boolean;
  
  /**
   * Whether to hide the item on extra large screens
   */
  hiddenXl?: boolean;
  
  /**
   * Whether to hide the item on extra extra large screens
   */
  hiddenXxl?: boolean;
  
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

export const GridCol = forwardRef<HTMLDivElement, GridColProps>(
  (
    {
      children,
      span = 12,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      offset,
      offsetXs,
      offsetSm,
      offsetMd,
      offsetLg,
      offsetXl,
      offsetXxl,
      order,
      orderXs,
      orderSm,
      orderMd,
      orderLg,
      orderXl,
      orderXxl,
      hidden,
      hiddenXs,
      hiddenSm,
      hiddenMd,
      hiddenLg,
      hiddenXl,
      hiddenXxl,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Helper function to convert span to flex basis value
    const getFlexBasis = (spanValue: GridColumns) => {
      if (spanValue === 'auto') return 'auto';
      if (spanValue === 'equal') return '0';
      return `${(Number(spanValue) / 12) * 100}%`;
    };

    // Build the base style object
    const colStyle: React.CSSProperties = {
      flexBasis: getFlexBasis(span),
      flexGrow: span === 'equal' ? 1 : 0,
      flexShrink: 0,
      maxWidth: span === 'auto' || span === 'equal' ? 'none' : `${(Number(span) / 12) * 100}%`,
      ...(offset && { marginLeft: `${(offset / 12) * 100}%` }),
      ...(order !== undefined && { order }),
      ...(hidden && { display: 'none' }),
      ...style,
    };

    // Add media query styles via CSS custom properties
    // These will be applied through a style tag in the component
    const breakpoints = {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    };

    // Create a unique ID for this component instance
    const id = React.useId();
    const styleId = `strive-grid-col-style-${id.replace(/:/g, '')}`;

    // Generate the media query styles
    const generateMediaStyles = () => {
      let styles = '';

      // Helper function to add media query styles
      const addMediaQuery = (breakpoint: GridBreakpoint, minWidth: string) => {
        const spanProp = { xs, sm, md, lg, xl, xxl }[breakpoint];
        const offsetProp = { offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl }[`offset${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof offsetXs];
        const orderProp = { orderXs, orderSm, orderMd, orderLg, orderXl, orderXxl }[`order${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof orderXs];
        const hiddenProp = { hiddenXs, hiddenSm, hiddenMd, hiddenLg, hiddenXl, hiddenXxl }[`hidden${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof typeof hiddenXs];

        if (spanProp || offsetProp !== undefined || orderProp !== undefined || hiddenProp !== undefined) {
          styles += `@media (min-width: ${minWidth}) {\n`;
          styles += `  #${styleId} {\n`;
          
          if (spanProp) {
            styles += `    flex-basis: ${getFlexBasis(spanProp)};\n`;
            styles += `    flex-grow: ${spanProp === 'equal' ? 1 : 0};\n`;
            styles += `    max-width: ${spanProp === 'auto' || spanProp === 'equal' ? 'none' : `${(Number(spanProp) / 12) * 100}%`};\n`;
          }
          
          if (offsetProp) {
            styles += `    margin-left: ${(offsetProp / 12) * 100}%;\n`;
          }
          
          if (orderProp !== undefined) {
            styles += `    order: ${orderProp};\n`;
          }
          
          if (hiddenProp) {
            styles += `    display: none;\n`;
          } else if (hiddenProp === false) {
            styles += `    display: block;\n`;
          }
          
          styles += `  }\n`;
          styles += `}\n`;
        }
      };

      // Add media queries for each breakpoint
      Object.entries(breakpoints).forEach(([breakpoint, minWidth]) => {
        addMediaQuery(breakpoint as GridBreakpoint, minWidth);
      });

      return styles;
    };

    // Add the style tag to the document if it doesn't exist
    React.useEffect(() => {
      if (typeof document !== 'undefined') {
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = generateMediaStyles();
          document.head.appendChild(style);
        }
      }

      // Clean up the style tag when the component unmounts
      return () => {
        if (typeof document !== 'undefined') {
          const style = document.getElementById(styleId);
          if (style) {
            document.head.removeChild(style);
          }
        }
      };
    }, [
      xs, sm, md, lg, xl, xxl,
      offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl,
      orderXs, orderSm, orderMd, orderLg, orderXl, orderXxl,
      hiddenXs, hiddenSm, hiddenMd, hiddenLg, hiddenXl, hiddenXxl,
    ]);

    return (
      <Component
        ref={ref}
        id={styleId}
        className={`strive-grid-col ${className}`}
        style={colStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GridCol.displayName = 'GridCol';

/**
 * GridContainer component for creating a container for grid layouts
 */
export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the container
   */
  children: React.ReactNode;
  
  /**
   * Whether the container should be fluid (full width)
   * @default false
   */
  fluid?: boolean;
  
  /**
   * The maximum width of the container
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | string;
  
  /**
   * Whether to add padding to the container
   * @default true
   */
  padding?: boolean | string;
  
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

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  (
    {
      children,
      fluid = false,
      maxWidth = 'lg',
      padding = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map maxWidth values to actual CSS values
    const maxWidthMap = {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      xxl: '1320px',
    };

    // Convert maxWidth value to CSS
    const getMaxWidthValue = () => {
      if (fluid) return '100%';
      return maxWidthMap[maxWidth as keyof typeof maxWidthMap] || maxWidth;
    };

    // Convert padding value to CSS
    const getPaddingValue = () => {
      if (padding === true) return '0 1rem';
      if (padding === false) return '0';
      return padding;
    };

    // Build the style object
    const containerStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: getMaxWidthValue(),
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: getPaddingValue(),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-grid-container ${fluid ? 'fluid' : ''} ${className}`}
        style={containerStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

GridContainer.displayName = 'GridContainer';
