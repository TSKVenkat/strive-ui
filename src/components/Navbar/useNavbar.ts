import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseNavbarProps {
  /**
   * The ID of the initially active item
   */
  defaultActiveItem?: string;
  /**
   * The ID of the controlled active item
   */
  activeItem?: string;
  /**
   * Callback when active item changes
   */
  onActiveChange?: (itemId: string) => void;
  /**
   * Whether the navbar is collapsible on smaller screens
   */
  collapsible?: boolean;
  /**
   * Whether the navbar is initially expanded (when collapsible)
   */
  defaultExpanded?: boolean;
  /**
   * Whether the navbar is controlled expanded (when collapsible)
   */
  expanded?: boolean;
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
}

export interface UseNavbarReturn {
  /**
   * The currently active item ID
   */
  activeItem: string;
  /**
   * Function to set the active item
   */
  setActiveItem: (id: string) => void;
  /**
   * Whether the navbar is currently expanded
   */
  isExpanded: boolean;
  /**
   * Function to toggle the expanded state
   */
  toggleExpanded: () => void;
  /**
   * Function to set the expanded state
   */
  setExpanded: (expanded: boolean) => void;
  /**
   * Function to register a navbar item
   */
  registerItem: (id: string) => void;
  /**
   * Function to unregister a navbar item
   */
  unregisterItem: (id: string) => void;
  /**
   * List of registered item IDs
   */
  itemIds: string[];
  /**
   * Get props for the navbar container
   */
  getNavbarProps: () => {
    role: string;
    'aria-expanded'?: boolean;
  };
  /**
   * Get props for the navbar toggle button
   */
  getToggleProps: () => {
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-label': string;
    onClick: () => void;
  };
  /**
   * Get props for a navbar item
   */
  getItemProps: (id: string, disabled?: boolean) => {
    id: string;
    role: string;
    tabIndex: number;
    'aria-current': boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    'aria-disabled': boolean;
    disabled: boolean;
    onClick: (event: React.MouseEvent) => void;
    'data-state': 'active' | 'inactive';
  };
}

/**
 * Hook for creating accessible navbar components.
 * Provides all the necessary props and state for creating a navbar component.
 * 
 * @example
 * ```jsx
 * const MyNavbar = ({ defaultActiveItem, onActiveChange, children }) => {
 *   const { 
 *     activeItem, 
 *     getNavbarProps, 
 *     getItemProps, 
 *     isExpanded,
 *     getToggleProps
 *   } = useNavbar({ defaultActiveItem, onActiveChange });
 *   
 *   return (
 *     <nav {...getNavbarProps()}>
 *       <button {...getToggleProps()}>Menu</button>
 *       <div className={isExpanded ? 'expanded' : 'collapsed'}>
 *         <a {...getItemProps('home')} href="/">Home</a>
 *         <a {...getItemProps('about')} href="/about">About</a>
 *         <a {...getItemProps('contact')} href="/contact">Contact</a>
 *       </div>
 *     </nav>
 *   );
 * };
 * ```
 */
export function useNavbar({
  defaultActiveItem,
  activeItem: controlledActiveItem,
  onActiveChange,
  collapsible = false,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
}: UseNavbarProps = {}): UseNavbarReturn {
  const [activeItem, setActiveItemState] = useState<string>(defaultActiveItem || '');
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [isExpanded, setExpandedState] = useState<boolean>(defaultExpanded);
  const navbarId = useRef(`navbar-${Math.random().toString(36).substr(2, 9)}`);
  
  // Handle controlled active item
  useEffect(() => {
    if (controlledActiveItem !== undefined) {
      setActiveItemState(controlledActiveItem);
    }
  }, [controlledActiveItem]);
  
  // Handle controlled expanded state
  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setExpandedState(controlledExpanded);
    }
  }, [controlledExpanded]);
  
  // Set first item as active if no default is provided
  useEffect(() => {
    if (!defaultActiveItem && !controlledActiveItem && itemIds.length > 0 && !activeItem) {
      setActiveItemState(itemIds[0]);
    }
  }, [defaultActiveItem, controlledActiveItem, itemIds, activeItem]);
  
  const setActiveItem = useCallback((id: string) => {
    if (controlledActiveItem === undefined) {
      setActiveItemState(id);
    }
    onActiveChange?.(id);
  }, [controlledActiveItem, onActiveChange]);
  
  const setExpanded = useCallback((expanded: boolean) => {
    if (controlledExpanded === undefined) {
      setExpandedState(expanded);
    }
    onExpandedChange?.(expanded);
  }, [controlledExpanded, onExpandedChange]);
  
  const toggleExpanded = useCallback(() => {
    setExpanded(!isExpanded);
  }, [isExpanded, setExpanded]);
  
  const registerItem = useCallback((id: string) => {
    setItemIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  }, []);
  
  const unregisterItem = useCallback((id: string) => {
    setItemIds(prev => prev.filter(itemId => itemId !== id));
  }, []);

  const getNavbarProps = useCallback(() => {
    return {
      role: 'navigation',
      ...(collapsible ? { 'aria-expanded': isExpanded } : {}),
    };
  }, [collapsible, isExpanded]);

  const getToggleProps = useCallback(() => {
    return {
      'aria-expanded': isExpanded,
      'aria-controls': navbarId.current,
      'aria-label': isExpanded ? 'Close menu' : 'Open menu',
      onClick: toggleExpanded,
    };
  }, [isExpanded, toggleExpanded]);

  const getItemProps = useCallback((id: string, disabled = false) => {
    const isActive = activeItem === id;

    const handleClick = (event: React.MouseEvent) => {
      if (!disabled) {
        setActiveItem(id);
      }
    };

    return {
      id: `nav-item-${id}`,
      role: 'menuitem',
      tabIndex: isActive ? 0 : -1,
      'aria-current': isActive ? ('page' as const) : (false as const),
      'aria-disabled': disabled,
      disabled,
      onClick: handleClick,
      'data-state': isActive ? ('active' as const) : ('inactive' as const),
    };
  }, [activeItem, setActiveItem]);

  return {
    activeItem,
    setActiveItem,
    isExpanded,
    toggleExpanded,
    setExpanded,
    registerItem,
    unregisterItem,
    itemIds,
    getNavbarProps,
    getToggleProps,
    getItemProps,
  };
}
