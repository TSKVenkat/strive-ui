import { useState, useRef, useCallback, useEffect } from 'react';
import { useDropdownMenu, DropdownMenuOptions, DropdownMenuItem } from '../../DropdownMenu/headless/useDropdownMenu';

export interface SelectOption {
  /**
   * Value of the option
   */
  value: string;
  /**
   * Label for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Group the option belongs to
   */
  group?: string;
  /**
   * Additional data for the option
   */
  data?: any;
}

export interface SelectMenuOptions extends Omit<DropdownMenuOptions, 'items' | 'selectedIds' | 'defaultSelectedIds' | 'onSelectionChange'> {
  /**
   * List of options
   */
  options?: SelectOption[];
  /**
   * Selected value(s) for controlled selection
   */
  value?: string | string[];
  /**
   * Default selected value(s) for uncontrolled selection
   */
  defaultValue?: string | string[];
  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[], option?: SelectOption | SelectOption[]) => void;
  /**
   * Whether to allow multiple selections
   */
  multiple?: boolean;
  /**
   * Whether to enable search filtering
   */
  searchable?: boolean;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string;
  /**
   * Whether to clear the search input when an option is selected
   */
  clearSearchOnSelect?: boolean;
  /**
   * Whether to close the menu when an option is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to show a clear button to remove all selections
   */
  clearable?: boolean;
  /**
   * Whether to create a new option when the search query doesn't match any options
   */
  creatable?: boolean;
  /**
   * Function to create a new option from search query
   */
  createOption?: (inputValue: string) => SelectOption;
  /**
   * Text to display for creating a new option
   */
  createText?: string;
  /**
   * Whether to group options
   */
  groupOptions?: boolean;
  /**
   * Whether to show checkboxes for options in multiple mode
   */
  showCheckboxes?: boolean;
  /**
   * Maximum number of items to display as selected in the trigger
   */
  maxDisplayValues?: number;
  /**
   * Text to display when more items are selected than maxDisplayValues
   */
  overflowText?: string;
  /**
   * Whether to show a select all option in multiple mode
   */
  showSelectAll?: boolean;
  /**
   * Text for the select all option
   */
  selectAllText?: string;
  /**
   * Function to filter options based on search query
   */
  filterOption?: (option: SelectOption, inputValue: string) => boolean;
  /**
   * Function to sort options
   */
  sortOptions?: (a: SelectOption, b: SelectOption) => number;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select is required
   */
  required?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Whether the select is loading
   */
  loading?: boolean;
  /**
   * Text to display when loading
   */
  loadingText?: string;
  /**
   * Text to display when no options are available
   */
  noOptionsText?: string;
  /**
   * Text to display when no options match the search query
   */
  noResultsText?: string;
}

export interface UseSelectMenuReturn {
  /**
   * Whether the select menu is open
   */
  isOpen: boolean;
  /**
   * Open the select menu
   */
  open: () => void;
  /**
   * Close the select menu
   */
  close: () => void;
  /**
   * Toggle the select menu
   */
  toggle: () => void;
  /**
   * Selected value(s)
   */
  value: string | string[];
  /**
   * Set the selected value(s)
   */
  setValue: (value: string | string[]) => void;
  /**
   * Selected option(s)
   */
  selectedOption: SelectOption | SelectOption[] | null;
  /**
   * Clear all selections
   */
  clearValue: () => void;
  /**
   * Search query for filtering options
   */
  searchValue: string;
  /**
   * Set the search query
   */
  setSearchValue: (value: string) => void;
  /**
   * Filtered options based on search query
   */
  filteredOptions: SelectOption[];
  /**
   * Grouped options for rendering
   */
  groupedOptions: { [key: string]: SelectOption[] };
  /**
   * Ref for the select container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the trigger element
   */
  triggerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the menu content element
   */
  menuRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the search input element
   */
  searchInputRef: React.RefObject<HTMLInputElement>;
  /**
   * Currently highlighted option index
   */
  highlightedIndex: number;
  /**
   * Set the highlighted option index
   */
  setHighlightedIndex: (index: number) => void;
  /**
   * Create a new option from the current search value
   */
  createNewOption: () => void;
  /**
   * Select all options
   */
  selectAll: () => void;
  /**
   * Deselect all options
   */
  deselectAll: () => void;
  /**
   * Whether the select is disabled
   */
  disabled: boolean;
  /**
   * Whether the select is loading
   */
  loading: boolean;
  /**
   * Whether the select has an error
   */
  hasError: boolean;
  /**
   * Error message
   */
  error: string;
  /**
   * Get props for the select container
   */
  getContainerProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  /**
   * Get props for the select trigger
   */
  getTriggerProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    onClick: (e: React.MouseEvent) => void;
    'aria-haspopup': boolean;
    'aria-expanded': boolean;
    'aria-disabled': boolean | undefined;
    'aria-required': boolean | undefined;
    'aria-invalid': boolean | undefined;
    tabIndex: number;
  };
  /**
   * Get props for the select menu
   */
  getMenuProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    role: string;
    'aria-hidden': boolean;
    tabIndex: number;
    style: React.CSSProperties;
  };
  /**
   * Get props for an option
   */
  getOptionProps: (option: SelectOption, index: number) => {
    role: string;
    id: string;
    'aria-selected': boolean;
    'aria-disabled': boolean | undefined;
    onClick: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    tabIndex: number;
  };
  /**
   * Get props for the search input
   */
  getSearchInputProps: () => {
    ref: React.RefObject<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    placeholder: string;
    'aria-autocomplete': string;
    'aria-controls': string;
    'aria-activedescendant': string | undefined;
    disabled: boolean | undefined;
  };
  /**
   * Get props for the clear button
   */
  getClearButtonProps: () => {
    onClick: (e: React.MouseEvent) => void;
    'aria-label': string;
    tabIndex: number;
    disabled: boolean | undefined;
  };
  /**
   * Get props for the select all option
   */
  getSelectAllProps: () => {
    role: string;
    onClick: (e: React.MouseEvent) => void;
    tabIndex: number;
  };
  /**
   * Get props for a group
   */
  getGroupProps: (groupName: string) => {
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for a group label
   */
  getGroupLabelProps: (groupName: string) => {
    id: string;
    role: string;
  };
  /**
   * Get display text for the trigger
   */
  getDisplayValue: () => string;
}

