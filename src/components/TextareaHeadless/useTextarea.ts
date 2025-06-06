import { useState, useCallback, useRef, useId, useEffect, ChangeEvent } from 'react';

export interface UseTextareaProps {
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
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * Callback when textarea is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Callback when textarea is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  /**
   * Whether the textarea is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the textarea is required
   */
  required?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Maximum number of characters allowed
   */
  maxLength?: number;
  /**
   * Minimum number of characters required
   */
  minLength?: number;
  /**
   * Name attribute for the textarea
   */
  name?: string;
  /**
   * ID for the textarea element
   */
  id?: string;
  /**
   * Whether to automatically focus the textarea on mount
   */
  autoFocus?: boolean;
  /**
   * Number of rows to display
   */
  rows?: number;
  /**
   * Number of columns to display
   */
  cols?: number;
  /**
   * Whether to automatically resize the textarea based on content
   */
  autoResize?: boolean;
  /**
   * Minimum height of the textarea in pixels (for autoResize)
   */
  minHeight?: number;
  /**
   * Maximum height of the textarea in pixels (for autoResize)
   */
  maxHeight?: number;
  /**
   * Whether to show the character count
   */
  showCount?: boolean;
  /**
   * Whether to count characters or words
   */
  countType?: 'characters' | 'words';
}

export interface UseTextareaReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Whether the textarea is disabled
   */
  disabled: boolean;
  /**
   * Whether the textarea is read-only
   */
  readOnly: boolean;
  /**
   * Whether the textarea is required
   */
  required: boolean;
  /**
   * Whether the textarea is focused
   */
  focused: boolean;
  /**
   * Character count
   */
  charCount: number;
  /**
   * Word count
   */
  wordCount: number;
  /**
   * Maximum length
   */
  maxLength?: number;
  /**
   * Input ID
   */
  id: string;
  /**
   * Reference to the textarea element
   */
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  /**
   * Set the value
   */
  setValue: (value: string) => void;
  /**
   * Clear the value
   */
  clear: () => void;
  /**
   * Focus the textarea
   */
  focus: () => void;
  /**
   * Blur the textarea
   */
  blur: () => void;
  /**
   * Get props for the textarea element
   */
  getTextareaProps: <E extends HTMLTextAreaElement = HTMLTextAreaElement>(
    props?: React.TextareaHTMLAttributes<E>
  ) => React.TextareaHTMLAttributes<E>;
  /**
   * Get props for the label element
   */
  getLabelProps: <E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => React.LabelHTMLAttributes<E>;
}

/**
 * Hook for creating textarea functionality.
 * 
 * @example
 * ```jsx
 * const MyTextarea = ({ label, ...props }) => {
 *   const { 
 *     value,
 *     getTextareaProps,
 *     getLabelProps,
 *   } = useTextarea(props);
 *   
 *   return (
 *     <div>
 *       <label {...getLabelProps()}>{label}</label>
 *       <textarea {...getTextareaProps()} />
 *     </div>
 *   );
 * };
 * ```
 */
export function useTextarea({
  defaultValue = '',
  value: controlledValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  placeholder,
  maxLength,
  minLength,
  name,
  id,
  autoFocus,
  rows = 3,
  cols,
  autoResize = false,
  minHeight,
  maxHeight,
  showCount = false,
  countType = 'characters',
}: UseTextareaProps = {}): UseTextareaReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;
  
  // State for value
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // State for focus
  const [focused, setFocused] = useState<boolean>(false);
  
  // Ref for the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Calculate character and word counts
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  
  // Auto-resize the textarea when the value changes
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Set the height based on scrollHeight
      let newHeight = textarea.scrollHeight;
      
      // Apply min/max height constraints if provided
      if (minHeight !== undefined) {
        newHeight = Math.max(newHeight, minHeight);
      }
      
      if (maxHeight !== undefined) {
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, autoResize, minHeight, maxHeight]);
  
  // Auto-focus the textarea on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);
  
  // Set value
  const setValue = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // No onChange callback here since this is a programmatic change
  }, [controlledValue]);
  
  // Clear the value
  const clear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    
    if (onChange) {
      // Create a synthetic event
      const event = {
        target: {
          value: '',
          name,
        },
      } as ChangeEvent<HTMLTextAreaElement>;
      
      onChange('', event);
    }
  }, [controlledValue, onChange, name]);
  
  // Handle change
  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    if (onChange) {
      onChange(newValue, event);
    }
  }, [controlledValue, onChange]);
  
  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);
  
  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);
  
  // Focus the textarea
  const focus = useCallback(() => {
    textareaRef.current?.focus();
  }, []);
  
  // Blur the textarea
  const blur = useCallback(() => {
    textareaRef.current?.blur();
  }, []);
  
  // Get props for the textarea element
  const getTextareaProps = useCallback(<E extends HTMLTextAreaElement = HTMLTextAreaElement>(
    props?: React.TextareaHTMLAttributes<E>
  ): React.TextareaHTMLAttributes<E> => {
    return {
      ...props,
      id: textareaId,

      value,
      onChange: handleChange as unknown as React.ChangeEventHandler<E>,
      onFocus: handleFocus as unknown as React.FocusEventHandler<E>,
      onBlur: handleBlur as unknown as React.FocusEventHandler<E>,
      disabled,
      readOnly,
      required,
      placeholder,
      maxLength,
      minLength,
      name,
      rows,
      cols,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-invalid': props?.['aria-invalid'],
    };
  }, [
    textareaId,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    disabled,
    readOnly,
    required,
    placeholder,
    maxLength,
    minLength,
    name,
    rows,
    cols,
  ]);
  
  // Get props for the label element
  const getLabelProps = useCallback(<E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ): React.LabelHTMLAttributes<E> => {
    return {
      ...props,
      htmlFor: textareaId,
    };
  }, [textareaId]);
  
  return {
    value,
    disabled,
    readOnly,
    required,
    focused,
    charCount,
    wordCount,
    maxLength,
    id: textareaId,
    textareaRef,
    setValue,
    clear,
    focus,
    blur,
    getTextareaProps,
    getLabelProps,
  };
}
