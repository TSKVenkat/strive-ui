import { useState, useCallback, useRef, useEffect } from 'react';

export interface SmartNavigationItem {
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
   * Initial weight/importance of the item (higher = more important)
   */
  initialWeight?: number;
  /**
   * Tags associated with this item for contextual relevance
   */
  tags?: string[];
  /**
   * Any additional data to associate with the item
   */
  data?: any;
}

export interface SmartNavigationUsageData {
  /**
   * Item ID
   */
  id: string;
  /**
   * Number of times the item has been clicked
   */
  clickCount: number;
  /**
   * Timestamp of the last click
   */
  lastClickTime: number;
  /**
   * Current calculated weight
   */
  weight: number;
}

export interface UseSmartNavigationProps {
  /**
   * Array of navigation items
   */
  items: SmartNavigationItem[];
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
   * Maximum number of items to show
   */
  maxVisibleItems?: number;
  /**
   * Whether to enable learning from user behavior
   */
  enableLearning?: boolean;
  /**
   * Whether to enable context awareness
   */
  enableContextAwareness?: boolean;
  /**
   * Current context tags to prioritize items by
   */
  contextTags?: string[];
  /**
   * Storage key for persisting usage data
   */
  storageKey?: string;
  /**
   * Weight decay factor (0-1, lower means faster decay)
   */
  weightDecayFactor?: number;
  /**
   * Weight boost for each click
   */
  clickWeightBoost?: number;
  /**
   * Weight boost for contextual relevance
   */
  contextRelevanceBoost?: number;
  /**
   * Time window in milliseconds for recency boost
   */
  recencyWindow?: number;
}

export interface UseSmartNavigationReturn {
  /**
   * Currently active item ID
   */
  activeId: string | null;
  /**
   * Set the active item ID
   */
  setActiveId: (id: string) => void;
  /**
   * Smart-sorted navigation items
   */
  sortedItems: SmartNavigationItem[];
  /**
   * Visible navigation items (limited by maxVisibleItems)
   */
  visibleItems: SmartNavigationItem[];
  /**
   * Hidden navigation items
   */
  hiddenItems: SmartNavigationItem[];
  /**
   * Usage data for all items
   */
  usageData: Record<string, SmartNavigationUsageData>;
  /**
   * Reset usage data to initial state
   */
  resetUsageData: () => void;
  /**
   * Record a click on an item
   */
  recordItemClick: (id: string) => void;
  /**
   * Update context tags
   */
  updateContextTags: (tags: string[]) => void;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for a navigation item
   */
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: SmartNavigationItem,
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
 * Hook for creating smart navigation functionality that adapts to user behavior and context.
 * 
 * @example
 * ```jsx
 * const MySmartNavigation = ({ items }) => {
 *   const { 
 *     visibleItems,
 *     hiddenItems,
 *     getContainerProps,
 *     getItemProps
 *   } = useSmartNavigation({
 *     items,
 *     defaultActiveId: 'home',
 *     enableLearning: true,
 *     maxVisibleItems: 5,
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
 *       {hiddenItems.length > 0 && (
 *         <div className="more-menu">
 *           {hiddenItems.map(item => (
 *             <a key={item.id} {...getItemProps(item)}>
 *               {item.label}
 *             </a>
 *           ))}
 *         </div>
 *       )}
 *     </nav>
 *   );
 * };
 * ```
 */
export function useSmartNavigation({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  maxVisibleItems = Infinity,
  enableLearning = true,
  enableContextAwareness = false,
  contextTags = [],
  storageKey = 'strive-ui-smart-navigation',
  weightDecayFactor = 0.9,
  clickWeightBoost = 1,
  contextRelevanceBoost = 0.5,
  recencyWindow = 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}: UseSmartNavigationProps): UseSmartNavigationReturn {
  // State for active item
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId || (items.length > 0 ? items[0].id : null));
  
  // Use controlled or uncontrolled state for active item
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  
  // State for context tags
  const [internalContextTags, setInternalContextTags] = useState<string[]>(contextTags);
  
  // Use the provided context tags or internal state
  const currentContextTags = contextTags.length > 0 ? contextTags : internalContextTags;
  
  // Initialize usage data
  const initializeUsageData = useCallback((): Record<string, SmartNavigationUsageData> => {
    const initialData: Record<string, SmartNavigationUsageData> = {};
    
    items.forEach(item => {
      initialData[item.id] = {
        id: item.id,
        clickCount: 0,
        lastClickTime: 0,
        weight: item.initialWeight || 0,
      };
    });
    
    return initialData;
  }, [items]);
  
