import { useState, useCallback, useRef, useId } from 'react';

export interface UseRatingProps {
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
   * Maximum rating value
   */
  max?: number;
  /**
   * Whether to allow half ratings
   */
  allowHalf?: boolean;
  /**
   * Whether to allow clearing the rating by clicking the same value
   */
  allowClear?: boolean;
  /**
   * Whether the rating is disabled
   */
  disabled?: boolean;
  /**
   * Whether the rating is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the rating is required
   */
  required?: boolean;
  /**
   * ID for the rating element
   */
  id?: string;
  /**
   * Name attribute for the rating
   */
  name?: string;
  /**
   * Direction of the rating
   */
  direction?: 'ltr' | 'rtl';
}

export interface UseRatingReturn {
  /**
   * Current value
   */
  value: number;
  /**
   * Hover value
   */
  hoverValue: number;
  /**
   * Whether the rating is disabled
   */
  disabled: boolean;
  /**
   * Whether the rating is read-only
   */
  readOnly: boolean;
  /**
   * Whether the rating is required
   */
  required: boolean;
  /**
   * Maximum rating value
   */
  max: number;
  /**
   * Whether to allow half ratings
   */
  allowHalf: boolean;
  /**
   * Whether to allow clearing the rating
   */
  allowClear: boolean;
  /**
   * Direction of the rating
   */
  direction: 'ltr' | 'rtl';
  /**
   * Rating ID
   */
  id: string;
  /**
   * Rating name
   */
  name: string | undefined;
  /**
   * Set the value
   */
  setValue: (value: number) => void;
  /**
   * Set the hover value
   */
  setHoverValue: (value: number) => void;
  /**
   * Reset the hover value
   */
  resetHoverValue: () => void;
  /**
   * Get props for the root element
   */
  getRootProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for an item element
   */
  getItemProps: <E extends HTMLElement = HTMLElement>(
    props: {
      value: number;
      half?: boolean;
    } & React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the hidden input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
}

/**
 * Hook for creating rating functionality.
 */
export function useRating({
  defaultValue = 0,
  value: controlledValue,
  onChange,
  max = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  direction = 'ltr',
}: UseRatingProps = {}): UseRatingReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const ratingId = id || `rating-${generatedId}`;
  
  // State for values
  const [internalValue, setInternalValue] = useState<number>(
    clamp(defaultValue, 0, max)
  );
  const [hoverValue, setHoverValue] = useState<number>(0);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined 
    ? clamp(controlledValue, 0, max) 
    : internalValue;
  
  // Reference to track if a value was clicked
  const clickedRef = useRef<boolean>(false);
  
  // Set value
  const setValue = useCallback((newValue: number) => {
    // Clamp value between 0 and max
    newValue = clamp(newValue, 0, max);
    
    // If the same value is clicked and allowClear is true, clear the rating
    if (allowClear && newValue === value && clickedRef.current) {
      newValue = 0;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newValue);
    }
    
    // Reset the clicked ref
    clickedRef.current = false;
  }, [value, max, allowClear, controlledValue, onChange]);
  
  // Reset hover value
  const resetHoverValue = useCallback(() => {
    setHoverValue(0);
  }, []);
  
  // Get props for the root element
  const getRootProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      role: 'radiogroup',
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-direction': direction,
      onMouseLeave: (event: React.MouseEvent<E>) => {
        if (!disabled && !readOnly) {
          resetHoverValue();
        }
        props?.onMouseLeave?.(event);
      },
    };
  }, [disabled, readOnly, required, direction, resetHoverValue]);
  
  // Get props for an item element
  const getItemProps = useCallback(<E extends HTMLElement = HTMLElement>(
    props: {
      value: number;
      half?: boolean;
    } & React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    const { value: itemValue, half = false, ...restProps } = props;
    
    // Determine if the item is active based on value and hover value
    const displayValue = hoverValue > 0 ? hoverValue : value;
    const isActive = half 
      ? itemValue - 0.5 <= displayValue 
      : itemValue <= displayValue;
    
    // Determine if the item is partially filled (for half ratings)
    const isPartiallyFilled = half 
      ? false 
      : allowHalf && Math.ceil(displayValue) === itemValue && displayValue % 1 !== 0;
    
    // Calculate the percentage filled for partially filled items
    const percentageFilled = isPartiallyFilled 
      ? (displayValue % 1) * 100 
      : 0;
    
    return {
      ...restProps,
      role: 'radio',
      tabIndex: disabled ? -1 : 0,
      'aria-checked': itemValue === value,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-posinset': Math.ceil(itemValue),
      'aria-setsize': max,
      'data-value': itemValue,
      'data-active': isActive ? '' : undefined,
      'data-half': half ? '' : undefined,
      'data-partially-filled': isPartiallyFilled ? '' : undefined,
      'data-percentage-filled': isPartiallyFilled ? percentageFilled : undefined,
      onClick: (event: React.MouseEvent<E>) => {
        if (!disabled && !readOnly) {
          clickedRef.current = true;
          setValue(itemValue);
        }
        props.onClick?.(event);
      },
      onMouseMove: (event: React.MouseEvent<E>) => {
        if (!disabled && !readOnly) {
          // For half ratings, determine if the cursor is on the left or right half
          if (allowHalf && !half) {
            const { left, width } = event.currentTarget.getBoundingClientRect();
            const position = event.clientX - left;
            const isLeftHalf = position < width / 2;
            
            setHoverValue(isLeftHalf ? itemValue - 0.5 : itemValue);
          } else {
            setHoverValue(itemValue);
          }
        }
        props.onMouseMove?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (disabled || readOnly) return;
        
        let newValue = value;
        
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            newValue = direction === 'ltr' 
              ? Math.min(value + (allowHalf ? 0.5 : 1), max)
              : Math.max(value - (allowHalf ? 0.5 : 1), 0);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            newValue = direction === 'ltr' 
              ? Math.max(value - (allowHalf ? 0.5 : 1), 0)
              : Math.min(value + (allowHalf ? 0.5 : 1), max);
            break;
          case 'ArrowUp':
            event.preventDefault();
            newValue = Math.min(value + (allowHalf ? 0.5 : 1), max);
            break;
          case 'ArrowDown':
            event.preventDefault();
            newValue = Math.max(value - (allowHalf ? 0.5 : 1), 0);
            break;
          case 'Home':
            event.preventDefault();
            newValue = 0;
            break;
          case 'End':
            event.preventDefault();
            newValue = max;
            break;
          case ' ':
          case 'Enter':
            event.preventDefault();
            clickedRef.current = true;
            newValue = itemValue;
            break;
          default:
            return;
        }
        
        setValue(newValue);
        props.onKeyDown?.(event);
      },
    };
  }, [
    value, 
    hoverValue, 
    disabled, 
    readOnly, 
    max, 
    allowHalf, 
    direction, 
    setValue
  ]);
  
  // Get props for the hidden input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      type: 'hidden',
      id: ratingId,
      name,
      value,
      disabled,
      readOnly,
      required,
    };
  }, [ratingId, name, value, disabled, readOnly, required]);
  
  return {
    value,
    hoverValue,
    disabled,
    readOnly,
    required,
    max,
    allowHalf,
    allowClear,
    direction,
    id: ratingId,
    name,
    setValue,
    setHoverValue,
    resetHoverValue,
    getRootProps,
    getItemProps,
    getInputProps,
  };
}

// Helper function
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
