import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseCarouselOptions {
  /**
   * The total number of items in the carousel
   */
  itemCount: number;
  
  /**
   * The initial active index
   * @default 0
   */
  initialIndex?: number;
  
  /**
   * Whether to enable infinite looping
   * @default false
   */
  infinite?: boolean;
  
  /**
   * Whether to enable autoplay
   * @default false
   */
  autoplay?: boolean;
  
  /**
   * The interval for autoplay in milliseconds
   * @default 3000
   */
  autoplayInterval?: number;
  
  /**
   * Whether to pause autoplay on hover
   * @default true
   */
  pauseOnHover?: boolean;
  
  /**
   * Whether to pause autoplay on focus
   * @default true
   */
  pauseOnFocus?: boolean;
  
  /**
   * The number of items to show at once
   * @default 1
   */
  slidesToShow?: number;
  
  /**
   * The number of items to scroll at once
   * @default 1
   */
  slidesToScroll?: number;
  
  /**
   * Whether to center the active slide
   * @default false
   */
  centerMode?: boolean;
  
  /**
   * Whether to enable dragging/swiping
   * @default true
   */
  draggable?: boolean;
  
  /**
   * The threshold for swipe distance (in px)
   * @default 50
   */
  swipeThreshold?: number;
  
  /**
   * Callback when the active index changes
   */
  onChange?: (index: number) => void;
  
  /**
   * Whether to enable keyboard navigation
   * @default true
   */
  keyboardNavigation?: boolean;
}

export interface UseCarouselReturn {
  /**
   * The current active index
   */
  activeIndex: number;
  
  /**
   * Go to the next slide
   */
  next: () => void;
  
  /**
   * Go to the previous slide
   */
  prev: () => void;
  
  /**
   * Go to a specific slide
   */
  goTo: (index: number) => void;
  
  /**
   * Start autoplay
   */
  startAutoplay: () => void;
  
  /**
   * Stop autoplay
   */
  stopAutoplay: () => void;
  
  /**
   * Whether the carousel is at the beginning
   */
  isBeginning: boolean;
  
  /**
   * Whether the carousel is at the end
   */
  isEnd: boolean;
  
  /**
   * Props for the carousel container
   */
  getContainerProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex: number;
    role: string;
    'aria-roledescription': string;
    'aria-live': string;
  };
  
  /**
   * Props for the carousel track
   */
  getTrackProps: () => {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    role: string;
  };
  
  /**
   * Props for a carousel slide
   */
  getSlideProps: (index: number) => {
    id: string;
    role: string;
    'aria-roledescription': string;
    'aria-hidden': boolean;
    'aria-label': string;
    tabIndex: number;
  };
  
  /**
   * Props for the next button
   */
  getNextButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    'aria-label': string;
    'aria-controls': string;
  };
  
  /**
   * Props for the previous button
   */
  getPrevButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    'aria-label': string;
    'aria-controls': string;
  };
  
  /**
   * Props for a dot indicator
   */
  getDotProps: (index: number) => {
    onClick: () => void;
    'aria-label': string;
    'aria-selected': boolean;
    'aria-controls': string;
    role: string;
    tabIndex: number;
  };
  
  /**
   * Get the visible slide indexes
   */
  getVisibleSlides: () => number[];
  
  /**
   * The total number of items
   */
  itemCount: number;
  
  /**
   * The total number of pages
   */
  pageCount: number;
  
  /**
   * Whether the carousel is being dragged
   */
  isDragging: boolean;
  
  /**
   * Whether the carousel is in autoplay mode
   */
  isAutoPlaying: boolean;
}

/**
 * Hook for creating a carousel with accessibility and keyboard navigation
 */
