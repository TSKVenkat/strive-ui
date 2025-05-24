import { useState, useCallback } from 'react';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'border' | 'grow' | 'dots' | 'ripple' | 'dual-ring';

export interface SpinnerOptions {
  /**
   * Size of the spinner
   */
  size?: SpinnerSize;
  /**
   * Variant of the spinner
   */
  variant?: SpinnerVariant;
  /**
   * Whether the spinner is visible
   */
  visible?: boolean;
  /**
   * Label for the spinner for accessibility
   */
  label?: string;
  /**
   * Speed of the spinner animation in seconds
   */
  speed?: number;
  /**
   * Whether the spinner should be centered
   */
  centered?: boolean;
  /**
   * Whether the spinner should take up the full parent width
   */
  fullWidth?: boolean;
  /**
   * Whether the spinner should be inline with text
   */
  inline?: boolean;
}

export interface UseSpinnerReturn {
  /**
   * Size of the spinner
   */
  size: SpinnerSize;
  /**
   * Variant of the spinner
   */
  variant: SpinnerVariant;
  /**
   * Whether the spinner is visible
   */
  visible: boolean;
  /**
   * Set the visibility of the spinner
   */
  setVisible: (visible: boolean) => void;
  /**
   * Label for the spinner for accessibility
   */
  label: string;
  /**
   * Speed of the spinner animation in seconds
   */
  speed: number;
  /**
   * Whether the spinner should be centered
   */
  centered: boolean;
  /**
   * Whether the spinner should take up the full parent width
   */
  fullWidth: boolean;
  /**
   * Whether the spinner should be inline with text
   */
  inline: boolean;
  /**
   * Show the spinner
   */
  show: () => void;
  /**
   * Hide the spinner
   */
  hide: () => void;
  /**
   * Toggle the visibility of the spinner
   */
  toggle: () => void;
  /**
   * Get props for the spinner container
   */
  getContainerProps: () => {
    role: string;
    'aria-busy': boolean;
    'aria-label': string;
  };
  /**
   * Get props for the spinner element
   */
  getSpinnerProps: () => {
    style: {
      animationDuration?: string;
    };
  };
}

/**
 * Hook for creating a spinner
 */
export function useSpinner(options: SpinnerOptions = {}): UseSpinnerReturn {
  // Destructure options with defaults
  const {
    size = 'medium',
    variant = 'border',
    visible: initialVisible = true,
    label = 'Loading...',
    speed = 0.75,
    centered = false,
    fullWidth = false,
    inline = false,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(initialVisible);

  // Show the spinner
  const show = useCallback(() => {
    setVisible(true);
  }, []);

  // Hide the spinner
  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Toggle the visibility of the spinner
  const toggle = useCallback(() => {
    setVisible(prevVisible => !prevVisible);
  }, []);

  // Get props for the spinner container
  const getContainerProps = useCallback(() => {
    return {
      role: 'status',
      'aria-busy': visible,
      'aria-label': label,
    };
  }, [visible, label]);

  // Get props for the spinner element
  const getSpinnerProps = useCallback(() => {
    return {
      style: {
        animationDuration: `${speed}s`,
      },
    };
  }, [speed]);

  return {
    size,
    variant,
    visible,
    setVisible,
    label,
    speed,
    centered,
    fullWidth,
    inline,
    show,
    hide,
    toggle,
    getContainerProps,
    getSpinnerProps,
  };
}

export default useSpinner;
