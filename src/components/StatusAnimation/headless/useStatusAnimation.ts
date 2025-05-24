import { useState, useCallback, useRef, useEffect } from 'react';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface StatusAnimationOptions {
  /**
   * Type of status animation
   */
  type?: StatusType;
  /**
   * Whether the animation is active
   */
  active?: boolean;
  /**
   * Duration of the animation in milliseconds
   */
  duration?: number;
  /**
   * Size of the animation in pixels
   */
  size?: number;
  /**
   * Stroke width of the animation
   */
  strokeWidth?: number;
  /**
   * Color of the animation
   */
  color?: string;
  /**
   * Background color of the animation
   */
  backgroundColor?: string;
  /**
   * Whether to show the animation in a circle
   */
  circle?: boolean;
  /**
   * Whether to play the animation only once
   */
  once?: boolean;
  /**
   * Callback when the animation completes
   */
  onComplete?: () => void;
  /**
   * Whether to auto-hide the animation after completion
   */
  autoHide?: boolean;
  /**
   * Delay before auto-hiding in milliseconds
   */
  autoHideDelay?: number;
}

export interface UseStatusAnimationReturn {
  /**
   * Type of status animation
   */
  type: StatusType;
  /**
   * Whether the animation is active
   */
  active: boolean;
  /**
   * Set whether the animation is active
   */
  setActive: (active: boolean) => void;
  /**
   * Duration of the animation in milliseconds
   */
  duration: number;
  /**
   * Size of the animation in pixels
   */
  size: number;
  /**
   * Stroke width of the animation
   */
  strokeWidth: number;
  /**
   * Color of the animation
   */
  color: string;
  /**
   * Background color of the animation
   */
  backgroundColor: string;
  /**
   * Whether to show the animation in a circle
   */
  circle: boolean;
  /**
   * Whether to play the animation only once
   */
  once: boolean;
  /**
   * Whether the animation is visible
   */
  visible: boolean;
  /**
   * Set whether the animation is visible
   */
  setVisible: (visible: boolean) => void;
  /**
   * Whether the animation is completed
   */
  completed: boolean;
  /**
   * Set whether the animation is completed
   */
  setCompleted: (completed: boolean) => void;
  /**
   * Start the animation
   */
  start: () => void;
  /**
   * Stop the animation
   */
  stop: () => void;
  /**
   * Reset the animation
   */
  reset: () => void;
  /**
   * Get props for the animation container
   */
  getContainerProps: () => {
    role: string;
    'aria-live': string;
    'aria-atomic': boolean;
  };
  /**
   * Get props for the SVG element
   */
  getSvgProps: () => {
    viewBox: string;
    width: number;
    height: number;
  };
  /**
   * Get the path data for the animation
   */
  getPathData: () => string;
  /**
   * Get the animation style
   */
  getAnimationStyle: () => React.CSSProperties;
}

/**
 * Hook for creating a status animation
 */
export function useStatusAnimation(options: StatusAnimationOptions = {}): UseStatusAnimationReturn {
  // Destructure options with defaults
  const {
    type = 'success',
    active: initialActive = false,
    duration = 1000,
    size = 48,
    strokeWidth = 3,
    color: initialColor,
    backgroundColor = 'transparent',
    circle = true,
    once = false,
    onComplete,
    autoHide = false,
    autoHideDelay = 2000,
  } = options;

  // Get default color based on type
  const getDefaultColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'loading':
        return '#9e9e9e';
      default:
        return '#4caf50';
    }
  };

  const color = initialColor || getDefaultColor();

  // State for activity and visibility
  const [active, setActive] = useState<boolean>(initialActive);
  const [visible, setVisible] = useState<boolean>(initialActive);
  const [completed, setCompleted] = useState<boolean>(false);
  
  // Refs for animation
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start animation
  const start = useCallback(() => {
    setActive(true);
    setVisible(true);
    setCompleted(false);
    
    // Set timer to mark animation as completed
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    
    animationTimerRef.current = setTimeout(() => {
      setCompleted(true);
      
      if (onComplete) {
        onComplete();
      }
      
      // Auto-hide after completion if enabled
      if (autoHide) {
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
        }
        
        autoHideTimerRef.current = setTimeout(() => {
          setVisible(false);
          
          // Stop animation after hiding if once is true
          if (once) {
            setActive(false);
          }
        }, autoHideDelay);
      }
    }, duration);
  }, [duration, onComplete, autoHide, autoHideDelay, once]);
  
  // Stop animation
  const stop = useCallback(() => {
    setActive(false);
    
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);
  
  // Reset animation
  const reset = useCallback(() => {
    stop();
    setVisible(false);
    setCompleted(false);
  }, [stop]);
  
  // Get props for the animation container
  const getContainerProps = useCallback(() => {
    return {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': true,
    };
  }, []);
  
  // Get props for the SVG element
  const getSvgProps = useCallback(() => {
    return {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
    };
  }, [size]);
  
  // Get the path data for the animation
  const getPathData = useCallback(() => {
    switch (type) {
      case 'success':
        return 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z';
      case 'error':
        return 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';
      case 'warning':
        return 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z';
      case 'info':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
      case 'loading':
        return 'M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z';
      default:
        return 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z';
    }
  }, [type]);
  
  // Get the animation style
  const getAnimationStyle = useCallback(() => {
    const baseStyle: React.CSSProperties = {
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
    };
    
    if (type === 'loading') {
      return {
        ...baseStyle,
        animation: active ? 'spin 1.5s linear infinite' : 'none',
      };
    }
    
    if (active && !completed) {
      return {
        ...baseStyle,
        strokeDasharray: 100,
        strokeDashoffset: 100,
        animation: `dash ${duration / 1000}s ease-in-out forwards`,
      };
    }
    
    return baseStyle;
  }, [visible, type, active, completed, duration]);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, []);
  
  // Start animation if initially active
  useEffect(() => {
    if (initialActive) {
      start();
    }
  }, [initialActive, start]);
  
  return {
    type,
    active,
    setActive,
    duration,
    size,
    strokeWidth,
    color,
    backgroundColor,
    circle,
    once,
    visible,
    setVisible,
    completed,
    setCompleted,
    start,
    stop,
    reset,
    getContainerProps,
    getSvgProps,
    getPathData,
    getAnimationStyle,
  };
}

export default useStatusAnimation;
