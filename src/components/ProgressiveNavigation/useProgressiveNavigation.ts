import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface ProgressiveNavigationItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Display label for the item
   */
  label: string;
  /**
   * Optional icon for the item
   */
  icon?: React.ReactNode;
  /**
   * Optional URL for the item
   */
  href?: string;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Function to execute when the item is clicked
   */
  onClick?: () => void;
  /**
   * Priority level of the item (higher values = higher priority)
   */
  priority: number;
  /**
   * Minimum breakpoint at which the item should be visible (in pixels)
   */
  minBreakpoint?: number;
  /**
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface UseProgressiveNavigationProps {
  /**
   * Array of navigation items
   */
  items: ProgressiveNavigationItem[];
  /**
   * Default active item ID
   */
  defaultActiveId?: string;
  /**
   * Controlled active item ID
   */
  activeId?: string;
  /**
   * Callback when active item changes
   */
  onActiveChange?: (id: string) => void;
  /**
   * Default overflow behavior
   */
  defaultOverflowBehavior?: 'collapse' | 'hide';
  /**
   * Controlled overflow behavior
   */
  overflowBehavior?: 'collapse' | 'hide';
  /**
   * Callback when overflow behavior changes
   */
  onOverflowBehaviorChange?: (behavior: 'collapse' | 'hide') => void;
  /**
   * Whether the overflow menu is open
   */
  isOverflowMenuOpen?: boolean;
  /**
   * Callback when overflow menu open state changes
   */
  onOverflowMenuOpenChange?: (isOpen: boolean) => void;
  /**
   * Minimum number of visible items before overflow
   */
  minVisibleItems?: number;
  /**
   * Maximum number of visible items before overflow
   */
  maxVisibleItems?: number;
  /**
   * Whether to prioritize items by their priority value
   */
  prioritizeItems?: boolean;
  /**
   * Whether to adapt to available space
   */
  adaptToSpace?: boolean;
  /**
   * Whether to adapt to screen size
   */
  adaptToScreenSize?: boolean;
}

export interface UseProgressiveNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string) => void;
  /**
   * Current overflow behavior
   */
  overflowBehavior: 'collapse' | 'hide';
  /**
   * Set the overflow behavior
   */
  setOverflowBehavior: (behavior: 'collapse' | 'hide') => void;
  /**
   * Whether the overflow menu is open
   */
  isOverflowMenuOpen: boolean;
  /**
   * Open the overflow menu
   */
  openOverflowMenu: () => void;
  /**
   * Close the overflow menu
   */
  closeOverflowMenu: () => void;
  /**
   * Toggle the overflow menu
   */
  toggleOverflowMenu: () => void;
  /**
   * Visible navigation items
   */
  visibleItems: ProgressiveNavigationItem[];
  /**
   * Overflow navigation items
   */
  overflowItems: ProgressiveNavigationItem[];
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: ProgressiveNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /**
   * Get props for the overflow toggle button
   */
  getOverflowToggleProps: <E extends HTMLElement = HTMLButtonElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-haspopup': boolean;
    'aria-expanded': boolean;
    'aria-label': string;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
  /**
   * Get props for the overflow menu
   */
  getOverflowMenuProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
    tabIndex: number;
  };
}

/**
 * Hook for creating progressive navigation functionality.
 * 
 * @example
 * ```jsx
 * const MyProgressiveNavigation = ({ items }) => {
 *   const { 
 *     visibleItems,
 *     overflowItems,
 *     isOverflowMenuOpen,
 *     getContainerProps,
 *     getItemProps,
 *     getOverflowToggleProps,
 *     getOverflowMenuProps
 *   } = useProgressiveNavigation({
 *     items,
 *     defaultActiveId: 'home',
 *     adaptToSpace: true,
 *   });
 *   
 *   return (
 *     <nav {...getContainerProps()}>
 *       {visibleItems.map(item => (
 *         <a key={item.id} {...getItemProps(item)}>
 *           {item.label}
 *         </a>
 *       ))}
 *       
 *       {overflowItems.length > 0 && (
 *         <>
 *           <button {...getOverflowToggleProps()}>
 *             More
 *           </button>
 *           
 *           {isOverflowMenuOpen && (
 *             <div {...getOverflowMenuProps()}>
 *               {overflowItems.map(item => (
 *                 <a key={item.id} {...getItemProps(item)}>
 *                   {item.label}
 *                 </a>
 *               ))}
 *             </div>
 *           )}
 *         </>
 *       )}
 *     </nav>
 *   );
 * };
 * ```
 */
