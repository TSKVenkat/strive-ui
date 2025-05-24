import { useState, useCallback, useEffect, useRef } from 'react';

export interface QuickAction {
  /**
   * Unique identifier for the action
   */
  id: string;
  /**
   * Display label for the action
   */
  label: string;
  /**
   * Optional icon for the action
   */
  icon?: React.ReactNode;
  /**
   * Optional keyboard shortcut for the action
   */
  shortcut?: string;
  /**
   * Optional description for the action
   */
  description?: string;
  /**
   * Optional group for the action (for categorization)
   */
  group?: string;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * Function to execute when the action is triggered
   */
  onAction: () => void;
  /**
   * Any additional data to associate with the action
   */
  data?: any;
}

export interface UseQuickActionsProps {
  /**
   * Array of quick actions
   */
  actions: QuickAction[];
  /**
   * Whether the quick actions menu is open
   */
  isOpen?: boolean;
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to close the menu after an action is triggered
   */
  closeOnAction?: boolean;
  /**
   * Whether to enable keyboard shortcuts
   */
  enableShortcuts?: boolean;
  /**
   * Whether to enable keyboard navigation
   */
  enableKeyboardNavigation?: boolean;
  /**
   * Whether to enable search filtering
   */
  enableSearch?: boolean;
  /**
   * Initial search query
   */
  initialSearchQuery?: string;
  /**
   * Callback when an action is triggered
   */
  onActionTriggered?: (action: QuickAction) => void;
}

export interface UseQuickActionsReturn {
  /**
   * Whether the quick actions menu is open
   */
  isOpen: boolean;
  /**
   * Open the quick actions menu
   */
  open: () => void;
  /**
   * Close the quick actions menu
   */
  close: () => void;
  /**
   * Toggle the quick actions menu
   */
  toggle: () => void;
  /**
   * Currently active action ID
   */
  activeActionId: string | null;
  /**
   * Set the active action ID
   */
  setActiveActionId: (id: string | null) => void;
  /**
   * Filtered actions based on search query
   */
  filteredActions: QuickAction[];
  /**
   * Current search query
   */
  searchQuery: string;
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  /**
   * Trigger an action by ID
   */
  triggerAction: (id: string) => void;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Reference to the search input element
   */
  searchInputRef: React.RefObject<HTMLInputElement>;
  /**
   * Handle keyboard navigation
   */
  handleKeyDown: (event: React.KeyboardEvent) => void;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    role: string;
    'aria-label': string;
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /**
   * Get props for the search input element
   */
  getSearchInputProps: <E extends HTMLInputElement = HTMLInputElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLInputElement>;
    role: string;
    'aria-label': string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoFocus?: boolean;
  };
  /**
   * Get props for an action element
   */
  getActionProps: <E extends HTMLElement = HTMLDivElement>(
    action: QuickAction,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    id: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onMouseEnter: () => void;
    'aria-selected': boolean;
  };
}

