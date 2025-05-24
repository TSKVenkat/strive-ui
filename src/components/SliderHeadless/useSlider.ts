import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseSliderProps {
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: number;
  /**
   * Controlled value
   */
  value?: number;
  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;
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
}

export interface UseSliderReturn {
  /**
   * Current value
   */
  value: number;
  /**
   * Percentage of the value within the range
   */
  percentage: number;
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
   * Whether the slider is focused
   */
  focused: boolean;
  /**
   * Whether the slider is being dragged
   */
  dragging: boolean;
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
   * Reference to the thumb element
   */
  thumbRef: React.RefObject<HTMLDivElement>;
  /**
   * Set the value
   */
  setValue: (value: number) => void;
  /**
   * Increment the value by step
   */
  increment: () => void;
  /**
   * Decrement the value by step
   */
  decrement: () => void;
  /**
   * Set the value to minimum
   */
  setToMin: () => void;
  /**
   * Set the value to maximum
   */
  setToMax: () => void;
  /**
   * Get props for the root element
   */
  getRootProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the track element
   */
  getTrackProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the thumb element
   */
  getThumbProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
}

/**
 * Hook for creating slider functionality.
 */
export function useSlider({
  defaultValue = 0,
  value: controlledValue,
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
}: UseSliderProps = {}): UseSliderReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const sliderId = id || `slider-${generatedId}`;
  
  // State for value
  const [internalValue, setInternalValue] = useState<number>(
    clamp(defaultValue, min, max)
  );
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined 
    ? clamp(controlledValue, min, max) 
    : internalValue;
  
  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;
  
  // State for focus
  const [focused, setFocused] = useState<boolean>(false);
  
  // State for dragging
  const [dragging, setDragging] = useState<boolean>(false);
  
  // Refs for DOM elements
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
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
  
  // Set value
  const setValue = useCallback((newValue: number) => {
    const clampedValue = clamp(newValue, min, max);
    const steppedValue = roundToStep(clampedValue, min, step);
    
    if (controlledValue === undefined) {
      setInternalValue(steppedValue);
    }
    
    if (onChange) {
      onChange(steppedValue);
    }
  }, [controlledValue, min, max, step, onChange]);
  
  // Increment the value by step
  const increment = useCallback(() => {
    if (disabled || readOnly) return;
    setValue(value + step);
  }, [disabled, readOnly, setValue, value, step]);
  
  // Decrement the value by step
  const decrement = useCallback(() => {
    if (disabled || readOnly) return;
    setValue(value - step);
  }, [disabled, readOnly, setValue, value, step]);
  
  // Set the value to minimum
  const setToMin = useCallback(() => {
    if (disabled || readOnly) return;
    setValue(min);
  }, [disabled, readOnly, setValue, min]);
  
  // Set the value to maximum
  const setToMax = useCallback(() => {
    if (disabled || readOnly) return;
    setValue(max);
  }, [disabled, readOnly, setValue, max]);
  
  // Handle key down
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || readOnly) return;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        increment();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        decrement();
        break;
      case 'Home':
        event.preventDefault();
        setToMin();
        break;
      case 'End':
        event.preventDefault();
        setToMax();
        break;
      case 'PageUp':
        event.preventDefault();
        setValue(value + step * 10);
        break;
      case 'PageDown':
        event.preventDefault();
        setValue(value - step * 10);
        break;
      default:
        break;
    }
  }, [disabled, readOnly, increment, decrement, setToMin, setToMax, setValue, value, step]);
  
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
    
    setValue(newValue);
    
    // Focus the thumb
    thumbRef.current?.focus();
    
    // Start dragging
    setDragging(true);
  }, [disabled, readOnly, orientation, min, max, setValue]);
  
  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragging || !trackRef.current) return;
    
    // Calculate new value based on mouse position
    const rect = trackRef.current.getBoundingClientRect();
    const position = orientation === 'horizontal'
      ? event.clientX - rect.left
      : rect.bottom - event.clientY;
    const size = orientation === 'horizontal' ? rect.width : rect.height;
    const percentage = clamp(position / size, 0, 1);
    const newValue = min + percentage * (max - min);
    
    setValue(newValue);
  }, [dragging, orientation, min, max, setValue]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);
  
  // Add and remove event listeners for dragging
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);
  
  // Get props for the root element
  const getRootProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      role: 'presentation',
      'data-orientation': orientation,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    };
  }, [orientation, disabled, readOnly]);
  
  // Get props for the track element
  const getTrackProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: trackRef as React.RefObject<E>,
      role: 'presentation',
      onMouseDown: (event: React.MouseEvent<E>) => {
        handleTrackMouseDown(event as unknown as React.MouseEvent<HTMLDivElement>);
        props?.onMouseDown?.(event);
      },
    };
  }, [handleTrackMouseDown]);
  
  // Get props for the thumb element
  const getThumbProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: thumbRef as React.RefObject<E>,
      role: 'slider',
      tabIndex: disabled ? -1 : 0,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': value,
      'aria-orientation': orientation,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      style: {
        ...props?.style,
        [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleKeyDown(event as unknown as React.KeyboardEvent);
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        setFocused(true);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setFocused(false);
        props?.onBlur?.(event);
      },
      onMouseDown: (event: React.MouseEvent<E>) => {
        if (disabled || readOnly) return;
        
        // Prevent text selection during drag
        event.preventDefault();
        
        // Start dragging
        setDragging(true);
        
        props?.onMouseDown?.(event);
      },
    };
  }, [
    min,
    max,
    value,
    orientation,
    disabled,
    readOnly,
    required,
    percentage,
    handleKeyDown,
  ]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      type: 'range',
      id: sliderId,
      name,
      min,
      max,
      step,
      value,
      disabled,
      readOnly,
      required,
      onChange: (event: React.ChangeEvent<E>) => {
        setValue(Number(event.target.value));
        props?.onChange?.(event);
      },
    };
  }, [
    sliderId,
    name,
    min,
    max,
    step,
    value,
    disabled,
    readOnly,
    required,
    setValue,
  ]);
  
  return {
    value,
    percentage,
    disabled,
    readOnly,
    required,
    focused,
    dragging,
    min,
    max,
    step,
    id: sliderId,
    marks: normalizedMarks,
    trackRef,
    thumbRef,
    setValue,
    increment,
    decrement,
    setToMin,
    setToMax,
    getRootProps,
    getTrackProps,
    getThumbProps,
    getInputProps,
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
