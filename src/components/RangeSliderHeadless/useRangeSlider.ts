import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseRangeSliderProps {
  /**
   * Default start value (uncontrolled)
   */
  defaultStartValue?: number;
  /**
   * Default end value (uncontrolled)
   */
  defaultEndValue?: number;
  /**
   * Controlled start value
   */
  startValue?: number;
  /**
   * Controlled end value
   */
  endValue?: number;
  /**
   * Callback when values change
   */
  onChange?: (values: [number, number]) => void;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Step value
   */
  step?: number;
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;
  /**
   * Whether the slider is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the slider is required
   */
  required?: boolean;
  /**
   * ID for the slider element
   */
  id?: string;
  /**
   * Name attribute for the slider
   */
  name?: string;
  /**
   * Whether to show marks
   */
  marks?: boolean | { value: number; label?: string }[];
  /**
   * Whether to show tooltip
   */
  tooltip?: boolean;
  /**
   * Orientation of the slider
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Minimum distance between handles
   */
  minDistance?: number;
  /**
   * Whether to allow handles to cross
   */
  allowCross?: boolean;
}

export interface UseRangeSliderReturn {
  /**
   * Current start value
   */
  startValue: number;
  /**
   * Current end value
   */
  endValue: number;
  /**
   * Percentage of the start value within the range
   */
  startPercentage: number;
  /**
   * Percentage of the end value within the range
   */
  endPercentage: number;
  /**
   * Whether the slider is disabled
   */
  disabled: boolean;
  /**
   * Whether the slider is read-only
   */
  readOnly: boolean;
  /**
   * Whether the slider is required
   */
  required: boolean;
  /**
   * Whether the start thumb is focused
   */
  startFocused: boolean;
  /**
   * Whether the end thumb is focused
   */
  endFocused: boolean;
  /**
   * Whether the start thumb is being dragged
   */
  startDragging: boolean;
  /**
   * Whether the end thumb is being dragged
   */
  endDragging: boolean;
  /**
   * Minimum value
   */
  min: number;
  /**
   * Maximum value
   */
  max: number;
  /**
   * Step value
   */
  step: number;
  /**
   * Slider ID
   */
  id: string;
  /**
   * Marks for the slider
   */
  marks: { value: number; label?: string; percentage: number }[];
  /**
   * Reference to the track element
   */
  trackRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the start thumb element
   */
  startThumbRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the end thumb element
   */
  endThumbRef: React.RefObject<HTMLDivElement>;
  /**
   * Set the values
   */
  setValues: (values: [number, number]) => void;
  /**
   * Get props for the root element
   */
  getRootProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { 'data-orientation': string };
  /**
   * Get props for the track element
   */
  getTrackProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { ref: React.RefObject<E> };
  /**
   * Get props for the range element
   */
  getRangeProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the start thumb element
   */
  getStartThumbProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { ref: React.RefObject<E> };
  /**
   * Get props for the end thumb element
   */
  getEndThumbProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { ref: React.RefObject<E> };
  /**
   * Get props for the start input element
   */
  getStartInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for the end input element
   */
  getEndInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
}

/**
 * Hook for creating range slider functionality.
 */
