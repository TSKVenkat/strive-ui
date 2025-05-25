import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

export interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show scroll buttons
   */
  showButtons?: boolean;
  /**
   * Whether to enable mouse wheel scrolling
   */
  enableMouseWheel?: boolean;
  /**
   * Whether to show scroll indicators
   */
  showIndicators?: boolean;
  /**
   * Custom button components
   */
  buttonPrev?: React.ReactNode;
  buttonNext?: React.ReactNode;
  /**
   * Scroll step in pixels
   */
  scrollStep?: number;
  /**
   * Scroll behavior
   */
  scrollBehavior?: 'auto' | 'smooth';
  /**
   * Whether to hide buttons when scroll is at the start/end
   */
  hideButtonsOnEdges?: boolean;
  /**
   * Space between items
   */
  gap?: number;
  /**
   * Custom styles for the container
   */
  containerStyle?: React.CSSProperties;
  /**
   * Custom styles for the scroll area
   */
  scrollAreaStyle?: React.CSSProperties;
  /**
   * Custom styles for the buttons
   */
  buttonStyle?: React.CSSProperties;
  /**
   * Custom styles for the indicators
   */
  indicatorStyle?: React.CSSProperties;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ScrollArea = styled.div<{ $gap?: number }>`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  gap: ${props => props.$gap || 0}px;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }
`;

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 5px;
`;

const Indicator = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#007bff' : '#ccc'};
  transition: background-color 0.2s ease;
`;

/**
 * HorizontalScroll component for scrolling content horizontally
 */
export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  showButtons = true,
  enableMouseWheel = true,
  showIndicators = false,
  buttonPrev,
  buttonNext,
  scrollStep = 200,
  scrollBehavior = 'smooth',
  hideButtonsOnEdges = true,
  gap = 16,
  containerStyle,
  scrollAreaStyle,
  buttonStyle,
  indicatorStyle,
  children,
  ...props
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [childrenArray, setChildrenArray] = useState<React.ReactNode[]>([]);

  // Convert children to array for indicators
  useEffect(() => {
    const childArray = React.Children.toArray(children);
    setChildrenArray(childArray);
  }, [children]);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      
      // Calculate active index for indicators
      if (showIndicators && childrenArray.length > 0) {
        const itemWidth = scrollWidth / childrenArray.length;
        const index = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.min(index, childrenArray.length - 1));
      }
    }
  }, [childrenArray.length, showIndicators]);

  // Initial check and add scroll event listener
  useEffect(() => {
    checkScrollPosition();
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [checkScrollPosition]);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (enableMouseWheel && scrollRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
        checkScrollPosition();
      }
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement && enableMouseWheel) {
      scrollElement.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        scrollElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [enableMouseWheel, checkScrollPosition]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollStep,
        behavior: scrollBehavior,
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollStep,
        behavior: scrollBehavior,
      });
    }
  };

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (scrollRef.current && childrenArray.length > 0) {
      const itemWidth = scrollRef.current.scrollWidth / childrenArray.length;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: scrollBehavior,
      });
    }
  };

  return (
    <Container style={containerStyle} {...props}>
      {showButtons && (!hideButtonsOnEdges || canScrollLeft) && (
        <PrevButton 
          onClick={scrollLeft} 
          disabled={!canScrollLeft}
          style={buttonStyle}
          aria-label="Scroll left"
        >
          {buttonPrev || '←'}
        </PrevButton>
      )}
      
      <ScrollArea 
        ref={scrollRef} 
        style={scrollAreaStyle} 
        $gap={gap}
      >
        {children}
      </ScrollArea>
      
      {showButtons && (!hideButtonsOnEdges || canScrollRight) && (
        <NextButton 
          onClick={scrollRight} 
          disabled={!canScrollRight}
          style={buttonStyle}
          aria-label="Scroll right"
        >
          {buttonNext || '→'}
        </NextButton>
      )}
      
      {showIndicators && childrenArray.length > 1 && (
        <Indicators style={indicatorStyle}>
          {childrenArray.map((_, index) => (
            <Indicator 
              key={index} 
              $active={index === activeIndex} 
              onClick={() => scrollToIndex(index)}
              role="button"
              aria-label={`Go to item ${index + 1}`}
              tabIndex={0}
            />
          ))}
        </Indicators>
      )}
    </Container>
  );
};

export default HorizontalScroll;
