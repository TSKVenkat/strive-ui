import { useState, useCallback, useEffect } from 'react';

export interface BottomNavigationItem {
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
   * Optional badge content for the item
   */
  badge?: React.ReactNode;
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
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface UseBottomNavigationProps {
  /**
   * Array of navigation items
   */
  items: BottomNavigationItem[];
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
   * Whether to show labels
   */
  showLabels?: boolean;
  /**
   * Whether to show labels only for active item
   */
  showLabelsOnlyForActive?: boolean;
  /**
   * Whether the bottom navigation is visible
   */
  visible?: boolean;
  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Whether to hide the bottom navigation when scrolling down
   */
  hideOnScroll?: boolean;
  /**
   * Scroll threshold for hiding the bottom navigation
   */
  scrollThreshold?: number;
}

export interface UseBottomNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string) => void;
  /**
   * Whether the bottom navigation is visible
   */
  visible: boolean;
  /**
   * Show the bottom navigation
   */
  show: () => void;
  /**
   * Hide the bottom navigation
   */
  hide: () => void;
  /**
   * Toggle the visibility of the bottom navigation
   */
  toggleVisibility: () => void;
  /**
   * Whether to show labels
   */
  showLabels: boolean;
  /**
   * Whether to show labels only for active item
   */
  showLabelsOnlyForActive: boolean;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    item: BottomNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * Hook for creating bottom navigation functionality.
 * 
 * @example
 * ```jsx
 * const MyBottomNavigation = ({ items }) => {
 *   const { 
 *     activeId,
 *     getContainerProps,
 *     getItemProps,
 *     showLabels,
 *     showLabelsOnlyForActive
 *   } = useBottomNavigation({
 *     items,
 *     defaultActiveId: 'home',
 *     showLabels: true,
 *   });
 *   
 *   return (
 *     <div {...getContainerProps()}>
 *       {items.map(item => (
 *         <div key={item.id} {...getItemProps(item)}>
 *           {item.icon}
 *           {(showLabels && (!showLabelsOnlyForActive || item.id === activeId)) && (
 *             <span>{item.label}</span>
 *           )}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export function useBottomNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  showLabels = true,
  showLabelsOnlyForActive = false,
  visible: controlledVisible = true,
  onVisibleChange,
  hideOnScroll = false,
  scrollThreshold = 50,
}: UseBottomNavigationProps): UseBottomNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || (items.length > 0 ? items[0].id : null));
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for visibility
  const [internalVisible, setInternalVisible] = useState<boolean>(controlledVisible);
  
  // Use controlled or uncontrolled state for visibility
  const visible = controlledVisible !== undefined ? controlledVisible : internalVisible;
  
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
  
  // Show the bottom navigation
  const show = useCallback(() => {
    const newVisible = true;
    
    if (newVisible !== visible) {
      if (onVisibleChange) {
        onVisibleChange(newVisible);
      }
      
      if (controlledVisible === undefined) {
        setInternalVisible(newVisible);
      }
    }
  }, [visible, onVisibleChange, controlledVisible]);
  
  // Hide the bottom navigation
  const hide = useCallback(() => {
    const newVisible = false;
    
    if (newVisible !== visible) {
      if (onVisibleChange) {
        onVisibleChange(newVisible);
      }
      
      if (controlledVisible === undefined) {
        setInternalVisible(newVisible);
      }
    }
  }, [visible, onVisibleChange, controlledVisible]);
  
  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
  }, [visible, hide, show]);
  
  // Handle scroll for hiding the bottom navigation
  useEffect(() => {
    if (!hideOnScroll) return;
    
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      if (scrollDifference < scrollThreshold) return;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        hide();
      } else {
        // Scrolling up
        show();
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hideOnScroll, scrollThreshold, hide, show]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'navigation',
      'aria-label': 'Bottom navigation',
    };
  }, []);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    item: BottomNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    const isActive = item.id === activeId;
    
    return {
      ...props,
      role: 'button',
      tabIndex: item.disabled ? -1 : 0,
      'aria-disabled': item.disabled,
      'aria-current': isActive,
      onClick: (event: React.MouseEvent) => {
        if (item.disabled) return;
        
        if (item.onClick) {
          item.onClick();
        }
        
        setActiveId(item.id);
        
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
        }
        
        props?.onKeyDown?.(event as any);
      },
    };
  }, [activeId, setActiveId]);
  
  return {
    activeId,
    setActiveId,
    visible,
    show,
    hide,
    toggleVisibility,
    showLabels,
    showLabelsOnlyForActive,
    getContainerProps,
    getItemProps,
  };
}
