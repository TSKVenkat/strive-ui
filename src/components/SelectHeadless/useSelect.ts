import { useState, useCallback, useRef, useId, useEffect, KeyboardEvent, FocusEvent } from 'react';

export interface SelectOption {
  /**
   * The value of the option
   */
  value: string;
  /**
   * The label to display for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Optional group that the option belongs to
   */
  group?: string;
  /**
   * Optional icon or element to display before the label
   */
  prefix?: React.ReactNode;
  /**
   * Optional icon or element to display after the label
   */
  suffix?: React.ReactNode;
  /**
   * Optional description or hint text
   */
  description?: string;
}

export interface SelectGroup {
  /**
   * The label of the group
   */
  label: string;
  /**
   * Optional description for the group
   */
  description?: string;
}

export interface UseSelectProps {
  /**
   * Options for the select
   */
  options: SelectOption[];
  /**
   * Optional groups for the options
   */
  groups?: Record<string, SelectGroup>;
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
  onChange?: (value: string, option: SelectOption) => void;
  /**
   * Callback when the select is opened
   */
  onOpen?: () => void;
  /**
   * Callback when the select is closed
   */
  onClose?: () => void;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select is required
   */
  required?: boolean;
  /**
   * Name attribute for the select
   */
  name?: string;
  /**
   * ID for the select element
   */
  id?: string;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Whether the select is clearable
   */
  clearable?: boolean;
  /**
   * Whether the select is searchable
   */
  searchable?: boolean;
  /**
   * Maximum height of the dropdown in pixels
   */
  maxHeight?: number;
  /**
   * Placement of the dropdown
   */
  placement?: 'top' | 'bottom' | 'auto';
  /**
   * Whether the dropdown should match the width of the trigger
   */
  matchWidth?: boolean;
  /**
   * Whether to close the dropdown when an option is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to focus the trigger when an option is selected
   */
  focusOnSelect?: boolean;
}

