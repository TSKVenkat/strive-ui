import { useState, useCallback } from 'react';

export type SkeletonVariant = 'text' | 'rectangular' | 'circular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'shimmer' | 'none';

export interface SkeletonOptions {
  /**
   * Variant of the skeleton
   */
  variant?: SkeletonVariant;
  /**
   * Animation of the skeleton
   */
  animation?: SkeletonAnimation;
  /**
   * Width of the skeleton
   */
  width?: string | number;
  /**
   * Height of the skeleton
   */
  height?: string | number;
  /**
   * Whether the skeleton is visible
   */
  visible?: boolean;
  /**
   * Border radius of the skeleton
   */
  borderRadius?: string | number;
  /**
   * Number of lines for text variant
   */
  lines?: number;
  /**
   * Whether the skeleton should take up the full parent width
   */
  fullWidth?: boolean;
}

export interface UseSkeletonReturn {
  /**
   * Variant of the skeleton
   */
  variant: SkeletonVariant;
  /**
   * Animation of the skeleton
   */
  animation: SkeletonAnimation;
  /**
   * Width of the skeleton
   */
  width: string | number | undefined;
  /**
   * Height of the skeleton
   */
  height: string | number | undefined;
  /**
   * Whether the skeleton is visible
   */
  visible: boolean;
  /**
   * Set the visibility of the skeleton
   */
  setVisible: (visible: boolean) => void;
  /**
   * Border radius of the skeleton
   */
  borderRadius: string | number | undefined;
  /**
   * Number of lines for text variant
   */
  lines: number;
  /**
   * Whether the skeleton should take up the full parent width
   */
  fullWidth: boolean;
  /**
   * Show the skeleton
   */
  show: () => void;
  /**
   * Hide the skeleton
   */
  hide: () => void;
  /**
   * Toggle the visibility of the skeleton
   */
  toggle: () => void;
  /**
   * Get props for the skeleton container
   */
  getContainerProps: () => {
    role: string;
    'aria-busy': boolean;
    'aria-hidden': boolean;
  };
  /**
   * Get props for the skeleton element
   */
  getSkeletonProps: () => {
    style: {
      width?: string | number;
      height?: string | number;
      borderRadius?: string | number;
    };
  };
}

/**
 * Hook for creating a skeleton loader
 */
export function useSkeleton(options: SkeletonOptions = {}): UseSkeletonReturn {
  // Destructure options with defaults
  const {
    variant = 'text',
    animation = 'pulse',
    width,
    height,
    visible: initialVisible = true,
    borderRadius,
    lines = 1,
    fullWidth = false,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(initialVisible);

  // Show the skeleton
  const show = useCallback(() => {
    setVisible(true);
  }, []);

  // Hide the skeleton
  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Toggle the visibility of the skeleton
  const toggle = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
  }, []);

  // Get props for the skeleton container
  const getContainerProps = useCallback(() => {
    return {
      role: 'status',
      'aria-busy': visible,
      'aria-hidden': !visible,
    };
  }, [visible]);

  // Get props for the skeleton element
  const getSkeletonProps = useCallback(() => {
    // Get default width and height based on variant
    const getDefaultDimensions = () => {
      switch (variant) {
        case 'text':
          return {
            width: fullWidth ? '100%' : '100px',
            height: '16px',
          };
        case 'rectangular':
          return {
            width: fullWidth ? '100%' : '100px',
            height: '100px',
          };
        case 'circular':
          return {
            width: '40px',
            height: '40px',
          };
        case 'rounded':
          return {
            width: fullWidth ? '100%' : '100px',
            height: '40px',
          };
        default:
          return {
            width: fullWidth ? '100%' : '100px',
            height: '16px',
          };
      }
    };

    // Get default border radius based on variant
    const getDefaultBorderRadius = () => {
      switch (variant) {
        case 'text':
          return '4px';
        case 'rectangular':
          return '0';
        case 'circular':
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
      },
    };
  }, [variant, width, height, borderRadius, fullWidth]);

  return {
    variant,
    animation,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    lines,
    fullWidth,
    show,
    hide,
    toggle,
    getContainerProps,
    getSkeletonProps,
  };
}

export default useSkeleton;
