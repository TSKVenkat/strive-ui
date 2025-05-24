import { useState, useCallback, useRef, useEffect } from 'react';

export type NavigationLayout = 'horizontal' | 'vertical' | 'bottom' | 'floating' | 'sidebar' | 'drawer';

export interface AdaptiveNavigationItem {
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
   * Minimum breakpoint at which the item should be visible (in pixels)
   */
  minBreakpoint?: number;
  /**
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface BreakpointConfig {
  /**
   * Layout to use for mobile devices (0-639px)
   */
  mobile?: NavigationLayout;
  /**
   * Layout to use for tablet devices (640px-1023px)
   */
  tablet?: NavigationLayout;
  /**
   * Layout to use for desktop devices (1024px+)
   */
  desktop?: NavigationLayout;
  /**
   * Custom breakpoints for specific screen widths
   */
  custom?: {
    /**
     * Minimum screen width in pixels
     */
    minWidth: number;
    /**
     * Layout to use at this breakpoint
     */
    layout: NavigationLayout;
  }[];
}

export interface UseAdaptiveNavigationProps {
  /**
   * Array of navigation items
   */
  items: AdaptiveNavigationItem[];
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
   * Default layout to use
   */
  defaultLayout?: NavigationLayout;
  /**
   * Controlled layout
   */
  layout?: NavigationLayout;
  /**
   * Callback when layout changes
   */
  onLayoutChange?: (layout: NavigationLayout) => void;
  /**
   * Breakpoint configuration for responsive layouts
   */
  breakpoints?: BreakpointConfig;
  /**
   * Whether to adapt to screen size automatically
   */
  adaptToScreenSize?: boolean;
  /**
   * Whether to adapt to user preferences
   */
  adaptToUserPreferences?: boolean;
  /**
   * Whether to adapt to device type
   */
  adaptToDeviceType?: boolean;
  /**
   * Whether to adapt to orientation
   */
  adaptToOrientation?: boolean;
  /**
   * Whether the navigation is open (for drawer/sidebar layouts)
   */
  isOpen?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to collapse items to icons only when space is limited
   */
  collapseToIcons?: boolean;
  /**
   * Storage key for persisting user preferences
   */
  storageKey?: string;
}

export interface UseAdaptiveNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string) => void;
  /**
   * Current layout
   */
  currentLayout: NavigationLayout;
  /**
   * Set the layout
   */
  setLayout: (layout: NavigationLayout) => void;
  /**
   * Whether the navigation is open (for drawer/sidebar layouts)
   */
  isOpen: boolean;
  /**
   * Open the navigation
   */
  open: () => void;
  /**
   * Close the navigation
   */
  close: () => void;
  /**
   * Toggle the navigation open state
   */
  toggle: () => void;
  /**
   * Whether icons should be shown without labels
   */
  iconsOnly: boolean;
  /**
   * Set whether icons should be shown without labels
   */
  setIconsOnly: (iconsOnly: boolean) => void;
  /**
   * Current screen size
   */
  screenSize: 'mobile' | 'tablet' | 'desktop';
  /**
   * Current orientation
   */
  orientation: 'portrait' | 'landscape';
  /**
   * Current device type
   */
  deviceType: 'mobile' | 'tablet' | 'desktop';
  /**
   * Filtered items based on current breakpoint
   */
  filteredItems: AdaptiveNavigationItem[];
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
    'data-layout': NavigationLayout;
    'data-icons-only': boolean;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: AdaptiveNavigationItem,
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
   * Get props for the toggle button
   */
  getToggleProps: <E extends HTMLElement = HTMLButtonElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-label': string;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
}

/**
 * Hook for creating adaptive navigation functionality that adjusts based on device, screen size, and user preferences.
 * 
 * @example
 * ```jsx
 * const MyAdaptiveNavigation = ({ items }) => {
 *   const { 
 *     currentLayout,
 *     filteredItems,
 *     isOpen,
 *     toggle,
 *     getContainerProps,
 *     getItemProps,
 *     getToggleProps
 *   } = useAdaptiveNavigation({
 *     items,
 *     defaultActiveId: 'home',
 *     adaptToScreenSize: true,
 *     breakpoints: {
 *       mobile: 'bottom',
 *       tablet: 'sidebar',
 *       desktop: 'horizontal',
 *     },
 *   });
 *   
 *   return (
 *     <>
 *       {(currentLayout === 'sidebar' || currentLayout === 'drawer') && (
 *         <button {...getToggleProps()}>
 *           Menu
 *         </button>
 *       )}
 *       
 *       <nav {...getContainerProps({ className: `layout-${currentLayout}` })}>
 *         {filteredItems.map(item => (
 *           <a key={item.id} {...getItemProps(item)}>
 *             {item.icon}
 *             {item.label}
 *           </a>
 *         ))}
 *       </nav>
 *     </>
 *   );
 * };
 * ```
 */
