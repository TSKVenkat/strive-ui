import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Box } from '../Box/Box';
import { Icon } from '../Icon/Icon';

export interface CarouselItem {
  /**
   * Unique ID for the item
   */
  id: string | number;
  /**
   * Image source URL
   */
  image?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Title for the item
   */
  title?: string;
  /**
   * Description for the item
   */
  description?: string;
  /**
   * Custom content for the item
   */
  content?: React.ReactNode;
}

export interface AdvancedCarouselProps {
  /**
   * Items to display in the carousel
   */
  items: CarouselItem[];
  /**
   * Whether to show navigation arrows
   */
  showArrows?: boolean;
  /**
   * Whether to show navigation dots
   */
  showDots?: boolean;
  /**
   * Whether to show thumbnails
   */
  showThumbnails?: boolean;
  /**
   * Whether to enable autoplay
   */
  autoplay?: boolean;
  /**
   * Autoplay interval in milliseconds
   */
  autoplayInterval?: number;
  /**
   * Whether to pause autoplay on hover
   */
  pauseOnHover?: boolean;
  /**
   * Whether to enable infinite loop
   */
  infinite?: boolean;
  /**
   * Whether to enable dragging/swiping
   */
  draggable?: boolean;
  /**
   * Transition effect ('slide' | 'fade' | 'zoom')
   */
  effect?: 'slide' | 'fade' | 'zoom';
  /**
   * Transition duration in milliseconds
   */
  transitionDuration?: number;
  /**
   * Whether to show item content
   */
  showContent?: boolean;
  /**
   * Content position ('bottom' | 'top' | 'left' | 'right' | 'center')
   */
  contentPosition?: 'bottom' | 'top' | 'left' | 'right' | 'center';
  /**
   * Number of items to show at once
   */
  slidesToShow?: number;
  /**
   * Number of items to scroll at once
   */
  slidesToScroll?: number;
  /**
   * Whether to center the active slide
   */
  centerMode?: boolean;
  /**
   * Whether to enable adaptive height
   */
  adaptiveHeight?: boolean;
  /**
   * Whether to enable lazy loading
   */
  lazyLoad?: boolean;
  /**
   * Whether to enable keyboard navigation
   */
  keyboardNavigation?: boolean;
  /**
   * Whether to display fullscreen button
   */
  fullscreenButton?: boolean;
  /**
   * Custom class name for the carousel container
   */
  className?: string;
  /**
   * Custom style for the carousel container
   */
  style?: React.CSSProperties;
  /**
   * Callback when the active slide changes
   */
  onChange?: (currentIndex: number) => void;
  /**
   * Callback when a slide is clicked
   */
  onSlideClick?: (item: CarouselItem, index: number) => void;
}

// Styled components
const CarouselContainer = styled.div<{ $fullscreen: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ $fullscreen }) => ($fullscreen ? '100vh' : '100%')};
  overflow: hidden;
  ${({ $fullscreen }) => $fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: black;
  `}
`;

const CarouselTrack = styled(motion.div)<{ $draggable: boolean }>`
  display: flex;
  height: 100%;
  cursor: ${({ $draggable }) => ($draggable ? 'grab' : 'default')};
  
  &:active {
    cursor: ${({ $draggable }) => ($draggable ? 'grabbing' : 'default')};
  }
`;

const CarouselSlide = styled(motion.div)<{ $width: string }>`
  flex: 0 0 ${({ $width }) => $width};
  position: relative;
  overflow: hidden;
`;

const SlideImage = styled(motion.img)<{ $objectFit?: string }>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit || 'cover'};
  pointer-events: none;
`;

const SlideContent = styled(motion.div)<{ $position: string }>`
  position: absolute;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.common.white};
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  ${({ $position }) => {
    switch ($position) {
      case 'bottom':
        return `
          bottom: 0;
          left: 0;
          right: 0;
        `;
      case 'top':
        return `
          top: 0;
          left: 0;
          right: 0;
        `;
      case 'left':
        return `
          left: 0;
          top: 0;
          bottom: 0;
          max-width: 30%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `;
      case 'right':
        return `
          right: 0;
          top: 0;
          bottom: 0;
          max-width: 30%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `;
      case 'center':
        return `
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 80%;
          text-align: center;
        `;
      default:
        return `
          bottom: 0;
          left: 0;
          right: 0;
        `;
    }
  }}
`;

const SlideTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const SlideDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const NavigationArrow = styled(motion.button)<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position === 'left' ? 'left: 10px;' : 'right: 10px;'}
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.common.white : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.common.white};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: 4px;
  }
`;

