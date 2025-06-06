import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSidebarProps {
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
   * Whether the sidebar is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether the sidebar is initially expanded (when collapsible)
   */
  defaultExpanded?: boolean;
  /**
   * Whether the sidebar is controlled expanded (when collapsible)
   */
  expanded?: boolean;
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Whether the sidebar supports nested items
   */
  nested?: boolean;
  /**
   * Whether to auto-expand parent items when a child is active
   */
  autoExpandParent?: boolean;
}

export interface UseSidebarReturn {
  /**
   * The currently active item ID
   */
  activeItem: string;
  /**
   * Function to set the active item
   */
  setActiveItem: (id: string) => void;
  /**
   * Whether the sidebar is currently expanded
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
   * Map of expanded section IDs
   */
  expandedSections: Record<string, boolean>;
  /**
   * Function to toggle a section's expanded state
   */
  toggleSection: (id: string) => void;
  /**
   * Function to set a section's expanded state
   */
  setSectionExpanded: (id: string, expanded: boolean) => void;
  /**
   * Function to register a sidebar item
   */
  registerItem: (id: string, parentId?: string) => void;
  /**
   * Function to unregister a sidebar item
   */
  unregisterItem: (id: string) => void;
  /**
   * Map of item IDs to their parent IDs
   */
  itemParents: Record<string, string>;
  /**
   * List of registered item IDs
   */
  itemIds: string[];
  /**
   * Get props for the sidebar container
   */
  getSidebarProps: () => {
    role: string;
    'aria-expanded'?: boolean;
  };
  /**
   * Get props for the sidebar toggle button
   */
  getToggleProps: () => {
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-label': string;
    onClick: () => void;
  };
  /**
   * Get props for a sidebar item
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
  /**
   * Get props for a sidebar section
   */
  getSectionProps: (id: string, disabled?: boolean) => {
    id: string;
    role: string;
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-disabled': boolean;
    disabled: boolean;
    onClick: (event: React.MouseEvent) => void;
    'data-state': 'expanded' | 'collapsed';
  };
}

/**
 * Hook for creating accessible sidebar components.
 * Provides all the necessary props and state for creating a sidebar component.
 * 
 * @example
 * ```jsx
 * const MySidebar = ({ defaultActiveItem, onActiveChange, children }) => {
 *   const { 
 *     activeItem, 
 *     getSidebarProps, 
 *     getItemProps, 
 *     isExpanded,
 *     getToggleProps,
 *     getSectionProps,
 *     expandedSections
 *   } = useSidebar({ defaultActiveItem, onActiveChange });
 *   
 *   return (
 *     <aside {...getSidebarProps()}>
 *       <button {...getToggleProps()}>Toggle</button>
 *       <div className={isExpanded ? 'expanded' : 'collapsed'}>
 *         <div {...getSectionProps('section1')}>
 *           <span>Section 1</span>
 *           <div className={expandedSections['section1'] ? 'visible' : 'hidden'}>
 *             <a {...getItemProps('item1')} href="/item1">Item 1</a>
 *             <a {...getItemProps('item2')} href="/item2">Item 2</a>
 *           </div>
 *         </div>
 *         <a {...getItemProps('item3')} href="/item3">Item 3</a>
 *       </div>
 *     </aside>
 *   );
 * };
 * ```
 */
export function useSidebar({
  defaultActiveItem,
  activeItem: controlledActiveItem,
  onActiveChange,
  collapsible = false,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  nested = false,
  autoExpandParent = true,
}: UseSidebarProps = {}): UseSidebarReturn {
  const [activeItem, setActiveItemState] = useState<string>(defaultActiveItem || '');
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [itemParents, setItemParents] = useState<Record<string, string>>({});
  const [isExpanded, setExpandedState] = useState<boolean>(defaultExpanded);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const sidebarId = useRef(`sidebar-${Math.random().toString(36).substr(2, 9)}`);
  
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
  
  // Auto-expand parent sections when a child is active
  useEffect(() => {
    if (nested && autoExpandParent && activeItem) {
      let parentId = itemParents[activeItem];
      
      while (parentId) {
        setExpandedSections(prev => ({
          ...prev,
          [parentId]: true
        }));
        
        parentId = itemParents[parentId];
      }
    }
  }, [nested, autoExpandParent, activeItem, itemParents]);
  
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
  
  const setSectionExpanded = useCallback((id: string, expanded: boolean) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: expanded
    }));
  }, []);
  
  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);
  
  const registerItem = useCallback((id: string, parentId?: string) => {
    setItemIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    
    if (parentId) {
      setItemParents(prev => ({
        ...prev,
        [id]: parentId
      }));
    }
  }, []);
  
  const unregisterItem = useCallback((id: string) => {
    setItemIds(prev => prev.filter(itemId => itemId !== id));
    
    setItemParents(prev => {
      const newParents = { ...prev };
      delete newParents[id];
      return newParents;
    });
  }, []);

  const getSidebarProps = useCallback(() => {
    return {
      role: 'navigation',
      ...(collapsible ? { 'aria-expanded': isExpanded } : {}),
    };
  }, [collapsible, isExpanded]);

  const getToggleProps = useCallback(() => {
    return {
      'aria-expanded': isExpanded,
      'aria-controls': sidebarId.current,
      'aria-label': isExpanded ? 'Collapse sidebar' : 'Expand sidebar',
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
      id: `sidebar-item-${id}`,
      role: 'menuitem',
      tabIndex: isActive ? 0 : -1,
      'aria-current': (isActive ? 'page' : false) as boolean | 'page' | 'step' | 'location' | 'date' | 'time',
      'aria-disabled': disabled,
      disabled,
      onClick: handleClick,
      'data-state': (isActive ? 'active' : 'inactive') as 'active' | 'inactive',
    };
  }, [activeItem, setActiveItem]);

  const getSectionProps = useCallback((id: string, disabled = false) => {
    const isExpanded = expandedSections[id] || false;
    const sectionId = `sidebar-section-${id}`;
    const contentId = `sidebar-section-content-${id}`;

    const handleClick = (event: React.MouseEvent) => {
      if (!disabled) {
        event.preventDefault();
        toggleSection(id);
      }
    };

    return {
      id: sectionId,
      role: 'button',
      'aria-expanded': isExpanded,
      'aria-controls': contentId,
      'aria-disabled': disabled,
      disabled,
      onClick: handleClick,
      'data-state': (isExpanded ? 'expanded' : 'collapsed') as 'expanded' | 'collapsed',
    };
  }, [expandedSections, toggleSection]);

  return {
    activeItem,
    setActiveItem,
    isExpanded,
    toggleExpanded,
    setExpanded,
    expandedSections,
    toggleSection,
    setSectionExpanded,
    registerItem,
    unregisterItem,
    itemParents,
    itemIds,
    getSidebarProps,
    getToggleProps,
    getItemProps,
    getSectionProps,
  };
}
