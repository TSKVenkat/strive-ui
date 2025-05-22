/**
 * Animation hooks for StriveUI components
 * These hooks provide animation capabilities that can be used across components
 */
import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect when an element is visible in the viewport
 * @param options IntersectionObserver options
 * @returns [ref, isVisible] - Ref to attach to the element and whether it's visible
 */
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '0px',
      ...options,
    });

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

/**
 * Hook to create scroll-triggered animations
 * @param options Options for the scroll animation
 * @returns [ref, controls] - Ref to attach to the element and animation controls
 */
export const useScrollAnimation = (options = {}) => {
  const [ref, isInView] = useInView(options);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Animation state
  const [animationState, setAnimationState] = useState('hidden');
  
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setAnimationState('visible');
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);
  
  return [ref, animationState] as const;
};

/**
 * Hook for parallax scrolling effects
 * @param speed The speed of the parallax effect (1 = normal, 0.5 = half speed, 2 = double speed)
 * @returns [ref, style] - Ref to attach to the element and the style object
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    
    const { top } = ref.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate parallax offset
    const newOffset = (top - windowHeight) * speed;
    setOffset(newOffset);
  }, [speed]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  const style = {
    transform: `translateY(${offset}px)`,
  };
  
  return [ref, style] as const;
};

/**
 * Hook for scroll-based progress tracking
 * @returns [ref, progress] - Ref to attach to the element and progress (0-1)
 */
export const useScrollProgress = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  
  const calculateProgress = useCallback(() => {
    if (!ref.current) return;
    
    const { top, height } = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the element is in view
    const visibleTop = Math.max(0, top < 0 ? -top : 0);
    const visibleHeight = Math.min(windowHeight, top + height) - Math.max(0, top);
    const visibleRatio = visibleHeight / height;
    
    // Calculate progress based on position
    let newProgress = 0;
    
    if (top <= 0) {
      // Element is at or above the top of the viewport
      newProgress = Math.min(1, visibleRatio + (Math.abs(top) / height));
    } else {
      // Element is below the top of the viewport
      newProgress = Math.min(1, (windowHeight - top) / (windowHeight + height));
    }
    
    setProgress(Math.max(0, Math.min(1, newProgress)));
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', calculateProgress);
    window.addEventListener('resize', calculateProgress);
    calculateProgress();
    
    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);
  
  return [ref, progress] as const;
};

/**
 * Hook for creating staggered animations for lists
 * @param count Number of items
 * @param staggerDelay Delay between each item's animation
 * @returns Array of delays for each item
 */
export const useStaggered = (count: number, staggerDelay = 0.05) => {
  return Array.from({ length: count }, (_, i) => i * staggerDelay);
};

/**
 * Hook for smooth counter animation
 * @param targetValue The target value to count to
 * @param duration Duration of the animation in ms
 * @returns The current count value
 */
export const useCounter = (targetValue: number, duration = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * targetValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);
  
  return count;
};

/**
 * Hook for scroll-based sticky elements
 * @param options Options for the sticky behavior
 * @returns [ref, isSticky] - Ref to attach to the element and whether it's sticky
 */
export const useSticky = (options = { offset: 0 }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: `-${options.offset}px 0px 0px 0px` }
    );
    
    observer.observe(cachedRef);
    
    return () => {
      observer.unobserve(cachedRef);
    };
  }, [options.offset]);
  
  return [ref, isSticky] as const;
};

/**
 * Hook for scroll-linked animations
 * @param options Options for the animation
 * @returns [ref, animationProps] - Ref to attach to the element and animation props
 */
export const useScrollLinkedAnimation = (options = { startOffset: 0, endOffset: 1 }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const handleScroll = () => {
      if (!ref.current) return;
      
      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress
      const scrollStart = windowHeight * options.startOffset;
      const scrollEnd = windowHeight * options.endOffset;
      
      const scrollRange = scrollEnd - scrollStart;
      const currentScroll = top - scrollStart;
      
      const newProgress = 1 - Math.max(0, Math.min(1, currentScroll / scrollRange));
      setProgress(newProgress);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [options.startOffset, options.endOffset]);
  
  // Animation properties based on scroll progress
  const animationProps = {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 50}px)`,
  };
  
  return [ref, animationProps] as const;
};
