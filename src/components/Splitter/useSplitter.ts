import { useState, useRef, useCallback, useEffect } from 'react';

export type SplitDirection = 'horizontal' | 'vertical';

export interface SplitterOptions {
  /**
   * Direction of the split
   */
  direction?: SplitDirection;
  /**
   * Initial sizes of the panes as percentages (0-100)
   */
  initialSizes?: number[];
  /**
   * Minimum sizes of the panes in pixels
   */
  minSizes?: number[];
  /**
   * Maximum sizes of the panes in pixels
   */
  maxSizes?: number[];
  /**
   * Whether the splitter is disabled
   */
  disabled?: boolean;
  /**
   * Gutter size in pixels
   */
  gutterSize?: number;
  /**
   * Snap threshold in pixels
   */
  snapThreshold?: number;
  /**
   * Callback when drag starts
   */
  onDragStart?: (sizes: number[]) => void;
  /**
   * Callback during drag
   */
  onDrag?: (sizes: number[]) => void;
  /**
   * Callback when drag ends
   */
  onDragEnd?: (sizes: number[]) => void;
  /**
   * Callback when a pane is collapsed
   */
  onPaneCollapse?: (index: number) => void;
  /**
   * Callback when a pane is expanded
   */
  onPaneExpand?: (index: number) => void;
}

export interface UseSplitterReturn {
  /**
   * Current sizes of the panes as percentages (0-100)
   */
  sizes: number[];
  /**
   * Set the sizes of the panes
   */
  setSizes: (sizes: number[]) => void;
  /**
   * Whether a gutter is being dragged
   */
  isDragging: boolean;
  /**
   * Index of the gutter being dragged
   */
  draggedGutterIndex: number | null;
  /**
   * Ref to attach to the splitter container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the splitter container
   */
  getContainerProps: () => {
    style: React.CSSProperties;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for a pane
   */
  getPaneProps: (index: number) => {
    style: React.CSSProperties;
    'data-pane-index': number;
  };
  /**
   * Get props for a gutter
   */
  getGutterProps: (index: number) => {
    style: React.CSSProperties;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    'data-gutter-index': number;
    role: string;
    tabIndex: number;
    'aria-valuenow': number;
    'aria-valuemin': number;
    'aria-valuemax': number;
    'aria-orientation': string;
  };
  /**
   * Collapse a pane
   */
  collapsePane: (index: number) => void;
  /**
   * Expand a pane
   */
  expandPane: (index: number) => void;
  /**
   * Reset pane sizes to initial values
   */
  resetSizes: () => void;
}

/**
 * Hook for creating a splitter component
 */
export function useSplitter(options: SplitterOptions = {}): UseSplitterReturn {
  const {
    direction = 'horizontal',
    initialSizes = [50, 50],
    minSizes = [],
    maxSizes = [],
    disabled = false,
    gutterSize = 10,
    snapThreshold = 0,
    onDragStart,
    onDrag,
    onDragEnd,
    onPaneCollapse,
    onPaneExpand,
  } = options;

  const [sizes, setSizes] = useState<number[]>(initialSizes);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedGutterIndex, setDraggedGutterIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLElement>(null);
  const previousSizesRef = useRef<number[]>([]);
  const startPositionRef = useRef<number>(0);
  const collapsedPanesRef = useRef<Set<number>>(new Set());

  // Normalize sizes to ensure they sum to 100%
  const normalizeSizes = useCallback((newSizes: number[]): number[] => {
    const sum = newSizes.reduce((acc, size) => acc + size, 0);
    return newSizes.map(size => (size / sum) * 100);
  }, []);

  // Apply min/max constraints to sizes
  const applySizeConstraints = useCallback((newSizes: number[], containerSize: number): number[] => {
    const paneCount = newSizes.length;
    const constrainedSizes = [...newSizes];
    
    // Apply min/max constraints
    for (let i = 0; i < paneCount; i++) {
      const minSize = minSizes[i] || 0;
      const maxSize = maxSizes[i] || Infinity;
      
      // Convert percentage to pixels
      const pixelSize = (constrainedSizes[i] / 100) * containerSize;
      
      // Apply constraints
      if (pixelSize < minSize) {
        constrainedSizes[i] = (minSize / containerSize) * 100;
      } else if (pixelSize > maxSize) {
        constrainedSizes[i] = (maxSize / containerSize) * 100;
      }
    }
    
    return normalizeSizes(constrainedSizes);
  }, [minSizes, maxSizes, normalizeSizes]);

  // Handle drag start
  const handleDragStart = useCallback((e: MouseEvent | TouchEvent, gutterIndex: number) => {
    if (disabled) return;
    
    e.preventDefault();
    
    // Store current sizes
    previousSizesRef.current = [...sizes];
    
    // Get client position
    const clientPosition = 'touches' in e ? e.touches[0] : e;
    startPositionRef.current = direction === 'horizontal' ? clientPosition.clientX : clientPosition.clientY;
    
    setDraggedGutterIndex(gutterIndex);
    setIsDragging(true);
    
    onDragStart?.(sizes);
  }, [disabled, sizes, direction, onDragStart]);

  // Handle drag
  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || draggedGutterIndex === null || !containerRef.current) return;
    
