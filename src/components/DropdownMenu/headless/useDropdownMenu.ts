import { useState, useRef, useCallback, useEffect } from 'react';
import { usePopover, PopoverOptions, PopoverPlacement } from '../../Popover/headless/usePopover';

export interface DropdownMenuItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Label for the item
   */
  label: string;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether the item is currently selected
   */
  selected?: boolean;
  /**
   * Icon for the item
   */
  icon?: React.ReactNode;
  /**
   * Whether the item is a divider
   */
  isDivider?: boolean;
  /**
   * Whether the item is a header
   */
  isHeader?: boolean;
  /**
   * Callback when the item is clicked
   */
  onClick?: () => void;
  /**
   * Nested items for a submenu
   */
  items?: DropdownMenuItem[];
}

export interface DropdownMenuOptions extends Omit<PopoverOptions, 'placement'> {
  /**
   * Placement of the dropdown menu
   */
  placement?: PopoverPlacement;
  /**
   * List of items in the dropdown menu
   */
  items?: DropdownMenuItem[];
  /**
   * Callback when an item is selected
   */
  onSelect?: (item: DropdownMenuItem) => void;
  /**
   * Whether to close the dropdown menu when an item is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to enable keyboard navigation
   */
  enableKeyboardNavigation?: boolean;
  /**
   * Whether to enable search filtering
   */
  enableSearch?: boolean;
  /**
   * Whether to highlight the first item by default
   */
  highlightFirstItem?: boolean;
  /**
   * Whether to loop through items when navigating with keyboard
   */
  loopNavigation?: boolean;
  /**
   * Whether to show a checkbox for selected items
   */
  showCheckboxes?: boolean;
  /**
   * Whether to allow multiple selections
   */
  multiSelect?: boolean;
  /**
   * Selected item IDs for controlled selection
   */
  selectedIds?: string[];
  /**
   * Default selected item IDs for uncontrolled selection
   */
  defaultSelectedIds?: string[];
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface UseDropdownMenuReturn {
  /**
   * Whether the dropdown menu is open
   */
  isOpen: boolean;
  /**
   * Open the dropdown menu
   */
  open: () => void;
  /**
   * Close the dropdown menu
   */
  close: () => void;
  /**
   * Toggle the dropdown menu
   */
  toggle: () => void;
  /**
   * Ref for the trigger element
   */
  triggerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the dropdown menu content element
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the arrow element
   */
  arrowRef: React.RefObject<HTMLElement>;
  /**
   * Currently highlighted item index
   */
  highlightedIndex: number;
  /**
   * Set the highlighted item index
   */
  setHighlightedIndex: (index: number) => void;
  /**
   * Selected item IDs
   */
  selectedIds: string[];
  /**
   * Toggle selection of an item
   */
  toggleSelection: (id: string) => void;
  /**
   * Select an item
   */
  selectItem: (id: string) => void;
  /**
   * Deselect an item
   */
  deselectItem: (id: string) => void;
  /**
   * Clear all selections
   */
  clearSelection: () => void;
  /**
   * Select all items
   */
  selectAll: () => void;
  /**
   * Search query for filtering items
   */
  searchQuery: string;
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  /**
   * Filtered items based on search query
   */
  filteredItems: DropdownMenuItem[];
  /**
   * Get props for the dropdown menu trigger
   */
  getTriggerProps: () => {
    ref: React.RefObject<HTMLElement>;
    onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onKeyDown: (e: React.KeyboardEvent<Element>) => void;
    'aria-expanded': boolean;
    'aria-haspopup': boolean;
  };
  /**
   * Get props for the dropdown menu content
   */
  getContentProps: () => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    role: string;
    tabIndex: number;
    'aria-hidden': boolean;
    onKeyDown: (e: React.KeyboardEvent<Element>) => void;
  };
  /**
   * Get props for the dropdown menu arrow
   */
  getArrowProps: () => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
  };
  /**
   * Get props for a dropdown menu item
   */
  getItemProps: (item: DropdownMenuItem, index: number) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-selected': boolean | undefined;
    onClick: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  /**
   * Get props for the dropdown menu search input
   */
  getSearchInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    'aria-label': string;
  };
}

/**
 * Hook for creating a dropdown menu
 */