export function useProgressiveNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  defaultOverflowBehavior = 'collapse',
  overflowBehavior: controlledOverflowBehavior,
  onOverflowBehaviorChange,
  isOverflowMenuOpen: controlledIsOverflowMenuOpen,
  onOverflowMenuOpenChange,
  minVisibleItems = 1,
  maxVisibleItems = Infinity,
  prioritizeItems = true,
  adaptToSpace = false,
  adaptToScreenSize = false,
}: UseProgressiveNavigationProps): UseProgressiveNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || (items.length > 0 ? items[0].id : null));
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for overflow behavior
  const [internalOverflowBehavior, setInternalOverflowBehavior] = useState<'collapse' | 'hide'>(defaultOverflowBehavior);
  
  // Use controlled or uncontrolled state for overflow behavior
  const overflowBehavior = controlledOverflowBehavior !== undefined ? controlledOverflowBehavior : internalOverflowBehavior;
  
  // State for overflow menu open
  const [internalIsOverflowMenuOpen, setInternalIsOverflowMenuOpen] = useState<boolean>(false);
  
  // Use controlled or uncontrolled state for overflow menu open
  const isOverflowMenuOpen = controlledIsOverflowMenuOpen !== undefined ? controlledIsOverflowMenuOpen : internalIsOverflowMenuOpen;
  
  // State for visible items count
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(maxVisibleItems);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLElement>(null);
  
  // Ref for resize observer
  const resizeObserver = useRef<ResizeObserver | null>(null);
  
  // Set active item
  const setActiveId = useCallback((id: string) => {
    if (id !== activeId) {
      if (onActiveChange) {
        onActiveChange(id);
      }
      
      if (controlledActiveId === undefined) {
        setInternalActiveId(id);
      }
    }
  }, [activeId, onActiveChange, controlledActiveId]);
  
  // Set overflow behavior
  const setOverflowBehavior = useCallback((behavior: 'collapse' | 'hide') => {
    if (behavior !== overflowBehavior) {
      if (onOverflowBehaviorChange) {
        onOverflowBehaviorChange(behavior);
      }
      
      if (controlledOverflowBehavior === undefined) {
        setInternalOverflowBehavior(behavior);
      }
    }
  }, [overflowBehavior, onOverflowBehaviorChange, controlledOverflowBehavior]);
  
  // Open overflow menu
  const openOverflowMenu = useCallback(() => {
    if (!isOverflowMenuOpen) {
      if (onOverflowMenuOpenChange) {
        onOverflowMenuOpenChange(true);
      }
      
      if (controlledIsOverflowMenuOpen === undefined) {
        setInternalIsOverflowMenuOpen(true);
      }
    }
  }, [isOverflowMenuOpen, onOverflowMenuOpenChange, controlledIsOverflowMenuOpen]);
  
  // Close overflow menu
  const closeOverflowMenu = useCallback(() => {
    if (isOverflowMenuOpen) {
      if (onOverflowMenuOpenChange) {
        onOverflowMenuOpenChange(false);
      }
      
      if (controlledIsOverflowMenuOpen === undefined) {
        setInternalIsOverflowMenuOpen(false);
      }
    }
  }, [isOverflowMenuOpen, onOverflowMenuOpenChange, controlledIsOverflowMenuOpen]);
  
  // Toggle overflow menu
  const toggleOverflowMenu = useCallback(() => {
    if (isOverflowMenuOpen) {
      closeOverflowMenu();
    } else {
      openOverflowMenu();
    }
  }, [isOverflowMenuOpen, openOverflowMenu, closeOverflowMenu]);
  
  // Sort items by priority
  const sortedItems = useMemo(() => {
    if (!prioritizeItems) return [...items];
    
    return [...items].sort((a, b) => b.priority - a.priority);
  }, [items, prioritizeItems]);
  
  // Filter items by screen size
  const screenSizeFilteredItems = useMemo(() => {
    if (!adaptToScreenSize) return sortedItems;
    
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    
    return sortedItems.filter(item => {
      if (item.minBreakpoint === undefined) return true;
      return windowWidth >= item.minBreakpoint;
    });
  }, [sortedItems, adaptToScreenSize]);
  
  // Split items into visible and overflow
  const { visibleItems, overflowItems } = useMemo(() => {
    const visible = screenSizeFilteredItems.slice(0, visibleItemsCount);
    const overflow = screenSizeFilteredItems.slice(visibleItemsCount);
    
    return {
      visibleItems: visible,
      overflowItems: overflowBehavior === 'hide' ? [] : overflow,
    };
  }, [screenSizeFilteredItems, visibleItemsCount, overflowBehavior]);
  
  // Update visible items count based on container width
  useEffect(() => {
    if (!adaptToSpace || !containerRef.current) return;
    
    const updateVisibleItems = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const itemElements = Array.from(containerRef.current.children) as HTMLElement[];
      
      // Skip the overflow toggle button
      const navItemElements = itemElements.slice(0, -1);
      
      let totalWidth = 0;
      let count = 0;
      
      for (let i = 0; i < navItemElements.length && i < screenSizeFilteredItems.length; i++) {
        const itemWidth = navItemElements[i].offsetWidth;
        
        if (totalWidth + itemWidth <= containerWidth && count < maxVisibleItems) {
          totalWidth += itemWidth;
          count++;
        } else {
          break;
        }
      }
      
      // Ensure at least minVisibleItems are shown
      count = Math.max(count, minVisibleItems);
      
      setVisibleItemsCount(count);
    };
    
    // Set up resize observer
    resizeObserver.current = new ResizeObserver(updateVisibleItems);
    resizeObserver.current.observe(containerRef.current);
    
    // Initial update
    updateVisibleItems();
    
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [adaptToSpace, screenSizeFilteredItems, minVisibleItems, maxVisibleItems]);
  
  // Update visible items count when screen size changes
  useEffect(() => {
    if (!adaptToScreenSize) return;
    
    const handleResize = () => {
      // Reset visible items count to max when screen size changes
      setVisibleItemsCount(maxVisibleItems);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adaptToScreenSize, maxVisibleItems]);
  
  // Close overflow menu when clicking outside
  useEffect(() => {
    if (!isOverflowMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeOverflowMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOverflowMenuOpen, closeOverflowMenu]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      ref: containerRef as React.RefObject<E>,
      role: 'navigation',
      'aria-label': 'Progressive navigation',
    };
  }, []);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLElement>(
    item: ProgressiveNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    const isActive = item.id === activeId;
    
    return {
      ...props,
      role: 'menuitem',
      tabIndex: item.disabled ? -1 : 0,
      'aria-disabled': item.disabled,
      'aria-current': isActive,
      onClick: (event: React.MouseEvent) => {
        if (item.disabled) return;
        
        if (item.onClick) {
          item.onClick();
        }
        
        setActiveId(item.id);
        closeOverflowMenu();
        
        props?.onClick?.(event as any);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (item.disabled) return;
        
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          
          if (item.onClick) {
            item.onClick();
          }
          
          setActiveId(item.id);
          closeOverflowMenu();
        }
        
        props?.onKeyDown?.(event as any);
      },
    };
  }, [activeId, setActiveId, closeOverflowMenu]);
  
  // Get props for the overflow toggle button
  const getOverflowToggleProps = useCallback(<E extends HTMLElement = HTMLButtonElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'button',
      'aria-haspopup': true,
      'aria-expanded': isOverflowMenuOpen,
      'aria-label': 'More navigation options',
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        toggleOverflowMenu();
        props?.onClick?.(event as any);
      },
    };
  }, [isOverflowMenuOpen, toggleOverflowMenu]);
  
  // Get props for the overflow menu
  const getOverflowMenuProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'menu',
      'aria-label': 'Overflow navigation menu',
      tabIndex: -1,
    };
  }, []);
  
  return {
    activeId,
    setActiveId,
    overflowBehavior,
    setOverflowBehavior,
    isOverflowMenuOpen,
    openOverflowMenu,
    closeOverflowMenu,
    toggleOverflowMenu,
    visibleItems,
    overflowItems,
    containerRef,
    getContainerProps,
    getItemProps,
    getOverflowToggleProps,
    getOverflowMenuProps,
  };
}
