import React, { useState, useCallback, useRef, useId, useEffect, useMemo } from 'react';

export interface AutocompleteOption {
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

// Add proper ref types
type ElementRef<T> = T extends React.ElementType
  ? React.ComponentPropsWithRef<T>['ref']
  : never;

type MergeElementProps<T extends React.ElementType, P> = Omit<React.ComponentPropsWithRef<T>, keyof P> & P;

interface BaseProps<T extends React.ElementType> {
  as?: T;
}

export type AutocompleteProps<T extends React.ElementType> = MergeElementProps<T, BaseProps<T>>;

export interface UseAutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  /**
   * Array of options to select from
   */
  options: T[];
  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Controlled selected value
   */
  value?: string;
  /**
   * Default input value (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled input value
   */
  inputValue?: string;
  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Whether the autocomplete is disabled
   */
  disabled?: boolean;
  /**
   * Whether the autocomplete is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the autocomplete is required
   */
  required?: boolean;
  /**
   * ID for the autocomplete element
   */
  id?: string;
  /**
   * Name attribute for the autocomplete
   */
  name?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether to allow custom values not in the options
   */
  allowCustomValue?: boolean;
  /**
   * Whether to open the dropdown when the input is focused
   */
  openOnFocus?: boolean;
  /**
   * Whether to clear the input value when an option is selected
   */
  clearOnSelect?: boolean;
  /**
   * Whether to select all text when the input is focused
   */
  selectOnFocus?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: AutocompleteOption, inputValue: string) => boolean;
  /**
   * Minimum number of characters to start showing suggestions
   */
  minChars?: number;
  /**
   * Maximum number of suggestions to show
   */
  maxSuggestions?: number;
  /**
   * Debounce time in milliseconds for input changes
   */
  debounceTime?: number;
  /**
   * Whether to auto-select the first option
   */
  autoSelectFirst?: boolean;
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
  onHighlight?: (option: AutocompleteOption | null) => void;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback to load options asynchronously
   */
  loadOptions?: (inputValue: string) => Promise<AutocompleteOption[]>;
}

