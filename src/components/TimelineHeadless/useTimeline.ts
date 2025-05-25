import { useState, useCallback } from 'react';

export type TimelineOrientation = 'vertical' | 'horizontal';
export type TimelineAlignment = 'left' | 'right' | 'center' | 'alternate';
export type TimelineSortOrder = 'asc' | 'desc';

export interface UseTimelineOptions {
  /**
   * The orientation of the timeline
   * @default 'vertical'
   */
  orientation?: TimelineOrientation;
  
  /**
   * The alignment of the timeline items
   * @default 'left'
   */
  alignment?: TimelineAlignment;
  
  /**
   * The sort order of the timeline items
   * @default 'asc'
   */
  sortOrder?: TimelineSortOrder;
  
  /**
   * Whether to collapse items on mobile
   * @default true
   */
  collapseOnMobile?: boolean;
  
  /**
   * The breakpoint for mobile view (in px)
   * @default 768
   */
  mobileBreakpoint?: number;
  
  /**
   * Whether to animate items when they enter the viewport
   * @default true
   */
  animateOnScroll?: boolean;
  
  /**
   * The initial active item index
   * @default -1 (no active item)
   */
  initialActiveIndex?: number;
  
  /**
   * Callback when an item is activated
   */
  onItemActivate?: (index: number) => void;
}

export interface UseTimelineReturn {
  /**
   * The orientation of the timeline
   */
  orientation: TimelineOrientation;
  
  /**
   * The alignment of the timeline items
   */
  alignment: TimelineAlignment;
  
  /**
   * The sort order of the timeline items
   */
  sortOrder: TimelineSortOrder;
  
  /**
   * Whether the timeline is in mobile view
   */
  isMobileView: boolean;
  
  /**
   * The active item index
   */
  activeIndex: number;
  
  /**
   * Set the active item index
   */
  setActiveIndex: (index: number) => void;
  
  /**
   * Toggle the active item index
   */
  toggleActiveIndex: (index: number) => void;
  
  /**
   * Get props for the timeline container
   */
  getTimelineProps: () => {
    role: string;
    'aria-orientation': TimelineOrientation;
  };
  
  /**
   * Get props for a timeline item
   */
  getItemProps: (index: number) => {
    id: string;
    role: string;
    'aria-expanded': boolean;
    'aria-posinset': number;
    'aria-setsize': number;
    tabIndex: number;
    onClick: () => void;
  };
  
  /**
   * Get the position of an item based on index
   */
  getItemPosition: (index: number) => 'left' | 'right';
  
  /**
   * Get the animation direction for an item
   */
  getItemAnimationDirection: (index: number) => 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Hook for creating an accessible timeline component
 */
export function useTimeline(options: UseTimelineOptions = {}): UseTimelineReturn {
  const {
    orientation = 'vertical',
    alignment = 'left',
    sortOrder = 'asc',
    collapseOnMobile = true,
    mobileBreakpoint = 768,
    animateOnScroll = true,
    initialActiveIndex = -1,
    onItemActivate,
  } = options;
  
  // State
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const [isMobileView, setIsMobileView] = useState<boolean>(
    collapseOnMobile && typeof window !== 'undefined' ? window.innerWidth < mobileBreakpoint : false
  );
  
  // Update mobile view state on window resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      if (collapseOnMobile) {
        setIsMobileView(window.innerWidth < mobileBreakpoint);
      }
    });
  }
  
  // Toggle active index
  const toggleActiveIndex = useCallback((index: number) => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === index ? -1 : index;
      if (onItemActivate && newIndex !== -1) {
        onItemActivate(newIndex);
      }
      return newIndex;
    });
  }, [onItemActivate]);
  
  // Get the position of an item based on index and alignment
  const getItemPosition = useCallback((index: number): 'left' | 'right' => {
    if (alignment === 'left') return 'left';
    if (alignment === 'right') return 'right';
    if (alignment === 'center') return 'left'; // Center alignment uses left position with special styling
    return index % 2 === 0 ? 'left' : 'right'; // Alternate
  }, [alignment]);
  
  // Get the animation direction for an item
  const getItemAnimationDirection = useCallback((index: number): 'left' | 'right' | 'top' | 'bottom' => {
    if (orientation === 'horizontal') {
      return sortOrder === 'asc' ? 'top' : 'bottom';
    }
    
    const position = getItemPosition(index);
    return position === 'left' ? 'right' : 'left';
  }, [orientation, sortOrder, getItemPosition]);
  
  // Get props for the timeline container
  const getTimelineProps = useCallback(() => ({
    role: 'list',
    'aria-orientation': orientation,
  }), [orientation]);
  
  // Get props for a timeline item
  const getItemProps = useCallback((index: number) => ({
    id: `timeline-item-${index}`,
    role: 'listitem',
    'aria-expanded': activeIndex === index,
    'aria-posinset': index + 1,
    'aria-setsize': Infinity, // This will be updated by the component with the actual size
    tabIndex: 0,
    onClick: () => toggleActiveIndex(index),
  }), [activeIndex, toggleActiveIndex]);
  
  return {
    orientation,
    alignment,
    sortOrder,
    isMobileView,
    activeIndex,
    setActiveIndex,
    toggleActiveIndex,
    getTimelineProps,
    getItemProps,
    getItemPosition,
    getItemAnimationDirection,
  };
}

export default useTimeline;
