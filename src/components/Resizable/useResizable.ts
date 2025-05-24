import { useState, useRef, useCallback, useEffect } from 'react';

export type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface ResizableOptions {
  /**
   * Initial width of the resizable element
   */
  initialWidth?: number;
  /**
   * Initial height of the resizable element
   */
  initialHeight?: number;
  /**
   * Minimum width constraint
   */
  minWidth?: number;
  /**
   * Maximum width constraint
   */
  maxWidth?: number;
  /**
   * Minimum height constraint
   */
  minHeight?: number;
  /**
   * Maximum height constraint
   */
  maxHeight?: number;
  /**
   * Grid size for snapping during resize
   */
  grid?: [number, number];
  /**
   * Aspect ratio to maintain during resize (width/height)
   */
  aspectRatio?: number;
  /**
   * Allowed resize directions
   */
  directions?: ResizeDirection[];
  /**
   * Whether the element is resizable
   */
  disabled?: boolean;
  /**
   * Callback when resize starts
   */
  onResizeStart?: (size: Size, direction: ResizeDirection) => void;
  /**
   * Callback during resize
   */
  onResize?: (size: Size, direction: ResizeDirection) => void;
  /**
   * Callback when resize ends
   */
  onResizeEnd?: (size: Size, direction: ResizeDirection) => void;
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface UseResizableReturn {
  /**
   * Current size of the element
   */
  size: Size;
  /**
   * Set the size of the element
   */
  setSize: (size: Size) => void;
  /**
   * Whether the element is currently being resized
   */
  isResizing: boolean;
  /**
   * Current resize direction
   */
  resizeDirection: ResizeDirection | null;
  /**
   * Ref to attach to the resizable element
   */
  resizableRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the resizable element
   */
  getResizableProps: () => {
    style: React.CSSProperties;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for a resize handle
   */
  getHandleProps: (direction: ResizeDirection) => {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    style: React.CSSProperties;
    'data-resize-handle': string;
    'aria-label': string;
  };
}

/**
 * Hook for creating resizable elements
 */
export function useResizable(options: ResizableOptions = {}): UseResizableReturn {
  const {
    initialWidth = 200,
    initialHeight = 200,
    minWidth = 10,
    maxWidth = Infinity,
    minHeight = 10,
    maxHeight = Infinity,
    grid,
    aspectRatio,
    directions = ['right', 'bottom', 'bottomRight'],
    disabled = false,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = options;

  const [size, setSize] = useState<Size>({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);
  
  const resizableRef = useRef<HTMLElement>(null);
  const startSizeRef = useRef<Size>({ width: 0, height: 0 });
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });

  // Apply grid snapping if specified
  const applyGrid = useCallback((value: number, gridSize: number): number => {
    return Math.round(value / gridSize) * gridSize;
  }, []);

  // Constrain size within min/max bounds
  const constrainSize = useCallback((newSize: Size): Size => {
    let { width, height } = newSize;
    
    // Apply min/max constraints
    width = Math.max(minWidth, Math.min(maxWidth, width));
    height = Math.max(minHeight, Math.min(maxHeight, height));
    
    // Apply grid snapping if specified
    if (grid) {
      width = applyGrid(width, grid[0]);
      height = applyGrid(height, grid[1]);
    }
    
    // Maintain aspect ratio if specified
    if (aspectRatio) {
      const currentRatio = width / height;
      
      if (currentRatio > aspectRatio) {
        width = height * aspectRatio;
      } else if (currentRatio < aspectRatio) {
        height = width / aspectRatio;
      }
    }
    
    return { width, height };
  }, [minWidth, maxWidth, minHeight, maxHeight, grid, aspectRatio, applyGrid]);

  // Handle resize start
  const handleResizeStart = useCallback((e: MouseEvent | TouchEvent, direction: ResizeDirection) => {
    if (disabled) return;
    
    e.preventDefault();
    
    // Store initial size and position
    if (resizableRef.current) {
      const { width, height } = resizableRef.current.getBoundingClientRect();
      startSizeRef.current = { width, height };
      
      // Get client coordinates
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      startPositionRef.current = { x: clientX, y: clientY };
      setResizeDirection(direction);
      setIsResizing(true);
      
      onResizeStart?.({ width, height }, direction);
    }
  }, [disabled, onResizeStart]);

  // Handle resize
  const handleResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeDirection) return;
    
    // Get client coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate delta from start position
    const deltaX = clientX - startPositionRef.current.x;
    const deltaY = clientY - startPositionRef.current.y;
    
    // Calculate new size based on resize direction
    let newWidth = startSizeRef.current.width;
    let newHeight = startSizeRef.current.height;
    
    if (resizeDirection.includes('right')) {
      newWidth = startSizeRef.current.width + deltaX;
    } else if (resizeDirection.includes('left')) {
      newWidth = startSizeRef.current.width - deltaX;
    }
    
    if (resizeDirection.includes('bottom')) {
      newHeight = startSizeRef.current.height + deltaY;
    } else if (resizeDirection.includes('top')) {
      newHeight = startSizeRef.current.height - deltaY;
    }
    
    // Apply constraints
    const constrainedSize = constrainSize({ width: newWidth, height: newHeight });
    
    setSize(constrainedSize);
    onResize?.(constrainedSize, resizeDirection);
  }, [isResizing, resizeDirection, constrainSize, onResize]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (isResizing && resizeDirection) {
      setIsResizing(false);
      onResizeEnd?.(size, resizeDirection);
      setResizeDirection(null);
    }
  }, [isResizing, resizeDirection, size, onResizeEnd]);

  // Set up event listeners for resize
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('touchmove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchend', handleResizeEnd);
      
      // Add cursor styles to body during resize
      if (resizeDirection) {
        let cursor = 'default';
        
        if (resizeDirection === 'right' || resizeDirection === 'left') {
          cursor = 'ew-resize';
        } else if (resizeDirection === 'top' || resizeDirection === 'bottom') {
          cursor = 'ns-resize';
        } else if (resizeDirection === 'topLeft' || resizeDirection === 'bottomRight') {
          cursor = 'nwse-resize';
        } else if (resizeDirection === 'topRight' || resizeDirection === 'bottomLeft') {
          cursor = 'nesw-resize';
        }
        
        document.body.style.cursor = cursor;
        document.body.style.userSelect = 'none';
      }
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('touchmove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchend', handleResizeEnd);
      
      // Reset cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizeDirection, handleResize, handleResizeEnd]);

  // Get props for the resizable element
  const getResizableProps = useCallback(() => {
    return {
      style: {
        position: 'relative',
        width: `${size.width}px`,
        height: `${size.height}px`,
      },
      ref: resizableRef,
    };
  }, [size]);

  // Get props for a resize handle
  const getHandleProps = useCallback((direction: ResizeDirection) => {
    // Skip if direction is not allowed
    if (!directions.includes(direction)) {
      return {
        onMouseDown: () => {},
        onTouchStart: () => {},
        style: { display: 'none' },
        'data-resize-handle': direction,
        'aria-label': `Resize ${direction}`,
      };
    }
    
    // Get position and cursor based on direction
    let position: React.CSSProperties = {};
    let cursor = 'default';
    
    switch (direction) {
      case 'top':
        position = { top: 0, left: 0, right: 0, height: '10px', cursor: 'ns-resize' };
        cursor = 'ns-resize';
        break;
      case 'right':
        position = { top: 0, right: 0, bottom: 0, width: '10px', cursor: 'ew-resize' };
        cursor = 'ew-resize';
        break;
      case 'bottom':
        position = { bottom: 0, left: 0, right: 0, height: '10px', cursor: 'ns-resize' };
        cursor = 'ns-resize';
        break;
      case 'left':
        position = { top: 0, left: 0, bottom: 0, width: '10px', cursor: 'ew-resize' };
        cursor = 'ew-resize';
        break;
      case 'topLeft':
        position = { top: 0, left: 0, width: '10px', height: '10px', cursor: 'nwse-resize' };
        cursor = 'nwse-resize';
        break;
      case 'topRight':
        position = { top: 0, right: 0, width: '10px', height: '10px', cursor: 'nesw-resize' };
        cursor = 'nesw-resize';
        break;
      case 'bottomLeft':
        position = { bottom: 0, left: 0, width: '10px', height: '10px', cursor: 'nesw-resize' };
        cursor = 'nesw-resize';
        break;
      case 'bottomRight':
        position = { bottom: 0, right: 0, width: '10px', height: '10px', cursor: 'nwse-resize' };
        cursor = 'nwse-resize';
        break;
    }
    
    return {
      onMouseDown: (e: React.MouseEvent) => handleResizeStart(e.nativeEvent, direction),
      onTouchStart: (e: React.TouchEvent) => handleResizeStart(e.nativeEvent, direction),
      style: {
        position: 'absolute',
        ...position,
        cursor: disabled ? 'default' : cursor,
        zIndex: 1,
      },
      'data-resize-handle': direction,
      'aria-label': `Resize ${direction}`,
    };
  }, [directions, disabled, handleResizeStart]);

  return {
    size,
    setSize,
    isResizing,
    resizeDirection,
    resizableRef,
    getResizableProps,
    getHandleProps,
  };
}

export default useResizable;