export interface UseAutocompleteReturn<T extends AutocompleteOption = AutocompleteOption> {
  /**
   * Currently selected value
   */
  selectedValue: string;
  /**
   * Currently selected option
   */
  selectedOption: T | null;
  /**
   * Input value
   */
  inputValue: string;
  /**
   * Whether the dropdown is open
   */
  isOpen: boolean;
  /**
   * Currently highlighted option
   */
  highlightedOption: T | null;
  /**
   * Filtered options based on input value
   */
  filteredOptions: T[];
  /**
   * Whether options are being loaded asynchronously
   */
  loading: boolean;
  /**
   * Whether the autocomplete is disabled
   */
  disabled: boolean;
  /**
   * Whether the autocomplete is read-only
   */
  readOnly: boolean;
  /**
   * Whether the autocomplete is required
   */
  required: boolean;
  /**
   * Whether the autocomplete is focused
   */
  focused: boolean;
  /**
   * ID for the autocomplete element
   */
  id: string;
  /**
   * Name attribute for the autocomplete
   */
  name: string | undefined;
  /**
   * Placeholder text
   */
  placeholder: string;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Reference to the dropdown element
   */
  dropdownRef: React.RefObject<HTMLDivElement>;
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
  selectOption: (option: T) => void;
  /**
   * Clear the selection
   */
  clearSelection: () => void;
  /**
   * Highlight an option
   */
  highlightOption: (option: T | null) => void;
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
   * Focus the input
   */
  focus: () => void;
  /**
   * Blur the input
   */
  blur: () => void;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
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
    option: T,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the clear button
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating autocomplete functionality.
 */
export function useAutocomplete<T extends AutocompleteOption = AutocompleteOption>({
  options = [] as T[],
  defaultValue = '',
  value: controlledValue,
  defaultInputValue = '',
  inputValue: controlledInputValue,
  onChange,
  onInputChange,
  disabled = false,
  readOnly = false,
  required = false,
  id: externalId,
  name,
  placeholder = '',
  allowCustomValue = false,
  openOnFocus = false,
  clearOnSelect = false,
  selectOnFocus = false,
  filterOptions = true,
  filterFunction,
  minChars = 1,
  maxSuggestions,
  debounceTime = 200,
  autoSelectFirst = false,
  onOpen,
  onClose,
  onHighlight,
  onFocus,
  onBlur,
  loadOptions,
}: UseAutocompleteProps<T> = {} as UseAutocompleteProps<T>): UseAutocompleteReturn<T> {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const autocompleteId = externalId || `autocomplete-${generatedId}`;
  
  // State for autocomplete
  const [internalSelectedValue, setInternalSelectedValue] = useState<string>(defaultValue);
  const [internalInputValue, setInternalInputValue] = useState<string>(
    defaultInputValue || defaultValue
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [highlightedOption, setHighlightedOption] = useState<T | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [asyncOptions, setAsyncOptions] = useState<T[]>([]);
  
  // Use controlled or uncontrolled values
  const selectedValue = controlledValue !== undefined ? controlledValue : internalSelectedValue;
  const inputValue = controlledInputValue !== undefined ? controlledInputValue : internalInputValue;
  
  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get selected option based on selected value
  const selectedOptionMemo = useMemo(() => {
    return options.find(option => option.value === selectedValue) || null;
  }, [options, selectedValue]);
  
  // Update selected option from controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedOption(options.find(option => option.value === controlledValue) || null);
    }
  }, [controlledValue, options]);
  
  // Get all available options (including async options)
  const allOptions = useMemo(() => {
    return loadOptions ? asyncOptions : options;
  }, [loadOptions, asyncOptions, options]);
  
  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    if (!filterOptions || !inputValue || (minChars > 0 && inputValue.length < minChars)) {
      return maxSuggestions ? allOptions.slice(0, maxSuggestions) : allOptions;
    }
    
    let filtered: T[];
    
    if (filterFunction) {
      filtered = allOptions.filter(option => filterFunction(option, inputValue));
    } else {
      const lowerInputValue = inputValue.toLowerCase();
      filtered = allOptions.filter(option => 
        option.label.toLowerCase().includes(lowerInputValue) || 
        option.value.toLowerCase().includes(lowerInputValue)
      );
    }
    
    return maxSuggestions ? filtered.slice(0, maxSuggestions) : filtered;
  }, [allOptions, inputValue, filterOptions, filterFunction, minChars, maxSuggestions]);
  
  // Load options asynchronously
  const loadOptionsAsync = useCallback(async (value: string) => {
    if (!loadOptions) {
      return;
    }
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // If the input value is empty or too short, reset async options
    if (!value || (minChars > 0 && value.length < minChars)) {
      setAsyncOptions([]);
      setLoading(false);
      return;
    }
    
    // Debounce the loading of options
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const newOptions = await loadOptions(value);
        setAsyncOptions(newOptions as T[]);
      } catch (error) {
        console.error('Error loading options:', error);
        setAsyncOptions([]);
      } finally {
        setLoading(false);
      }
    }, debounceTime);
  }, [loadOptions, minChars, debounceTime]);
  
  // Open the dropdown
  const open = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    setIsOpen(true);
    
    // Auto-select first option if enabled
    if (autoSelectFirst && filteredOptions.length > 0) {
      setHighlightedOption(filteredOptions[0]);
    } else {
      setHighlightedOption(null);
    }
    
    // Call onOpen callback
    if (onOpen) {
      onOpen();
    }
  }, [disabled, readOnly, autoSelectFirst, filteredOptions, onOpen]);
  
  // Close the dropdown
  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedOption(null);
    
    // Call onClose callback
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  
  // Toggle the dropdown
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Select an option
  const selectOption = useCallback((option: T) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Get the option value
    const value = option.value;
    
    // Set selected option
    setSelectedOption(option);
    
    // If the option doesn't exist and custom values are not allowed, return
    if (!option && !allowCustomValue) {
      return;
    }
    
    // If the option exists and is disabled, return
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalSelectedValue(value);
    }
    
    // Clear input value if needed
    if (clearOnSelect) {
      setInputValueInternal('');
    } else if (option) {
      setInputValueInternal(option.label);
    } else if (allowCustomValue) {
      setInputValueInternal(value);
    }
    
    // Call onChange callback
    if (onChange) {
      // Use type assertion to handle the generic constraint
      onChange(value as any);
    }
    
    // Call onInputChange callback if input value changes
    if (onInputChange && !clearOnSelect) {
      onInputChange(option ? option.label : value);
    } else if (onInputChange && clearOnSelect) {
      onInputChange('');
    }
    
    // Close the dropdown
    close();
  }, [
    disabled, 
    readOnly, 
    options, 
    allowCustomValue, 
    controlledValue, 
    controlledInputValue, 
    clearOnSelect, 
    onChange, 
    onInputChange, 
    close
  ]);
  
  // Clear the selection
  const clearSelection = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalSelectedValue('');
    }
    
    // Update input value
    if (controlledInputValue === undefined) {
      setInternalInputValue('');
    }
    
    // Call onChange callback
    if (onChange) {
      onChange('');
    }
    
    // Call onInputChange callback
    if (onInputChange) {
      onInputChange('');
    }
    
    // Focus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, readOnly, controlledValue, controlledInputValue, onChange, onInputChange]);
  
  // Highlight an option
  const highlightOption = useCallback((option: T | null) => {
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
    
    // Load options asynchronously if loadOptions is provided
    if (loadOptions) {
      loadOptionsAsync(newValue);
    }
    
    // Open the dropdown if the input has a value and it meets the minimum length
    if (newValue && (!minChars || newValue.length >= minChars)) {
      open();
    } else if (!newValue) {
      close();
    }
  }, [
    controlledInputValue, 
    onInputChange, 
    loadOptions, 
    loadOptionsAsync, 
    minChars, 
    open, 
    close
  ]);
  
  // Focus the input
  const focusInput = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
      
      if (selectOnFocus) {
        inputRef.current.select();
      }
    }
  }, [inputRef, disabled, selectOnFocus]);
  
  // Blur the input
  const blur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [inputRef]);
  
  // Handle input blur
  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Close dropdown after a short delay to allow for option clicks
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        close();
      }
    }, 150);
    
    if (onBlur) {
      onBlur(e);
    }
  }, [disabled, readOnly, close, onBlur]);
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      return;
    }
    setInputValueInternal(e.target.value);
  }, [disabled, readOnly, setInputValueInternal]);

  // Handle input focus
  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      return;
    }
    
    setFocused(true);
    
    if (openOnFocus) {
      open();
    }
    
    if (onFocus) {
      onFocus(e);
    }
  }, [disabled, readOnly, openOnFocus, open, onFocus]);

  // Handle input keydown
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) {
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          highlightNextOption();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          highlightPrevOption();
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedOption) {
          selectOption(highlightedOption);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        if (isOpen) {
          close();
        }
        break;
    }
  }, [
    disabled,
    readOnly,
    isOpen,
    open,
    close,
    highlightedOption,
    highlightNextOption,
    highlightPrevOption,
    selectOption
  ]);
  
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
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.InputHTMLAttributes<E> & { ref: React.Ref<E> } => {
    const inputProps: React.InputHTMLAttributes<E> & { ref: React.Ref<E> } = {
      ...props,
      ref: mergeRefs(inputRef, props?.ref),
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? `${autocompleteId}-dropdown` : undefined,
      'aria-activedescendant': highlightedOption ? `${autocompleteId}-option-${highlightedOption.value}` : undefined,
      'aria-autocomplete': 'list',
      'aria-owns': isOpen ? `${autocompleteId}-dropdown` : undefined,
      id: autocompleteId,
      disabled,
      readOnly,
      required,
      value: inputValue,
      placeholder,
      autoComplete: 'off',
      onChange: handleInputChange,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      onKeyDown: handleInputKeyDown,
      onClick: () => {
        if (openOnFocus) {
          open();
        }
      },
      'data-loading': loading ? '' : undefined,
    };
    return inputProps;
  }, [
    autocompleteId,
    isOpen,
    highlightedOption,
    disabled,
    readOnly,
    required,
    inputValue,
    placeholder,
    loading,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputKeyDown,
    openOnFocus,
    open,
    inputRef
  ]);
  
  // Get props for an option element
  const getOptionProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    option: T,
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.HTMLAttributes<E> & { ref: React.Ref<E> } => {
    const isSelected = option.value === selectedValue;
    const isHighlighted = highlightedOption?.value === option.value;
    
    const optionProps: React.HTMLAttributes<E> & { ref: React.Ref<E> } = {
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
      id: `${autocompleteId}-option-${option.value}`,
      'aria-selected': isSelected,
      'aria-disabled': option.disabled,
      tabIndex: isHighlighted ? 0 : -1,
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
        if (option.disabled) {
          return;
        }
        
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            selectOption(option);
            break;
        }
        
        props?.onKeyDown?.(event);
      },
    };
    return optionProps;
  }, [autocompleteId, selectedValue, highlightedOption, selectOption, highlightOption]);
  
  // Get props for the clear button
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.ButtonHTMLAttributes<E> & { ref: React.Ref<E> } => {
    const clearButtonProps: React.ButtonHTMLAttributes<E> & { ref: React.Ref<E> } = {
      ...props,
      type: 'button',
      'aria-label': 'Clear selection',
      onClick: (event: React.MouseEvent<E>) => {
        clearSelection();
        props?.onClick?.(event);
      },
    };
    return clearButtonProps;
  }, [clearSelection]);
  
  // Get props for the dropdown element
  const getDropdownProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.HTMLAttributes<E> & { ref: React.Ref<E> } => {
    const dropdownProps: React.HTMLAttributes<E> & { ref: React.Ref<E> } = {
      ...props,
      ref: mergeRefs(dropdownRef, props?.ref),
      role: 'listbox',
      id: `${autocompleteId}-dropdown`,
      'aria-labelledby': autocompleteId,
    };
    return dropdownProps;
  }, [autocompleteId, dropdownRef]);
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        dropdownRef.current &&
        !inputRef.current.contains(event.target as Node) &&
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
  
  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  return {
    selectedValue,
    selectedOption,
    inputValue,
    isOpen,
    highlightedOption,
    filteredOptions,
    loading,
    disabled,
    readOnly,
    required,
    focused,
    id: autocompleteId,
    name,
    placeholder,
    inputRef,
    dropdownRef,
    open,
    close,
    toggle,
    selectOption,
    clearSelection,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    setInputValue: setInputValueInternal,
    focus: focusInput,
    blur,
    getInputProps,
    getDropdownProps,
    getOptionProps,
    getClearButtonProps,
  };
}