/**
 * Hook for creating a select menu
 */
export function useSelectMenu(options: SelectMenuOptions = {}): UseSelectMenuReturn {
  const {
    options: selectOptions = [],
    value: controlledValue,
    defaultValue = '',
    onChange,
    multiple = false,
    searchable = false,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    clearSearchOnSelect = true,
    closeOnSelect = !multiple,
    clearable = false,
    creatable = false,
    createOption = (inputValue: string) => ({ value: inputValue, label: inputValue }),
    createText = 'Create',
    groupOptions = false,
    showCheckboxes = multiple,
    maxDisplayValues = 3,
    overflowText = 'more selected',
    showSelectAll = false,
    selectAllText = 'Select All',
    filterOption = (option, inputValue) => 
      option.label.toLowerCase().includes(inputValue.toLowerCase()) || 
      option.value.toLowerCase().includes(inputValue.toLowerCase()),
    sortOptions,
    disabled = false,
    required = false,
    error = '',
    loading = false,
    loadingText = 'Loading...',
    noOptionsText = 'No options available',
    noResultsText = 'No results found',
    ...dropdownMenuOptions
  } = options;

  // Convert selectOptions to DropdownMenuItem format
  const convertOptionsToItems = useCallback((options: SelectOption[]): DropdownMenuItem[] => {
    return options.map(option => ({
      id: option.value,
      label: option.label,
      disabled: option.disabled,
      data: option,
    }));
  }, []);

  // Convert value to array format for internal use
  const normalizeValue = useCallback((value: string | string[] | undefined): string[] => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, []);

  // State for controlled/uncontrolled value
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(normalizeValue(defaultValue));
  const valueArray = isControlled ? normalizeValue(controlledValue) : internalValue;
  const value = multiple ? valueArray : valueArray[0] || '';

  // State for search
  const [searchValue, setSearchValue] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Container ref
  const containerRef = useRef<HTMLElement>(null);

  // Use dropdown menu hook for core functionality
  const dropdownMenuProps = useDropdownMenu({
    ...dropdownMenuOptions,
    items: convertOptionsToItems(selectOptions),
    selectedIds: valueArray,
    multiSelect: multiple,
    enableSearch: searchable,
    closeOnSelect,
    onSelectionChange: (selectedIds) => {
      const newValue = multiple ? selectedIds : selectedIds[0] || '';
      
      if (!isControlled) {
        setInternalValue(normalizeValue(newValue));
      }
      
      // Find selected options
      const selectedOptions = selectOptions.filter(option => 
        Array.isArray(newValue) 
          ? newValue.includes(option.value)
          : option.value === newValue
      );
      
      const selectedOption = multiple ? selectedOptions : selectedOptions[0] || null;
      
      onChange?.(newValue, selectedOption);
      
      if (clearSearchOnSelect) {
        setSearchValue('');
      }
    },
  });

  // Filter options based on search value
  const filteredOptions = useCallback(() => {
    if (!searchValue) return selectOptions;
    
    return selectOptions.filter(option => filterOption(option, searchValue));
  }, [selectOptions, searchValue, filterOption]);

  // Group options by group property
  const groupedOptions = useCallback(() => {
    if (!groupOptions) return { '': filteredOptions() };
    
    return filteredOptions().reduce((groups, option) => {
      const groupName = option.group || '';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(option);
      return groups;
    }, {} as { [key: string]: SelectOption[] });
  }, [filteredOptions, groupOptions]);

  // Find selected option(s)
  const selectedOption = useCallback(() => {
    if (multiple) {
      return selectOptions.filter(option => valueArray.includes(option.value));
    } else {
      return selectOptions.find(option => option.value === value) || null;
    }
  }, [selectOptions, value, valueArray, multiple]);

  // Set value
  const setValue = useCallback((newValue: string | string[]) => {
    const normalizedValue = normalizeValue(newValue);
    
    if (!isControlled) {
      setInternalValue(normalizedValue);
    }
    
    // Find selected options
    const selectedOptions = selectOptions.filter(option => 
      Array.isArray(newValue) 
        ? normalizedValue.includes(option.value)
        : option.value === newValue
    );
    
    const selectedOption = multiple ? selectedOptions : selectedOptions[0] || null;
    
    onChange?.(newValue, selectedOption);
  }, [isControlled, onChange, selectOptions, multiple, normalizeValue]);

  // Clear value
  const clearValue = useCallback(() => {
    const newValue = multiple ? [] : '';
    
    if (!isControlled) {
      setInternalValue([]);
    }
    
    onChange?.(newValue, multiple ? [] : undefined);
  }, [isControlled, onChange, multiple]);

  // Create new option
  const createNewOption = useCallback(() => {
    if (!creatable || !searchValue) return;
    
    const newOption = createOption(searchValue);
    
    // Add the new option to the list (in a real implementation, you would update the options prop)
    // For this hook, we'll just select the new option
    
    if (multiple) {
      setValue([...valueArray, newOption.value]);
    } else {
      setValue(newOption.value);
    }
    
    setSearchValue('');
    
    if (closeOnSelect) {
      dropdownMenuProps.close();
    }
  }, [creatable, searchValue, createOption, multiple, valueArray, setValue, closeOnSelect, dropdownMenuProps]);

  // Select all options
  const selectAll = useCallback(() => {
    if (!multiple) return;
    
    const allValues = selectOptions
      .filter(option => !option.disabled)
      .map(option => option.value);
    
    setValue(allValues);
  }, [multiple, selectOptions, setValue]);

  // Deselect all options
  const deselectAll = useCallback(() => {
    clearValue();
  }, [clearValue]);

  // Get display value for trigger
  const getDisplayValue = useCallback(() => {
    if (valueArray.length === 0) {
      return placeholder;
    }
    
    if (multiple) {
      const selected = selectOptions.filter(option => valueArray.includes(option.value));
      
      if (selected.length <= maxDisplayValues) {
        return selected.map(option => option.label).join(', ');
      } else {
        return `${selected.slice(0, maxDisplayValues).map(option => option.label).join(', ')} (+${selected.length - maxDisplayValues} ${overflowText})`;
      }
    } else {
      const selected = selectOptions.find(option => option.value === value);
      return selected ? selected.label : placeholder;
    }
  }, [valueArray, placeholder, multiple, selectOptions, maxDisplayValues, overflowText, value]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!dropdownMenuProps.isOpen) {
          dropdownMenuProps.open();
        }
        break;
      case 'Escape':
        e.preventDefault();
        dropdownMenuProps.close();
        break;
      case 'Enter':
        if (!dropdownMenuProps.isOpen) {
          e.preventDefault();
          dropdownMenuProps.open();
        }
        break;
      case 'Backspace':
        if (multiple && valueArray.length > 0 && !searchValue) {
          e.preventDefault();
          const newValue = [...valueArray];
          newValue.pop();
          setValue(newValue);
        }
        break;
    }
  }, [disabled, dropdownMenuProps, multiple, valueArray, searchValue, setValue]);

  // Get container props
  const getContainerProps = useCallback(<T extends HTMLElement = HTMLElement>() => {
    return {
      ref: containerRef as React.RefObject<T>,
      onKeyDown: handleKeyDown,
    };
  }, [handleKeyDown]);

  // Get trigger props
  const getTriggerProps = useCallback(<T extends HTMLElement = HTMLElement>() => {
    const triggerProps = dropdownMenuProps.getTriggerProps();
    
    return {
      ...triggerProps,
      ref: triggerProps.ref as React.RefObject<T>,
      'aria-disabled': disabled,
      'aria-required': required,
      'aria-invalid': !!error,
      tabIndex: disabled ? -1 : 0,
    };
  }, [dropdownMenuProps, disabled, required, error]);

  // Get menu props
  const getMenuProps = useCallback(<T extends HTMLElement = HTMLElement>() => {
    const contentProps = dropdownMenuProps.getContentProps();
    
    return {
      ...contentProps,
      ref: contentProps.ref as React.RefObject<T>,
      role: 'listbox',
      'aria-multiselectable': multiple,
    };
  }, [dropdownMenuProps, multiple]);

  // Get option props
  const getOptionProps = useCallback((option: SelectOption, index: number) => {
    const isSelected = valueArray.includes(option.value);
    
    return {
      role: 'option',
      id: `option-${option.value}`,
      'aria-selected': isSelected,
      'aria-disabled': option.disabled,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (option.disabled) return;
        
        if (multiple) {
          const newValue = isSelected
            ? valueArray.filter(v => v !== option.value)
            : [...valueArray, option.value];
          
          setValue(newValue);
        } else {
          setValue(option.value);
          
          if (closeOnSelect) {
            dropdownMenuProps.close();
          }
        }
        
        if (clearSearchOnSelect) {
          setSearchValue('');
        }
      },
      onMouseEnter: () => {
        dropdownMenuProps.setHighlightedIndex(index);
      },
      onMouseLeave: () => {
        dropdownMenuProps.setHighlightedIndex(-1);
      },
      tabIndex: -1,
    };
  }, [valueArray, multiple, setValue, closeOnSelect, dropdownMenuProps, clearSearchOnSelect]);

  // Get search input props
  const getSearchInputProps = useCallback(() => {
    return {
      ref: searchInputRef,
      value: searchValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && creatable && searchValue && filteredOptions().length === 0) {
          e.preventDefault();
          createNewOption();
        }
      },
      placeholder: searchPlaceholder,
      'aria-autocomplete': 'list' as const,
      'aria-controls': 'select-menu-options',
      'aria-activedescendant': dropdownMenuProps.highlightedIndex >= 0 
        ? `option-${filteredOptions()[dropdownMenuProps.highlightedIndex]?.value}` 
        : undefined,
      disabled,
    };
  }, [
    searchValue, 
    creatable, 
    filteredOptions, 
    createNewOption, 
    searchPlaceholder, 
    dropdownMenuProps.highlightedIndex, 
    disabled
  ]);

  // Get clear button props
  const getClearButtonProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        clearValue();
      },
      'aria-label': 'Clear selection',
      tabIndex: -1,
      disabled,
    };
  }, [clearValue, disabled]);

  // Get select all props
  const getSelectAllProps = useCallback(() => {
    const allSelected = selectOptions
      .filter(option => !option.disabled)
      .every(option => valueArray.includes(option.value));
    
    return {
      role: 'option',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (allSelected) {
          deselectAll();
        } else {
          selectAll();
        }
      },
      tabIndex: -1,
    };
  }, [selectOptions, valueArray, deselectAll, selectAll]);

  // Get group props
  const getGroupProps = useCallback((groupName: string) => {
    return {
      role: 'group',
      'aria-label': groupName,
    };
  }, []);

  // Get group label props
  const getGroupLabelProps = useCallback((groupName: string) => {
    return {
      id: `group-label-${groupName.replace(/\s+/g, '-').toLowerCase()}`,
      role: 'presentation',
    };
  }, []);

  // Focus search input when menu opens
  useEffect(() => {
    if (dropdownMenuProps.isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownMenuProps.isOpen, searchable]);

  // Clear search when menu closes
  useEffect(() => {
    if (!dropdownMenuProps.isOpen) {
      setSearchValue('');
    }
  }, [dropdownMenuProps.isOpen]);

  return {
    isOpen: dropdownMenuProps.isOpen,
    open: dropdownMenuProps.open,
    close: dropdownMenuProps.close,
    toggle: dropdownMenuProps.toggle,
    value,
    setValue,
    selectedOption: selectedOption(),
    clearValue,
    searchValue,
    setSearchValue,
    filteredOptions: filteredOptions(),
    groupedOptions: groupedOptions(),
    containerRef,
    triggerRef: dropdownMenuProps.triggerRef,
    menuRef: dropdownMenuProps.contentRef,
    searchInputRef,
    highlightedIndex: dropdownMenuProps.highlightedIndex,
    setHighlightedIndex: dropdownMenuProps.setHighlightedIndex,
    createNewOption,
    selectAll,
    deselectAll,
    disabled,
    loading,
    hasError: !!error,
    error,
    getContainerProps,
    getTriggerProps,
    getMenuProps,
    getOptionProps,
    getSearchInputProps,
    getClearButtonProps,
    getSelectAllProps,
    getGroupProps,
    getGroupLabelProps,
    getDisplayValue,
  };
}

export default useSelectMenu;
