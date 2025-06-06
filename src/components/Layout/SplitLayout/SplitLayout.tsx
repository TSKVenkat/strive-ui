import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

export type SplitDirection = 'horizontal' | 'vertical';
export type SplitSizes = [number, number];
export type SplitUnit = 'percentage' | 'pixel';

export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the split layout
   * Should be exactly two children
   */
  children: [React.ReactNode, React.ReactNode];
  
  /**
   * The direction of the split
   * @default 'horizontal'
   */
  direction?: SplitDirection;
  
  /**
   * The initial sizes of the split panes
   * @default [50, 50]
   */
  initialSizes?: SplitSizes;
  
  /**
   * The minimum sizes of the split panes
   * @default [0, 0]
   */
  minSizes?: SplitSizes;
  
  /**
   * The unit to use for sizes
   * @default 'percentage'
   */
  unit?: SplitUnit;
  
  /**
   * The width of the gutter between the panes
   * @default 10
   */
  gutterSize?: number;
  
  /**
   * The color of the gutter
   * @default '#e0e0e0'
   */
  gutterColor?: string;
  
  /**
   * Whether the split is resizable
   * @default true
   */
  resizable?: boolean;
  
  /**
   * Whether to collapse the first pane when dragging to minimum size
   * @default false
   */
  collapseWhenDraggedToMin?: boolean;
  
  /**
   * Callback when the sizes change
   */
  onSizesChange?: (sizes: SplitSizes) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

/**
 * SplitLayout component for creating resizable split layouts
 */
export const SplitLayout = forwardRef<HTMLDivElement, SplitLayoutProps>(
  (
    {
      children,
      direction = 'horizontal',
      initialSizes = [50, 50],
      minSizes = [0, 0],
      unit = 'percentage',
      gutterSize = 10,
      gutterColor = '#e0e0e0',
      resizable = true,
      collapseWhenDraggedToMin = false,
      onSizesChange,
      className = '',
      as: Component = 'div',
      style,
      ...rest
    },
    ref
  ) => {
    const [sizes, setSizes] = useState<SplitSizes>(initialSizes);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const gutterRef = useRef<HTMLDivElement>(null);
    const startPositionRef = useRef(0);
    const startSizesRef = useRef<SplitSizes>([0, 0]);

    // Validate that we have exactly two children
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length !== 2) {
      console.error('SplitLayout must have exactly two children');
      return null;
    }

    // Handle the start of dragging
    const handleDragStart = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!resizable) return;

        // Prevent text selection during drag
        e.preventDefault();
        document.body.style.userSelect = 'none';
        
        // Get the starting position
        const clientPosition = 'touches' in e ? e.touches[0].clientX : e.clientX;
        startPositionRef.current = direction === 'horizontal' ? clientPosition : ('touches' in e ? e.touches[0].clientY : e.clientY);
        
        // Store the current sizes
        startSizesRef.current = [...sizes];
        
        // Set dragging state
        setIsDragging(true);
      },
      [direction, resizable, sizes]
    );

    // Handle dragging
    const handleDrag = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        // Get the current position
        const clientPosition = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const currentPosition = direction === 'horizontal' ? clientPosition : ('touches' in e ? e.touches[0].clientY : e.clientY);
        
        // Calculate the delta
        const delta = currentPosition - startPositionRef.current;
        
        // Get the container size
        const containerSize = direction === 'horizontal' 
          ? containerRef.current.offsetWidth 
          : containerRef.current.offsetHeight;
        
        // Calculate the new sizes
        let newSizes: SplitSizes;
        
        if (unit === 'percentage') {
          // Calculate the delta as a percentage
          const deltaPercentage = (delta / containerSize) * 100;
          
          // Calculate the new sizes
          newSizes = [
            startSizesRef.current[0] + deltaPercentage,
            startSizesRef.current[1] - deltaPercentage,
          ];
        } else {
          // Calculate the new sizes in pixels
          newSizes = [
            startSizesRef.current[0] + delta,
            startSizesRef.current[1] - delta,
          ];
        }
        
        // Apply minimum sizes
        if (newSizes[0] < minSizes[0]) {
          const diff = minSizes[0] - newSizes[0];
          newSizes[0] = minSizes[0];
          newSizes[1] -= diff;
        }
        
        if (newSizes[1] < minSizes[1]) {
          const diff = minSizes[1] - newSizes[1];
          newSizes[1] = minSizes[1];
          newSizes[0] -= diff;
        }
        
        // Handle collapsing
        if (collapseWhenDraggedToMin) {
          if (newSizes[0] <= minSizes[0]) {
            newSizes = [0, 100];
          } else if (newSizes[1] <= minSizes[1]) {
            newSizes = [100, 0];
          }
        }
        
        // Update the sizes
        setSizes(newSizes);
        
        // Call the callback
        if (onSizesChange) {
          onSizesChange(newSizes);
        }
      },
      [isDragging, direction, unit, minSizes, collapseWhenDraggedToMin, onSizesChange]
    );

    // Handle the end of dragging
    const handleDragEnd = useCallback(() => {
      document.body.style.userSelect = '';
      setIsDragging(false);
    }, []);

    // Add event listeners for dragging
    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('touchmove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
      } else {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
      }
      
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }, [isDragging, handleDrag, handleDragEnd]);

    // Calculate the styles for the container
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      width: '100%',
      height: '100%',
      ...style,
    };

    // Calculate the styles for the panes
    const pane1Style: React.CSSProperties = {
      [direction === 'horizontal' ? 'width' : 'height']: unit === 'percentage' ? `${sizes[0]}%` : `${sizes[0]}px`,
      overflow: 'auto',
    };

    const pane2Style: React.CSSProperties = {
      [direction === 'horizontal' ? 'width' : 'height']: unit === 'percentage' ? `${sizes[1]}%` : `${sizes[1]}px`,
      overflow: 'auto',
    };

    // Calculate the styles for the gutter
    const gutterStyle: React.CSSProperties = {
      [direction === 'horizontal' ? 'width' : 'height']: `${gutterSize}px`,
      [direction === 'horizontal' ? 'minWidth' : 'minHeight']: `${gutterSize}px`,
      backgroundColor: gutterColor,
      cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
      ...(resizable && {
        userSelect: 'none',
        touchAction: 'none',
      }),
    };

    return (
      <Component
        ref={(node) => {
          // Handle both the forwardRef and the local ref
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref && 'current' in ref) {
              (ref as React.MutableRefObject<any>).current = node;
            }
          }
          if (containerRef && 'current' in containerRef) {
            (containerRef as React.MutableRefObject<any>).current = node;
          }
        }}
        className={`strive-split-layout ${direction} ${className}`}
        style={containerStyle}
        {...rest}
      >
        <div className="strive-split-pane strive-split-pane-1" style={pane1Style}>
          {childrenArray[0]}
        </div>
        
        <div
          ref={gutterRef}
          className="strive-split-gutter"
          style={gutterStyle}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />
        
        <div className="strive-split-pane strive-split-pane-2" style={pane2Style}>
          {childrenArray[1]}
        </div>
      </Component>
    );
  }
);

SplitLayout.displayName = 'SplitLayout';

/**
 * SplitPane component for use within SplitLayout
 */
export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the pane
   */
  children: React.ReactNode;
  
  /**
   * The minimum size of the pane
   */
  minSize?: number;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(
  (
    {
      children,
      className = '',
      as: Component = 'div',
      ...rest
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={`strive-split-pane ${className}`}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

SplitPane.displayName = 'SplitPane';

