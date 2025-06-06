import { useState, useCallback, useRef, useId, useEffect, ChangeEvent } from 'react';

export interface UseCheckboxProps {
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
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Whether the checkbox is required
   */
  required?: boolean;
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate?: boolean;
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
}

export interface UseCheckboxReturn {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;
  /**
   * Whether the checkbox is in an indeterminate state
   */
  indeterminate: boolean;
  /**
   * Whether the checkbox is disabled
   */
  disabled: boolean;
  /**
   * Whether the checkbox is required
   */
  required: boolean;
  /**
   * Whether the checkbox is focused
   */
  focused: boolean;
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
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for the label element
   */
  getLabelProps: <E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => React.LabelHTMLAttributes<E>;
}

/**
 * Hook for creating checkbox functionality.
 * 
 * @example
 * ```jsx
 * const MyCheckbox = ({ label, ...props }) => {
 *   const { 
 *     checked,
 *     getInputProps,
 *     getLabelProps,
 *   } = useCheckbox(props);
 *   
 *   return (
 *     <div>
 *       <input {...getInputProps()} />
 *       <label {...getLabelProps()}>{label}</label>
 *     </div>
 *   );
 * };
 * ```
 */
export function useCheckbox({
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  disabled = false,
  required = false,
  indeterminate = false,
  name,
  value,
  id,
}: UseCheckboxProps = {}): UseCheckboxReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;
  
  // State for checked state
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  
  // Use controlled or uncontrolled checked state
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  
  // State for focus
  const [focused, setFocused] = useState<boolean>(false);
  
  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set indeterminate state
  const setIndeterminate = useCallback((isIndeterminate: boolean) => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, []);
  
  // Update indeterminate state when it changes
  useEffect(() => {
    setIndeterminate(indeterminate);
  }, [indeterminate, setIndeterminate]);
  
  // Set checked state
  const setChecked = useCallback((newChecked: boolean) => {
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    // No onChange callback here since this is a programmatic change
  }, [controlledChecked]);
  
  // Toggle checked state
  const toggle = useCallback(() => {
    const newChecked = !checked;
    
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    if (onChange && !disabled) {
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
  }, [checked, controlledChecked, onChange, disabled, name, value]);
  
  // Handle change
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    
    if (onChange) {
      onChange(newChecked, event);
    }
  }, [controlledChecked, onChange]);
  
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
  const getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E> = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => {
    return {
      ...props,
      id: checkboxId,
      ref: inputRef as React.RefObject<E>,
      type: 'checkbox',
      checked: checked,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled,
      required,
      name,
      value,
      'aria-checked': indeterminate ? 'mixed' : checked,
      'aria-disabled': disabled ? true : undefined,
      'aria-required': required ? true : undefined,
    };
  }, [
    checkboxId,
    checked,
    handleChange,
    handleFocus,
    handleBlur,
    disabled,
    required,
    name,
    value,
  ]);
  
  // Get props for the label element
  const getLabelProps = useCallback(<E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => {
    return {
      ...props,
      htmlFor: checkboxId,
      onClick: (event: React.MouseEvent<E>) => {
        // Prevent default behavior to avoid double toggling
        // when clicking directly on the label
        event.preventDefault();
        
        if (!disabled) {
          toggle();
        }
        
        props?.onClick?.(event as any);
      },
    };
  }, [checkboxId, disabled, toggle]);
  
  return {
    checked,
    indeterminate,
    disabled,
    required,
    focused,
    id: checkboxId,
    inputRef,
    setChecked,
    toggle,
    focus,
    getInputProps,
    getLabelProps,
  };
}
