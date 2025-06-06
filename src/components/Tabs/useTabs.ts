import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseTabsProps {
  /**
   * The ID of the initially active tab
   */
  defaultTab?: string;
  /**
   * The ID of the controlled active tab
   */
  activeTab?: string;
  /**
   * Callback when active tab changes
   */
  onChange?: (tabId: string) => void;
  /**
   * The orientation of the tabs
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether tabs should automatically activate on focus
   */
  activateOnFocus?: boolean;
  /**
   * Whether the tabs should be manually activated (only via click)
   */
  manual?: boolean;
}

export interface UseTabsReturn {
  /**
   * The currently active tab ID
   */
  activeTab: string;
  /**
   * Function to set the active tab
   */
  setActiveTab: (id: string) => void;
  /**
   * Function to register a tab
   */
  registerTab: (id: string) => void;
  /**
   * Function to unregister a tab
   */
  unregisterTab: (id: string) => void;
  /**
   * List of registered tab IDs
   */
  tabIds: string[];
  /**
   * The orientation of the tabs
   */
  orientation: 'horizontal' | 'vertical';
  /**
   * Get props for the tabs container
   */
  getTabsProps: () => {
    role: string;
    'aria-orientation': 'horizontal' | 'vertical';
  };
  /**
   * Get props for a tab item
   */
  getTabProps: (id: string, disabled?: boolean) => {
    id: string;
    role: string;
    tabIndex: number;
    'aria-selected': boolean;
    'aria-controls': string;
    'aria-disabled': boolean;
    disabled: boolean;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onFocus: (event: React.FocusEvent) => void;
    'data-state': 'active' | 'inactive';
  };
  /**
   * Get props for a tab panel
   */
  getTabPanelProps: (id: string) => {
    id: string;
    role: string;
    'aria-labelledby': string;
    tabIndex: 0;
    hidden: boolean;
    'data-state': 'active' | 'inactive';
  };
}

/**
 * Hook for creating accessible tab components.
 * Provides all the necessary props and state for creating a tab component.
 * 
 * @example
 * ```jsx
 * const MyTabs = ({ defaultTab, onChange, children }) => {
 *   const { 
 *     activeTab, 
 *     getTabsProps, 
 *     getTabProps, 
 *     getTabPanelProps 
 *   } = useTabs({ defaultTab, onChange });
 *   
 *   return (
 *     <div>
 *       <div {...getTabsProps()}>
 *         <button {...getTabProps('tab1')}>Tab 1</button>
 *         <button {...getTabProps('tab2')}>Tab 2</button>
 *       </div>
 *       <div {...getTabPanelProps('tab1')}>
 *         Content 1
 *       </div>
 *       <div {...getTabPanelProps('tab2')}>
 *         Content 2
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useTabs({
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  orientation = 'horizontal',
  activateOnFocus = false,
  manual = false,
}: UseTabsProps = {}): UseTabsReturn {
  const [activeTab, setActiveTabState] = useState<string>(defaultTab || '');
  const [tabIds, setTabIds] = useState<string[]>([]);
  const tabsRef = useRef<HTMLElement | null>(null);
  
  // Handle controlled component
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setActiveTabState(controlledActiveTab);
    }
  }, [controlledActiveTab]);
  
  // Set first tab as active if no default is provided
  useEffect(() => {
    if (!defaultTab && !controlledActiveTab && tabIds.length > 0 && !activeTab) {
      setActiveTabState(tabIds[0]);
    }
  }, [defaultTab, controlledActiveTab, tabIds, activeTab]);
  
  const setActiveTab = useCallback((id: string) => {
    if (controlledActiveTab === undefined) {
      setActiveTabState(id);
    }
    onChange?.(id);
  }, [controlledActiveTab, onChange]);
  
  const registerTab = useCallback((id: string) => {
    setTabIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  }, []);
  
  const unregisterTab = useCallback((id: string) => {
    setTabIds(prev => prev.filter(tabId => tabId !== id));
  }, []);

  const focusTab = useCallback((id: string) => {
    const tabElement = document.getElementById(`tab-${id}`);
    if (tabElement) {
      tabElement.focus();
    }
  }, []);

  const getNextTab = useCallback((currentIndex: number) => {
    if (tabIds.length === 0) return '';
    return tabIds[(currentIndex + 1) % tabIds.length];
  }, [tabIds]);

  const getPrevTab = useCallback((currentIndex: number) => {
    if (tabIds.length === 0) return '';
    return tabIds[(currentIndex - 1 + tabIds.length) % tabIds.length];
  }, [tabIds]);

  const getFirstTab = useCallback(() => {
    return tabIds[0] || '';
  }, [tabIds]);

  const getLastTab = useCallback(() => {
    return tabIds[tabIds.length - 1] || '';
  }, [tabIds]);

  const getTabsProps = useCallback(() => {
    return {
      role: 'tablist',
      'aria-orientation': orientation,
    };
  }, [orientation]);

  const getTabProps = useCallback((id: string, disabled = false) => {
    const isActive = activeTab === id;
    const currentIndex = tabIds.indexOf(id);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      let nextTabId = '';

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextTabId = getNextTab(currentIndex);
          focusTab(nextTabId);
          if (activateOnFocus && !manual) {
            setActiveTab(nextTabId);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          nextTabId = getPrevTab(currentIndex);
          focusTab(nextTabId);
          if (activateOnFocus && !manual) {
            setActiveTab(nextTabId);
          }
          break;
        case 'Home':
          event.preventDefault();
          nextTabId = getFirstTab();
          focusTab(nextTabId);
          if (activateOnFocus && !manual) {
            setActiveTab(nextTabId);
          }
          break;
        case 'End':
          event.preventDefault();
          nextTabId = getLastTab();
          focusTab(nextTabId);
          if (activateOnFocus && !manual) {
            setActiveTab(nextTabId);
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          setActiveTab(id);
          break;
        default:
          break;
      }
    };

    const handleClick = (event: React.MouseEvent) => {
      if (!disabled) {
        setActiveTab(id);
      }
    };

    const handleFocus = (event: React.FocusEvent) => {
      if (!disabled && activateOnFocus && !manual) {
        setActiveTab(id);
      }
    };

    return {
      id: `tab-${id}`,
      role: 'tab',
      tabIndex: isActive ? 0 : -1,
      'aria-selected': isActive,
      'aria-controls': `panel-${id}`,
      'aria-disabled': disabled,
      disabled,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      'data-state': isActive ? 'active' as const : 'inactive' as const,
    };
  }, [activeTab, tabIds, setActiveTab, activateOnFocus, manual, getNextTab, getPrevTab, getFirstTab, getLastTab, focusTab]);

  const getTabPanelProps = useCallback((id: string) => {
    const isActive = activeTab === id;

    return {
      id: `panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `tab-${id}`,
      tabIndex: 0 as const,
      hidden: !isActive,
      'data-state': isActive ? 'active' as const : 'inactive' as const,
    };
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    registerTab,
    unregisterTab,
    tabIds,
    orientation,
    getTabsProps,
    getTabProps,
    getTabPanelProps,
  };
}