    // Get client position
    const clientPosition = 'touches' in e ? e.touches[0] : e;
    const currentPosition = direction === 'horizontal' ? clientPosition.clientX : clientPosition.clientY;
    
    // Calculate delta
    const delta = currentPosition - startPositionRef.current;
    
    // Get container size
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
    
    // Calculate size change as percentage
    const deltaPercentage = (delta / containerSize) * 100;
    
    // Update sizes
    const newSizes = [...previousSizesRef.current];
    const leftPaneIndex = draggedGutterIndex;
    const rightPaneIndex = draggedGutterIndex + 1;
    
    // Skip if either pane is collapsed
    if (collapsedPanesRef.current.has(leftPaneIndex) || collapsedPanesRef.current.has(rightPaneIndex)) {
      return;
    }
    
    newSizes[leftPaneIndex] += deltaPercentage;
    newSizes[rightPaneIndex] -= deltaPercentage;
    
    // Apply snap threshold
    if (snapThreshold > 0) {
      const leftPanePixels = (newSizes[leftPaneIndex] / 100) * containerSize;
      const rightPanePixels = (newSizes[rightPaneIndex] / 100) * containerSize;
      
      // Check if left pane should snap to zero
      if (leftPanePixels < snapThreshold) {
        newSizes[leftPaneIndex] = 0;
        newSizes[rightPaneIndex] = previousSizesRef.current[leftPaneIndex] + previousSizesRef.current[rightPaneIndex];
        collapsedPanesRef.current.add(leftPaneIndex);
        onPaneCollapse?.(leftPaneIndex);
      }
      
      // Check if right pane should snap to zero
      if (rightPanePixels < snapThreshold) {
        newSizes[rightPaneIndex] = 0;
        newSizes[leftPaneIndex] = previousSizesRef.current[leftPaneIndex] + previousSizesRef.current[rightPaneIndex];
        collapsedPanesRef.current.add(rightPaneIndex);
        onPaneCollapse?.(rightPaneIndex);
      }
    }
    
    // Apply constraints
    const constrainedSizes = applySizeConstraints(newSizes, containerSize);
    