export interface UseSelectReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Selected option
   */
  selectedOption: SelectOption | null;
  /**
   * Whether the dropdown is open
   */
  isOpen: boolean;
  /**
   * Whether the select is disabled
   */
  disabled: boolean;
  /**
   * Whether the select is required
   */
  required: boolean;
  /**
   * Whether the select is focused
   */
  focused: boolean;
  /**
   * Current search query (if searchable)
   */
  searchQuery: string;
  /**
   * Filtered options based on search query
   */
  filteredOptions: SelectOption[];
  /**
   * Highlighted option index
   */
  highlightedIndex: number;
  /**
   * ID for the select element
   */
  id: string;
  /**
   * Reference to the trigger element
   */
  triggerRef: React.RefObject<HTMLButtonElement>;
  /**
   * Reference to the dropdown element
   */
  dropdownRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the search input element
   */
  searchInputRef: React.RefObject<HTMLInputElement>;
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
  selectOption: (option: SelectOption) => void;
  /**
   * Clear the selection
   */
  clearSelection: () => void;
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  /**
   * Highlight an option by index
   */
  highlightOption: (index: number) => void;
  /**
   * Highlight the next option
   */
  highlightNextOption: () => void;
  /**
   * Highlight the previous option
   */
  highlightPrevOption: () => void;
  /**
   * Select the highlighted option
   */
  selectHighlightedOption: () => void;
  /**
   * Get props for the trigger element
   */
  getTriggerProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E> & { ref?: any };
  /**
   * Get props for the dropdown element
   */
  getDropdownProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { ref?: any };
  /**
   * Get props for the search input element
   */
  getSearchInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E> & { ref?: any };
  /**
   * Get props for an option element
   */
  getOptionProps: <E extends HTMLElement = HTMLDivElement>(
    option: SelectOption,
    index: number,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { ref?: any };
  /**
   * Get props for the clear button
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating select functionality.
 * 
 * @example
 * ```jsx
 * const MySelect = ({ options, ...props }) => {
 *   const { 
 *     isOpen,
 *     selectedOption,
 *     getTriggerProps,
 *     getDropdownProps,
 *     getOptionProps,
 *   } = useSelect({ options, ...props });
 *   
 *   return (
 *     <div>
 *       <button {...getTriggerProps()}>
 *         {selectedOption?.label || 'Select an option'}
 *       </button>
 *       {isOpen && (
 *         <div {...getDropdownProps()}>
 *           {options.map((option, index) => (
 *             <div key={option.value} {...getOptionProps(option, index)}>
 *               {option.label}
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export function useSelect({
  options,
  groups,
  defaultValue = '',
  value: controlledValue,
  onChange,
  onOpen,
  onClose,
  disabled = false,
  required = false,
  name,
  id,
  placeholder = 'Select an option',
  clearable = false,
  searchable = false,
  maxHeight = 300,
  placement = 'bottom',
  matchWidth = true,
  closeOnSelect = true,
  focusOnSelect = true,
}: UseSelectProps): UseSelectReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  
  // State for value
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // State for dropdown open
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // State for focus
  const [focused, setFocused] = useState<boolean>(false);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for highlighted option index
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // Refs for DOM elements
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Get the selected option
  const selectedOption = options.find(option => option.value === value) || null;
  
  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;
  
  // Reset highlighted index when filtered options change
  useEffect(() => {
    if (isOpen) {
      // Try to highlight the selected option if it exists in the filtered options
      if (selectedOption) {
        const selectedIndex = filteredOptions.findIndex(option => option.value === selectedOption.value);
        setHighlightedIndex(selectedIndex !== -1 ? selectedIndex : 0);
      } else {
        setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
      }
    }
  }, [filteredOptions, isOpen, selectedOption]);
  
  // Focus the search input when the dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  // Scroll the highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [highlightedIndex, isOpen]);
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
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
  }, [isOpen]);
  
  // Open the dropdown
  const open = useCallback(() => {
    if (!disabled && !isOpen) {
      setIsOpen(true);
      setSearchQuery('');
      onOpen?.();
    }
  }, [disabled, isOpen, onOpen]);
  
  // Close the dropdown
  const close = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      setSearchQuery('');
      onClose?.();
      
      // Focus the trigger when closing
      if (triggerRef.current) {
        triggerRef.current.focus();
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
  
  // Select an option
  const selectOption = useCallback((option: SelectOption) => {
    if (option.disabled) return;
    
    if (controlledValue === undefined) {
      setInternalValue(option.value);
    }
    
    onChange?.(option.value, option);
    
    if (closeOnSelect) {
      close();
    }
    
    if (focusOnSelect && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [controlledValue, onChange, close, closeOnSelect, focusOnSelect]);
  
  // Clear the selection
  const clearSelection = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    
    onChange?.('', {} as SelectOption);
    
    // Focus the trigger after clearing
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [controlledValue, onChange]);
  
  // Highlight an option by index
  const highlightOption = useCallback((index: number) => {
    if (index >= 0 && index < filteredOptions.length) {
      setHighlightedIndex(index);
    }
  }, [filteredOptions.length]);
  
  // Highlight the next option
  const highlightNextOption = useCallback(() => {
    if (filteredOptions.length === 0) return;
    
    setHighlightedIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= filteredOptions.length) {
        return 0; // Wrap around to the first option
      }
      return nextIndex;
    });
  }, [filteredOptions.length]);
  
  // Highlight the previous option
  const highlightPrevOption = useCallback(() => {
    if (filteredOptions.length === 0) return;
    
    setHighlightedIndex(prevIndex => {
      const prevOptionIndex = prevIndex - 1;
      if (prevOptionIndex < 0) {
        return filteredOptions.length - 1; // Wrap around to the last option
      }
      return prevOptionIndex;
    });
  }, [filteredOptions.length]);
  
  // Select the highlighted option
  const selectHighlightedOption = useCallback(() => {
    if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      selectOption(filteredOptions[highlightedIndex]);
    }
  }, [highlightedIndex, filteredOptions, selectOption]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
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
        if (isOpen) {
          selectHighlightedOption();
        } else {
          open();
        }
        break;
      case ' ': // Space
        if (!searchable || !isOpen) {
          event.preventDefault();
          if (!isOpen) {
            open();
          } else {
            selectHighlightedOption();
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        if (isOpen) {
          event.preventDefault();
          close();
        }
        break;
      default:
        // If the dropdown is closed and a printable character is pressed, open it
        if (
          !isOpen &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey &&
          event.key.length === 1
        ) {
          open();
        }
        break;
    }
  }, [
    isOpen,
    open,
    close,
    highlightNextOption,
    highlightPrevOption,
    selectHighlightedOption,
    searchable,
  ]);
  
  // Handle focus
  const handleFocus = useCallback((event: FocusEvent<HTMLElement>) => {
    setFocused(true);
  }, []);
  
  // Handle blur
  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    // Only blur if the focus is not moving to the dropdown or another part of the select
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.relatedTarget as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.relatedTarget as Node)
    ) {
      setFocused(false);
    }
  }, []);
  
  // Get props for the trigger element
  const getTriggerProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> & { ref?: any } => {
    return {
      ...props,
      id: selectId,
      ref: triggerRef as React.RefObject<E>,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      'aria-controls': `${selectId}-dropdown`,
      'aria-labelledby': `${selectId}-label`,
      'aria-disabled': disabled ? true : undefined,
      'aria-required': required ? true : undefined,
      disabled,
      onKeyDown: handleKeyDown as unknown as React.KeyboardEventHandler<E>,
      onFocus: handleFocus as unknown as React.FocusEventHandler<E>,
      onBlur: handleBlur as unknown as React.FocusEventHandler<E>,
      onClick: (event: React.MouseEvent<E>) => {
        event.preventDefault();
        if (!disabled) {
          toggle();
        }
        props?.onClick?.(event as any);
      },
    } as any;
  }, [
    selectId,
    isOpen,
    disabled,
    required,
    handleKeyDown,
    handleFocus,
    handleBlur,
    toggle,
  ]);
  
  // Get props for the dropdown element
  const getDropdownProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { ref?: any } => {
    return {
      ...props,
      id: `${selectId}-dropdown`,
      ref: dropdownRef as React.RefObject<E>,
      role: 'listbox',
      'aria-labelledby': `${selectId}-label`,
      style: {
        ...props?.style,
        maxHeight: `${maxHeight}px`,
        width: matchWidth && triggerRef.current ? `${triggerRef.current.offsetWidth}px` : undefined,
      },
      onKeyDown: handleKeyDown as unknown as React.KeyboardEventHandler<E>,
    } as any;
  }, [selectId, maxHeight, matchWidth, handleKeyDown]);
  
  // Get props for the search input element
  const getSearchInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> & { ref?: any } => {
    return {
      ...props,
      ref: searchInputRef as React.RefObject<E>,
      role: 'searchbox',
      'aria-autocomplete': 'list',
      'aria-controls': `${selectId}-dropdown`,
      value: searchQuery,
      onChange: (event: React.ChangeEvent<E>) => {
        setSearchQuery(event.target.value);
        props?.onChange?.(event as any);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        // Don't handle arrow keys, enter, etc. here, let the parent handle it
        if (
          event.key === 'ArrowDown' ||
          event.key === 'ArrowUp' ||
          event.key === 'Enter' ||
          event.key === 'Escape' ||
          event.key === 'Tab'
        ) {
          handleKeyDown(event as unknown as KeyboardEvent<HTMLElement>);
          return;
        }
        
        props?.onKeyDown?.(event as any);
      },
    } as any;
  }, [selectId, searchQuery, handleKeyDown]);
  
  // Get props for an option element
  const getOptionProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    option: SelectOption,
    index: number,
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { ref?: any } => {
    const isSelected = option.value === value;
    const isHighlighted = index === highlightedIndex;
    
    return {
      ...props,
      ref: (node: E | null) => {
        optionRefs.current[index] = node;
      },
      role: 'option',
      id: `${selectId}-option-${option.value}`,
      'aria-selected': isSelected,
      'aria-disabled': option.disabled ? true : undefined,
      'data-highlighted': isHighlighted ? '' : undefined,
      'data-selected': isSelected ? '' : undefined,
      'data-disabled': option.disabled ? '' : undefined,
      tabIndex: -1,
      onClick: (event: React.MouseEvent<E>) => {
        event.preventDefault();
        if (!option.disabled) {
          selectOption(option);
        }
        props?.onClick?.(event as any);
      },
      onMouseEnter: (event: React.MouseEvent<E>) => {
        if (!option.disabled) {
          highlightOption(index);
        }
        props?.onMouseEnter?.(event as any);
      },
    } as any;
  }, [selectId, value, highlightedIndex, selectOption, highlightOption]);
  
  // Get props for the clear button
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': 'Clear selection',
      tabIndex: -1,
      onClick: (event: React.MouseEvent<E>) => {
        event.stopPropagation();
        clearSelection();
        props?.onClick?.(event as any);
      },
    };
  }, [clearSelection]);
  
  return {
    value,
    selectedOption,
    isOpen,
    disabled,
    required,
    focused,
    searchQuery,
    filteredOptions,
    highlightedIndex,
    id: selectId,
    triggerRef,
    dropdownRef,
    searchInputRef,
    open,
    close,
    toggle,
    selectOption,
    clearSelection,
    setSearchQuery,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    selectHighlightedOption,
    getTriggerProps,
    getDropdownProps,
    getSearchInputProps,
    getOptionProps,
    getClearButtonProps,
  };
}
