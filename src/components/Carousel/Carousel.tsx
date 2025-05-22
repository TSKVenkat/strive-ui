import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface CarouselProps {
  /** Array of elements to display in the carousel */
  children: React.ReactNode[];
  /** Duration of the automatic slide transition in milliseconds */
  autoPlayInterval?: number;
  /** Whether to automatically transition between slides */
  autoPlay?: boolean;
  /** Whether to show navigation dots */
  showDots?: boolean;
  /** Whether to show navigation arrows */
  showArrows?: boolean;
  /** Function called when the active slide changes */
  onSlideChange?: (index: number) => void;
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 100%;
`;

const CarouselSlide = styled(motion.div)`
  flex: 0 0 100%;
  width: 100%;
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CarouselDot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary[600] : theme.colors.neutral[300]};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary[700] : theme.colors.neutral[400]};
  }
`;

const CarouselArrow = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => direction === 'left' ? 'left: 16px;' : 'right: 16px;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.neutral[900]}80`};
  color: ${({ theme }) => theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover {
    opacity: 1;
  }
  
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    transform: ${({ direction }) => 
      direction === 'left' ? 'rotate(-135deg)' : 'rotate(45deg)'};
  }
`;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export const Carousel = ({
  children,
  autoPlayInterval = 5000,
  autoPlay = false,
  showDots = true,
  showArrows = true,
  onSlideChange,
}: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slidesCount = React.Children.count(children);

  const goToSlide = (index: number) => {
    const newDirection = index > activeIndex ? 1 : -1;
    setDirection(newDirection);
    setActiveIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  const goToNextSlide = () => {
    const nextIndex = (activeIndex + 1) % slidesCount;
    goToSlide(nextIndex);
  };

  const goToPrevSlide = () => {
    const prevIndex = (activeIndex - 1 + slidesCount) % slidesCount;
    goToSlide(prevIndex);
  };

  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(goToNextSlide, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, activeIndex]);

  return (
    <div>
      <CarouselContainer>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <CarouselTrack
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <CarouselSlide>
              {children[activeIndex]}
            </CarouselSlide>
          </CarouselTrack>
        </AnimatePresence>
        
        {showArrows && slidesCount > 1 && (
          <>
            <CarouselArrow 
              direction="left" 
              onClick={goToPrevSlide}
              aria-label="Previous slide"
            />
            <CarouselArrow 
              direction="right" 
              onClick={goToNextSlide}
              aria-label="Next slide"
            />
          </>
        )}
      </CarouselContainer>
      
      {showDots && slidesCount > 1 && (
        <CarouselDots>
          {Array.from({ length: slidesCount }).map((_, index) => (
            <CarouselDot
              key={index}
              active={index === activeIndex}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </CarouselDots>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';
