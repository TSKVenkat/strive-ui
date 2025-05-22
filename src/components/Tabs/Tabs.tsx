import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';

// Context for Tabs
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  registerTab: (id: string) => void;
  unregisterTab: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'contained' | 'pills';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

// Types
export interface TabsProps {
  /**
   * The content of the tabs component (TabList and TabPanels)
   */
  children: React.ReactNode;
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
   * The visual variant of the tabs
   */
  variant?: 'default' | 'contained' | 'pills';
  /**
   * Whether the tabs should take up the full width
   */
  fullWidth?: boolean;
  /**
   * Whether the tabs should be centered
   */
  centered?: boolean;
}

export interface TabListProps {
  /**
   * The content of the tab list (Tab components)
   */
  children: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabProps {
  /**
   * The content of the tab
   */
  children: React.ReactNode;
  /**
   * The ID of the tab (must be unique)
   */
  id: string;
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Icon to display before the tab label
   */
  icon?: React.ReactNode;
}

export interface TabPanelsProps {
  /**
   * The content of the tab panels (TabPanel components)
   */
  children: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabPanelProps {
  /**
   * The content of the tab panel
   */
  children: React.ReactNode;
  /**
   * The ID of the tab panel (must match a tab ID)
   */
  id: string;
  /**
   * Additional CSS class name
   */
  className?: string;
}

// Styled Components
const StyledTabs = styled.div<{ orientation: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${({ orientation }) => orientation === 'vertical' ? 'row' : 'column'};
  width: 100%;
`;

const StyledTabList = styled.div<{ 
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'contained' | 'pills';
  fullWidth?: boolean;
  centered?: boolean;
}>`
  display: flex;
  flex-direction: ${({ orientation }) => orientation === 'vertical' ? 'column' : 'row'};
  ${({ fullWidth, orientation }) => fullWidth && orientation === 'horizontal' && css`
    width: 100%;
    & > * {
      flex: 1;
    }
  `}
  ${({ centered, orientation, fullWidth }) => centered && orientation === 'horizontal' && !fullWidth && css`
    justify-content: center;
  `}
  
  ${({ variant, theme, orientation }) => {
    if (variant === 'contained') {
      return css`
        background-color: ${theme.colors.neutral[200]};
        border-radius: ${theme.borderRadius.md};
        padding: ${orientation === 'horizontal' ? '0.25rem' : '0.5rem'};
      `;
    }
    if (variant === 'default') {
      return css`
        ${orientation === 'horizontal' && css`
          border-bottom: 1px solid ${theme.colors.neutral[300]};
        `}
        ${orientation === 'vertical' && css`
          border-right: 1px solid ${theme.colors.neutral[300]};
        `}
      `;
    }
    return '';
  }}
`;

const getTabStyles = (variant: 'default' | 'contained' | 'pills', orientation: 'horizontal' | 'vertical') => {
  switch (variant) {
    case 'contained':
      return css`
        border-radius: ${({ theme }) => theme.borderRadius.md};
        padding: 0.5rem 1rem;
        &[data-active="true"] {
          background-color: ${({ theme }) => theme.colors.common.white || theme.colors.neutral[100]};
          color: ${({ theme }) => theme.colors.primary[600]};
          box-shadow: ${({ theme }) => theme.shadows.sm};
        }
      `;
    case 'pills':
      return css`
        border-radius: ${({ theme }) => theme.borderRadius.full};
        padding: 0.5rem 1rem;
        &[data-active="true"] {
          background-color: ${({ theme }) => theme.colors.primary[600]};
          color: ${({ theme }) => theme.colors.common.white || theme.colors.neutral[100]};
        }
      `;
    case 'default':
    default:
      return css`
        padding: 0.75rem 1rem;
        ${orientation === 'horizontal' && css`
          border-bottom: 2px solid transparent;
          &[data-active="true"] {
            border-bottom-color: ${({ theme }) => theme.colors.primary[600]};
            color: ${({ theme }) => theme.colors.primary[600]};
          }
        `}
        ${orientation === 'vertical' && css`
          border-right: 2px solid transparent;
          &[data-active="true"] {
            border-right-color: ${({ theme }) => theme.colors.primary[600]};
            color: ${({ theme }) => theme.colors.primary[600]};
          }
        `}
      `;
  }
};

const StyledTab = styled.button<{ 
  variant: 'default' | 'contained' | 'pills';
  orientation: 'horizontal' | 'vertical';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  
  ${({ variant, orientation }) => getTabStyles(variant, orientation)}
  
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabIndicator = styled.div<{
  width: number;
  left: number;
  orientation: 'horizontal' | 'vertical';
}>`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary[600]};
  transition: all 0.3s ease;
  width: ${({ width }) => `${width}px`};
  left: ${({ left }) => `${left}px`};
`;

const StyledTabPanels = styled.div<{ orientation: 'horizontal' | 'vertical' }>`
  flex: 1;
  ${({ orientation }) => orientation === 'vertical' && css`
    margin-left: 1rem;
  `}
`;

const StyledTabPanel = styled.div`
  padding: 1rem 0;
`;

/**
 * Tabs component for organizing content into separate views
 * 
 * @example
 * ```jsx
 * <Tabs defaultTab="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
 *     <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panels>
 *     <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
 *     <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
 *   </Tabs.Panels>
 * </Tabs>
 * ```
 */
export const Tabs: React.FC<TabsProps> & {
  List: React.FC<TabListProps>;
  Tab: React.FC<TabProps>;
  Panels: React.FC<TabPanelsProps>;
  Panel: React.FC<TabPanelProps>;
} = ({
  children,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  orientation = 'horizontal',
  variant = 'default',
  fullWidth = false,
  centered = false,
}) => {
  const [activeTab, setActiveTabState] = useState<string>(defaultTab || '');
  const [tabIds, setTabIds] = useState<string[]>([]);
  
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
  
  const contextValue = {
    activeTab,
    setActiveTab,
    registerTab,
    unregisterTab,
    orientation,
    variant,
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <StyledTabs orientation={orientation} role="tablist">
        {children}
      </StyledTabs>
    </TabsContext.Provider>
  );
};

const TabList: React.FC<TabListProps> = ({ children, className }) => {
  const { orientation, variant } = useTabs();
  const { fullWidth, centered } = useContext(TabsContext) as any;
  
  return (
    <StyledTabList 
      orientation={orientation} 
      variant={variant}
      fullWidth={fullWidth}
      centered={centered}
      className={className}
      role="tablist"
    >
      {children}
    </StyledTabList>
  );
};

const Tab: React.FC<TabProps> = ({ children, id, disabled = false, className, icon }) => {
  const { activeTab, setActiveTab, registerTab, unregisterTab, orientation, variant } = useTabs();
  const isActive = activeTab === id;
  
  useEffect(() => {
    registerTab(id);
    return () => unregisterTab(id);
  }, [id, registerTab, unregisterTab]);
  
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id);
    }
  };
  
  return (
    <StyledTab
      type="button"
      onClick={handleClick}
      disabled={disabled}
      data-active={isActive}
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      className={className}
      variant={variant}
      orientation={orientation}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      {children}
    </StyledTab>
  );
};

const TabPanels: React.FC<TabPanelsProps> = ({ children, className }) => {
  const { orientation } = useTabs();
  
  return (
    <StyledTabPanels orientation={orientation} className={className}>
      {children}
    </StyledTabPanels>
  );
};

const TabPanel: React.FC<TabPanelProps> = ({ children, id, className }) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === id;
  
  if (!isActive) return null;
  
  return (
    <StyledTabPanel
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </StyledTabPanel>
  );
};

// Assign components to Tabs
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;
