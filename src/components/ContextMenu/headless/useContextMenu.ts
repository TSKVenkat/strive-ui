import { useState, useRef, useCallback, useEffect } from 'react';
import { DropdownMenuItem } from '../../DropdownMenu/headless/useDropdownMenu';

export interface ContextMenuOptions {
  /**
   * List of items in the context menu
   */
  items?: DropdownMenuItem[];
  /**
   * Callback when an item is selected
   */
  onSelect?: (item: DropdownMenuItem) => void;
  /**
   * Whether to close the context menu when an item is selected
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
  /**
   * Callback when the context menu opens
   */
  onOpen?: (x: number, y: number) => void;
  /**
   * Callback when the context menu closes
   */
  onClose?: () => void;
  /**
   * Whether to use a portal
   */
  usePortal?: boolean;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
  /**
   * Whether to prevent the default context menu
   */
  preventDefaultContextMenu?: boolean;
  /**
   * Whether to close the context menu when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the context menu when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to trap focus within the context menu
   */
  trapFocus?: boolean;
}

export interface UseContextMenuReturn {
  /**
   * Whether the context menu is open
   */
  isOpen: boolean;
  /**
   * Open the context menu at the specified position
   */
  open: (x: number, y: number) => void;
  /**
   * Close the context menu
   */
  close: () => void;
  /**
   * X position of the context menu
   */
  x: number;
  /**
   * Y position of the context menu
   */
  y: number;
  /**
   * Ref for the context menu content element
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the target element
   */
  targetRef: React.RefObject<HTMLElement>;
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
   * Get props for the context menu target
   */
  getTargetProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    onContextMenu: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the context menu content
   */
  getContentProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    style: React.CSSProperties;
    role: string;
    tabIndex: number;
    'aria-hidden': boolean;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  /**
   * Get props for a context menu item
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
   * Get props for the context menu search input
   */
  getSearchInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    'aria-label': string;
  };
}

/**
 * Hook for creating a context menu
 */
export function useContextMenu(options: ContextMenuOptions = {}): UseContextMenuReturn {
  const {
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
    onOpen,
    onClose,
    usePortal = true,
    portalId = 'context-menu-root',
    preventDefaultContextMenu = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    trapFocus = true,
  } = options;

  // State for open/close
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // State for position
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Refs
  const contentRef = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
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
  
  // Open the context menu
  const open = useCallback((x: number, y: number) => {
    setIsOpen(true);
    setPosition({ x, y });
    onOpen?.(x, y);
    
    // Save current active element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, [onOpen]);
  
  // Close the context menu
  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    
    // Restore focus when context menu closes
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [onClose]);
  
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
  
  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, closeOnOutsideClick, close]);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEscape, close]);
  
  // Handle focus trap
  useEffect(() => {
    if (!isOpen || !trapFocus || !contentRef.current) return;
    
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !contentRef.current) return;
      
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // If shift+tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
    
    // Focus the first focusable element in the context menu
    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    } else {
      contentRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, trapFocus]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !enableKeyboardNavigation) return;
    
    // Highlight first item when opening
    if (highlightFirstItem && highlightedIndex === -1 && filteredItems().length > 0) {
      setHighlightedIndex(0);
    }
  }, [isOpen, enableKeyboardNavigation, highlightFirstItem, highlightedIndex, filteredItems]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || !enableKeyboardNavigation) return;
    
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
              close();
            }
          }
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
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
    isOpen, 
    close, 
    enableKeyboardNavigation, 
    filteredItems, 
    highlightedIndex, 
    loopNavigation, 
    closeOnSelect, 
    toggleSelection, 
    onSelect
  ]);
  
  // Get target props
  const getTargetProps = useCallback(() => {
    return {
      ref: targetRef,
      onContextMenu: (e: React.MouseEvent) => {
        if (preventDefaultContextMenu) {
          e.preventDefault();
        }
        
        // Calculate position
        const x = e.clientX;
        const y = e.clientY;
        
        open(x, y);
      },
    };
  }, [preventDefaultContextMenu, open]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    return {
      ref: contentRef,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? 1 : 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
      },
      role: 'menu',
      tabIndex: -1,
      'aria-hidden': !isOpen,
      onKeyDown: handleKeyDown,
    };
  }, [isOpen, position.x, position.y, handleKeyDown]);
  
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
          close();
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
  }, [highlightedIndex, selectedIds, toggleSelection, onSelect, closeOnSelect, close]);
  
  // Get search input props
  const getSearchInputProps = useCallback(() => {
    return {
      value: searchQuery,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setHighlightedIndex(0);
      },
      placeholder: 'Search...',
      'aria-label': 'Search context menu items',
    };
  }, [searchQuery]);
  
  // Adjust position if menu is outside viewport
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    
    const updatePosition = () => {
      const menuRect = contentRef.current?.getBoundingClientRect();
      
      if (!menuRect) return;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = position.x;
      let y = position.y;
      
      // Adjust horizontal position if menu is outside viewport
      if (x + menuRect.width > viewportWidth) {
        x = viewportWidth - menuRect.width;
      }
      
      // Adjust vertical position if menu is outside viewport
      if (y + menuRect.height > viewportHeight) {
        y = viewportHeight - menuRect.height;
      }
      
      // Update position if needed
      if (x !== position.x || y !== position.y) {
        setPosition({ x, y });
      }
    };
    
    // Update position after render
    requestAnimationFrame(updatePosition);
  }, [isOpen, position]);
  
  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      setSearchQuery('');
    }
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    x: position.x,
    y: position.y,
    contentRef,
    targetRef,
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
    getTargetProps,
    getContentProps,
    getItemProps,
    getSearchInputProps,
  };
}

export default useContextMenu;
