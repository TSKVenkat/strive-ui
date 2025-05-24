import { useState, useCallback, useEffect, useRef } from 'react';

export type ProgressSize = 'small' | 'medium' | 'large';
export type ProgressVariant = 'determinate' | 'indeterminate';

export interface ProgressOptions {
  /**
   * Current value of the progress
   */
  value?: number;
  /**
   * Minimum value of the progress
   */
  min?: number;
  /**
   * Maximum value of the progress
   */
  max?: number;
  /**
   * Size of the progress bar
   */
  size?: ProgressSize;
  /**
   * Variant of the progress bar
   */
  variant?: ProgressVariant;
  /**
   * Whether the progress bar is animated
   */
  animated?: boolean;
  /**
   * Whether the progress bar shows a label
   */
  showLabel?: boolean;
  /**
   * Format of the label
   */
  labelFormat?: (value: number, min: number, max: number) => string;
  /**
   * Whether the progress bar is striped
   */
  striped?: boolean;
  /**
   * Callback when the progress reaches 100%
   */
  onComplete?: () => void;
  /**
   * Whether the progress bar has a buffer indicator
   */
  hasBuffer?: boolean;
  /**
   * Buffer value of the progress
   */
  bufferValue?: number;
}

export interface UseProgressReturn {
  /**
   * Current value of the progress
   */
  value: number;
  /**
   * Set the value of the progress
   */
  setValue: (value: number) => void;
  /**
   * Minimum value of the progress
   */
  min: number;
  /**
   * Maximum value of the progress
   */
  max: number;
  /**
   * Size of the progress bar
   */
  size: ProgressSize;
  /**
   * Variant of the progress bar
   */
  variant: ProgressVariant;
  /**
   * Whether the progress bar is animated
   */
  animated: boolean;
  /**
   * Whether the progress bar shows a label
   */
  showLabel: boolean;
  /**
   * Whether the progress bar is striped
   */
  striped: boolean;
  /**
   * Whether the progress bar has a buffer indicator
   */
  hasBuffer: boolean;
  /**
   * Buffer value of the progress
   */
  bufferValue: number;
  /**
   * Set the buffer value of the progress
   */
  setBufferValue: (value: number) => void;
  /**
   * Percentage of the progress
   */
  percentage: number;
  /**
   * Buffer percentage of the progress
   */
  bufferPercentage: number;
  /**
   * Whether the progress is complete
   */
  isComplete: boolean;
  /**
   * Get the formatted label
   */
  getFormattedLabel: () => string;
  /**
   * Get props for the progress container
   */
  getContainerProps: () => {
    role: string;
    'aria-valuemin': number;
    'aria-valuemax': number;
    'aria-valuenow': number;
    'aria-valuetext': string;
  };
  /**
   * Get props for the progress bar
   */
  getProgressBarProps: () => {
    style: {
      width: string;
    };
  };
  /**
   * Get props for the buffer bar
   */
  getBufferBarProps: () => {
    style: {
      width: string;
    };
  };
  /**
   * Get props for the label
   */
  getLabelProps: () => {
    'aria-hidden': boolean;
  };
}

/**
 * Hook for creating a progress bar
 */
export function useProgress(options: ProgressOptions = {}): UseProgressReturn {
  // Destructure options with defaults
  const {
    value: initialValue = 0,
    min = 0,
    max = 100,
    size = 'medium',
    variant = 'determinate',
    animated = true,
    showLabel = false,
    labelFormat,
    striped = false,
    onComplete,
    hasBuffer = false,
    bufferValue: initialBufferValue = 0,
  } = options;

  // State for value
  const [value, setValue] = useState<number>(
    Math.max(min, Math.min(max, initialValue))
  );
  
  // State for buffer value
  const [bufferValue, setBufferValue] = useState<number>(
    Math.max(min, Math.min(max, initialBufferValue))
  );
  
  // Ref for tracking completion
  const completedRef = useRef<boolean>(false);

  // Calculate percentage
  const percentage = max - min === 0 ? 0 : ((value - min) / (max - min)) * 100;
  
  // Calculate buffer percentage
  const bufferPercentage = max - min === 0 ? 0 : ((bufferValue - min) / (max - min)) * 100;
  
  // Check if progress is complete
  const isComplete = value >= max;

  // Handle value change
  const handleValueChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setValue(clampedValue);
  }, [min, max]);

  // Handle buffer value change
  const handleBufferValueChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setBufferValue(clampedValue);
  }, [min, max]);

  // Format label
  const getFormattedLabel = useCallback(() => {
    if (labelFormat) {
      return labelFormat(value, min, max);
    }
    
    if (variant === 'determinate') {
      return `${Math.round(percentage)}%`;
    }
    
    return '';
  }, [labelFormat, value, min, max, variant, percentage]);

  // Call onComplete when progress reaches 100%
  useEffect(() => {
    if (isComplete && !completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete();
    } else if (!isComplete) {
      completedRef.current = false;
    }
  }, [isComplete, onComplete]);

  // Get props for the progress container
  const getContainerProps = useCallback(() => {
    return {
      role: 'progressbar',
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': variant === 'determinate' ? value : undefined,
      'aria-valuetext': variant === 'determinate' ? getFormattedLabel() : undefined,
    };
  }, [min, max, value, variant, getFormattedLabel]);

  // Get props for the progress bar
  const getProgressBarProps = useCallback(() => {
    return {
      style: {
        width: variant === 'determinate' ? `${percentage}%` : undefined,
      },
    };
  }, [variant, percentage]);

  // Get props for the buffer bar
  const getBufferBarProps = useCallback(() => {
    return {
      style: {
        width: `${bufferPercentage}%`,
      },
    };
  }, [bufferPercentage]);

  // Get props for the label
  const getLabelProps = useCallback(() => {
    return {
      'aria-hidden': true,
    };
  }, []);

  return {
    value,
    setValue: handleValueChange,
    min,
    max,
    size,
    variant,
    animated,
    showLabel,
    striped,
    hasBuffer,
    bufferValue,
    setBufferValue: handleBufferValueChange,
    percentage,
    bufferPercentage,
    isComplete,
    getFormattedLabel,
    getContainerProps,
    getProgressBarProps,
    getBufferBarProps,
    getLabelProps,
  };
}

export default useProgress;
