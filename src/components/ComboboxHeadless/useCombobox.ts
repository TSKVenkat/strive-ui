import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface ComboboxOption {
  /**
   * Option value
   */
  value: string;
  /**
   * Option label
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Option group
   */
  group?: string;
  /**
   * Additional data
   */
  [key: string]: any;
}

export interface UseComboboxProps {
  /**
   * Options for the combobox
   */
  options: ComboboxOption[];
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Default input value (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Controlled input value
   */
  inputValue?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string, option: ComboboxOption | null) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;
  /**
   * Whether the combobox is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the combobox is required
   */
  required?: boolean;
  /**
   * ID for the combobox element
   */
  id?: string;
  /**
   * Name attribute for the combobox
   */
  name?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether to allow free text input
   */
  allowCustomValue?: boolean;
  /**
   * Whether to open the dropdown on focus
   */
  openOnFocus?: boolean;
  /**
   * Whether to clear the input when an option is selected
   */
  clearOnSelect?: boolean;
  /**
   * Whether to select the first option when the dropdown is opened
   */
  selectOnFocus?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: ComboboxOption, inputValue: string) => boolean;
  /**
   * Callback when dropdown is opened
   */
  onOpen?: () => void;
  /**
   * Callback when dropdown is closed
   */
  onClose?: () => void;
  /**
   * Callback when an option is highlighted
   */
  onHighlight?: (option: ComboboxOption | null) => void;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface UseComboboxReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Current input value
   */
  inputValue: string;
  /**
   * Selected option
   */
  selectedOption: ComboboxOption | null;
  /**
   * Highlighted option
   */
  highlightedOption: ComboboxOption | null;
  /**
   * Filtered options
   */
  filteredOptions: ComboboxOption[];
  /**
   * Whether the dropdown is open
   */
  isOpen: boolean;
  /**
   * Whether the combobox is disabled
   */
  disabled: boolean;
  /**
   * Whether the combobox is read-only
   */
  readOnly: boolean;
  /**
   * Whether the combobox is required
   */
  required: boolean;
  /**
   * Whether the input is focused
   */
  focused: boolean;
  /**
   * Combobox ID
   */
  id: string;
  /**
   * Input ID
   */
  inputId: string;
  /**
   * Listbox ID
   */
  listboxId: string;
  /**
   * Combobox name
   */
  name: string | undefined;
  /**
   * Placeholder text
   */
  placeholder: string | undefined;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Reference to the listbox element
   */
  listboxRef: React.RefObject<HTMLUListElement>;
  /**
   * Open the dropdown
   */
  open: () => void;
  /**
   * Close the dropdown
   */
  close: () => void;
  /**
   * Toggle the dropdown
   */
  toggle: () => void;
  /**
   * Set the value
   */
  setValue: (value: string) => void;
  /**
   * Set the input value
   */
  setInputValue: (value: string) => void;
  /**
   * Select an option
   */
  selectOption: (option: ComboboxOption) => void;
  /**
   * Highlight an option
   */
  highlightOption: (option: ComboboxOption | null) => void;
  /**
   * Highlight the next option
   */
  highlightNextOption: () => void;
  /**
   * Highlight the previous option
   */
  highlightPrevOption: () => void;
  /**
   * Focus the input
   */
  focus: () => void;
  /**
   * Blur the input
   */
  blur: () => void;
  /**
   * Clear the input and value
   */
  clear: () => void;
  /**
   * Get props for the combobox container element
   */
  getComboboxProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for the toggle button element
   */
  getToggleButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the clear button element
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the listbox element
   */
  getListboxProps: <E extends HTMLUListElement = HTMLUListElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for an option element
   */
  getOptionProps: <E extends HTMLLIElement = HTMLLIElement>(
    option: ComboboxOption,
    props?: React.LiHTMLAttributes<E>
  ) => React.LiHTMLAttributes<E>;
  /**
   * Get props for a group element
   */
  getGroupProps: <E extends HTMLElement = HTMLElement>(
    group: string,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
}

/**
 * Hook for creating combobox functionality.
 */
