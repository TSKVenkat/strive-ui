import { useState, useCallback } from 'react';

export type ShimmerShape = 'rectangle' | 'circle' | 'rounded' | 'text';
export type ShimmerDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

export interface ShimmerOptions {
  /**
   * Shape of the shimmer
   */
  shape?: ShimmerShape;
  /**
   * Width of the shimmer
   */
  width?: string | number;
  /**
   * Height of the shimmer
   */
  height?: string | number;
  /**
   * Whether the shimmer is visible
   */
  visible?: boolean;
  /**
   * Border radius of the shimmer
   */
  borderRadius?: string | number;
  /**
   * Duration of the shimmer animation in seconds
   */
  duration?: number;
  /**
   * Direction of the shimmer animation
   */
  direction?: ShimmerDirection;
  /**
   * Base color of the shimmer
   */
  baseColor?: string;
  /**
   * Highlight color of the shimmer
   */
  highlightColor?: string;
  /**
   * Whether the shimmer should take up the full parent width
   */
  fullWidth?: boolean;
}

export interface UseShimmerReturn {
  /**
   * Shape of the shimmer
   */
  shape: ShimmerShape;
  /**
   * Width of the shimmer
   */
  width: string | number;
  /**
   * Height of the shimmer
   */
  height: string | number;
  /**
   * Whether the shimmer is visible
   */
  visible: boolean;
  /**
   * Set the visibility of the shimmer
   */
  setVisible: (visible: boolean) => void;
  /**
   * Border radius of the shimmer
   */
  borderRadius: string | number;
  /**
   * Duration of the shimmer animation in seconds
   */
  duration: number;
  /**
   * Direction of the shimmer animation
   */
  direction: ShimmerDirection;
  /**
   * Base color of the shimmer
   */
  baseColor: string;
  /**
   * Highlight color of the shimmer
   */
  highlightColor: string;
  /**
   * Whether the shimmer should take up the full parent width
   */
  fullWidth: boolean;
  /**
   * Show the shimmer
   */
  show: () => void;
  /**
   * Hide the shimmer
   */
  hide: () => void;
  /**
   * Toggle the visibility of the shimmer
   */
  toggle: () => void;
  /**
   * Get props for the shimmer container
   */
  getContainerProps: () => {
    role: string;
    'aria-busy': boolean;
    'aria-hidden': boolean;
  };
  /**
   * Get props for the shimmer element
   */
  getShimmerProps: () => {
    style: {
      width?: string | number;
      height?: string | number;
      borderRadius?: string | number;
      backgroundColor?: string;
    };
  };
  /**
   * Get props for the shimmer effect
   */
  getEffectProps: () => {
    style: {
      animationDuration: string;
    };
  };
}

/**
 * Hook for creating a shimmer effect
 */
export function useShimmer(options: ShimmerOptions = {}): UseShimmerReturn {
  // Destructure options with defaults
  const {
    shape = 'rectangle',
    width,
    height,
    visible: initialVisible = true,
    borderRadius,
    duration = 1.5,
    direction = 'left-to-right',
    baseColor = '#e0e0e0',
    highlightColor = '#f5f5f5',
    fullWidth = false,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(initialVisible);

  // Show the shimmer
  const show = useCallback(() => {
    setVisible(true);
  }, []);

  // Hide the shimmer
  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Toggle the visibility of the shimmer
  const toggle = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
  }, []);

  // Get props for the shimmer container
  const getContainerProps = useCallback(() => {
    return {
      role: 'status',
      'aria-busy': visible,
      'aria-hidden': !visible,
    };
  }, [visible]);

  // Get props for the shimmer element
  const getShimmerProps = useCallback(() => {
    // Get default dimensions based on shape
    const getDefaultDimensions = () => {
      switch (shape) {
        case 'text':
          return {
            width: fullWidth ? '100%' : '200px',
            height: '16px',
          };
        case 'rectangle':
          return {
            width: fullWidth ? '100%' : '200px',
            height: '100px',
          };
        case 'circle':
          return {
            width: '50px',
            height: '50px',
          };
        case 'rounded':
          return {
            width: fullWidth ? '100%' : '200px',
            height: '40px',
          };
        default:
          return {
            width: fullWidth ? '100%' : '200px',
            height: '16px',
          };
      }
    };

    // Get default border radius based on shape
    const getDefaultBorderRadius = () => {
      switch (shape) {
        case 'text':
          return '4px';
        case 'rectangle':
          return '0';
        case 'circle':
          return '50%';
        case 'rounded':
          return '8px';
        default:
          return '4px';
      }
    };

    const defaultDimensions = getDefaultDimensions();
    const defaultBorderRadius = getDefaultBorderRadius();

    return {
      style: {
        width: width ?? defaultDimensions.width,
        height: height ?? defaultDimensions.height,
        borderRadius: borderRadius ?? defaultBorderRadius,
        backgroundColor: baseColor,
        position: 'relative' as const,
        overflow: 'hidden' as const,
      },
    };
  }, [shape, width, height, borderRadius, baseColor, fullWidth]);

  // Get props for the shimmer effect
  const getEffectProps = useCallback(() => {
    return {
      style: {
        animationDuration: `${duration}s`,
      },
    };
  }, [duration]);

  return {
    shape,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    duration,
    direction,
    baseColor,
    highlightColor,
    fullWidth,
    show,
    hide,
    toggle,
    getContainerProps,
    getShimmerProps,
    getEffectProps,
  };
}

export default useShimmer;
