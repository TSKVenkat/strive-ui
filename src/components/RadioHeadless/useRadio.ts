import { useState, useCallback, useRef, useId, useEffect, ChangeEvent } from 'react';

export interface UseRadioProps {
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
   * Whether the radio is disabled
   */
  disabled?: boolean;
  /**
   * Whether the radio is required
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
}

export interface UseRadioReturn {
  /**
   * Whether the radio is checked
   */
  checked: boolean;
  /**
   * Whether the radio is disabled
   */
  disabled: boolean;
  /**
   * Whether the radio is required
   */
  required: boolean;
  /**
   * Whether the radio is focused
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
 * Hook for creating radio button functionality.
 * 
 * @example
 * ```jsx
 * const MyRadio = ({ label, ...props }) => {
 *   const { 
 *     checked,
 *     getInputProps,
 *     getLabelProps,
 *   } = useRadio(props);
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
export function useRadio({
  defaultChecked = false,
  checked: controlledChecked,
  onChange,
  disabled = false,
  required = false,
  name,
  value,
  id,
}: UseRadioProps = {}): UseRadioReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const radioId = id || `radio-${generatedId}`;
  
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
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      id: radioId,
      ref: inputRef as React.RefObject<E>,
      type: 'radio',
      checked,
      onChange: handleChange as unknown as React.ChangeEventHandler<E>,
      onFocus: handleFocus as unknown as React.FocusEventHandler<E>,
      onBlur: handleBlur as unknown as React.FocusEventHandler<E>,
      disabled,
      required,
      name,
      value,
      'aria-checked': checked,
      'aria-disabled': disabled ? true : undefined,
      'aria-required': required ? true : undefined,
    };
  }, [
    radioId,
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
  ): React.LabelHTMLAttributes<E> => {
    return {
      ...props,
      htmlFor: radioId,
      onClick: (event: React.MouseEvent<E>) => {
        // We don't need to prevent default here like in checkbox
        // because clicking a label for a radio button is standard behavior
        
        props?.onClick?.(event as any);
      },
    };
  }, [radioId]);
  
  return {
    checked,
    disabled,
    required,
    focused,
    id: radioId,
    inputRef,
    setChecked,
    focus,
    getInputProps,
    getLabelProps,
  };
}
