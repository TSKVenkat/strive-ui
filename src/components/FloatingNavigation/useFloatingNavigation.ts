import { useState, useCallback, useRef, useEffect } from 'react';

export type FloatingPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-center' | 'right-center' | 'center';

export interface FloatingNavigationItem {
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
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Function to execute when the item is clicked
   */
  onClick?: () => void;
  /**
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface UseFloatingNavigationProps {
  /**
   * Array of navigation items
   */
  items: FloatingNavigationItem[];
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
   * Default position of the floating navigation
   */
  defaultPosition?: FloatingPosition;
  /**
   * Controlled position of the floating navigation
   */
  position?: FloatingPosition;
  /**
   * Callback when position changes
   */
  onPositionChange?: (position: FloatingPosition) => void;
  /**
   * Whether the floating navigation is draggable
   */
  draggable?: boolean;
  /**
   * Whether the floating navigation is visible
   */
  visible?: boolean;
  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Whether the floating navigation is collapsed
   */
  collapsed?: boolean;
  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Offset from the edge of the screen
   */
  offset?: number;
  /**
   * Z-index of the floating navigation
   */
  zIndex?: number;
}

export interface UseFloatingNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string | null) => void;
  /**
   * Current position of the floating navigation
   */
  position: FloatingPosition;
  /**
   * Set the position of the floating navigation
   */
  setPosition: (position: FloatingPosition) => void;
  /**
   * Whether the floating navigation is visible
   */
  visible: boolean;
  /**
   * Show the floating navigation
   */
  show: () => void;
  /**
   * Hide the floating navigation
   */
  hide: () => void;
  /**
   * Toggle the visibility of the floating navigation
   */
  toggleVisibility: () => void;
  /**
   * Whether the floating navigation is collapsed
   */
  collapsed: boolean;
  /**
   * Collapse the floating navigation
   */
  collapse: () => void;
  /**
   * Expand the floating navigation
   */
  expand: () => void;
  /**
   * Toggle the collapsed state of the floating navigation
   */
  toggleCollapsed: () => void;
  /**
   * Custom position of the floating navigation (when dragged)
   */
  customPosition: { x: number; y: number } | null;
  /**
   * Reset the custom position
   */
  resetPosition: () => void;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Handle the start of dragging
   */
  handleDragStart: (event: React.MouseEvent | React.TouchEvent) => void;
  /**
   * Handle dragging
   */
  handleDrag: (event: MouseEvent | TouchEvent) => void;
  /**
   * Handle the end of dragging
   */
  handleDragEnd: () => void;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    onMouseDown?: (event: React.MouseEvent) => void;
    onTouchStart?: (event: React.TouchEvent) => void;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    item: FloatingNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean | undefined;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /**
   * Get props for the toggle button
   */
  getToggleProps: <E extends HTMLElement = HTMLButtonElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
    'aria-expanded': boolean;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
}

