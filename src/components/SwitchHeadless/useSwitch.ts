import { useState, useCallback, useRef, useId, ChangeEvent } from 'react';

export interface UseSwitchProps {
  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;
  /**
   * Controlled checked state
   */
  checked?: boolean;
  /**
   * Callback when checked state changes
   */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Whether the switch is required
   */
  required?: boolean;
  /**
   * Name attribute for the input
   */
  name?: string;
  /**
   * Value attribute for the input
   */
  value?: string;
  /**
   * ID for the input element
   */
  id?: string;
  /**
   * Size of the switch
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show the loading state
   */
  loading?: boolean;
}

export interface UseSwitchReturn {
  /**
   * Whether the switch is checked
   */
  checked: boolean;
  /**
   * Whether the switch is disabled
   */
  disabled: boolean;
  /**
   * Whether the switch is required
   */
  required: boolean;
  /**
   * Whether the switch is focused
   */
  focused: boolean;
  /**
   * Whether the switch is loading
   */
  loading: boolean;
  /**
   * Size of the switch
   */
  size: 'sm' | 'md' | 'lg';
  /**
   * Input ID
   */
  id: string;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Set the checked state
   */
  setChecked: (checked: boolean) => void;
  /**
   * Toggle the checked state
   */
  toggle: () => void;
  /**
   * Focus the input
   */
  focus: () => void;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E> & { ref?: any };
  /**
   * Get props for the label element
   */
  getLabelProps: <E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => React.LabelHTMLAttributes<E>;
  /**
   * Get props for the switch element (the visual toggle)
   */
  getSwitchProps: <E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { 'data-state'?: string };
  /**
   * Get props for the thumb element (the moving part of the switch)
   */
  getThumbProps: <E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { 'data-state'?: string };
}

/**
 * Hook for creating switch functionality.
 * 
 * @example
 * ```jsx
 * const MySwitch = ({ label, ...props }) => {
 *   const { 
 *     checked,
 *     getInputProps,
 *     getSwitchProps,
 *     getThumbProps,
 *     getLabelProps,
 *   } = useSwitch(props);
 *   
 *   return (
 *     <div>
 *       <input {...getInputProps()} />
 *       <div {...getSwitchProps()}>
 *         <div {...getThumbProps()} />
 *       </div>
 *       <label {...getLabelProps()}>{label}</label>
 *     </div>
 *   );
 * };
 * ```
 */
export function useSwitch({
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  disabled = false,
  required = false,
  name,
  value,
  id,
  size = 'md',
  loading = false,
}: UseSwitchProps = {}): UseSwitchReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const switchId = id || `switch-${generatedId}`;
  
  // State for checked state
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  
  // Use controlled or uncontrolled checked state
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  
  // State for focus
  const [focused, setFocused] = useState<boolean>(false);
  
  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set checked state
  const setChecked = useCallback((newChecked: boolean) => {
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    // No onChange callback here since this is a programmatic change
  }, [controlledChecked]);
  
  // Toggle checked state
  const toggle = useCallback(() => {
    if (disabled || loading) return;
    
    const newChecked = !checked;
    
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    if (onChange) {
      // Create a synthetic event
      const event = {
        target: {
          checked: newChecked,
          name,
          value,
        },
      } as ChangeEvent<HTMLInputElement>;
      
      onChange(newChecked, event);
    }
  }, [checked, controlledChecked, onChange, disabled, loading, name, value]);
  
  // Handle change
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    
    const newChecked = event.target.checked;
    
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    if (onChange) {
      onChange(newChecked, event);
    }
  }, [controlledChecked, onChange, disabled, loading]);
  
  // Handle focus
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);
  
  // Handle blur
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);
  
  // Focus the input
  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> & { ref?: any } => {
    return {
      ...props,
      id: switchId,
      ref: inputRef as any,
      type: 'checkbox',
      role: 'switch',
      checked,
      onChange: handleChange as unknown as React.ChangeEventHandler<E>,
      onFocus: handleFocus as unknown as React.FocusEventHandler<E>,
      onBlur: handleBlur as unknown as React.FocusEventHandler<E>,
      disabled: disabled || loading,
      required,
      name,
      value,
      'aria-checked': checked,
      'aria-disabled': disabled || loading ? true : undefined,
      'aria-required': required ? true : undefined,
    } as any;
  }, [
    switchId,
    checked,
    handleChange,
    handleFocus,
    handleBlur,
    disabled,
    loading,
    required,
    name,
    value,
  ]);
  
  // Get props for the label element
  const getLabelProps = useCallback(<E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ): React.LabelHTMLAttributes<E> => {
    return {
      ...props,
      htmlFor: switchId,
      onClick: (event: React.MouseEvent<E>) => {
        // Prevent default behavior to avoid double toggling
        // when clicking directly on the label
        event.preventDefault();
        
        if (!disabled && !loading) {
          toggle();
        }
        
        props?.onClick?.(event as any);
      },
    };
  }, [switchId, disabled, loading, toggle]);
  
  // Get props for the switch element (the visual toggle)
  const getSwitchProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { 'data-state'?: string } => {
    return {
      ...props,
      role: 'presentation',
      'aria-hidden': true,
      'data-state': (checked ? 'checked' : 'unchecked') as any,
      'data-disabled': disabled || loading ? '' : undefined,
      'data-focused': focused ? '' : undefined,
      'data-loading': loading ? '' : undefined,
      'data-size': size,
      onClick: (event: React.MouseEvent<E>) => {
        // Prevent default behavior
        event.preventDefault();
        
        if (!disabled && !loading) {
          toggle();
          // Focus the input when clicking the switch
          inputRef.current?.focus();
        }
        
        props?.onClick?.(event as any);
      },
    } as any;
  }, [checked, disabled, focused, loading, size, toggle]);
  
  // Get props for the thumb element (the moving part of the switch)
  const getThumbProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { 'data-state'?: string } => {
    return {
      ...props,
      'data-state': (checked ? 'checked' : 'unchecked') as any,
      'data-disabled': disabled || loading ? '' : undefined,
      'data-loading': loading ? '' : undefined,
      'data-size': size,
    } as any;
  }, [checked, disabled, loading, size]);
  
  return {
    checked,
    disabled,
    required,
    focused,
    loading,
    size,
    id: switchId,
    inputRef,
    setChecked,
    toggle,
    focus,
    getInputProps,
    getLabelProps,
    getSwitchProps,
    getThumbProps,
  };
}