export function useRangeSlider({
  defaultStartValue = 0,
  defaultEndValue = 100,
  startValue: controlledStartValue,
  endValue: controlledEndValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  marks = false,
  tooltip = false,
  orientation = 'horizontal',
  minDistance = 0,
  allowCross = false,
}: UseRangeSliderProps = {}): UseRangeSliderReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const sliderId = id || `range-slider-${generatedId}`;
  
  // State for values
  const [internalStartValue, setInternalStartValue] = useState<number>(
    clamp(defaultStartValue, min, max)
  );
  const [internalEndValue, setInternalEndValue] = useState<number>(
    clamp(defaultEndValue, min, max)
  );
  
  // Use controlled or uncontrolled values
  const startValue = controlledStartValue !== undefined 
    ? clamp(controlledStartValue, min, max) 
    : internalStartValue;
  const endValue = controlledEndValue !== undefined 
    ? clamp(controlledEndValue, min, max) 
    : internalEndValue;
  
  // Calculate percentages
  const startPercentage = ((startValue - min) / (max - min)) * 100;
  const endPercentage = ((endValue - min) / (max - min)) * 100;
  
  // State for focus
  const [startFocused, setStartFocused] = useState<boolean>(false);
  const [endFocused, setEndFocused] = useState<boolean>(false);
  
  // State for dragging
  const [startDragging, setStartDragging] = useState<boolean>(false);
  const [endDragging, setEndDragging] = useState<boolean>(false);
  
  // Refs for DOM elements
  const trackRef = useRef<HTMLDivElement>(null);
  const startThumbRef = useRef<HTMLDivElement>(null);
  const endThumbRef = useRef<HTMLDivElement>(null);
  
  // Generate marks
  const normalizedMarks = useMemo(() => {
    if (marks === false) return [];
    if (marks === true) {
      // Generate marks for each step
      const count = Math.floor((max - min) / step) + 1;
      return Array.from({ length: count }, (_, i) => {
        const value = min + i * step;
        return {
          value,
          label: undefined,
          percentage: ((value - min) / (max - min)) * 100,
        };
      });
    }
    
    // Use provided marks
    return marks.map(mark => ({
      ...mark,
      percentage: ((mark.value - min) / (max - min)) * 100,
    }));
  }, [marks, min, max, step]);
  
  // Set values
  const setValues = useCallback((values: [number, number]) => {
    let [newStartValue, newEndValue] = values;
    
    // Clamp values to min/max
    newStartValue = clamp(newStartValue, min, max);
    newEndValue = clamp(newEndValue, min, max);
    
    // Round to step
    newStartValue = roundToStep(newStartValue, min, step);
    newEndValue = roundToStep(newEndValue, min, step);
    
    // Enforce minDistance and allowCross
    if (!allowCross && newStartValue > newEndValue) {
      if (startDragging) {
        newStartValue = newEndValue;
      } else if (endDragging) {
        newEndValue = newStartValue;
      }
    } else if (minDistance > 0) {
      const distance = newEndValue - newStartValue;
      if (distance < minDistance) {
        if (startDragging) {
          newStartValue = newEndValue - minDistance;
        } else if (endDragging) {
          newEndValue = newStartValue + minDistance;
        }
      }
    }
    
    // Update internal state for uncontrolled component
    if (controlledStartValue === undefined) {
      setInternalStartValue(newStartValue);
    }
    if (controlledEndValue === undefined) {
      setInternalEndValue(newEndValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([newStartValue, newEndValue]);
    }
  }, [
    min, 
    max, 
    step, 
    minDistance, 
    allowCross, 
    startDragging, 
    endDragging, 
    controlledStartValue, 
    controlledEndValue, 
    onChange
  ]);
  
  // Handle key down for start thumb
  const handleStartKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || readOnly) return;
    
    let newValue = startValue;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = startValue + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = startValue - step;
        break;
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = allowCross ? max : endValue;
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = startValue + step * 10;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = startValue - step * 10;
        break;
      default:
        return;
    }
    
    setValues([newValue, endValue]);
  }, [disabled, readOnly, startValue, endValue, step, min, max, allowCross, setValues]);
  
  // Handle key down for end thumb
  const handleEndKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || readOnly) return;
    
    let newValue = endValue;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = endValue + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = endValue - step;
        break;
      case 'Home':
        event.preventDefault();
        newValue = allowCross ? min : startValue;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = endValue + step * 10;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = endValue - step * 10;
        break;
      default:
        return;
    }
    
    setValues([startValue, newValue]);
  }, [disabled, readOnly, startValue, endValue, step, min, max, allowCross, setValues]);
  
  // Handle mouse down on track
  const handleTrackMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || readOnly || !trackRef.current) return;
    
    // Calculate new value based on click position
    const rect = trackRef.current.getBoundingClientRect();
    const position = orientation === 'horizontal'
      ? event.clientX - rect.left
      : rect.bottom - event.clientY;
    const size = orientation === 'horizontal' ? rect.width : rect.height;
    const percentage = position / size;
    const newValue = min + percentage * (max - min);
    
    // Determine which thumb to move
    const distanceToStart = Math.abs(newValue - startValue);
    const distanceToEnd = Math.abs(newValue - endValue);
    
    if (distanceToStart <= distanceToEnd) {
      setValues([newValue, endValue]);
      startThumbRef.current?.focus();
      setStartDragging(true);
    } else {
      setValues([startValue, newValue]);
      endThumbRef.current?.focus();
      setEndDragging(true);
    }
  }, [
    disabled, 
    readOnly, 
    orientation, 
    min, 
    max, 
    startValue, 
    endValue, 
    setValues
  ]);
  
  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if ((!startDragging && !endDragging) || !trackRef.current) return;
    
    // Calculate new value based on mouse position
    const rect = trackRef.current.getBoundingClientRect();
    const position = orientation === 'horizontal'
      ? event.clientX - rect.left
      : rect.bottom - event.clientY;
    const size = orientation === 'horizontal' ? rect.width : rect.height;
    const percentage = clamp(position / size, 0, 1);
    const newValue = min + percentage * (max - min);
    
    if (startDragging) {
      setValues([newValue, endValue]);
    } else if (endDragging) {
      setValues([startValue, newValue]);
    }
  }, [
    startDragging, 
    endDragging, 
    orientation, 
    min, 
    max, 
    startValue, 
    endValue, 
    setValues
  ]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setStartDragging(false);
    setEndDragging(false);
  }, []);
  
  // Add and remove event listeners for dragging
  useEffect(() => {
    if (startDragging || endDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [startDragging, endDragging, handleMouseMove, handleMouseUp]);
  
  // Get props for the root element
  const getRootProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { 'data-orientation': string } => {
    return {
      ...props,
      role: 'presentation',
      'data-orientation': orientation,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    } as any;
  }, [orientation, disabled, readOnly]);
  
  // Get props for the track element
  const getTrackProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { ref: React.RefObject<E> } => {
    return {
      ...props,
      ref: trackRef as React.RefObject<E>,
      role: 'presentation',
      onMouseDown: (event: React.MouseEvent<E>) => {
        handleTrackMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>);
        props?.onMouseDown?.(event);
      },
    } as any;
  }, [handleTrackMouseDown]);
  
  // Get props for the range element
  const getRangeProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      role: 'presentation',
      style: {
        ...props?.style,
        [orientation === 'horizontal' ? 'left' : 'bottom']: `${startPercentage}%`,
        [orientation === 'horizontal' ? 'width' : 'height']: `${endPercentage - startPercentage}%`,
      },
    };
  }, [orientation, startPercentage, endPercentage]);
  
  // Get props for the start thumb element
  const getStartThumbProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { ref: React.RefObject<E> } => {
    return {
      ...props,
      ref: startThumbRef as React.RefObject<E>,
      role: 'slider',
      tabIndex: disabled ? -1 : 0,
      'aria-valuemin': min,
      'aria-valuemax': allowCross ? max : endValue,
      'aria-valuenow': startValue,
      'aria-orientation': orientation,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-label': props?.['aria-label'] || 'Minimum value',
      style: {
        ...props?.style,
        [orientation === 'horizontal' ? 'left' : 'bottom']: `${startPercentage}%`,
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleStartKeyDown(event as unknown as React.KeyboardEvent);
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        setStartFocused(true);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setStartFocused(false);
        props?.onBlur?.(event);
      },
      onMouseDown: (event: React.MouseEvent<E>) => {
        if (disabled || readOnly) return;
        
        // Prevent text selection during drag
        event.preventDefault();
        
        // Start dragging
        setStartDragging(true);
        
        props?.onMouseDown?.(event);
      },
    } as any;
  }, [
    min,
    max,
    startValue,
    endValue,
    orientation,
    disabled,
    readOnly,
    required,
    allowCross,
    startPercentage,
    handleStartKeyDown,
  ]);
  
  // Get props for the end thumb element
  const getEndThumbProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { ref: React.RefObject<E> } => {
    return {
      ...props,
      ref: endThumbRef as React.RefObject<E>,
      role: 'slider',
      tabIndex: disabled ? -1 : 0,
      'aria-valuemin': allowCross ? min : startValue,
      'aria-valuemax': max,
      'aria-valuenow': endValue,
      'aria-orientation': orientation,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-label': props?.['aria-label'] || 'Maximum value',
      style: {
        ...props?.style,
        [orientation === 'horizontal' ? 'left' : 'bottom']: `${endPercentage}%`,
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleEndKeyDown(event as unknown as React.KeyboardEvent);
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        setEndFocused(true);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setEndFocused(false);
        props?.onBlur?.(event);
      },
      onMouseDown: (event: React.MouseEvent<E>) => {
        if (disabled || readOnly) return;
        
        // Prevent text selection during drag
        event.preventDefault();
        
        // Start dragging
        setEndDragging(true);
        
        props?.onMouseDown?.(event);
      },
    } as any;
  }, [
    min,
    max,
    startValue,
    endValue,
    orientation,
    disabled,
    readOnly,
    required,
    allowCross,
    endPercentage,
    handleEndKeyDown,
  ]);
  
  // Get props for the start input element
  const getStartInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      type: 'range',
      id: `${sliderId}-start`,
      name: name ? `${name}-start` : undefined,
      min,
      max: allowCross ? max : endValue,
      step,
      value: startValue,
      disabled,
      readOnly,
      required,
      onChange: (event: React.ChangeEvent<E>) => {
        setValues([Number(event.target.value), endValue]);
        props?.onChange?.(event);
      },
    };
  }, [
    sliderId,
    name,
    min,
    max,
    step,
    startValue,
    endValue,
    disabled,
    readOnly,
    required,
    allowCross,
    setValues,
  ]);
  
  // Get props for the end input element
  const getEndInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      type: 'range',
      id: `${sliderId}-end`,
      name: name ? `${name}-end` : undefined,
      min: allowCross ? min : startValue,
      max,
      step,
      value: endValue,
      disabled,
      readOnly,
      required,
      onChange: (event: React.ChangeEvent<E>) => {
        setValues([startValue, Number(event.target.value)]);
        props?.onChange?.(event);
      },
    };
  }, [
    sliderId,
    name,
    min,
    max,
    step,
    startValue,
    endValue,
    disabled,
    readOnly,
    required,
    allowCross,
    setValues,
  ]);
  
  return {
    startValue,
    endValue,
    startPercentage,
    endPercentage,
    disabled,
    readOnly,
    required,
    startFocused,
    endFocused,
    startDragging,
    endDragging,
    min,
    max,
    step,
    id: sliderId,
    marks: normalizedMarks,
    trackRef,
    startThumbRef,
    endThumbRef,
    setValues,
    getRootProps,
    getTrackProps,
    getRangeProps,
    getStartThumbProps,
    getEndThumbProps,
    getStartInputProps,
    getEndInputProps,
  };
}

// Helper functions
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, min: number, step: number): number {
  const stepsFromMin = Math.round((value - min) / step);
  return min + stepsFromMin * step;
}

function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ value: T; deps: React.DependencyList }>({
    value: undefined as unknown as T,
    deps: [],
  });
  
  const depsChanged = !deps.every((dep, i) => Object.is(dep, ref.current.deps[i]));
  
  if (depsChanged || ref.current.value === undefined) {
    ref.current.value = factory();
    ref.current.deps = deps;
  }
  
  return ref.current.value;
}