export function useCarousel(options: UseCarouselOptions): UseCarouselReturn {
  const {
    itemCount,
    initialIndex = 0,
    infinite = false,
    autoplay = false,
    autoplayInterval = 3000,
    pauseOnHover = true,
    pauseOnFocus = true,
    slidesToShow = 1,
    slidesToScroll = 1,
    centerMode = false,
    draggable = true,
    swipeThreshold = 50,
    onChange,
    keyboardNavigation = true,
  } = options;
  
  // State
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
  
  // Refs
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  
  // Calculate page count
  const pageCount = Math.ceil(itemCount / slidesToScroll);
  
  // Check if at beginning or end
  const isBeginning = activeIndex === 0;
  const isEnd = activeIndex >= itemCount - slidesToShow;
  
  // Handle going to a specific slide
  const goTo = useCallback((index: number) => {
    let newIndex = index;
    
    if (!infinite) {
      // Clamp index to valid range
      newIndex = Math.max(0, Math.min(itemCount - slidesToShow, newIndex));
    } else {
      // Handle wrapping for infinite mode
      if (newIndex < 0) {
        newIndex = itemCount - slidesToShow + (newIndex % (itemCount - slidesToShow));
      } else if (newIndex >= itemCount) {
        newIndex = newIndex % itemCount;
      }
    }
    
    setActiveIndex(newIndex);
    onChange?.(newIndex);
  }, [infinite, itemCount, slidesToShow, onChange]);
  
  // Handle going to the next slide
  const next = useCallback(() => {
    const nextIndex = activeIndex + slidesToScroll;
    
    if (!infinite && nextIndex >= itemCount - slidesToShow + 1) {
      goTo(itemCount - slidesToShow);
    } else {
      goTo(nextIndex);
    }
  }, [activeIndex, goTo, infinite, itemCount, slidesToScroll, slidesToShow]);
  
  // Handle going to the previous slide
  const prev = useCallback(() => {
    const prevIndex = activeIndex - slidesToScroll;
    
    if (!infinite && prevIndex < 0) {
      goTo(0);
    } else {
      goTo(prevIndex);
    }
  }, [activeIndex, goTo, infinite, slidesToScroll]);
  
  // Handle autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    setIsAutoPlaying(true);
    autoplayTimerRef.current = setInterval(() => {
      next();
    }, autoplayInterval);
  }, [autoplayInterval, next]);
  
  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    setIsAutoPlaying(false);
  }, []);
  
  // Start/stop autoplay based on options
  useEffect(() => {
    if (autoplay) {
      startAutoplay();
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, startAutoplay]);
  
  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (startXRef.current === null) return;
      currentXRef.current = e.clientX;
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (startXRef.current === null || currentXRef.current === null) return;
      
      const diff = currentXRef.current - startXRef.current;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          prev();
        } else {
          next();
        }
      }
      
      startXRef.current = null;
      currentXRef.current = null;
      setIsDragging(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [draggable, next, prev, swipeThreshold]);
  
  // Handle touch events for swiping
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (startXRef.current === null) return;
      currentXRef.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      if (startXRef.current === null || currentXRef.current === null) return;
      
      const diff = currentXRef.current - startXRef.current;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          prev();
        } else {
          next();
        }
      }
      
      startXRef.current = null;
      currentXRef.current = null;
      setIsDragging(false);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [draggable, next, prev, swipeThreshold]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        next();
        break;
      default:
        break;
    }
  }, [keyboardNavigation, next, prev]);
  
  // Get the visible slide indexes
  const getVisibleSlides = useCallback(() => {
    const visibleSlides: number[] = [];
    
    for (let i = 0; i < slidesToShow; i++) {
      const slideIndex = (activeIndex + i) % itemCount;
      visibleSlides.push(slideIndex);
    }
    
    return visibleSlides;
  }, [activeIndex, itemCount, slidesToShow]);
  
  // Props getters
  const getContainerProps = useCallback(() => ({
    onMouseEnter: () => {
      if (pauseOnHover && isAutoPlaying) {
        stopAutoplay();
      }
    },
    onMouseLeave: () => {
      if (pauseOnHover && autoplay && !isAutoPlaying) {
        startAutoplay();
      }
    },
    onFocus: () => {
      if (pauseOnFocus && isAutoPlaying) {
        stopAutoplay();
      }
    },
    onBlur: () => {
      if (pauseOnFocus && autoplay && !isAutoPlaying) {
        startAutoplay();
      }
    },
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: 'region',
    'aria-roledescription': 'carousel',
    'aria-live': isAutoPlaying ? 'off' : 'polite',
  }), [
    pauseOnHover, 
    isAutoPlaying, 
    stopAutoplay, 
    pauseOnFocus, 
    autoplay, 
    startAutoplay, 
    handleKeyDown
  ]);
  
  const getTrackProps = useCallback(() => ({
    onMouseDown: handleMouseDown,
    onTouchStart: handleTouchStart,
    role: 'presentation',
  }), [handleMouseDown, handleTouchStart]);
  
  const getSlideProps = useCallback((index: number) => ({
    id: `carousel-slide-${index}`,
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-hidden': !getVisibleSlides().includes(index),
    'aria-label': `${index + 1} of ${itemCount}`,
    tabIndex: getVisibleSlides().includes(index) ? 0 : -1,
  }), [getVisibleSlides, itemCount]);
  
  const getNextButtonProps = useCallback(() => ({
    onClick: next,
    disabled: !infinite && isEnd,
    'aria-label': 'Next slide',
    'aria-controls': `carousel-slide-${activeIndex}`,
  }), [next, infinite, isEnd, activeIndex]);
  
  const getPrevButtonProps = useCallback(() => ({
    onClick: prev,
    disabled: !infinite && isBeginning,
    'aria-label': 'Previous slide',
    'aria-controls': `carousel-slide-${activeIndex}`,
  }), [prev, infinite, isBeginning, activeIndex]);
  
  const getDotProps = useCallback((index: number) => ({
    onClick: () => goTo(index * slidesToScroll),
    'aria-label': `Go to slide ${index + 1}`,
    'aria-selected': Math.floor(activeIndex / slidesToScroll) === index,
    'aria-controls': `carousel-slide-${index * slidesToScroll}`,
    role: 'tab',
    tabIndex: 0,
  }), [activeIndex, goTo, slidesToScroll]);
  
  return {
    activeIndex,
    next,
    prev,
    goTo,
    startAutoplay,
    stopAutoplay,
    isBeginning,
    isEnd,
    getContainerProps,
    getTrackProps,
    getSlideProps,
    getNextButtonProps,
    getPrevButtonProps,
    getDotProps,
    getVisibleSlides,
    itemCount,
    pageCount,
    isDragging,
    isAutoPlaying,
  };
}

export default useCarousel;