export function useCombobox({
  options,
  defaultValue = '',
  defaultInputValue = '',
  value: controlledValue,
  inputValue: controlledInputValue,
  onChange,
  onInputChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  placeholder = 'Select an option',
  allowCustomValue = false,
  openOnFocus = true,
  clearOnSelect = false,
  selectOnFocus = false,
  filterOptions = true,
  filterFunction,
  onOpen,
  onClose,
  onHighlight,
  onFocus,
  onBlur,
}: UseComboboxProps): UseComboboxReturn {
  // Generate unique IDs
  const generatedId = useId();
  const comboboxId = id || `combobox-${generatedId}`;
  const inputId = `${comboboxId}-input`;
  const listboxId = `${comboboxId}-listbox`;
  
  // State for combobox
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [internalInputValue, setInternalInputValue] = useState<string>(defaultInputValue || defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const inputValue = controlledInputValue !== undefined ? controlledInputValue : internalInputValue;
  
  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  
  // Compute selected option
  const selectedOption = options.find(option => option.value === value) || null;
  
  // Filter options based on input value
  const filteredOptions = filterOptions
    ? options.filter(option => {
        if (filterFunction) {
          return filterFunction(option, inputValue);
        }
        return option.label.toLowerCase().includes(inputValue.toLowerCase());
      })
    : options;
  
  // Compute highlighted option
  const highlightedOption = highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
    ? filteredOptions[highlightedIndex]
    : null;
  
  // Reset highlighted index when filtered options change
  useEffect(() => {
    if (isOpen) {
      if (selectOnFocus && filteredOptions.length > 0) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(-1);
      }
    }
  }, [filteredOptions, isOpen, selectOnFocus]);
  
  // Open the dropdown
  const open = useCallback(() => {
    if (!isOpen && !disabled && !readOnly) {
      setIsOpen(true);
      if (onOpen) {
        onOpen();
      }
    }
  }, [isOpen, disabled, readOnly, onOpen]);
  
  // Close the dropdown
  const close = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      setHighlightedIndex(-1);
      if (onClose) {
        onClose();
      }
    }
  }, [isOpen, onClose]);
  
  // Toggle the dropdown
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Set the value
  const setValue = useCallback((newValue: string) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      const option = options.find(opt => opt.value === newValue) || null;
      onChange(newValue, option);
    }
  }, [disabled, readOnly, controlledValue, onChange, options]);
  
  // Set the input value
  const setInputValue = useCallback((newInputValue: string) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledInputValue === undefined) {
      setInternalInputValue(newInputValue);
    }
    
    // Call onInputChange callback
    if (onInputChange) {
      onInputChange(newInputValue);
    }
    
    // If allowCustomValue is true, also update the value
    if (allowCustomValue) {
      setValue(newInputValue);
    }
  }, [
    disabled, 
    readOnly, 
    controlledInputValue, 
    onInputChange, 
    allowCustomValue, 
    setValue
  ]);
  
  // Select an option
  const selectOption = useCallback((option: ComboboxOption) => {
    if (disabled || readOnly || option.disabled) {
      return;
    }
    
    // Update value
    setValue(option.value);
    
    // Update input value
    if (clearOnSelect) {
      setInputValue('');
    } else {
      setInputValue(option.label);
    }
    
    // Close the dropdown
    close();
    
    // Focus the input
    focus();
  }, [
    disabled, 
    readOnly, 
    setValue, 
    setInputValue, 
    clearOnSelect, 
    close
  ]);
  
  // Highlight an option
  const highlightOption = useCallback((option: ComboboxOption | null) => {
    if (!option) {
      setHighlightedIndex(-1);
      if (onHighlight) {
        onHighlight(null);
      }
      return;
    }
    
    const index = filteredOptions.findIndex(opt => opt.value === option.value);
    if (index >= 0) {
      setHighlightedIndex(index);
      if (onHighlight) {
        onHighlight(option);
      }
      
      // Scroll the option into view
      if (listboxRef.current) {
        const optionElement = listboxRef.current.children[index] as HTMLElement;
        if (optionElement) {
          const listboxRect = listboxRef.current.getBoundingClientRect();
          const optionRect = optionElement.getBoundingClientRect();
          
          if (optionRect.bottom > listboxRect.bottom) {
            listboxRef.current.scrollTop += optionRect.bottom - listboxRect.bottom;
          } else if (optionRect.top < listboxRect.top) {
            listboxRef.current.scrollTop -= listboxRect.top - optionRect.top;
          }
        }
      }
    }
  }, [filteredOptions, onHighlight]);
  
  // Highlight the next option
  const highlightNextOption = useCallback(() => {
    if (filteredOptions.length === 0) {
      return;
    }
    
    const nextIndex = highlightedIndex >= filteredOptions.length - 1
      ? 0
      : highlightedIndex + 1;
    
    // Skip disabled options
    let index = nextIndex;
    while (filteredOptions[index].disabled) {
      index = index >= filteredOptions.length - 1 ? 0 : index + 1;
      if (index === nextIndex) {
        // All options are disabled
        return;
      }
    }
    
    setHighlightedIndex(index);
    if (onHighlight) {
      onHighlight(filteredOptions[index]);
    }
    
    // Scroll the option into view
    if (listboxRef.current) {
      const optionElement = listboxRef.current.children[index] as HTMLElement;
      if (optionElement) {
        const listboxRect = listboxRef.current.getBoundingClientRect();
        const optionRect = optionElement.getBoundingClientRect();
        
        if (optionRect.bottom > listboxRect.bottom) {
          listboxRef.current.scrollTop += optionRect.bottom - listboxRect.bottom;
        }
      }
    }
  }, [filteredOptions, highlightedIndex, onHighlight]);
  
  // Highlight the previous option
  const highlightPrevOption = useCallback(() => {
    if (filteredOptions.length === 0) {
      return;
    }
    
    const prevIndex = highlightedIndex <= 0
      ? filteredOptions.length - 1
      : highlightedIndex - 1;
    
    // Skip disabled options
    let index = prevIndex;
    while (filteredOptions[index].disabled) {
      index = index <= 0 ? filteredOptions.length - 1 : index - 1;
      if (index === prevIndex) {
        // All options are disabled
        return;
      }
    }
    
    setHighlightedIndex(index);
    if (onHighlight) {
      onHighlight(filteredOptions[index]);
    }
    
    // Scroll the option into view
    if (listboxRef.current) {
      const optionElement = listboxRef.current.children[index] as HTMLElement;
      if (optionElement) {
        const listboxRect = listboxRef.current.getBoundingClientRect();
        const optionRect = optionElement.getBoundingClientRect();
        
        if (optionRect.top < listboxRect.top) {
          listboxRef.current.scrollTop -= listboxRect.top - optionRect.top;
        }
      }
    }
  }, [filteredOptions, highlightedIndex, onHighlight]);
  
  // Focus the input
  const focus = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);
  
  // Blur the input
  const blur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  
  // Clear the input and value
  const clear = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    setValue('');
    setInputValue('');
    focus();
  }, [disabled, readOnly, setValue, setInputValue, focus]);
  
  // Handle input focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    
    if (openOnFocus) {
      open();
    }
    
    if (onFocus) {
      onFocus(event);
    }
  }, [openOnFocus, open, onFocus]);
  
  // Handle input blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    
    // If allowCustomValue is false, reset input value to selected option's label
    if (!allowCustomValue && selectedOption) {
      setInputValue(selectedOption.label);
    } else if (!allowCustomValue && !selectedOption) {
      setInputValue('');
    }
    
    if (onBlur) {
      onBlur(event);
    }
    
    // Close the dropdown after a short delay to allow for option selection
    setTimeout(() => {
      close();
    }, 100);
  }, [allowCustomValue, selectedOption, setInputValue, onBlur, close]);
  
  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    
    // Open the dropdown if the input is not empty
    if (newInputValue.trim() !== '') {
      open();
    } else {
      // If the input is empty and allowCustomValue is true, clear the value
      if (allowCustomValue) {
        setValue('');
      }
    }
  }, [setInputValue, open, allowCustomValue, setValue]);
  
  // Handle key down events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          open();
        } else {
          highlightNextOption();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          open();
        } else {
          highlightPrevOption();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedOption) {
          selectOption(highlightedOption);
        } else if (allowCustomValue) {
          close();
        }
        break;
      case 'Escape':
        event.preventDefault();
        if (isOpen) {
          close();
        } else {
          clear();
        }
        break;
      case 'Tab':
        if (isOpen) {
          close();
        }
        break;
    }
  }, [
    isOpen, 
    open, 
    close, 
    highlightNextOption, 
    highlightPrevOption, 
    highlightedOption, 
    selectOption, 
    allowCustomValue, 
    clear
  ]);
  
  // Get props for the combobox container element
  const getComboboxProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      id: comboboxId,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-owns': listboxId,
      'aria-haspopup': 'listbox',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-open': isOpen ? '' : undefined,
      'data-has-value': value ? '' : undefined,
    };
  }, [comboboxId, listboxId, isOpen, disabled, readOnly, required, value]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(inputRef, props?.ref),
      id: inputId,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-controls': listboxId,
      'aria-expanded': isOpen,
      'aria-activedescendant': highlightedOption 
        ? `${listboxId}-option-${highlightedOption.value}` 
        : undefined,
      autoComplete: 'off',
      type: 'text',
      value: inputValue,
      name,
      placeholder,
      disabled,
      readOnly,
      required,
      onChange: (event: React.ChangeEvent<E>) => {
        handleInputChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        props?.onChange?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        handleFocus(event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        handleBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onBlur?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleKeyDown(event as unknown as React.KeyboardEvent<HTMLInputElement>);
        props?.onKeyDown?.(event);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-open': isOpen ? '' : undefined,
      'data-has-value': value ? '' : undefined,
    };
  }, [
    inputId, 
    listboxId, 
    isOpen, 
    highlightedOption, 
    inputValue, 
    name, 
    placeholder, 
    disabled, 
    readOnly, 
    required, 
    value, 
    handleInputChange, 
    handleFocus, 
    handleBlur, 
    handleKeyDown
  ]);
  
  // Get props for the toggle button element
  const getToggleButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      tabIndex: -1,
      'aria-label': isOpen ? 'Close' : 'Open',
      'aria-controls': listboxId,
      'aria-expanded': isOpen,
      disabled: disabled || readOnly,
      onClick: (event: React.MouseEvent<E>) => {
        event.preventDefault();
        toggle();
        props?.onClick?.(event);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-open': isOpen ? '' : undefined,
    };
  }, [listboxId, isOpen, disabled, readOnly, toggle]);
  
  // Get props for the clear button element
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      tabIndex: -1,
      'aria-label': 'Clear',
      disabled: disabled || readOnly || !value,
      onClick: (event: React.MouseEvent<E>) => {
        event.preventDefault();
        clear();
        props?.onClick?.(event);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-visible': value ? '' : undefined,
    };
  }, [disabled, readOnly, value, clear]);
  
  // Get props for the listbox element
  const getListboxProps = useCallback(<E extends HTMLUListElement = HTMLUListElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(listboxRef, props?.ref),
      id: listboxId,
      role: 'listbox',
      'aria-labelledby': inputId,
      'data-open': isOpen ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      style: {
        ...props?.style,
        display: isOpen ? 'block' : 'none',
      },
    };
  }, [listboxId, inputId, isOpen, disabled, readOnly]);
  
  // Get props for an option element
  const getOptionProps = useCallback(<E extends HTMLLIElement = HTMLLIElement>(
    option: ComboboxOption,
    props?: React.LiHTMLAttributes<E>
  ): React.LiHTMLAttributes<E> => {
    const isSelected = option.value === value;
    const isHighlighted = option === highlightedOption;
    
    return {
      ...props,
      id: `${listboxId}-option-${option.value}`,
      role: 'option',
      'aria-selected': isSelected,
      'aria-disabled': option.disabled,
      tabIndex: option.disabled ? -1 : 0,
      onClick: (event: React.MouseEvent<E>) => {
        if (!option.disabled) {
          selectOption(option);
        }
        props?.onClick?.(event);
      },
      onMouseEnter: (event: React.MouseEvent<E>) => {
        if (!option.disabled) {
          highlightOption(option);
        }
        props?.onMouseEnter?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!option.disabled) {
            selectOption(option);
          }
        }
        props?.onKeyDown?.(event);
      },
      'data-selected': isSelected ? '' : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
      'data-disabled': option.disabled ? '' : undefined,
    };
  }, [listboxId, value, highlightedOption, selectOption, highlightOption]);
  
  // Get props for a group element
  const getGroupProps = useCallback(<E extends HTMLElement = HTMLElement>(
    group: string,
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      id: `${listboxId}-group-${group.replace(/\s+/g, '-').toLowerCase()}`,
      role: 'group',
      'aria-label': group,
    };
  }, [listboxId]);
  
  return {
    value,
    inputValue,
    selectedOption,
    highlightedOption,
    filteredOptions,
    isOpen,
    disabled,
    readOnly,
    required,
    focused,
    id: comboboxId,
    inputId,
    listboxId,
    name,
    placeholder,
    inputRef,
    listboxRef,
    open,
    close,
    toggle,
    setValue,
    setInputValue,
    selectOption,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    focus,
    blur,
    clear,
    getComboboxProps,
    getInputProps,
    getToggleButtonProps,
    getClearButtonProps,
    getListboxProps,
    getOptionProps,
    getGroupProps,
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
