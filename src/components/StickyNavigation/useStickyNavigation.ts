import { useState, useCallback, useRef, useEffect } from 'react';

export interface StickyNavigationItem {
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
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface UseStickyNavigationProps {
  /**
   * Array of navigation items
   */
  items: StickyNavigationItem[];
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
   * Whether the navigation is sticky
   */
  isSticky?: boolean;
  /**
   * Callback when sticky state changes
   */
  onStickyChange?: (isSticky: boolean) => void;
  /**
   * Offset from the top of the viewport when the navigation becomes sticky
   */
  stickyOffset?: number;
  /**
   * Z-index of the sticky navigation
   */
  zIndex?: number;
  /**
   * Whether to add a shadow when the navigation is sticky
   */
  stickyWithShadow?: boolean;
  /**
   * Whether to animate the sticky transition
   */
  animateSticky?: boolean;
  /**
   * Whether to hide the navigation when scrolling down
   */
  hideOnScroll?: boolean;
  /**
   * Scroll threshold for hiding the navigation
   */
  scrollThreshold?: number;
}

export interface UseStickyNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string) => void;
  /**
   * Whether the navigation is currently sticky
   */
  isSticky: boolean;
  /**
   * Whether the navigation is visible (when hideOnScroll is enabled)
   */
  isVisible: boolean;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Reference to the sentinel element (for detecting when to make the navigation sticky)
   */
  sentinelRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for the sentinel element
   */
  getSentinelProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    'aria-hidden': boolean;
    style: React.CSSProperties;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: StickyNavigationItem,
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
 * Hook for creating sticky navigation functionality.
 * 
 * @example
 * ```jsx
 * const MyStickyNavigation = ({ items }) => {
 *   const { 
 *     isSticky,
 *     getContainerProps,
 *     getSentinelProps,
 *     getItemProps
 *   } = useStickyNavigation({
 *     items,
 *     defaultActiveId: 'home',
 *     stickyOffset: 0,
 *   });
 *   
 *   return (
 *     <>
 *       <div {...getSentinelProps()} />
 *       <nav 
 *         {...getContainerProps({ 
 *           className: isSticky ? 'sticky-nav' : 'nav'
 *         })}
 *       >
 *         {items.map(item => (
 *           <a key={item.id} {...getItemProps(item)}>
 *             {item.icon && <span>{item.icon}</span>}
 *             <span>{item.label}</span>
 *           </a>
 *         ))}
 *       </nav>
 *     </>
 *   );
 * };
 * ```
 */
export function useStickyNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  isSticky: controlledIsSticky,
  onStickyChange,
  stickyOffset = 0,
  zIndex = 1000,
  stickyWithShadow = true,
  animateSticky = true,
  hideOnScroll = false,
  scrollThreshold = 50,
}: UseStickyNavigationProps): UseStickyNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || (items.length > 0 ? items[0].id : null));
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for sticky status
  const [internalIsSticky, setInternalIsSticky] = useState<boolean>(false);
  
  // Use controlled or uncontrolled state for sticky status
  const isSticky = controlledIsSticky !== undefined ? controlledIsSticky : internalIsSticky;
  
  // State for visibility (when hideOnScroll is enabled)
  const [isVisible, setIsVisible] = useState<boolean>(true);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLElement>(null);
  
  // Ref for last scroll position
  const lastScrollY = useRef<number>(0);
  
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
  
  // Set up Intersection Observer for sticky behavior
  useEffect(() => {
    if (!sentinelRef.current) return;
    
    const options = {
      rootMargin: `-${stickyOffset}px 0px 0px 0px`,
      threshold: [0],
    };
    
    const observer = new IntersectionObserver(([entry]) => {
      const newIsSticky = !entry.isIntersecting;
      
      if (newIsSticky !== isSticky) {
        if (onStickyChange) {
          onStickyChange(newIsSticky);
        }
        
        if (controlledIsSticky === undefined) {
          setInternalIsSticky(newIsSticky);
        }
      }
    }, options);
    
    observer.observe(sentinelRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [stickyOffset, isSticky, onStickyChange, controlledIsSticky]);
  
  // Handle scroll for hiding the navigation
  useEffect(() => {
    if (!hideOnScroll) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
      
      if (scrollDifference < scrollThreshold) return;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > stickyOffset) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hideOnScroll, scrollThreshold, stickyOffset]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      ref: containerRef as React.RefObject<E>,
      style: {
        ...(isSticky ? {
          position: 'fixed' as const,
          top: stickyOffset,
          left: 0,
          right: 0,
          zIndex,
          ...(stickyWithShadow ? {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          } : {}),
          ...(animateSticky ? {
            transition: 'box-shadow 0.3s ease',
          } : {}),
          ...(hideOnScroll ? {
            transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease',
          } : {}),
        } : {}),
        ...props?.style,
      },
      role: 'navigation',
      'aria-label': 'Sticky navigation',
    };
  }, [isSticky, stickyOffset, zIndex, stickyWithShadow, animateSticky, hideOnScroll, isVisible]);
  
  // Get props for the sentinel element
  const getSentinelProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      ref: sentinelRef as React.RefObject<E>,
      'aria-hidden': true,
      style: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        visibility: 'hidden' as const,
        ...props?.style,
      },
    };
  }, []);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLElement>(
    item: StickyNavigationItem,
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
    isSticky,
    isVisible,
    containerRef,
    sentinelRef,
    getContainerProps,
    getSentinelProps,
    getItemProps,
  };
}
