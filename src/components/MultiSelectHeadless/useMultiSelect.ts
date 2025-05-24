import { useState, useCallback, useRef, useId, useEffect, useMemo } from 'react';

export interface SelectOption {
  /**
   * Unique value for the option
   */
  value: string;
  /**
   * Display label for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Optional group the option belongs to
   */
  group?: string;
  /**
   * Any additional data
   */
  [key: string]: any;
}

export interface UseMultiSelectProps {
  /**
   * Array of options to select from
   */
  options: SelectOption[];
  /**
   * Default selected values (uncontrolled)
   */
  defaultValue?: string[];
  /**
   * Controlled selected values
   */
  value?: string[];
  /**
   * Callback when selection changes
   */
  onChange?: (value: string[]) => void;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the select is required
   */
  required?: boolean;
  /**
   * ID for the select element
   */
  id?: string;
  /**
   * Name attribute for the select
   */
  name?: string;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Whether to close the dropdown when an option is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: SelectOption, inputValue: string) => boolean;
  /**
   * Maximum number of items that can be selected
   */
  maxSelectedItems?: number;
  /**
   * Whether to show a search input
   */
  searchable?: boolean;
  /**
   * Default input value for search (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled input value for search
   */
  inputValue?: string;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Callback when dropdown opens
   */
  onOpen?: () => void;
  /**
   * Callback when dropdown closes
   */
  onClose?: () => void;
  /**
   * Callback when an option is highlighted
   */
  onHighlight?: (option: SelectOption | null) => void;
  /**
   * Callback when the select is focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when the select is blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
}

export interface UseMultiSelectReturn {
  /**
   * Currently selected values
   */
  selectedValues: string[];
  /**
   * Currently selected options
   */
  selectedOptions: SelectOption[];
  /**
   * Whether the dropdown is open
   */
  isOpen: boolean;
  /**
   * Currently highlighted option
   */
  highlightedOption: SelectOption | null;
  /**
   * Input value for search
   */
  inputValue: string;
  /**
   * Filtered options based on input value and selected options
   */
  filteredOptions: SelectOption[];
  /**
   * Whether the select is disabled
   */
  disabled: boolean;
  /**
   * Whether the select is read-only
   */
  readOnly: boolean;
  /**
   * Whether the select is required
   */
  required: boolean;
  /**
   * Whether the select is focused
   */
  focused: boolean;
  /**
   * ID for the select element
   */
  id: string;
  /**
   * Name attribute for the select
   */
  name: string | undefined;
  /**
   * Placeholder text
   */
  placeholder: string;
  /**
   * Reference to the trigger element
   */
  triggerRef: React.RefObject<HTMLButtonElement>;
  /**
   * Reference to the dropdown element
   */
  dropdownRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
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
   * Select an option
   */
  selectOption: (option: SelectOption | string) => void;
  /**
   * Deselect an option
   */
  deselectOption: (option: SelectOption | string) => void;
  /**
   * Toggle selection of an option
   */
  toggleOption: (option: SelectOption | string) => void;
  /**
   * Clear all selected options
   */
  clearSelection: () => void;
  /**
   * Highlight an option
   */
  highlightOption: (option: SelectOption | null) => void;
  /**
   * Highlight the next option
   */
  highlightNextOption: () => void;
  /**
   * Highlight the previous option
   */
  highlightPrevOption: () => void;
  /**
   * Set the input value
   */
  setInputValue: (value: string) => void;
  /**
   * Focus the trigger element
   */
  focus: () => void;
  /**
   * Blur the trigger element
   */
  blur: () => void;
  /**
   * Get props for the trigger element
   */
  getTriggerProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the dropdown element
   */
  getDropdownProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for an option element
   */
  getOptionProps: <E extends HTMLDivElement = HTMLDivElement>(
    option: SelectOption,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for the clear button
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for a selected item element
   */
  getSelectedItemProps: <E extends HTMLDivElement = HTMLDivElement>(
    option: SelectOption,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for a selected item remove button
   */
  getSelectedItemRemoveProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    option: SelectOption,
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating multi-select functionality.
 */
export function useMultiSelect({
  options = [],
  defaultValue = [],
  value: controlledValue,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  placeholder = 'Select options...',
  closeOnSelect = false,
  filterOptions = true,
  filterFunction,
  maxSelectedItems,
  searchable = false,
  defaultInputValue = '',
  inputValue: controlledInputValue,
  onInputChange,
  onOpen,
  onClose,
  onHighlight,
  onFocus,
  onBlur,
}: UseMultiSelectProps = {}): UseMultiSelectReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const selectId = id || `multi-select-${generatedId}`;
  
  // State for multi-select
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedOption, setHighlightedOption] = useState<SelectOption | null>(null);
  const [internalInputValue, setInternalInputValue] = useState<string>(defaultInputValue);
  const [focused, setFocused] = useState<boolean>(false);
  
  // Use controlled or uncontrolled values
  const selectedValues = controlledValue !== undefined ? controlledValue : internalSelectedValues;
  const inputValue = controlledInputValue !== undefined ? controlledInputValue : internalInputValue;
  
  // Refs for DOM elements
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Get selected options based on selected values
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  
  // Filter options based on input value and selected options
  const filteredOptions = useMemo(() => {
    let filtered = options;
    
    // Filter out options that are already selected
    if (maxSelectedItems !== undefined && selectedValues.length >= maxSelectedItems) {
      filtered = filtered.filter(option => selectedValues.includes(option.value));
    }
    
    // Filter options based on input value
    if (filterOptions && inputValue) {
      if (filterFunction) {
        filtered = filtered.filter(option => filterFunction(option, inputValue));
      } else {
        const lowerInputValue = inputValue.toLowerCase();
        filtered = filtered.filter(option => 
          option.label.toLowerCase().includes(lowerInputValue) || 
          option.value.toLowerCase().includes(lowerInputValue)
        );
      }
    }
    
    return filtered;
  }, [options, selectedValues, inputValue, filterOptions, filterFunction, maxSelectedItems]);
  
  // Open the dropdown
  const open = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    setIsOpen(true);
    
    // Reset highlighted option when opening
    if (filteredOptions.length > 0) {
      setHighlightedOption(filteredOptions[0]);
    } else {
      setHighlightedOption(null);
    }
    
    // Call onOpen callback
    if (onOpen) {
      onOpen();
    }
  }, [disabled, readOnly, filteredOptions, onOpen]);
  
  // Close the dropdown
  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedOption(null);
    
    // Reset input value when closing if searchable
    if (searchable && controlledInputValue === undefined) {
      setInternalInputValue('');
    }
    
    // Call onClose callback
    if (onClose) {
      onClose();
    }
  }, [searchable, controlledInputValue, onClose]);
  
  // Toggle the dropdown
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Select an option
  const selectOption = useCallback((optionOrValue: SelectOption | string) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Get the option value
    const value = typeof optionOrValue === 'string' ? optionOrValue : optionOrValue.value;
    
    // Get the option
    const option = typeof optionOrValue === 'string' 
      ? options.find(opt => opt.value === optionOrValue)
      : optionOrValue;
    
    // If the option doesn't exist or is disabled, return
    if (!option || option.disabled) {
      return;
    }
    
    // Check if we've reached the maximum number of selected items
    if (maxSelectedItems !== undefined && selectedValues.length >= maxSelectedItems && !selectedValues.includes(value)) {
      return;
    }
    
    // If the option is already selected, return
    if (selectedValues.includes(value)) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalSelectedValues(prev => [...prev, value]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([...selectedValues, value]);
    }
    
    // Close dropdown if closeOnSelect is true
    if (closeOnSelect) {
      close();
    }
  }, [disabled, readOnly, options, selectedValues, maxSelectedItems, controlledValue, onChange, closeOnSelect, close]);
  
  // Deselect an option
  const deselectOption = useCallback((optionOrValue: SelectOption | string) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Get the option value
    const value = typeof optionOrValue === 'string' ? optionOrValue : optionOrValue.value;
    
    // If the option is not selected, return
    if (!selectedValues.includes(value)) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalSelectedValues(prev => prev.filter(v => v !== value));
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(selectedValues.filter(v => v !== value));
    }
  }, [disabled, readOnly, selectedValues, controlledValue, onChange]);
  
  // Toggle selection of an option
  const toggleOption = useCallback((optionOrValue: SelectOption | string) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Get the option value
    const value = typeof optionOrValue === 'string' ? optionOrValue : optionOrValue.value;
    
    // Toggle selection
    if (selectedValues.includes(value)) {
      deselectOption(value);
    } else {
      selectOption(value);
    }
  }, [disabled, readOnly, selectedValues, selectOption, deselectOption]);
  
  // Clear all selected options
  const clearSelection = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalSelectedValues([]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([]);
    }
  }, [disabled, readOnly, controlledValue, onChange]);
  
  // Highlight an option
  const highlightOption = useCallback((option: SelectOption | null) => {
    setHighlightedOption(option);
    
    // Call onHighlight callback
    if (onHighlight && option) {
      onHighlight(option);
    }
  }, [onHighlight]);
  
  // Highlight the next option
  const highlightNextOption = useCallback(() => {
    if (filteredOptions.length === 0) {
      return;
    }
    
    if (!highlightedOption) {
      highlightOption(filteredOptions[0]);
      return;
    }
    
    const currentIndex = filteredOptions.findIndex(option => option.value === highlightedOption.value);
    const nextIndex = (currentIndex + 1) % filteredOptions.length;
    highlightOption(filteredOptions[nextIndex]);
    
    // Scroll the option into view
    const optionElement = optionRefs.current.get(filteredOptions[nextIndex].value);
    if (optionElement && dropdownRef.current) {
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  }, [filteredOptions, highlightedOption, highlightOption]);
  
  // Highlight the previous option
  const highlightPrevOption = useCallback(() => {
    if (filteredOptions.length === 0) {
      return;
    }
    
    if (!highlightedOption) {
      highlightOption(filteredOptions[filteredOptions.length - 1]);
      return;
    }
    
    const currentIndex = filteredOptions.findIndex(option => option.value === highlightedOption.value);
    const prevIndex = (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
    highlightOption(filteredOptions[prevIndex]);
    
    // Scroll the option into view
    const optionElement = optionRefs.current.get(filteredOptions[prevIndex].value);
    if (optionElement && dropdownRef.current) {
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  }, [filteredOptions, highlightedOption, highlightOption]);
  
  // Set the input value
  const setInputValueInternal = useCallback((newValue: string) => {
    // Update internal state for uncontrolled component
    if (controlledInputValue === undefined) {
      setInternalInputValue(newValue);
    }
    
    // Call onInputChange callback
    if (onInputChange) {
      onInputChange(newValue);
    }
    
    // Open the dropdown if it's not already open and the input has a value
    if (!isOpen && newValue) {
      open();
    }
  }, [controlledInputValue, onInputChange, isOpen, open]);
  
  // Focus the trigger element
  const focus = useCallback(() => {
    if (triggerRef.current && !disabled) {
      triggerRef.current.focus();
    }
  }, [disabled]);
  
  // Blur the trigger element
  const blur = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.blur();
    }
  }, []);
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);
  
  // Handle escape key to close the dropdown
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, close]);
  
  // Helper function to merge refs
  const mergeRefs = <T,>(...refs: (React.Ref<T> | undefined)[]) => {
    return (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref && 'current' in ref) {
          (ref as React.MutableRefObject<T>).current = value;
        }
      });
    };
  };
  
  // Get props for the trigger element
  const getTriggerProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(triggerRef, props?.ref as React.Ref<E>),
      id: `${selectId}-trigger`,
      type: 'button',
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
      'aria-controls': `${selectId}-dropdown`,
      'aria-labelledby': props?.['aria-labelledby'],
      'aria-label': props?.['aria-label'],
      disabled: disabled || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        if (!readOnly) {
          toggle();
        }
        props?.onClick?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (readOnly) {
          return;
        }
        
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (!isOpen) {
              open();
            } else if (highlightedOption) {
              toggleOption(highlightedOption);
            }
            break;
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
          case 'Home':
            if (isOpen && filteredOptions.length > 0) {
              event.preventDefault();
              highlightOption(filteredOptions[0]);
            }
            break;
          case 'End':
            if (isOpen && filteredOptions.length > 0) {
              event.preventDefault();
              highlightOption(filteredOptions[filteredOptions.length - 1]);
            }
            break;
        }
        
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        setFocused(true);
        props?.onFocus?.(event);
        if (onFocus) {
          onFocus(event as unknown as React.FocusEvent);
        }
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setFocused(false);
        props?.onBlur?.(event);
        if (onBlur) {
          onBlur(event as unknown as React.FocusEvent);
        }
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-open': isOpen ? '' : undefined,
      'data-focused': focused ? '' : undefined,
      'data-empty': selectedValues.length === 0 ? '' : undefined,
    };
  }, [
    selectId,
    isOpen,
    disabled,
    readOnly,
    required,
    focused,
    selectedValues.length,
    toggle,
    open,
    highlightedOption,
    toggleOption,
    highlightNextOption,
    highlightPrevOption,
    filteredOptions,
    highlightOption,
    onFocus,
    onBlur,
  ]);
  
  // Get props for the dropdown element
  const getDropdownProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(dropdownRef, props?.ref as React.Ref<E>),
      id: `${selectId}-dropdown`,
      role: 'listbox',
      'aria-multiselectable': 'true',
      'aria-labelledby': `${selectId}-trigger`,
      tabIndex: -1,
      'data-open': isOpen ? '' : undefined,
      'data-empty': filteredOptions.length === 0 ? '' : undefined,
    };
  }, [selectId, isOpen, filteredOptions.length]);
  
  // Get props for an option element
  const getOptionProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    option: SelectOption,
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    const isSelected = selectedValues.includes(option.value);
    const isHighlighted = highlightedOption?.value === option.value;
    
    return {
      ...props,
      ref: (node: E | null) => {
        if (node) {
          optionRefs.current.set(option.value, node);
        } else {
          optionRefs.current.delete(option.value);
        }
        if (props?.ref) {
          if (typeof props.ref === 'function') {
            props.ref(node);
          } else {
            (props.ref as React.MutableRefObject<E | null>).current = node;
          }
        }
      },
      role: 'option',
      id: `${selectId}-option-${option.value}`,
      'aria-selected': isSelected,
      'aria-disabled': option.disabled,
      tabIndex: isHighlighted ? 0 : -1,
      onClick: (event: React.MouseEvent<E>) => {
        if (!option.disabled) {
          toggleOption(option);
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
        if (option.disabled) {
          return;
        }
        
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            toggleOption(option);
            break;
        }
        
        props?.onKeyDown?.(event);
      },
      'data-disabled': option.disabled ? '' : undefined,
      'data-selected': isSelected ? '' : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
    };
  }, [selectId, selectedValues, highlightedOption, toggleOption, highlightOption]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(inputRef, props?.ref as React.Ref<E>),
      id: `${selectId}-input`,
      role: 'searchbox',
      'aria-autocomplete': 'list',
      'aria-controls': `${selectId}-dropdown`,
      value: inputValue,
      disabled: disabled || props?.disabled,
      readOnly: readOnly || props?.readOnly,
      onChange: (event: React.ChangeEvent<E>) => {
        setInputValueInternal(event.target.value);
        props?.onChange?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        if (!isOpen) {
          open();
        }
        props?.onFocus?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            highlightNextOption();
            break;
          case 'ArrowUp':
            event.preventDefault();
            highlightPrevOption();
            break;
          case 'Enter':
            if (highlightedOption) {
              event.preventDefault();
              toggleOption(highlightedOption);
              if (closeOnSelect) {
                close();
              }
            }
            break;
          case 'Escape':
            event.preventDefault();
            close();
            break;
          case 'Tab':
            close();
            break;
        }
        
        props?.onKeyDown?.(event);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
    };
  }, [
    selectId,
    inputValue,
    disabled,
    readOnly,
    isOpen,
    open,
    setInputValueInternal,
    highlightNextOption,
    highlightPrevOption,
    highlightedOption,
    toggleOption,
    closeOnSelect,
    close,
  ]);
  
  // Get props for the clear button
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': 'Clear selection',
      disabled: disabled || readOnly || selectedValues.length === 0 || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        event.stopPropagation();
        clearSelection();
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || selectedValues.length === 0) ? '' : undefined,
    };
  }, [disabled, readOnly, selectedValues.length, clearSelection]);
  
  // Get props for a selected item element
  const getSelectedItemProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    option: SelectOption,
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      role: 'listitem',
      id: `${selectId}-selected-item-${option.value}`,
      'data-disabled': option.disabled ? '' : undefined,
    };
  }, [selectId]);
  
  // Get props for a selected item remove button
  const getSelectedItemRemoveProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    option: SelectOption,
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': `Remove ${option.label}`,
      disabled: disabled || readOnly || option.disabled || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        event.stopPropagation();
        deselectOption(option);
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || option.disabled) ? '' : undefined,
    };
  }, [disabled, readOnly, deselectOption]);
  
  return {
    selectedValues,
    selectedOptions,
    isOpen,
    highlightedOption,
    inputValue,
    filteredOptions,
    disabled,
    readOnly,
    required,
    focused,
    id: selectId,
    name,
    placeholder,
    triggerRef,
    dropdownRef,
    inputRef,
    open,
    close,
    toggle,
    selectOption,
    deselectOption,
    toggleOption,
    clearSelection,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    setInputValue: setInputValueInternal,
    focus,
    blur,
    getTriggerProps,
    getDropdownProps,
    getOptionProps,
    getInputProps,
    getClearButtonProps,
    getSelectedItemProps,
    getSelectedItemRemoveProps,
  };
}
