import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { CarouselHeadless, useCarouselContext } from '../CarouselHeadless';
import { UseCarouselOptions } from '../CarouselHeadless/useCarousel';

// Define the image item type
export interface ImageItem {
  /**
   * The source URL of the image
   */
  src: string;
  
  /**
   * Alt text for the image (for accessibility)
   */
  alt: string;
  
  /**
   * Optional caption for the image
   */
  caption?: string;
  
  /**
   * Optional link for the image
   */
  href?: string;
}

// Define the props for the ImageCarousel component
export interface ImageCarouselProps extends Omit<UseCarouselOptions, 'itemCount'> {
  /**
   * Array of image items to display in the carousel
   */
  images: ImageItem[];
  
  /**
   * Whether to show captions
   * @default true
   */
  showCaptions?: boolean;
  
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * Whether to show navigation dots
   * @default true
   */
  showDots?: boolean;
  
  /**
   * Whether to enable lightbox mode on image click
   * @default false
   */
  lightbox?: boolean;
  
  /**
   * Whether to enable lazy loading of images
   * @default true
   */
  lazyLoad?: boolean;
  
  /**
   * Whether to show image counter (e.g., "3 of 10")
   * @default false
   */
  showCounter?: boolean;
  
  /**
   * Custom class name for the component
   */
  className?: string;
}

// Styled components for the ImageCarousel
const StyledCarouselRoot = styled(CarouselHeadless.Root)`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const StyledCarouselTrack = styled(CarouselHeadless.Track)`
  display: flex;
  transition: transform 0.3s ease;
`;

const StyledCarouselSlide = styled(CarouselHeadless.Slide)`
  flex: 0 0 100%;
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const StyledCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  text-align: center;
`;

const StyledNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
`;

const StyledButton = styled.button`
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
  pointer-events: auto;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StyledDots = styled(CarouselHeadless.Dots)`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
`;

const StyledDot = styled(CarouselHeadless.Dot)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &.active {
    background: white;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

const StyledCounter = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  z-index: 10;
`;

// Add a Counter component to use the hook
const Counter: React.FC<{ total: number }> = ({ total }) => {
  const carousel = useCarouselContext();
  return (
    <StyledCounter>
      {carousel.activeIndex + 1} of {total}
    </StyledCounter>
  );
};

// ImageCarousel component
export const ImageCarousel = forwardRef<HTMLDivElement, ImageCarouselProps>(
  ({
    images,
    showCaptions = true,
    showArrows = true,
    showDots = true,
    lightbox = false,
    lazyLoad = true,
    showCounter = false,
    className = '',
    ...carouselProps
  }, ref) => {
    // Handle image click for lightbox mode
    const handleImageClick = (src: string, alt: string) => {
      if (lightbox) {
        // Implement lightbox functionality here
        // This could be a modal or a third-party lightbox library
        console.log('Lightbox opened for:', src, alt);
      }
    };
    
    return (
      <StyledCarouselRoot
        ref={ref}
        itemCount={images.length}
        className={`strive-image-carousel ${className}`}
        {...carouselProps}
      >
        {showCounter && <Counter total={images.length} />}
        
        <StyledCarouselTrack>
          {images.map((image, index) => (
            <StyledCarouselSlide key={index} index={index}>
              {image.href ? (
                <a href={image.href} target="_blank" rel="noopener noreferrer">
                  <StyledImage
                    src={image.src}
                    alt={image.alt}
                    loading={lazyLoad ? 'lazy' : undefined}
                    onClick={() => handleImageClick(image.src, image.alt)}
                  />
                </a>
              ) : (
                <StyledImage
                  src={image.src}
                  alt={image.alt}
                  loading={lazyLoad ? 'lazy' : undefined}
                  onClick={() => handleImageClick(image.src, image.alt)}
                />
              )}
              
              {showCaptions && image.caption && (
                <StyledCaption>{image.caption}</StyledCaption>
              )}
            </StyledCarouselSlide>
          ))}
        </StyledCarouselTrack>
        
        {showArrows && (
          <StyledNav>
            <StyledButton as={CarouselHeadless.PrevButton} aria-label="Previous slide">
              ←
            </StyledButton>
            <StyledButton as={CarouselHeadless.NextButton} aria-label="Next slide">
              →
            </StyledButton>
          </StyledNav>
        )}
        
        {showDots && (
          <StyledDots>
            {Array.from({ length: Math.ceil(images.length / (carouselProps.slidesToScroll || 1)) }).map((_, index) => (
              <StyledDot key={index} index={index} />
            ))}
          </StyledDots>
        )}
      </StyledCarouselRoot>
    );
  }
);

ImageCarousel.displayName = 'ImageCarousel';

export default ImageCarousel;