const Thumbnail = styled.button<{ $active: boolean }>`
  width: 60px;
  height: 40px;
  border: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    border-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[500] : theme.colors.neutral[400]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

/**
 * Advanced Carousel component with multiple features like autoplay, infinite loop,
 * different transition effects, thumbnails, and more.
 */
export const AdvancedCarousel: React.FC<AdvancedCarouselProps> = ({
  items,
  showArrows = true,
  showDots = true,
  showThumbnails = false,
  autoplay = false,
  autoplayInterval = 5000,
  pauseOnHover = true,
  infinite = true,
  draggable = true,
  effect = 'slide',
  transitionDuration = 500,
  showContent = true,
  contentPosition = 'bottom',
  slidesToShow = 1,
  slidesToScroll = 1,
  centerMode = false,
  adaptiveHeight = false,
  lazyLoad = true,
  keyboardNavigation = true,
  fullscreenButton = false,
  className,
  style,
  onChange,
  onSlideClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slideHeight, setSlideHeight] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();
  
  // Calculate the width of each slide
  const slideWidth = `${100 / slidesToShow}%`;
  
  // Adjust current index when items change
  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(Math.max(0, items.length - 1));
    }
  }, [items, currentIndex]);
  
  // Handle autoplay
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
      
      if (autoplay && !isPaused) {
        autoplayTimerRef.current = setInterval(() => {
          goToNext();
        }, autoplayInterval);
      }
    };
    
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isPaused, items.length]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyboardNavigation) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardNavigation, isFullscreen]);
  
  // Handle adaptive height
  useEffect(() => {
    if (!adaptiveHeight) return;
    
    const updateHeight = () => {
      const currentSlide = slideRefs.current[currentIndex];
      if (currentSlide) {
        const height = currentSlide.offsetHeight;
        setSlideHeight(height);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [adaptiveHeight, currentIndex]);
  
  // Go to previous slide
  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => {
      const newIndex = prev - slidesToScroll;
      if (newIndex < 0) {
        return infinite ? Math.max(0, items.length - slidesToShow) : 0;
      }
      return newIndex;
    });
  }, [slidesToScroll, infinite, items.length, slidesToShow]);
  
  // Go to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      const newIndex = prev + slidesToScroll;
      const maxIndex = items.length - slidesToShow;
      if (newIndex > maxIndex) {
        return infinite ? 0 : maxIndex;
      }
      return newIndex;
    });
  }, [slidesToScroll, infinite, items.length, slidesToShow]);
  
  // Go to a specific slide
  const goToSlide = useCallback((index: number) => {
    const maxIndex = items.length - slidesToShow;
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
  }, [items.length, slidesToShow]);
  
  // Handle slide click
  const handleSlideClick = (item: CarouselItem, index: number) => {
    if (onSlideClick) {
      onSlideClick(item, index);
    }
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };
  
  // Handle mouse enter/leave for autoplay pause
  const handleMouseEnter = () => {
    if (pauseOnHover && autoplay) {
      setIsPaused(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (pauseOnHover && autoplay) {
      setIsPaused(false);
    }
  };
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    
    setIsDragging(true);
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : e.clientX;
    
    setDragStartX(clientX);
    setDragOffset(0);
  };
  
  // Handle drag move
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable || !isDragging) return;
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : e.clientX;
    
    const offset = clientX - dragStartX;
    setDragOffset(offset);
    
    // Update the track position
    controls.set({ x: -currentIndex * (containerRef.current?.offsetWidth || 0) / slidesToShow + offset });
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    if (!draggable || !isDragging) return;
    
    setIsDragging(false);
    
    // Determine if we should navigate based on the drag distance
    const threshold = (containerRef.current?.offsetWidth || 0) * 0.2;
    
    if (dragOffset < -threshold) {
      goToNext();
    } else if (dragOffset > threshold) {
      goToPrev();
    } else {
      // Reset to current position
      controls.start({ 
        x: -currentIndex * (containerRef.current?.offsetWidth || 0) / slidesToShow,
        transition: { duration: transitionDuration / 1000 }
      });
    }
  };
  
  // Update animation when current index changes
  useEffect(() => {
    // Notify onChange callback
    if (onChange) {
      onChange(currentIndex);
    }
    
    // Animate to the new position
    if (effect === 'slide') {
      controls.start({ 
        x: -currentIndex * (containerRef.current?.offsetWidth || 0) / slidesToShow,
        transition: { duration: transitionDuration / 1000 }
      });
    }
  }, [currentIndex, controls, transitionDuration, effect, slidesToShow, onChange]);
  
  // Get slide variants based on the effect
  const getSlideVariants = () => {
    switch (effect) {
      case 'fade':
        return {
          enter: { opacity: 0 },
          center: { opacity: 1, transition: { duration: transitionDuration / 1000 } },
          exit: { opacity: 0, transition: { duration: transitionDuration / 1000 } },
        };
      case 'zoom':
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { 
            opacity: 1, 
            scale: 1, 
            transition: { duration: transitionDuration / 1000 } 
          },
          exit: { 
            opacity: 0, 
            scale: 1.2, 
            transition: { duration: transitionDuration / 1000 } 
          },
        };
      default:
        return {
          enter: { opacity: 1 },
          center: { opacity: 1 },
          exit: { opacity: 1 },
        };
    }
  };
  
  // Render slides based on the effect
  const renderSlides = () => {
    if (effect === 'slide') {
      return (
        <CarouselTrack
          $draggable={draggable}
          animate={controls}
          initial={{ x: 0 }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{ 
            height: adaptiveHeight && slideHeight ? `${slideHeight}px` : '100%' 
          }}
        >
          {items.map((item, index) => (
            <CarouselSlide
              key={item.id}
              $width={slideWidth}
              ref={el => slideRefs.current[index] = el}
              onClick={() => handleSlideClick(item, index)}
              style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
            >
              {item.image && (
                <SlideImage
                  src={item.image}
                  alt={item.alt || ''}
                  $objectFit={adaptiveHeight ? 'contain' : 'cover'}
                  loading={lazyLoad ? 'lazy' : 'eager'}
                />
              )}
              
              {item.content ? (
                item.content
              ) : (
                showContent && (item.title || item.description) && (
                  <SlideContent $position={contentPosition}>
                    {item.title && <SlideTitle>{item.title}</SlideTitle>}
                    {item.description && <SlideDescription>{item.description}</SlideDescription>}
                  </SlideContent>
                )
              )}
            </CarouselSlide>
          ))}
        </CarouselTrack>
      );
    } else {
      // For fade and zoom effects
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={getSlideVariants()}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
          >
            <CarouselSlide
              $width="100%"
              ref={el => slideRefs.current[currentIndex] = el}
              onClick={() => handleSlideClick(items[currentIndex], currentIndex)}
              style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
            >
              {items[currentIndex].image && (
                <SlideImage
                  src={items[currentIndex].image}
                  alt={items[currentIndex].alt || ''}
                  $objectFit={adaptiveHeight ? 'contain' : 'cover'}
                  loading={lazyLoad ? 'lazy' : 'eager'}
                />
              )}
              
              {items[currentIndex].content ? (
                items[currentIndex].content
              ) : (
                showContent && (items[currentIndex].title || items[currentIndex].description) && (
                  <SlideContent $position={contentPosition}>
                    {items[currentIndex].title && <SlideTitle>{items[currentIndex].title}</SlideTitle>}
                    {items[currentIndex].description && <SlideDescription>{items[currentIndex].description}</SlideDescription>}
                  </SlideContent>
                )
              )}
            </CarouselSlide>
          </motion.div>
        </AnimatePresence>
      );
    }
  };
  
  return (
    <CarouselContainer
      ref={containerRef}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      $fullscreen={isFullscreen}
    >
      {renderSlides()}
      
      {showArrows && (
        <>
          <NavigationArrow
            $position="left"
            onClick={goToPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </NavigationArrow>
          <NavigationArrow
            $position="right"
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </NavigationArrow>
        </>
      )}
      
      {showDots && (
        <DotsContainer>
          {Array.from({ length: Math.ceil(items.length / slidesToShow) }).map((_, index) => (
            <Dot
              key={index}
              $active={index === Math.floor(currentIndex / slidesToShow)}
              onClick={() => goToSlide(index * slidesToShow)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </DotsContainer>
      )}
      
      {showThumbnails && (
        <ThumbnailsContainer>
          {items.map((item, index) => (
            <Thumbnail
              key={item.id}
              $active={index === currentIndex}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {item.image && (
                <ThumbnailImage
                  src={item.image}
                  alt={item.alt || ''}
                  loading="lazy"
                />
              )}
            </Thumbnail>
          ))}
        </ThumbnailsContainer>
      )}
      
      {fullscreenButton && (
        <FullscreenButton
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? '↙' : '↗'}
        </FullscreenButton>
      )}
    </CarouselContainer>
  );
};

export default AdvancedCarousel;
