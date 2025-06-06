import React, { createContext, useContext, forwardRef } from 'react';
import useCarousel, { UseCarouselOptions, UseCarouselReturn } from './useCarousel';

// Create context for the carousel
export const CarouselContext = createContext<UseCarouselReturn | null>(null);

// Hook to use carousel context
export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a CarouselHeadless.Root component');
  }
  return context;
};

// Types for the compound components
export interface CarouselRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'draggable'>, UseCarouselOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CarouselTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the track node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The index of the slide
   */
  index: number;
  
  /**
   * The component used for the slide node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CarouselNextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the button node
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface CarouselPrevButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the button node
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the dots container node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CarouselDotProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The index of the dot
   */
  index: number;
  
  /**
   * The component used for the dot node
   * @default 'button'
   */
  as?: React.ElementType;
}

// Root component
const Root = forwardRef<HTMLDivElement, CarouselRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract carousel options from props
    const {
      itemCount,
      initialIndex,
      infinite,
      autoplay,
      autoplayInterval,
      pauseOnHover,
      pauseOnFocus,
      slidesToShow,
      slidesToScroll,
      centerMode,
      draggable,
      swipeThreshold,
      onChange,
      keyboardNavigation,
      ...restProps
    } = props;
    
    // Use the carousel hook
    const carouselState = useCarousel({
      itemCount,
      initialIndex,
      infinite,
      autoplay,
      autoplayInterval,
      pauseOnHover,
      pauseOnFocus,
      slidesToShow,
      slidesToScroll,
      centerMode,
      draggable: Boolean(draggable),
      swipeThreshold,
      onChange,
      keyboardNavigation,
    });
    
    // Get container props from the hook
    const containerProps = carouselState.getContainerProps();
    
    return (
      <CarouselContext.Provider value={carouselState}>
        <Component
          ref={ref}
          className={`strive-carousel ${className}`}
          {...containerProps}
          {...restProps}
        >
          {children}
        </Component>
      </CarouselContext.Provider>
    );
  }
);

Root.displayName = 'CarouselHeadless.Root';

// Track component
const Track = forwardRef<HTMLDivElement, CarouselTrackProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    const trackProps = carousel.getTrackProps();
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-track ${className}`}
        {...trackProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Track.displayName = 'CarouselHeadless.Track';

// Slide component
const Slide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ as: Component = 'div', index, children, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    const slideProps = carousel.getSlideProps(index);
    const isVisible = carousel.getVisibleSlides().includes(index);
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-slide ${isVisible ? 'active' : ''} ${className}`}
        {...slideProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Slide.displayName = 'CarouselHeadless.Slide';

// Next button component
const NextButton = forwardRef<HTMLButtonElement, CarouselNextButtonProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    const nextButtonProps = carousel.getNextButtonProps();
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-next-button ${className}`}
        type="button"
        {...nextButtonProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

NextButton.displayName = 'CarouselHeadless.NextButton';

// Previous button component
const PrevButton = forwardRef<HTMLButtonElement, CarouselPrevButtonProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    const prevButtonProps = carousel.getPrevButtonProps();
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-prev-button ${className}`}
        type="button"
        {...prevButtonProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

PrevButton.displayName = 'CarouselHeadless.PrevButton';

// Dots container component
const Dots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-dots ${className}`}
        role="tablist"
        aria-label="Carousel navigation"
        {...props}
      >
        {children || (
          <>
            {Array.from({ length: carousel.pageCount }).map((_, index) => (
              <Dot key={index} index={index} />
            ))}
          </>
        )}
      </Component>
    );
  }
);

Dots.displayName = 'CarouselHeadless.Dots';

// Dot component
const Dot = forwardRef<HTMLButtonElement, CarouselDotProps>(
  ({ as: Component = 'button', index, className = '', ...props }, ref) => {
    const carousel = useCarouselContext();
    const dotProps = carousel.getDotProps(index);
    const isActive = Math.floor(carousel.activeIndex / carousel.slidesToScroll) === index;
    
    return (
      <Component
        ref={ref}
        className={`strive-carousel-dot ${isActive ? 'active' : ''} ${className}`}
        type="button"
        {...dotProps}
        {...props}
      />
    );
  }
);

Dot.displayName = 'CarouselHeadless.Dot';

// Assemble the compound component
export const CarouselHeadless = {
  Root,
  Track,
  Slide,
  NextButton,
  PrevButton,
  Dots,
  Dot,
  useCarousel,
};

export default CarouselHeadless;