/**
 * Hook for creating quick actions functionality.
 * 
 * @example
 * ```jsx
 * const MyQuickActions = ({ actions }) => {
 *   const { 
 *     isOpen,
 *     open,
 *     close,
 *     filteredActions,
 *     getContainerProps,
 *     getSearchInputProps,
 *     getActionProps
 *   } = useQuickActions({
 *     actions,
 *     closeOnAction: true,
 *     enableSearch: true,
 *   });
 *   
 *   if (!isOpen) return <button onClick={open}>Open Quick Actions</button>;
 *   
 *   return (
 *     <div {...getContainerProps()}>
 *       <input {...getSearchInputProps({ placeholder: 'Search actions...' })} />
 *       <div>
 *         {filteredActions.map(action => (
 *           <div key={action.id} {...getActionProps(action)}>
 *             {action.icon && <span>{action.icon}</span>}
 *             <span>{action.label}</span>
 *             {action.shortcut && <span>{action.shortcut}</span>}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useQuickActions({
  actions,
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnAction = true,
  enableShortcuts = true,
  enableKeyboardNavigation = true,
  enableSearch = true,
  initialSearchQuery = '',
  onActionTriggered,
}: UseQuickActionsProps): UseQuickActionsReturn {
  // State for open/closed status
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  // State for active action
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Filter actions based on search query
  const filteredActions = enableSearch && searchQuery
    ? actions.filter(action => {
        const query = searchQuery.toLowerCase();
        return (
          action.label.toLowerCase().includes(query) ||
          action.description?.toLowerCase().includes(query) ||
          action.group?.toLowerCase().includes(query)
        );
      })
    : actions;
  
  // Set the first action as active when filtered actions change
  useEffect(() => {
    if (isOpen && filteredActions.length > 0 && !activeActionId) {
      setActiveActionId(filteredActions[0].id);
    } else if (filteredActions.length === 0) {
      setActiveActionId(null);
    } else if (activeActionId && !filteredActions.some(action => action.id === activeActionId)) {
      setActiveActionId(filteredActions[0].id);
    }
  }, [isOpen, filteredActions, activeActionId]);
  
  // Focus the search input when opened
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, enableSearch]);
  
  // Register keyboard shortcuts
  useEffect(() => {
    if (!isOpen || !enableShortcuts) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for action shortcuts
      const matchingAction = actions.find(action => {
        if (!action.shortcut || action.disabled) return false;
        
        // Parse the shortcut string (e.g., "Ctrl+K")
        const keys = action.shortcut.split('+').map(key => key.trim().toLowerCase());
        
        // Check if all keys in the shortcut are pressed
        const modifiers = {
          ctrl: keys.includes('ctrl') || keys.includes('control'),
          alt: keys.includes('alt'),
          shift: keys.includes('shift'),
          meta: keys.includes('meta') || keys.includes('cmd') || keys.includes('command'),
        };
        
        // Get the main key (the last one that's not a modifier)
        const mainKey = keys.find(key => 
          !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd', 'command'].includes(key)
        );
        
        // Check if the event matches the shortcut
        return (
          (modifiers.ctrl === event.ctrlKey) &&
          (modifiers.alt === event.altKey) &&
          (modifiers.shift === event.shiftKey) &&
          (modifiers.meta === event.metaKey) &&
          (mainKey === event.key.toLowerCase())
        );
      });
      
      if (matchingAction) {
        event.preventDefault();
        triggerAction(matchingAction.id);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, enableShortcuts, actions]);
  
  // Open the quick actions menu
  const open = useCallback(() => {
    const newIsOpen = true;
    
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
    
    // Reset active action
    if (filteredActions.length > 0) {
      setActiveActionId(filteredActions[0].id);
    }
  }, [onOpenChange, filteredActions]);
  
  // Close the quick actions menu
  const close = useCallback(() => {
    const newIsOpen = false;
    
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
    
    // Reset search query and active action
    setSearchQuery('');
    setActiveActionId(null);
  }, [onOpenChange]);
  
  // Toggle the quick actions menu
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Trigger an action by ID
  const triggerAction = useCallback((id: string) => {
    const action = actions.find(a => a.id === id);
    
    if (action && !action.disabled) {
      action.onAction();
      
      if (onActionTriggered) {
        onActionTriggered(action);
      }
      
      if (closeOnAction) {
        close();
      }
    }
  }, [actions, closeOnAction, close, onActionTriggered]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (filteredActions.length === 0) return;
        
        if (activeActionId) {
          const currentIndex = filteredActions.findIndex(action => action.id === activeActionId);
          const nextIndex = (currentIndex + 1) % filteredActions.length;
          setActiveActionId(filteredActions[nextIndex].id);
        } else {
          setActiveActionId(filteredActions[0].id);
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (filteredActions.length === 0) return;
        
        if (activeActionId) {
          const currentIndex = filteredActions.findIndex(action => action.id === activeActionId);
          const prevIndex = (currentIndex - 1 + filteredActions.length) % filteredActions.length;
          setActiveActionId(filteredActions[prevIndex].id);
        } else {
          setActiveActionId(filteredActions[filteredActions.length - 1].id);
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        if (activeActionId) {
          triggerAction(activeActionId);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        close();
        break;
        
      case 'Home':
        event.preventDefault();
        if (filteredActions.length > 0) {
          setActiveActionId(filteredActions[0].id);
        }
        break;
        
      case 'End':
        event.preventDefault();
        if (filteredActions.length > 0) {
          setActiveActionId(filteredActions[filteredActions.length - 1].id);
        }
        break;
    }
  }, [enableKeyboardNavigation, filteredActions, activeActionId, triggerAction, close]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      ref: containerRef as React.RefObject<E>,
      role: 'menu',
      'aria-label': 'Quick actions',
      tabIndex: -1,
      onKeyDown: (event: React.KeyboardEvent) => {
        handleKeyDown(event);
        props?.onKeyDown?.(event);
      },
    };
  }, [handleKeyDown]);
  
  // Get props for the search input element
  const getSearchInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      ref: searchInputRef as React.RefObject<E>,
      role: 'searchbox',
      'aria-label': 'Search actions',
      value: searchQuery,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        props?.onChange?.(event as any);
      },
      placeholder: props?.placeholder || 'Search...',
      autoFocus: props?.autoFocus !== undefined ? props.autoFocus : true,
    };
  }, [searchQuery]);
  
  // Get props for an action element
  const getActionProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    action: QuickAction,
    props?: React.HTMLProps<E>
  ) => {
    const isActive = action.id === activeActionId;
    
    return {
      ...props,
      role: 'menuitem',
      id: `quick-action-${action.id}`,
      tabIndex: isActive ? 0 : -1,
      'aria-disabled': action.disabled,
      onClick: (event: React.MouseEvent) => {
        if (!action.disabled) {
          triggerAction(action.id);
        }
        props?.onClick?.(event as any);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!action.disabled) {
            triggerAction(action.id);
          }
        }
        props?.onKeyDown?.(event as any);
      },
      onMouseEnter: () => {
        if (!action.disabled) {
          setActiveActionId(action.id);
        }
        props?.onMouseEnter?.(undefined as any);
      },
      'aria-selected': isActive,
    };
  }, [activeActionId, triggerAction]);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    activeActionId,
    setActiveActionId,
    filteredActions,
    searchQuery,
    setSearchQuery,
    triggerAction,
    containerRef,
    searchInputRef,
    handleKeyDown,
    getContainerProps,
    getSearchInputProps,
    getActionProps,
  };
}
