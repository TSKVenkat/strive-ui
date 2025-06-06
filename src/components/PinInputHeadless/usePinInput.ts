import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UsePinInputProps {
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when all inputs are filled
   */
  onComplete?: (value: string) => void;
  /**
   * Number of input fields
   */
  length?: number;
  /**
   * Type of input fields
   */
  type?: 'text' | 'password' | 'number';
  /**
   * Mask character for password type
   */
  mask?: string;
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
   * ID for the pin input element
   */
  id?: string;
  /**
   * Name attribute for the pin input
   */
  name?: string;
  /**
   * Whether to auto focus the first input
   */
  autoFocus?: boolean;
  /**
   * Whether to focus the next input automatically
   */
  autoFocusNext?: boolean;
  /**
   * Whether to focus the previous input on backspace
   */
  focusPrevOnBackspace?: boolean;
  /**
   * Whether to clear all inputs when the value is cleared
   */
  clearOnReset?: boolean;
  /**
   * Whether to allow only one character per input
   */
  oneCharPerInput?: boolean;
  /**
   * Regex pattern for input validation
   */
  pattern?: string;
  /**
   * Placeholder for each input
   */
  placeholder?: string;
  /**
   * Separator between inputs
   */
  separator?: React.ReactNode;
  /**
   * Callback when an input is focused
   */
  onFocus?: (index: number, event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when an input is blurred
   */
  onBlur?: (index: number, event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when a key is pressed
   */
  onKeyDown?: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Callback when paste event occurs
   */
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export interface UsePinInputReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Array of individual values for each input
   */
  values: string[];
  /**
   * Whether the input is disabled
   */
  disabled: boolean;
  /**
   * Whether the input is read-only
   */
  readOnly: boolean;
  /**
   * Whether the input is required
   */
  required: boolean;
  /**
   * Number of input fields
   */
  length: number;
  /**
   * Type of input fields
   */
  type: 'text' | 'password' | 'number';
  /**
   * Mask character for password type
   */
  mask: string | undefined;
  /**
   * Pin input ID
   */
  id: string;
  /**
   * Pin input name
   */
  name: string | undefined;
  /**
   * Placeholder for each input
   */
  placeholder: string | undefined;
  /**
   * Separator between inputs
   */
  separator: React.ReactNode;
  /**
   * Index of the currently focused input
   */
  focusedIndex: number;
  /**
   * Array of refs for each input
   */
  inputRefs: React.RefObject<HTMLInputElement>[];
  /**
   * Set the value
   */
  setValue: (value: string) => void;
  /**
   * Clear all inputs
   */
  clear: () => void;
  /**
   * Focus an input by index
   */
  focusInput: (index: number) => void;
  /**
   * Focus the next input
   */
  focusNext: (index: number) => void;
  /**
   * Focus the previous input
   */
  focusPrev: (index: number) => void;
  /**
   * Get props for the pin input container element
   */
  getPinInputProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for an individual input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    index: number,
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
}

/**
 * Hook for creating pin input functionality.
 */
export function usePinInput({
  defaultValue = '',
  value: controlledValue,
  onChange,
  onComplete,
  length = 4,
  type = 'text',
  mask,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  autoFocus = false,
  autoFocusNext = true,
  focusPrevOnBackspace = true,
  clearOnReset = true,
  oneCharPerInput = true,
  pattern = '[0-9]',
  placeholder = '○',
  separator,
  onFocus,
  onBlur,
  onKeyDown,
  onPaste,
}: UsePinInputProps = {}): UsePinInputReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const pinInputId = id || `pin-input-${generatedId}`;
  
  // Normalize value to match length
  const normalizeValue = (val: string) => {
    return val.slice(0, length);
  };
  
  // State for pin input
  const [internalValue, setInternalValue] = useState<string>(normalizeValue(defaultValue));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined 
    ? normalizeValue(controlledValue) 
    : internalValue;
  
  // Split value into individual characters
  const values = value.split('').concat(Array(length - value.length).fill(''));
  
  // Create refs for each input
  const inputRefs = Array(length)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));
  
  // Focus the first input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  }, [autoFocus]);
  
  // Set the value
  const setValue = useCallback((newValue: string) => {
    const normalizedValue = normalizeValue(newValue);
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(normalizedValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(normalizedValue);
    }
    
    // Call onComplete callback if all inputs are filled
    if (onComplete && normalizedValue.length === length) {
      onComplete(normalizedValue);
    }
  }, [controlledValue, onChange, onComplete, length]);
  
  // Clear all inputs
  const clear = useCallback(() => {
    setValue('');
    
    // Focus the first input if clearOnReset is true
    if (clearOnReset && inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  }, [setValue, clearOnReset, inputRefs]);
  
  // Focus an input by index
  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length && inputRefs[index]?.current) {
      inputRefs[index].current?.focus();
    }
  }, [length, inputRefs]);
  
  // Focus the next input
  const focusNext = useCallback((index: number) => {
    if (index < length - 1) {
      focusInput(index + 1);
    }
  }, [length, focusInput]);
  
  // Focus the previous input
  const focusPrev = useCallback((index: number) => {
    if (index > 0) {
      focusInput(index - 1);
    }
  }, [focusInput]);
  
  // Handle input change
  const handleChange = useCallback((index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newChar = event.target.value;
    
    // If the input is empty, do nothing
    if (!newChar) {
      return;
    }
    
    // If oneCharPerInput is true, only take the last character
    const char = oneCharPerInput ? newChar.slice(-1) : newChar;
    
    // Validate the character with the pattern
    if (pattern && !new RegExp(pattern).test(char)) {
      return;
    }
    
    // Update the value
    const newValue = [...values];
    newValue[index] = char;
    
    // If oneCharPerInput is false, we need to handle multi-character input
    if (!oneCharPerInput && char.length > 1) {
      // Split the characters and distribute them across inputs
      const chars = char.split('');
      for (let i = 0; i < chars.length && index + i < length; i++) {
        newValue[index + i] = chars[i];
      }
    }
    
    setValue(newValue.join(''));
    
    // Focus the next input if autoFocusNext is true
    if (autoFocusNext && index < length - 1 && newValue[index]) {
      focusNext(index);
    }
  }, [values, oneCharPerInput, pattern, length, setValue, autoFocusNext, focusNext]);
  
  // Handle key down events
  const handleKeyDown = useCallback((index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    // Call onKeyDown callback
    if (onKeyDown) {
      onKeyDown(index, event);
    }
    
    switch (event.key) {
      case 'Backspace':
        // If the input is empty and focusPrevOnBackspace is true, focus the previous input
        if (focusPrevOnBackspace && !values[index] && index > 0) {
          event.preventDefault();
          focusPrev(index);
          
          // Clear the previous input
          const newValue = [...values];
          newValue[index - 1] = '';
          setValue(newValue.join(''));
        } else if (values[index]) {
          // Clear the current input
          const newValue = [...values];
          newValue[index] = '';
          setValue(newValue.join(''));
        }
        break;
      case 'Delete':
        // Clear the current input
        const newValue = [...values];
        newValue[index] = '';
        setValue(newValue.join(''));
        break;
      case 'ArrowLeft':
        // Focus the previous input
        event.preventDefault();
        focusPrev(index);
        break;
      case 'ArrowRight':
        // Focus the next input
        event.preventDefault();
        focusNext(index);
        break;
      case 'Home':
        // Focus the first input
        event.preventDefault();
        focusInput(0);
        break;
      case 'End':
        // Focus the last input
        event.preventDefault();
        focusInput(length - 1);
        break;
    }
  }, [
    onKeyDown, 
    focusPrevOnBackspace, 
    values, 
    setValue, 
    focusPrev, 
    focusNext, 
    focusInput, 
    length
  ]);
  
  // Handle focus events
  const handleFocus = useCallback((index: number, event: React.FocusEvent<HTMLInputElement>) => {
    setFocusedIndex(index);
    
    // Call onFocus callback
    if (onFocus) {
      onFocus(index, event);
    }
  }, [onFocus]);
  
  // Handle blur events
  const handleBlur = useCallback((index: number, event: React.FocusEvent<HTMLInputElement>) => {
    setFocusedIndex(-1);
    
    // Call onBlur callback
    if (onBlur) {
      onBlur(index, event);
    }
  }, [onBlur]);
  
  // Handle paste events
  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    // Call onPaste callback
    if (onPaste) {
      onPaste(event);
    }
    
    // If the event is prevented, do nothing
    if (event.defaultPrevented) {
      return;
    }
    
    // Get the pasted text
    const pastedText = event.clipboardData.getData('text/plain');
    
    // If the pasted text is empty, do nothing
    if (!pastedText) {
      return;
    }
    
    // Filter the pasted text to only include characters that match the pattern
    let filteredText = pastedText;
    if (pattern) {
      const regex = new RegExp(pattern, 'g');
      const matches = pastedText.match(regex);
      filteredText = matches ? matches.join('') : '';
    }
    
    // Update the value
    setValue(filteredText);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = values.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    focusInput(focusIndex);
    
    // Prevent the default paste behavior
    event.preventDefault();
  }, [onPaste, pattern, setValue, values, length, focusInput]);
  
  // Get props for the pin input container element
  const getPinInputProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      id: pinInputId,
      role: 'group',
      'aria-labelledby': props?.['aria-labelledby'],
      'aria-label': props?.['aria-label'] || 'Pin input',
      ...(disabled && { 'data-disabled': '' }),
      ...(readOnly && { 'data-readonly': '' }),
      ...(required && { 'data-required': '' }),
      ...(value.length === length && { 'data-complete': '' }),
    } as React.HTMLAttributes<E>;
  }, [pinInputId, disabled, readOnly, required, value.length, length]);
  
  // Get props for an individual input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    index: number,
    props?: React.InputHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.InputHTMLAttributes<E> & { ref: React.RefCallback<E> } => {
    return {
      ...props,
      ref: mergeRefs(inputRefs[index] as React.Ref<E>, props?.ref),
      id: `${pinInputId}-${index}`,
      type,
      inputMode: type === 'number' ? 'numeric' : 'text',
      pattern: pattern,
      value: values[index],
      placeholder,
      autoComplete: 'one-time-code',
      autoCorrect: 'off',
      spellCheck: false,
      'aria-label': `${props?.['aria-label'] || `Digit ${index + 1}`}`,
      disabled,
      readOnly,
      required,
      onChange: (event: React.ChangeEvent<E>) => {
        handleChange(index, event as unknown as React.ChangeEvent<HTMLInputElement>);
        props?.onChange?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleKeyDown(index, event as unknown as React.KeyboardEvent<HTMLInputElement>);
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        handleFocus(index, event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        handleBlur(index, event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onBlur?.(event);
      },
      onPaste: (event: React.ClipboardEvent<E>) => {
        handlePaste(event as unknown as React.ClipboardEvent<HTMLInputElement>);
        props?.onPaste?.(event);
      },
      ...(disabled && { 'data-disabled': '' }),
      ...(readOnly && { 'data-readonly': '' }),
      ...(required && { 'data-required': '' }),
      ...(values[index] && { 'data-filled': '' }),
      ...(focusedIndex === index && { 'data-focused': '' }),
      'data-index': index,
    } as React.InputHTMLAttributes<E> & { ref: React.RefCallback<E> };
  }, [
    inputRefs,
    pinInputId,
    type,
    pattern,
    values,
    placeholder,
    disabled,
    readOnly,
    required,
    focusedIndex,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handlePaste,
  ]);
  
  return {
    value,
    values,
    disabled,
    readOnly,
    required,
    length,
    type,
    mask,
    id: pinInputId,
    name,
    placeholder,
    separator,
    focusedIndex,
    inputRefs,
    setValue,
    clear,
    focusInput,
    focusNext,
    focusPrev,
    getPinInputProps,
    getInputProps,
  };
}

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
