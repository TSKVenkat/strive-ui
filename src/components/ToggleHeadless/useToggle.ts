import { useState, useCallback, useRef, useId } from 'react';

export interface UseToggleProps {
  /**
   * Default toggle state (uncontrolled)
   */
  defaultToggled?: boolean;
  /**
   * Controlled toggle state
   */
  toggled?: boolean;
  /**
   * Callback when toggle state changes
   */
  onChange?: (toggled: boolean) => void;
  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;
  /**
   * Whether the toggle is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the toggle is required
   */
  required?: boolean;
  /**
   * ID for the toggle element
   */
  id?: string;
  /**
   * Name attribute for the toggle
   */
  name?: string;
  /**
   * Value attribute for the toggle
   */
  value?: string;
  /**
   * ARIA label for the toggle
   */
  'aria-label'?: string;
  /**
   * ARIA labelledby for the toggle
   */
  'aria-labelledby'?: string;
  /**
   * Callback when toggle is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  /**
   * Callback when toggle is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

export interface UseToggleReturn {
  /**
   * Whether the toggle is toggled
   */
  toggled: boolean;
  /**
   * Whether the toggle is disabled
   */
  disabled: boolean;
  /**
   * Whether the toggle is read-only
   */
  readOnly: boolean;
  /**
   * Whether the toggle is required
   */
  required: boolean;
  /**
   * Whether the toggle is focused
   */
  focused: boolean;
  /**
   * Whether the toggle is hovered
   */
  hovered: boolean;
  /**
   * Whether the toggle is pressed
   */
  pressed: boolean;
  /**
   * Toggle ID
   */
  id: string;
  /**
   * Toggle name
   */
  name: string | undefined;
  /**
   * Toggle value
   */
  value: string | undefined;
  /**
   * ARIA label
   */
  'aria-label': string | undefined;
  /**
   * ARIA labelledby
   */
  'aria-labelledby': string | undefined;
  /**
   * Reference to the toggle element
   */
  ref: React.RefObject<HTMLButtonElement>;
  /**
   * Toggle the state
   */
  toggle: () => void;
  /**
   * Set the toggle state
   */
  setToggled: (toggled: boolean) => void;
  /**
   * Focus the toggle
   */
  focus: () => void;
  /**
   * Blur the toggle
   */
  blur: () => void;
  /**
   * Get props for the toggle element
   */
  getToggleProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the toggle label element
   */
  getLabelProps: <E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => React.LabelHTMLAttributes<E>;
  /**
   * Get props for the toggle track element
   */
  getTrackProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the toggle thumb element
   */
  getThumbProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
}

/**
 * Hook for creating toggle functionality.
 */
export function useToggle({
  defaultToggled = false,
  toggled: controlledToggled,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  value,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  onFocus,
  onBlur,
}: UseToggleProps = {}): UseToggleReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const toggleId = id || `toggle-${generatedId}`;
  
  // State for toggle
  const [internalToggled, setInternalToggled] = useState<boolean>(defaultToggled);
  const [focused, setFocused] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [pressed, setPressed] = useState<boolean>(false);
  
  // Use controlled or uncontrolled toggle state
  const toggled = controlledToggled !== undefined ? controlledToggled : internalToggled;
  
  // Ref for toggle element
  const ref = useRef<HTMLButtonElement>(null);
  
  // Toggle the state
  const toggle = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    const newToggled = !toggled;
    
    // Update internal state for uncontrolled component
    if (controlledToggled === undefined) {
      setInternalToggled(newToggled);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newToggled);
    }
  }, [toggled, disabled, readOnly, controlledToggled, onChange]);
  
  // Set the toggle state
  const setToggled = useCallback((newToggled: boolean) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledToggled === undefined) {
      setInternalToggled(newToggled);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newToggled);
    }
  }, [disabled, readOnly, controlledToggled, onChange]);
  
  // Focus the toggle
  const focus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  
  // Blur the toggle
  const blur = useCallback(() => {
    if (ref.current) {
      ref.current.blur();
    }
  }, []);
  
  // Handle focus event
  const handleFocus = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);
  
  // Handle blur event
  const handleBlur = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setFocused(false);
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);
  
  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setPressed(false);
  }, []);
  
  const handleMouseDown = useCallback(() => {
    setPressed(true);
  }, []);
  
  const handleMouseUp = useCallback(() => {
    setPressed(false);
  }, []);
  
  // Get props for the toggle element
  const getToggleProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(ref, props?.ref),
      id: toggleId,
      role: 'switch',
      type: 'button',
      'aria-checked': toggled,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      disabled: disabled,
      tabIndex: disabled ? -1 : 0,
      onClick: (event: React.MouseEvent<E>) => {
        if (!disabled && !readOnly) {
          toggle();
        }
        props?.onClick?.(event as any);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (!disabled && !readOnly && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          toggle();
        }
        props?.onKeyDown?.(event as any);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        handleFocus(event as any);
        props?.onFocus?.(event as any);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        handleBlur(event as any);
        props?.onBlur?.(event as any);
      },
      onMouseEnter: (event: React.MouseEvent<E>) => {
        handleMouseEnter();
        props?.onMouseEnter?.(event as any);
      },
      onMouseLeave: (event: React.MouseEvent<E>) => {
        handleMouseLeave();
        props?.onMouseLeave?.(event as any);
      },
      onMouseDown: (event: React.MouseEvent<E>) => {
        handleMouseDown();
        props?.onMouseDown?.(event as any);
      },
      onMouseUp: (event: React.MouseEvent<E>) => {
        handleMouseUp();
        props?.onMouseUp?.(event as any);
      },
      'data-state': toggled ? 'on' : 'off',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-focused': focused ? '' : undefined,
      'data-hovered': hovered ? '' : undefined,
      'data-pressed': pressed ? '' : undefined,
    };
  }, [
    toggleId,
    toggled,
    disabled,
    readOnly,
    required,
    ariaLabel,
    ariaLabelledby,
    toggle,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    focused,
    hovered,
    pressed,
  ]);
  
  // Get props for the toggle label element
  const getLabelProps = useCallback(<E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ): React.LabelHTMLAttributes<E> => {
    return {
      ...props,
      htmlFor: toggleId,
      onClick: (event: React.MouseEvent<E>) => {
        // Prevent default to avoid double toggling
        event.preventDefault();
        if (!disabled && !readOnly) {
          toggle();
          focus();
        }
        props?.onClick?.(event as any);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    };
  }, [toggleId, disabled, readOnly, toggle, focus]);
  
  // Get props for the toggle track element
  const getTrackProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      'data-state': toggled ? 'on' : 'off',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    };
  }, [toggled, disabled, readOnly]);
  
  // Get props for the toggle thumb element
  const getThumbProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      'data-state': toggled ? 'on' : 'off',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    };
  }, [toggled, disabled, readOnly]);
  
  return {
    toggled,
    disabled,
    readOnly,
    required,
    focused,
    hovered,
    pressed,
    id: toggleId,
    name,
    value,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ref,
    toggle,
    setToggled,
    focus,
    blur,
    getToggleProps,
    getLabelProps,
    getTrackProps,
    getThumbProps,
  };
}

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}
