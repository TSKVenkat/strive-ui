import { useState, useCallback, ChangeEvent, FocusEvent, KeyboardEvent, useRef, useId } from 'react';

export interface UseTextInputProps {
  /**
   * Default value for the input
   */
  defaultValue?: string;
  /**
   * Controlled value for the input
   */
  value?: string;
  /**
   * Callback when the input value changes
   */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input loses focus
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when a key is pressed
   */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Callback when a key is released
   */
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * Input placeholder text
   */
  placeholder?: string;
  /**
   * Maximum length of the input value
   */
  maxLength?: number;
  /**
   * Minimum length of the input value
   */
  minLength?: number;
  /**
   * Pattern for input validation
   */
  pattern?: string;
  /**
   * Input name
   */
  name?: string;
  /**
   * Input autocomplete attribute
   */
  autoComplete?: string;
  /**
   * Whether to auto-focus the input
   */
  autoFocus?: boolean;
  /**
   * Input form ID
   */
  form?: string;
  /**
   * Input size
   */
  size?: number;
  /**
   * Input spellcheck attribute
   */
  spellCheck?: boolean;
  /**
   * Input type
   */
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'number';
  /**
   * ID for the input element
   */
  id?: string;
}

export interface UseTextInputReturn {
  /**
   * Current input value
   */
  value: string;
  /**
   * Whether the input is focused
   */
  isFocused: boolean;
  /**
   * Whether the input is disabled
   */
  isDisabled: boolean;
  /**
   * Whether the input is read-only
   */
  isReadOnly: boolean;
  /**
   * Whether the input is required
   */
  isRequired: boolean;
  /**
   * Input ID
   */
  inputId: string;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Set the input value
   */
  setValue: (value: string) => void;
  /**
   * Focus the input
   */
  focus: () => void;
  /**
   * Blur (unfocus) the input
   */
  blur: () => void;
  /**
   * Clear the input value
   */
  clear: () => void;
  /**
   * Select all text in the input
   */
  selectAll: () => void;
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
 * Hook for creating text input functionality.
 * 
 * @example
 * ```jsx
 * const MyTextInput = ({ label, ...props }) => {
 *   const { 
 *     value,
 *     isFocused,
 *     inputId,
 *     getInputProps,
 *     getLabelProps,
 *   } = useTextInput(props);
 *   
 *   return (
 *     <div>
 *       <label {...getLabelProps()}>{label}</label>
 *       <input {...getInputProps()} />
 *     </div>
 *   );
 * };
 * ```
 */
export function useTextInput({
  defaultValue = '',
  value: controlledValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  disabled = false,
  readOnly = false,
  required = false,
  placeholder,
  maxLength,
  minLength,
  pattern,
  name,
  autoComplete,
  autoFocus,
  form,
  size,
  spellCheck,
  type = 'text',
  id,
}: UseTextInputProps = {}): UseTextInputReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const inputId = id || `text-input-${generatedId}`;
  
  // State for input value
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // State for focus
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set value
  const setValue = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // No onChange callback here since this is a programmatic change
  }, [controlledValue]);
  
  // Handle value change
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    if (onChange) {
      onChange(newValue, event);
    }
  }, [controlledValue, onChange]);
  
  // Handle focus
  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);
  
  // Handle blur
  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);
  
  // Focus the input
  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  // Blur the input
  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);
  
  // Clear the input
  const clear = useCallback(() => {
    setValue('');
  }, [setValue]);
  
  // Select all text
  const selectAll = useCallback(() => {
    inputRef.current?.select();
  }, []);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => {
    return {
      ...props,
      id: inputId,
      ref: inputRef as React.RefObject<E>,
      value,
      onChange: handleChange as unknown as React.ChangeEventHandler<E>,
      onFocus: handleFocus as unknown as React.FocusEventHandler<E>,
      onBlur: handleBlur as unknown as React.FocusEventHandler<E>,
      onKeyDown: onKeyDown as unknown as React.KeyboardEventHandler<E>,
      onKeyUp: onKeyUp as unknown as React.KeyboardEventHandler<E>,
      disabled,
      readOnly,
      required,
      placeholder,
      maxLength,
      minLength,
      pattern,
      name,
      autoComplete,
      autoFocus,
      form,
      size,
      spellCheck,
      type,
      'aria-disabled': disabled ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
    };
  }, [
    inputId,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    onKeyDown,
    onKeyUp,
    disabled,
    readOnly,
    required,
    placeholder,
    maxLength,
    minLength,
    pattern,
    name,
    autoComplete,
    autoFocus,
    form,
    size,
    spellCheck,
    type,
  ]);
  
  // Get props for the label element
  const getLabelProps = useCallback(<E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => {
    return {
      ...props,
      htmlFor: inputId,
    };
  }, [inputId]);
  
  return {
    value,
    isFocused,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    inputId,
    inputRef,
    setValue,
    focus,
    blur,
    clear,
    selectAll,
    getInputProps,
    getLabelProps,
  };
}
