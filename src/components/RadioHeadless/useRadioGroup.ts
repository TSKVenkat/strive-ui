import { useState, useCallback, useRef, useId, ChangeEvent } from 'react';

export interface UseRadioGroupProps {
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
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Whether the radio group is disabled
   */
  disabled?: boolean;
  /**
   * Whether the radio group is required
   */
  required?: boolean;
  /**
   * Name attribute for the radio inputs
   */
  name?: string;
  /**
   * ID for the radio group
   */
  id?: string;
  /**
   * Orientation of the radio group
   */
  orientation?: 'horizontal' | 'vertical';
}

export interface UseRadioGroupReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Whether the radio group is disabled
   */
  disabled: boolean;
  /**
   * Whether the radio group is required
   */
  required: boolean;
  /**
   * Name attribute for the radio inputs
   */
  name: string;
  /**
   * ID for the radio group
   */
  id: string;
  /**
   * Orientation of the radio group
   */
  orientation: 'horizontal' | 'vertical';
  /**
   * Set the value
   */
  setValue: (value: string) => void;
  /**
   * Get props for the radio group element
   */
  getRadioGroupProps: <E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for a radio input
   */
  getRadioProps: (
    radioValue: string,
    props?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'name' | 'checked' | 'onChange' | 'type'>
  ) => {
    value: string;
    name: string;
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    type: 'radio';
    disabled?: boolean;
    required?: boolean;
    'aria-checked': boolean;
    'aria-disabled'?: boolean;
    'aria-required'?: boolean;
  };
}

/**
 * Hook for creating radio group functionality.
 * 
 * @example
 * ```jsx
 * const MyRadioGroup = ({ options, ...props }) => {
 *   const { 
 *     getRadioGroupProps,
 *     getRadioProps,
 *   } = useRadioGroup(props);
 *   
 *   return (
 *     <div {...getRadioGroupProps()}>
 *       {options.map((option) => (
 *         <label key={option.value}>
 *           <input {...getRadioProps(option.value)} />
 *           {option.label}
 *         </label>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export function useRadioGroup({
  defaultValue = '',
  value: controlledValue,
  onChange,
  disabled = false,
  required = false,
  name: providedName,
  id,
  orientation = 'vertical',
}: UseRadioGroupProps = {}): UseRadioGroupReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const groupId = id || `radio-group-${generatedId}`;
  
  // Generate a unique name if none is provided
  const generatedName = useId();
  const name = providedName || `radio-group-${generatedName}`;
  
  // State for value
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Set value
  const setValue = useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // No onChange callback here since this is a programmatic change
  }, [controlledValue]);
  
  // Handle change
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    if (onChange) {
      onChange(newValue, event);
    }
  }, [controlledValue, onChange]);
  
  // Get props for the radio group element
  const getRadioGroupProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      id: groupId,
      role: 'radiogroup',
      'aria-orientation': orientation,
      'aria-disabled': disabled ? true : undefined,
      'aria-required': required ? true : undefined,
    };
  }, [groupId, orientation, disabled, required]);
  
  // Get props for a radio input
  const getRadioProps = useCallback((
    radioValue: string,
    props?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'name' | 'checked' | 'onChange' | 'type'>
  ) => {
    const isChecked = value === radioValue;
    
    return {
      ...props,
      value: radioValue,
      name,
      checked: isChecked,
      onChange: handleChange,
      type: 'radio' as const,
      disabled: disabled || props?.disabled,
      required: required || props?.required,
      'aria-checked': isChecked,
      'aria-disabled': disabled || props?.disabled ? true : undefined,
      'aria-required': required || props?.required ? true : undefined,
    };
  }, [value, name, handleChange, disabled, required]);
  
  return {
    value,
    disabled,
    required,
    name,
    id: groupId,
    orientation,
    setValue,
    getRadioGroupProps,
    getRadioProps,
  };
}