  // Try to load usage data from localStorage
  const loadUsageData = useCallback((): Record<string, SmartNavigationUsageData> => {
    if (typeof window === 'undefined' || !enableLearning) {
      return initializeUsageData();
    }
    
    try {
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as Record<string, SmartNavigationUsageData>;
        
        // Ensure all current items have usage data
        const mergedData = { ...initializeUsageData() };
        
        // Only keep data for items that still exist
        Object.keys(parsedData).forEach(id => {
          if (mergedData[id]) {
            mergedData[id] = parsedData[id];
          }
        });
        
        return mergedData;
      }
    } catch (error) {
      console.error('Error loading smart navigation usage data:', error);
    }
    
    return initializeUsageData();
  }, [enableLearning, initializeUsageData, storageKey]);
  
  // State for usage data
  const [usageData, setUsageData] = useState<Record<string, SmartNavigationUsageData>>(loadUsageData);
  
  // Save usage data to localStorage
  const saveUsageData = useCallback((data: Record<string, SmartNavigationUsageData>) => {
    if (typeof window === 'undefined' || !enableLearning) {
      return;
    }
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving smart navigation usage data:', error);
    }
  }, [enableLearning, storageKey]);
  
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
  
  // Reset usage data
  const resetUsageData = useCallback(() => {
    const newData = initializeUsageData();
    setUsageData(newData);
    saveUsageData(newData);
  }, [initializeUsageData, saveUsageData]);
  
  // Record a click on an item
  const recordItemClick = useCallback((id: string) => {
    if (!enableLearning || !usageData[id]) {
      return;
    }
    
    const now = Date.now();
    
    setUsageData(prevData => {
      const newData = { ...prevData };
      
      newData[id] = {
        ...newData[id],
        clickCount: newData[id].clickCount + 1,
        lastClickTime: now,
        weight: newData[id].weight + clickWeightBoost,
      };
      
      return newData;
    });
  }, [enableLearning, usageData, clickWeightBoost]);
  
  // Update context tags
  const updateContextTags = useCallback((tags: string[]) => {
    setInternalContextTags(tags);
  }, []);
  
  // Calculate item weights based on usage and context
  const calculateItemWeights = useCallback(() => {
    if (!enableLearning) {
      return usageData;
    }
    
    const now = Date.now();
    const newData = { ...usageData };
    
    // Apply weight decay and recency boost
    Object.keys(newData).forEach(id => {
      const item = items.find(i => i.id === id);
      if (!item) return;
      
      // Apply weight decay
      newData[id].weight = newData[id].weight * weightDecayFactor;
      
      // Apply recency boost
      const timeSinceLastClick = now - newData[id].lastClickTime;
      if (newData[id].lastClickTime > 0 && timeSinceLastClick < recencyWindow) {
        const recencyFactor = 1 - (timeSinceLastClick / recencyWindow);
        newData[id].weight += recencyFactor * clickWeightBoost;
      }
      
      // Apply context relevance boost
      if (enableContextAwareness && item.tags && currentContextTags.length > 0) {
        const matchingTags = item.tags.filter(tag => currentContextTags.includes(tag));
        if (matchingTags.length > 0) {
          const contextBoost = (matchingTags.length / currentContextTags.length) * contextRelevanceBoost;
          newData[id].weight += contextBoost;
        }
      }
    });
    
    return newData;
  }, [
    enableLearning,
    usageData,
    items,
    weightDecayFactor,
    recencyWindow,
    clickWeightBoost,
    enableContextAwareness,
    currentContextTags,
    contextRelevanceBoost,
  ]);
  
  // Sort items by weight
  const sortItemsByWeight = useCallback((itemsToSort: SmartNavigationItem[], weights: Record<string, SmartNavigationUsageData>) => {
    return [...itemsToSort].sort((a, b) => {
      const weightA = weights[a.id]?.weight || a.initialWeight || 0;
      const weightB = weights[b.id]?.weight || b.initialWeight || 0;
      return weightB - weightA;
    });
  }, []);
  
  // Calculate sorted items
  const sortedItems = useMemo(() => {
    const weights = calculateItemWeights();
    return sortItemsByWeight(items, weights);
  }, [items, calculateItemWeights, sortItemsByWeight]);
  
  // Split items into visible and hidden
  const { visibleItems, hiddenItems } = useMemo(() => {
    const visible = sortedItems.slice(0, maxVisibleItems);
    const hidden = sortedItems.slice(maxVisibleItems);
    
    return {
      visibleItems: visible,
      hiddenItems: hidden,
    };
  }, [sortedItems, maxVisibleItems]);
  
  // Save usage data when it changes
  useEffect(() => {
    if (enableLearning) {
      saveUsageData(usageData);
    }
  }, [enableLearning, usageData, saveUsageData]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLElement = HTMLElement>(
    props?: React.HTMLProps<E>
  ) => {
    return {
      ...props,
      role: 'navigation',
      'aria-label': 'Smart navigation',
    };
  }, []);
  
  // Get props for a navigation item
  const getItemProps = useCallback(<E extends HTMLElement = HTMLElement>(
    item: SmartNavigationItem,
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
        
        recordItemClick(item.id);
        
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
          
          recordItemClick(item.id);
          
          if (item.onClick) {
            item.onClick();
          }
          
          setActiveId(item.id);
        }
        
        props?.onKeyDown?.(event as any);
      },
    };
  }, [activeId, setActiveId, recordItemClick]);
  
  return {
    activeId,
    setActiveId,
    sortedItems,
    visibleItems,
    hiddenItems,
    usageData,
    resetUsageData,
    recordItemClick,
    updateContextTags,
    getContainerProps,
    getItemProps,
  };
}