    setSizes(constrainedSizes);
    onDrag?.(constrainedSizes);
  }, [isDragging, draggedGutterIndex, direction, snapThreshold, applySizeConstraints, onDrag, onPaneCollapse]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging && draggedGutterIndex !== null) {
      setIsDragging(false);
      setDraggedGutterIndex(null);
      onDragEnd?.(sizes);
    }
  }, [isDragging, draggedGutterIndex, sizes, onDragEnd]);

  // Set up event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
      
      // Add cursor styles to body during drag
      document.body.style.cursor = direction === 'horizontal' ? 'ew-resize' : 'ns-resize';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
      
      // Reset cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, direction, handleDrag, handleDragEnd]);

  // Get props for the splitter container
  const getContainerProps = useCallback(() => {
    return {
      style: {
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
      ref: containerRef,
    };
  }, [direction]);

  // Get props for a pane
  const getPaneProps = useCallback((index: number) => {
    const isCollapsed = collapsedPanesRef.current.has(index);
    
    return {
      style: {
        flex: isCollapsed ? '0 0 0px' : `1 1 ${sizes[index]}%`,
        overflow: 'auto',
      },
      'data-pane-index': index,
    };
  }, [sizes]);

  // Get props for a gutter
  const getGutterProps = useCallback((index: number) => {
    const isLeftPaneCollapsed = collapsedPanesRef.current.has(index);
    const isRightPaneCollapsed = collapsedPanesRef.current.has(index + 1);
    
    return {
      style: {
        flex: `0 0 ${gutterSize}px`,
        cursor: disabled ? 'default' : direction === 'horizontal' ? 'ew-resize' : 'ns-resize',
        userSelect: 'none',
        display: isLeftPaneCollapsed || isRightPaneCollapsed ? 'none' : 'block',
      },
      onMouseDown: (e: React.MouseEvent) => handleDragStart(e.nativeEvent, index),
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e.nativeEvent, index),
      'data-gutter-index': index,
      role: 'separator',
      tabIndex: 0,
      'aria-valuenow': sizes[index],
      'aria-valuemin': minSizes[index] || 0,
      'aria-valuemax': maxSizes[index] || 100,
      'aria-orientation': direction === 'horizontal' ? 'vertical' : 'horizontal',
    };
  }, [gutterSize, disabled, direction, sizes, minSizes, maxSizes, handleDragStart]);

  // Collapse a pane
  const collapsePane = useCallback((index: number) => {
    if (index < 0 || index >= sizes.length) return;
    
    // Store current size before collapsing
    previousSizesRef.current = [...sizes];
    
    // Update sizes
    const newSizes = [...sizes];
    const sizeToDistribute = newSizes[index];
    newSizes[index] = 0;
    
    // Distribute the size to other panes
    const remainingPanes = sizes.length - 1;
    const sizePerPane = sizeToDistribute / remainingPanes;
    
    for (let i = 0; i < newSizes.length; i++) {
      if (i !== index) {
        newSizes[i] += sizePerPane;
      }
    }
    
    // Mark pane as collapsed
    collapsedPanesRef.current.add(index);
    
    setSizes(newSizes);
    onPaneCollapse?.(index);
  }, [sizes, onPaneCollapse]);

  // Expand a pane
  const expandPane = useCallback((index: number) => {
    if (index < 0 || index >= sizes.length || !collapsedPanesRef.current.has(index)) return;
    
    // Restore previous size
    const newSizes = [...sizes];
    newSizes[index] = previousSizesRef.current[index];
    
    // Adjust other panes
    const sizeToTake = newSizes[index];
    const remainingPanes = sizes.length - 1;
    const sizePerPane = sizeToTake / remainingPanes;
    
    for (let i = 0; i < newSizes.length; i++) {
      if (i !== index) {
        newSizes[i] -= sizePerPane;
      }
    }
    
    // Remove from collapsed panes
    collapsedPanesRef.current.delete(index);
    
    setSizes(normalizeSizes(newSizes));
    onPaneExpand?.(index);
  }, [sizes, normalizeSizes, onPaneExpand]);

  // Reset pane sizes to initial values
  const resetSizes = useCallback(() => {
    setSizes(initialSizes);
    collapsedPanesRef.current.clear();
  }, [initialSizes]);

  return {
    sizes,
    setSizes,
    isDragging,
    draggedGutterIndex,
    containerRef,
    getContainerProps,
    getPaneProps,
    getGutterProps,
    collapsePane,
    expandPane,
    resetSizes,
  };
}

export default useSplitter;