export function useDropdownMenu(options: DropdownMenuOptions = {}): UseDropdownMenuReturn {
  const {
    placement = 'bottom-start',
    items = [],
    onSelect,
    closeOnSelect = true,
    enableKeyboardNavigation = true,
    enableSearch = false,
    highlightFirstItem = true,
    loopNavigation = true,
    showCheckboxes = false,
    multiSelect = false,
    selectedIds: controlledSelectedIds,
    defaultSelectedIds = [],
    onSelectionChange,
    ...popoverOptions
  } = options;

  // Use the popover hook for positioning and basic functionality
  const popoverProps = usePopover({
    ...popoverOptions,
    placement,
  });
  
  // State for highlighted item
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  // State for selected items
  const isControlled = controlledSelectedIds !== undefined;
  const [selectedIdsState, setSelectedIdsState] = useState<string[]>(defaultSelectedIds);
  const selectedIds = isControlled ? controlledSelectedIds! : selectedIdsState;
  
  // State for search
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter items based on search query
  const filteredItems = useCallback(() => {
    if (!searchQuery) return items;
    
    return items.filter(item => {
      if (item.isDivider || item.isHeader) return false;
      return item.label.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery]);
  
  // Toggle selection of an item
  const toggleSelection = useCallback((id: string) => {
    if (!isControlled) {
      setSelectedIdsState(prev => {
        const newSelectedIds = prev.includes(id)
          ? prev.filter(selectedId => selectedId !== id)
          : multiSelect
            ? [...prev, id]
            : [id];
        
        onSelectionChange?.(newSelectedIds);
        return newSelectedIds;
      });
    } else {
      const newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : multiSelect
          ? [...selectedIds, id]
          : [id];
      
      onSelectionChange?.(newSelectedIds);
    }
  }, [isControlled, multiSelect, selectedIds, onSelectionChange]);
  
  // Select an item
  const selectItem = useCallback((id: string) => {
    if (!isControlled) {
      setSelectedIdsState(prev => {
        const newSelectedIds = multiSelect
          ? [...prev, id]
          : [id];
        
        onSelectionChange?.(newSelectedIds);
        return newSelectedIds;
      });
    } else {
      const newSelectedIds = multiSelect
        ? [...selectedIds, id]
        : [id];
      
      onSelectionChange?.(newSelectedIds);
    }
  }, [isControlled, multiSelect, selectedIds, onSelectionChange]);
  
  // Deselect an item
  const deselectItem = useCallback((id: string) => {
    if (!isControlled) {
      setSelectedIdsState(prev => {
        const newSelectedIds = prev.filter(selectedId => selectedId !== id);
        
        onSelectionChange?.(newSelectedIds);
        return newSelectedIds;
      });
    } else {
      const newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
      
      onSelectionChange?.(newSelectedIds);
    }
  }, [isControlled, selectedIds, onSelectionChange]);
  
  // Clear all selections
  const clearSelection = useCallback(() => {
    if (!isControlled) {
      setSelectedIdsState([]);
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.([]);
    }
  }, [isControlled, onSelectionChange]);
  
  // Select all items
  const selectAll = useCallback(() => {
    const allSelectableIds = items
      .filter(item => !item.isDivider && !item.isHeader && !item.disabled)
      .map(item => item.id);
    
    if (!isControlled) {
      setSelectedIdsState(allSelectableIds);
      onSelectionChange?.(allSelectableIds);
    } else {
      onSelectionChange?.(allSelectableIds);
    }
  }, [isControlled, items, onSelectionChange]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!popoverProps.isOpen || !enableKeyboardNavigation) return;
    
    // Highlight first item when opening
    if (highlightFirstItem && highlightedIndex === -1 && filteredItems().length > 0) {
      setHighlightedIndex(0);
    }
  }, [popoverProps.isOpen, enableKeyboardNavigation, highlightFirstItem, highlightedIndex, filteredItems]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!popoverProps.isOpen || !enableKeyboardNavigation) return;
    
    const filtered = filteredItems();
    
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (filtered.length === 0) return;
        
        // Find next non-divider, non-header, non-disabled item
        let nextIndex = highlightedIndex;
        do {
          nextIndex = (nextIndex + 1) % filtered.length;
          // If we've looped through all items and couldn't find a valid one, stop
          if (!loopNavigation && nextIndex < highlightedIndex) {
            nextIndex = highlightedIndex;
            break;
          }
        } while (
          (filtered[nextIndex].isDivider || 
           filtered[nextIndex].isHeader || 
           filtered[nextIndex].disabled) && 
          nextIndex !== highlightedIndex
        );
        
        setHighlightedIndex(nextIndex);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (filtered.length === 0) return;
        
        // Find previous non-divider, non-header, non-disabled item
        let prevIndex = highlightedIndex;
        do {
          prevIndex = prevIndex <= 0 
            ? (loopNavigation ? filtered.length - 1 : 0) 
            : prevIndex - 1;
          // If we've looped through all items and couldn't find a valid one, stop
          if (!loopNavigation && prevIndex > highlightedIndex) {
            prevIndex = highlightedIndex;
            break;
          }
        } while (
          (filtered[prevIndex].isDivider || 
           filtered[prevIndex].isHeader || 
           filtered[prevIndex].disabled) && 
          prevIndex !== highlightedIndex
        );
        
        setHighlightedIndex(prevIndex);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          const item = filtered[highlightedIndex];
          if (!item.isDivider && !item.isHeader && !item.disabled) {
            item.onClick?.();
            toggleSelection(item.id);
            onSelect?.(item);
            
            if (closeOnSelect) {
              popoverProps.close();
            }
          }
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        popoverProps.close();
        break;
      }
      case 'Home': {
        e.preventDefault();
        if (filtered.length === 0) return;
        
        // Find first non-divider, non-header, non-disabled item
        let firstIndex = 0;
        while (
          firstIndex < filtered.length && 
          (filtered[firstIndex].isDivider || 
           filtered[firstIndex].isHeader || 
           filtered[firstIndex].disabled)
        ) {
          firstIndex++;
        }
        
        if (firstIndex < filtered.length) {
          setHighlightedIndex(firstIndex);
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        if (filtered.length === 0) return;
        
        // Find last non-divider, non-header, non-disabled item
        let lastIndex = filtered.length - 1;
        while (
          lastIndex >= 0 && 
          (filtered[lastIndex].isDivider || 
           filtered[lastIndex].isHeader || 
           filtered[lastIndex].disabled)
        ) {
          lastIndex--;
        }
        
        if (lastIndex >= 0) {
          setHighlightedIndex(lastIndex);
        }
        break;
      }
    }
  }, [
    popoverProps.isOpen, 
    popoverProps.close, 
    enableKeyboardNavigation, 
    filteredItems, 
    highlightedIndex, 
    loopNavigation, 
    closeOnSelect, 
    toggleSelection, 
    onSelect
  ]);
  
  // Get trigger props
  const getTriggerProps = useCallback(() => {
    const triggerProps = popoverProps.getTriggerProps();
    
    return {
      ...triggerProps,
      onKeyDown: (e: React.KeyboardEvent<Element>) => {
        if (e.key === 'ArrowDown' && !popoverProps.isOpen) {
          e.preventDefault();
          popoverProps.open();
        }
        handleKeyDown(e);
      },
    };
  }, [popoverProps, handleKeyDown]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    const contentProps = popoverProps.getContentProps();
    
    return {
      ...contentProps,
      role: 'menu',
      onKeyDown: handleKeyDown,
    };
  }, [popoverProps, handleKeyDown]);
  
  // Get item props
  const getItemProps = useCallback((item: DropdownMenuItem, index: number) => {
    return {
      role: item.isDivider ? 'separator' : item.isHeader ? 'presentation' : 'menuitem',
      tabIndex: index === highlightedIndex ? 0 : -1,
      'aria-disabled': item.disabled,
      'aria-selected': selectedIds.includes(item.id),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (item.isDivider || item.isHeader || item.disabled) return;
        
        item.onClick?.();
        toggleSelection(item.id);
        onSelect?.(item);
        
        if (closeOnSelect) {
          popoverProps.close();
        }
      },
      onMouseEnter: () => {
        if (!item.isDivider && !item.isHeader && !item.disabled) {
          setHighlightedIndex(index);
        }
      },
      onMouseLeave: () => {
        setHighlightedIndex(-1);
      },
    };
  }, [highlightedIndex, selectedIds, toggleSelection, onSelect, closeOnSelect, popoverProps]);
  
  // Get search input props
  const getSearchInputProps = useCallback(() => {
    return {
      value: searchQuery,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setHighlightedIndex(0);
      },
      placeholder: 'Search...',
      'aria-label': 'Search dropdown items',
    };
  }, [searchQuery]);
  
  // Reset state when closing
  useEffect(() => {
    if (!popoverProps.isOpen) {
      setHighlightedIndex(-1);
      setSearchQuery('');
    }
  }, [popoverProps.isOpen]);

  return {
    ...popoverProps,
    highlightedIndex,
    setHighlightedIndex,
    selectedIds,
    toggleSelection,
    selectItem,
    deselectItem,
    clearSelection,
    selectAll,
    searchQuery,
    setSearchQuery,
    filteredItems: filteredItems(),
    getTriggerProps,
    getContentProps,
    getArrowProps: popoverProps.getArrowProps,
    getItemProps,
    getSearchInputProps,
  };
}

export default useDropdownMenu;
