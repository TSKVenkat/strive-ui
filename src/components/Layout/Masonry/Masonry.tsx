import React, { forwardRef, useEffect, useRef, useState } from 'react';

export type MasonryBreakpoints = {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
};

export interface MasonryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The items to render in the masonry layout
   */
  children: React.ReactNode[];
  
  /**
   * Number of columns in the masonry layout
   * @default 3
   */
  columns?: number;
  
  /**
   * Responsive column configuration for different breakpoints
   */
  breakpoints?: MasonryBreakpoints;
  
  /**
   * Gap between masonry items
   * @default '1rem'
   */
  gap?: string | number;
  
  /**
   * Horizontal gap between masonry items
   */
  columnGap?: string | number;
  
  /**
   * Vertical gap between masonry items
   */
  rowGap?: string | number;
  
  /**
   * Whether to fill the container width
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
 * Masonry component for creating Pinterest-like grid layouts
 */
export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  (
    {
      children,
      columns = 3,
      breakpoints,
      gap = '1rem',
      columnGap,
      rowGap,
      fullWidth = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [columnCount, setColumnCount] = useState(columns);
    const [itemsPerColumn, setItemsPerColumn] = useState<React.ReactNode[][]>([]);

    // Handle responsive columns based on breakpoints
    useEffect(() => {
      if (!breakpoints) {
        setColumnCount(columns);
        return;
      }

      const handleResize = () => {
        const width = window.innerWidth;
        let newColumnCount = breakpoints.default || columns;

        if (width >= 1536 && breakpoints['2xl']) {
          newColumnCount = breakpoints['2xl'];
        } else if (width >= 1280 && breakpoints.xl) {
          newColumnCount = breakpoints.xl;
        } else if (width >= 1024 && breakpoints.lg) {
          newColumnCount = breakpoints.lg;
        } else if (width >= 768 && breakpoints.md) {
          newColumnCount = breakpoints.md;
        } else if (width >= 640 && breakpoints.sm) {
          newColumnCount = breakpoints.sm;
        }

        setColumnCount(newColumnCount);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [breakpoints, columns]);

    // Distribute items into columns
    useEffect(() => {
      if (!children || !children.length) {
        setItemsPerColumn([]);
        return;
      }

      const newItemsPerColumn: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
      
      // Distribute items evenly across columns (column-first approach)
      children.forEach((child, index) => {
        const columnIndex = index % columnCount;
        newItemsPerColumn[columnIndex].push(child);
      });

      setItemsPerColumn(newItemsPerColumn);
    }, [children, columnCount]);

    // Convert gap value to CSS
    const getGapValue = (gapValue: string | number | undefined) => {
      if (!gapValue) return undefined;
      return typeof gapValue === 'number' ? `${gapValue}px` : gapValue;
    };

    // Build the style object
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      ...(gap && !columnGap && !rowGap && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    // Calculate column width
    const columnWidth = `calc((100% - ${getGapValue(columnGap || gap) || '0px'} * ${columnCount - 1}) / ${columnCount})`;

    return (
      <Component
        ref={(node: HTMLDivElement) => {
          // Handle both refs
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          containerRef.current = node;
        }}
        className={`strive-masonry ${className}`}
        style={containerStyle}
        {...rest}
      >
        {itemsPerColumn.map((columnItems, columnIndex) => (
          <div
            key={`masonry-column-${columnIndex}`}
            className="strive-masonry-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: columnWidth,
              ...(gap && !rowGap && { gap: getGapValue(gap) }),
              ...(rowGap && { gap: getGapValue(rowGap) }),
            }}
          >
            {columnItems.map((item, itemIndex) => (
              <div
                key={`masonry-item-${columnIndex}-${itemIndex}`}
                className="strive-masonry-item"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </Component>
    );
  }
);

Masonry.displayName = 'Masonry';
