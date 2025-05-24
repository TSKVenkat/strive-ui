import React, { forwardRef, useEffect } from 'react';
import { useTabs, UseTabsProps } from './useTabs';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless Tabs component
 */
export type TabsHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseTabsProps & {
    /** Children to render inside the tabs */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless TabList component
 */
export type TabListHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the tab list */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless Tab component
 */
export type TabHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the tab */
    children: React.ReactNode;
    /** ID of the tab */
    id: string;
    /** Whether the tab is disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless TabPanels component
 */
export type TabPanelsHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the tab panels container */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless TabPanel component
 */
export type TabPanelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the tab panel */
    children: React.ReactNode;
    /** ID of the tab panel (must match a tab ID) */
    id: string;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the tabs state
const TabsContext = React.createContext<ReturnType<typeof useTabs> | null>(null);

// Custom hook to use the tabs context
const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a TabsHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type TabsHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TabsHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TabListHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TabListHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TabHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: TabHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TabPanelsHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TabPanelsHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TabPanelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TabPanelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Tabs component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled tabs.
 */
export const TabsHeadless = forwardRef(function TabsHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    defaultTab, 
    activeTab, 
    onChange, 
    orientation = 'horizontal',
    activateOnFocus,
    manual,
    ...props 
  }: Omit<TabsHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const tabsState = useTabs({
    defaultTab,
    activeTab,
    onChange,
    orientation,
    activateOnFocus,
    manual,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <TabsContext.Provider value={tabsState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </ElementType>
    </TabsContext.Provider>
  );
}) as unknown as TabsHeadlessComponent;

/**
 * A headless TabList component that provides all the functionality without any styling.
 */
export const TabListHeadless = forwardRef(function TabListHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<TabListHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTabsProps } = useTabsContext();
  const tabsProps = getTabsProps();

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...tabsProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TabListHeadlessComponent;

/**
 * A headless Tab component that provides all the functionality without any styling.
 */
export const TabHeadless = forwardRef(function TabHeadless<C extends React.ElementType = 'button'>(
  { as, children, className, style, id, disabled = false, ...props }: Omit<TabHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTabProps, registerTab, unregisterTab } = useTabsContext();
  const tabProps = getTabProps(id, disabled);

  // Register and unregister the tab
  useEffect(() => {
    registerTab(id);
    return () => unregisterTab(id);
  }, [id, registerTab, unregisterTab]);

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...tabProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TabHeadlessComponent;

/**
 * A headless TabPanels component that provides all the functionality without any styling.
 */
export const TabPanelsHeadless = forwardRef(function TabPanelsHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<TabPanelsHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TabPanelsHeadlessComponent;

/**
 * A headless TabPanel component that provides all the functionality without any styling.
 */
export const TabPanelHeadless = forwardRef(function TabPanelHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, id, ...props }: Omit<TabPanelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTabPanelProps } = useTabsContext();
  const tabPanelProps = getTabPanelProps(id);

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...tabPanelProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TabPanelHeadlessComponent;

// Add displayNames for better debugging
(TabsHeadless as any).displayName = 'TabsHeadless';
(TabListHeadless as any).displayName = 'TabListHeadless';
(TabHeadless as any).displayName = 'TabHeadless';
(TabPanelsHeadless as any).displayName = 'TabPanelsHeadless';
(TabPanelHeadless as any).displayName = 'TabPanelHeadless';

// Create a compound component
export const Tabs = Object.assign(TabsHeadless, {
  List: TabListHeadless,
  Tab: TabHeadless,
  Panels: TabPanelsHeadless,
  Panel: TabPanelHeadless,
});

export default Tabs;