export function useAdaptiveNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  defaultLayout = 'horizontal',
  layout: controlledLayout,
  onLayoutChange,
  breakpoints = {
    mobile: 'bottom',
    tablet: 'sidebar',
    desktop: 'horizontal',
  },
  adaptToScreenSize = true,
  adaptToUserPreferences = true,
  adaptToDeviceType = true,
  adaptToOrientation = true,
  isOpen: controlledIsOpen,
  onOpenChange,
  collapseToIcons = true,
  storageKey = 'strive-ui-adaptive-navigation',
}: UseAdaptiveNavigationProps): UseAdaptiveNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || (items.length > 0 ? items[0].id : null));
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for layout
  const [internalLayout, setInternalLayout] = useState<NavigationLayout>(defaultLayout);
  
  // Use controlled or uncontrolled state for layout
  const currentLayout = controlledLayout !== undefined ? controlledLayout : internalLayout;
  
  // State for open status (for drawer/sidebar layouts)
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  
  // Use controlled or uncontrolled state for open status
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  // State for icons only mode
  const [iconsOnly, setIconsOnly] = useState<boolean>(false);
  
  // State for screen size
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // State for orientation
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  
  // State for device type
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Generate a unique ID for the navigation
  const navigationId = useRef(`adaptive-nav-${Math.random().toString(36).substring(2, 9)}`);
  
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
  
  // Set layout
  const setLayout = useCallback((layout: NavigationLayout) => {
    if (layout !== currentLayout) {
      if (onLayoutChange) {
        onLayoutChange(layout);
      }
      
      if (controlledLayout === undefined) {
        setInternalLayout(layout);
        
        // Save user preference if enabled
        if (adaptToUserPreferences && typeof window !== 'undefined') {
          try {
            const preferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
            localStorage.setItem(storageKey, JSON.stringify({
              ...preferences,
              layout,
            }));
          } catch (error) {
            console.error('Error saving adaptive navigation preferences:', error);
          }
        }
      }
    }
  }, [currentLayout, onLayoutChange, controlledLayout, adaptToUserPreferences, storageKey]);
  
  // Open the navigation
  const open = useCallback(() => {
    if (!isOpen) {
      if (onOpenChange) {
        onOpenChange(true);
      }
      
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(true);
      }
    }
  }, [isOpen, onOpenChange, controlledIsOpen]);
  
  // Close the navigation
  const close = useCallback(() => {
    if (isOpen) {
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(false);
      }
    }
  }, [isOpen, onOpenChange, controlledIsOpen]);
  
  // Toggle the navigation
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Detect screen size, orientation, and device type
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const detectScreenProperties = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Detect screen size
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
      
      // Detect orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
      
      // Detect device type (simplified)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent);
      
      if (isMobile && !isTablet) {
        setDeviceType('mobile');
      } else if (isTablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    detectScreenProperties();
    
    window.addEventListener('resize', detectScreenProperties);
    
    return () => {
      window.removeEventListener('resize', detectScreenProperties);
    };
  }, []);
  
  // Load user preferences
  useEffect(() => {
    if (!adaptToUserPreferences || typeof window === 'undefined') return;
    
    try {
      const preferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      if (preferences.layout && controlledLayout === undefined) {
        setInternalLayout(preferences.layout);
      }
      
      if (preferences.iconsOnly !== undefined) {
        setIconsOnly(preferences.iconsOnly);
      }
    } catch (error) {
      console.error('Error loading adaptive navigation preferences:', error);
    }
  }, [adaptToUserPreferences, storageKey, controlledLayout]);
  
  // Adapt layout based on screen size
  useEffect(() => {
    if (!adaptToScreenSize) return;
    
    let newLayout: NavigationLayout | undefined;
    
    // Check custom breakpoints first
    if (breakpoints.custom && breakpoints.custom.length > 0) {
      // Sort custom breakpoints by minWidth in descending order
      const sortedBreakpoints = [...breakpoints.custom].sort((a, b) => b.minWidth - a.minWidth);
      
      for (const breakpoint of sortedBreakpoints) {
        if (typeof window !== 'undefined' && window.innerWidth >= breakpoint.minWidth) {
          newLayout = breakpoint.layout;
          break;
        }
      }
    }
    
    // If no custom breakpoint matched, use predefined ones
    if (!newLayout) {
      if (screenSize === 'mobile' && breakpoints.mobile) {
        newLayout = breakpoints.mobile;
      } else if (screenSize === 'tablet' && breakpoints.tablet) {
        newLayout = breakpoints.tablet;
      } else if (screenSize === 'desktop' && breakpoints.desktop) {
        newLayout = breakpoints.desktop;
      }
    }
    
    if (newLayout && newLayout !== currentLayout && controlledLayout === undefined) {
      setInternalLayout(newLayout);
    }
  }, [adaptToScreenSize, screenSize, breakpoints, currentLayout, controlledLayout]);
  
  // Adapt layout based on device type
  useEffect(() => {
    if (!adaptToDeviceType) return;
    
    // Only change layout if not already set by screen size
    if (controlledLayout === undefined && !adaptToScreenSize) {
      if (deviceType === 'mobile' && breakpoints.mobile) {
        setInternalLayout(breakpoints.mobile);
      } else if (deviceType === 'tablet' && breakpoints.tablet) {
        setInternalLayout(breakpoints.tablet);
      } else if (deviceType === 'desktop' && breakpoints.desktop) {
        setInternalLayout(breakpoints.desktop);
      }
    }
  }, [adaptToDeviceType, deviceType, breakpoints, adaptToScreenSize, controlledLayout]);
  
  // Adapt to orientation changes
  useEffect(() => {
    if (!adaptToOrientation) return;
    
    // Adjust layout based on orientation for mobile and tablet
    if (controlledLayout === undefined && (deviceType === 'mobile' || deviceType === 'tablet')) {
      if (orientation === 'portrait') {
        // In portrait mode, prefer bottom or drawer navigation for mobile
        if (deviceType === 'mobile' && currentLayout !== 'bottom' && currentLayout !== 'drawer') {
          setInternalLayout('bottom');
        }
      } else {
        // In landscape mode, prefer horizontal or sidebar navigation
        if (deviceType === 'mobile' && currentLayout === 'bottom') {
          setInternalLayout('horizontal');
        }
      }
    }
  }, [adaptToOrientation, orientation, deviceType, currentLayout, controlledLayout]);
  
  // Adapt icons only mode based on screen size
  useEffect(() => {
    if (!collapseToIcons) return;
    
    // Automatically switch to icons only on smaller screens
    const shouldUseIconsOnly = screenSize === 'mobile' || 
      (screenSize === 'tablet' && (currentLayout === 'horizontal' || currentLayout === 'bottom'));
    
    setIconsOnly(shouldUseIconsOnly);
    
    // Save preference
    if (adaptToUserPreferences && typeof window !== 'undefined') {
      try {
        const preferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
        localStorage.setItem(storageKey, JSON.stringify({
          ...preferences,
          iconsOnly: shouldUseIconsOnly,
        }));
      } catch (error) {
        console.error('Error saving adaptive navigation preferences:', error);
      }
    }
  }, [collapseToIcons, screenSize, currentLayout, adaptToUserPreferences, storageKey]);
  
  // Filter items based on current breakpoint
  const filteredItems = useMemo(() => {
    if (typeof window === 'undefined') return items;
    
    const width = window.innerWidth;
    
    return items.filter(item => {
      if (item.minBreakpoint === undefined) return true;
      return width >= item.minBreakpoint;
    });
  }, [items]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'navigation',
      'aria-label': 'Adaptive navigation',
      'data-layout': currentLayout,
      'data-icons-only': iconsOnly,
    };
  }, [currentLayout, iconsOnly]);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLElement>(
    item: AdaptiveNavigationItem,
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
        
        // Automatically close navigation on mobile when item is clicked
        if ((currentLayout === 'drawer' || currentLayout === 'sidebar') && 
            (screenSize === 'mobile' || screenSize === 'tablet')) {
          close();
        }
        
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
          
          // Automatically close navigation on mobile when item is clicked
          if ((currentLayout === 'drawer' || currentLayout === 'sidebar') && 
              (screenSize === 'mobile' || screenSize === 'tablet')) {
            close();
          }
        }
        
        props?.onKeyDown?.(event as any);
      },
    };
  }, [activeId, setActiveId, currentLayout, screenSize, close]);
  
  // Get props for the toggle button
  const getToggleProps = useCallback(<E extends HTMLElement = HTMLButtonElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'button',
      'aria-expanded': isOpen,
      'aria-controls': navigationId.current,
      'aria-label': isOpen ? 'Close navigation' : 'Open navigation',
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        toggle();
        props?.onClick?.(event as any);
      },
    };
  }, [isOpen, toggle]);
  
  return {
    activeId,
    setActiveId,
    currentLayout,
    setLayout,
    isOpen,
    open,
    close,
    toggle,
    iconsOnly,
    setIconsOnly,
    screenSize,
    orientation,
    deviceType,
    filteredItems,
    getContainerProps,
    getItemProps,
    getToggleProps,
  };
}
