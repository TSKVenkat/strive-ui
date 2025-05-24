import { useState, useCallback } from 'react';

export type PulseSize = 'small' | 'medium' | 'large';
export type PulseShape = 'circle' | 'rectangle' | 'rounded';

export interface PulseOptions {
  /**
   * Size of the pulse
   */
  size?: PulseSize;
  /**
   * Shape of the pulse
   */
  shape?: PulseShape;
  /**
   * Width of the pulse
   */
  width?: string | number;
  /**
   * Height of the pulse
   */
  height?: string | number;
  /**
   * Whether the pulse is visible
   */
  visible?: boolean;
  /**
   * Border radius of the pulse
   */
  borderRadius?: string | number;
  /**
   * Duration of the pulse animation in seconds
   */
  duration?: number;
  /**
   * Color of the pulse
   */
  color?: string;
  /**
   * Whether the pulse should take up the full parent width
   */
  fullWidth?: boolean;
  /**
   * Whether the pulse should be continuous
   */
  continuous?: boolean;
  /**
   * Number of pulses to show
   */
  count?: number;
  /**
   * Delay between pulses in seconds
   */
  delay?: number;
  /**
   * Scale factor for the pulse
   */
  scale?: number;
  /**
   * Opacity of the pulse
   */
  opacity?: number;
  /**
   * Whether the pulse should be centered
   */
  centered?: boolean;
}

export interface UsePulseReturn {
  /**
   * Size of the pulse
   */
  size: PulseSize;
  /**
   * Shape of the pulse
   */
  shape: PulseShape;
  /**
   * Width of the pulse
   */
  width: string | number;
  /**
   * Height of the pulse
   */
  height: string | number;
  /**
   * Whether the pulse is visible
   */
  visible: boolean;
  /**
   * Set the visibility of the pulse
   */
  setVisible: (visible: boolean) => void;
  /**
   * Border radius of the pulse
   */
  borderRadius: string | number;
  /**
   * Duration of the pulse animation in seconds
   */
  duration: number;
  /**
   * Color of the pulse
   */
  color: string;
  /**
   * Whether the pulse should take up the full parent width
   */
  fullWidth: boolean;
  /**
   * Whether the pulse should be continuous
   */
  continuous: boolean;
  /**
   * Number of pulses to show
   */
  count: number;
  /**
   * Delay between pulses in seconds
   */
  delay: number;
  /**
   * Scale factor for the pulse
   */
  scale: number;
  /**
   * Opacity of the pulse
   */
  opacity: number;
  /**
   * Whether the pulse should be centered
   */
  centered: boolean;
  /**
   * Show the pulse
   */
  show: () => void;
  /**
   * Hide the pulse
   */
  hide: () => void;
  /**
   * Toggle the visibility of the pulse
   */
  toggle: () => void;
  /**
   * Get props for the pulse container
   */
  getContainerProps: () => {
    role: string;
    'aria-hidden': boolean;
  };
  /**
   * Get props for the pulse element
   */
  getPulseProps: () => {
    style: {
      width?: string | number;
      height?: string | number;
      borderRadius?: string | number;
      backgroundColor?: string;
    };
  };
  /**
   * Get props for the pulse effect
   */
  getEffectProps: (index: number) => {
    style: {
      animationDuration: string;
      animationDelay: string;
    };
  };
}

/**
 * Hook for creating a pulse effect
 */
export function usePulse(options: PulseOptions = {}): UsePulseReturn {
  // Destructure options with defaults
  const {
    size = 'medium',
    shape = 'circle',
    width,
    height,
    visible: initialVisible = true,
    borderRadius,
    duration = 1.5,
    color = 'rgba(0, 123, 255, 0.6)',
    fullWidth = false,
    continuous = true,
    count = 3,
    delay = 0.3,
    scale = 1.5,
    opacity = 0.7,
    centered = false,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(initialVisible);

  // Show the pulse
  const show = useCallback(() => {
    setVisible(true);
  }, []);

  // Hide the pulse
  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Toggle the visibility of the pulse
  const toggle = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
  }, []);

  // Get props for the pulse container
  const getContainerProps = useCallback(() => {
    return {
      role: 'presentation',
      'aria-hidden': !visible,
    };
  }, [visible]);

  // Get props for the pulse element
  const getPulseProps = useCallback(() => {
    // Get default dimensions based on size
    const getDefaultDimensions = () => {
      switch (size) {
        case 'small':
          return {
            width: '24px',
            height: '24px',
          };
        case 'medium':
          return {
            width: '48px',
            height: '48px',
          };
        case 'large':
          return {
            width: '72px',
            height: '72px',
          };
        default:
          return {
            width: '48px',
            height: '48px',
          };
      }
    };

    // Get default border radius based on shape
    const getDefaultBorderRadius = () => {
      switch (shape) {
        case 'circle':
          return '50%';
        case 'rectangle':
          return '0';
        case 'rounded':
          return '8px';
        default:
          return '50%';
      }
    };

    const defaultDimensions = getDefaultDimensions();
    const defaultBorderRadius = getDefaultBorderRadius();

    return {
      style: {
        width: width ?? (fullWidth ? '100%' : defaultDimensions.width),
        height: height ?? defaultDimensions.height,
        borderRadius: borderRadius ?? defaultBorderRadius,
        backgroundColor: color,
        position: 'relative' as const,
      },
    };
  }, [size, shape, width, height, borderRadius, color, fullWidth]);

  // Get props for the pulse effect
  const getEffectProps = useCallback((index: number) => {
    return {
      style: {
        animationDuration: `${duration}s`,
        animationDelay: `${index * delay}s`,
      },
    };
  }, [duration, delay]);

  return {
    size,
    shape,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    duration,
    color,
    fullWidth,
    continuous,
    count,
    delay,
    scale,
    opacity,
    centered,
    show,
    hide,
    toggle,
    getContainerProps,
    getPulseProps,
    getEffectProps,
  };
}

export default usePulse;