/**
 * Hook for creating floating navigation functionality.
 * 
 * @example
 * ```jsx
 * const MyFloatingNavigation = ({ items }) => {
 *   const { 
 *     visible,
 *     collapsed,
 *     toggleCollapsed,
 *     getContainerProps,
 *     getItemProps,
 *     getToggleProps
 *   } = useFloatingNavigation({
 *     items,
 *     defaultPosition: 'bottom-right',
 *     draggable: true,
 *   });
 *   
 *   if (!visible) return null;
 *   
 *   return (
 *     <div {...getContainerProps()}>
 *       <button {...getToggleProps()}>
 *         {collapsed ? 'Expand' : 'Collapse'}
 *       </button>
 *       {!collapsed && (
 *         <div>
 *           {items.map(item => (
 *             <div key={item.id} {...getItemProps(item)}>
 *               {item.icon && <span>{item.icon}</span>}
 *               {!collapsed && <span>{item.label}</span>}
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export function useFloatingNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  defaultPosition = 'bottom-right',
  position: controlledPosition,
  onPositionChange,
  draggable = false,
  visible: controlledVisible = true,
  onVisibleChange,
  collapsed: controlledCollapsed = false,
  onCollapsedChange,
  offset = 16,
  zIndex = 1000,
}: UseFloatingNavigationProps): UseFloatingNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || null);
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for position
  const [internalPosition, setInternalPosition] = useState<FloatingPosition>(defaultPosition);
  
  // Use controlled or uncontrolled state for position
  const position = controlledPosition !== undefined ? controlledPosition : internalPosition;
  
  // State for visibility
  const [internalVisible, setInternalVisible] = useState<boolean>(controlledVisible);
  
  // Use controlled or uncontrolled state for visibility
  const visible = controlledVisible !== undefined ? controlledVisible : internalVisible;
  
  // State for collapsed
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(controlledCollapsed);
  
  // Use controlled or uncontrolled state for collapsed
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  
  // State for custom position (when dragged)
  const [customPosition, setCustomPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Refs for dragging
  const containerRef = useRef<HTMLElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Set active item
  const setActiveId = useCallback((id: string | null) => {
    if (id !== activeId) {
      if (onActiveChange && id !== null) {
        onActiveChange(id);
      }
      
      if (controlledActiveId === undefined) {
        setInternalActiveId(id);
      }
    }
  }, [activeId, onActiveChange, controlledActiveId]);
  
  // Set position
  const setPosition = useCallback((newPosition: FloatingPosition) => {
    if (newPosition !== position) {
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
      
      if (controlledPosition === undefined) {
        setInternalPosition(newPosition);
      }
      
      // Reset custom position when changing to a predefined position
      setCustomPosition(null);
    }
  }, [position, onPositionChange, controlledPosition]);
  
  // Show the floating navigation
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
  
  // Hide the floating navigation
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
  
  // Collapse the floating navigation
  const collapse = useCallback(() => {
    const newCollapsed = true;
    
    if (newCollapsed !== collapsed) {
      if (onCollapsedChange) {
        onCollapsedChange(newCollapsed);
      }
      
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newCollapsed);
      }
    }
  }, [collapsed, onCollapsedChange, controlledCollapsed]);
  
  // Expand the floating navigation
  const expand = useCallback(() => {
    const newCollapsed = false;
    
    if (newCollapsed !== collapsed) {
      if (onCollapsedChange) {
        onCollapsedChange(newCollapsed);
      }
      
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(newCollapsed);
      }
    }
  }, [collapsed, onCollapsedChange, controlledCollapsed]);
  
  // Toggle collapsed state
  const toggleCollapsed = useCallback(() => {
    if (collapsed) {
      expand();
    } else {
      collapse();
    }
  }, [collapsed, expand, collapse]);
  
  // Reset custom position
  const resetPosition = useCallback(() => {
    setCustomPosition(null);
  }, []);
  
  // Handle the start of dragging
  const handleDragStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable || !containerRef.current) return;
    
    // Prevent default behavior
    event.preventDefault();
    
    // Get the current position of the container
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get the position of the mouse/touch
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    // Calculate the offset between the mouse/touch position and the container position
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    
    // Set dragging flag
    isDragging.current = true;
    
    // Add event listeners for drag and drag end
    if ('touches' in event) {
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }
  }, [draggable]);
  
  // Handle dragging
  const handleDrag = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    
    // Get the position of the mouse/touch
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    // Calculate the new position of the container
    const x = clientX - dragOffset.current.x;
    const y = clientY - dragOffset.current.y;
    
    // Update the custom position
    setCustomPosition({ x, y });
  }, []);
  
  // Handle the end of dragging
  const handleDragEnd = useCallback(() => {
    // Reset dragging flag
    isDragging.current = false;
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
  }, [handleDrag]);
  
  // Calculate the position style based on the current position
  const getPositionStyle = useCallback(() => {
    if (customPosition) {
      return {
        position: 'fixed' as const,
        top: customPosition.y,
        left: customPosition.x,
        transform: 'none',
        zIndex,
      };
    }
    
    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex,
    };
    
    switch (position) {
      case 'top-left':
        style.top = offset;
        style.left = offset;
        break;
      case 'top-center':
        style.top = offset;
        style.left = '50%';
        style.transform = 'translateX(-50%)';
        break;
      case 'top-right':
        style.top = offset;
        style.right = offset;
        break;
      case 'bottom-left':
        style.bottom = offset;
        style.left = offset;
        break;
      case 'bottom-center':
        style.bottom = offset;
        style.left = '50%';
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        style.bottom = offset;
        style.right = offset;
        break;
      case 'left-center':
        style.left = offset;
        style.top = '50%';
        style.transform = 'translateY(-50%)';
        break;
      case 'right-center':
        style.right = offset;
        style.top = '50%';
        style.transform = 'translateY(-50%)';
        break;
      case 'center':
        style.top = '50%';
        style.left = '50%';
        style.transform = 'translate(-50%, -50%)';
        break;
    }
    
    return style;
  }, [position, offset, zIndex, customPosition]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    const positionStyle = getPositionStyle();
    
    return {
      ...props,
      ref: containerRef as React.RefObject<E>,
      style: {
        ...positionStyle,
        ...props?.style,
      },
      ...(draggable ? {
        onMouseDown: (event: React.MouseEvent) => {
          handleDragStart(event);
          props?.onMouseDown?.(event as any);
        },
        onTouchStart: (event: React.TouchEvent) => {
          handleDragStart(event);
          props?.onTouchStart?.(event as any);
        },
      } : {}),
    };
  }, [getPositionStyle, draggable, handleDragStart]);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    item: FloatingNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    const isActive = item.active || item.id === activeId;
    
    return {
      ...props,
      role: 'menuitem',
      tabIndex: isActive ? 0 : -1,
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
  
  // Get props for the toggle button
  const getToggleProps = useCallback(<E extends HTMLElement = HTMLButtonElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'button',
      'aria-label': collapsed ? 'Expand navigation' : 'Collapse navigation',
      'aria-expanded': !collapsed,
      tabIndex: 0,
      onClick: (event: React.MouseEvent) => {
        toggleCollapsed();
        props?.onClick?.(event as any);
      },
    };
  }, [collapsed, toggleCollapsed]);
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);
  
  return {
    activeId,
    setActiveId,
    position,
    setPosition,
    visible,
    show,
    hide,
    toggleVisibility,
    collapsed,
    collapse,
    expand,
    toggleCollapsed,
    customPosition,
    resetPosition,
    containerRef,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    getContainerProps,
    getItemProps,
    getToggleProps,
  };
}
