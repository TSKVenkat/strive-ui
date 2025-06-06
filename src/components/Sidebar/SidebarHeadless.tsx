import React, { forwardRef, useEffect } from 'react';
import { useSidebar, UseSidebarProps } from './useSidebar';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless Sidebar component
 */
export type SidebarHeadlessProps<C extends React.ElementType = 'aside'> = PolymorphicComponentPropsWithRef<
  C,
  UseSidebarProps & {
    /** Children to render inside the sidebar */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarToggle component
 */
export type SidebarToggleHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the toggle button */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarContent component
 */
export type SidebarContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the content area */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarItem component
 */
export type SidebarItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the sidebar item */
    children: React.ReactNode;
    /** ID of the sidebar item */
    id: string;
    /** ID of the parent section (for nested items) */
    parentId?: string;
    /** Whether the item is disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarSection component
 */
export type SidebarSectionHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the sidebar section */
    children: React.ReactNode;
    /** ID of the sidebar section */
    id: string;
    /** ID of the parent section (for nested sections) */
    parentId?: string;
    /** Whether the section is disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarSectionTitle component
 */
export type SidebarSectionTitleHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the section title */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SidebarSectionContent component
 */
export type SidebarSectionContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the section content */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the sidebar state
const SidebarContext = React.createContext<ReturnType<typeof useSidebar> | null>(null);

// Context for section IDs
const SidebarSectionContext = React.createContext<{ id: string } | null>(null);

// Custom hook to use the sidebar context
const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('Sidebar compound components must be used within a SidebarHeadless component');
  }
  return context;
};

// Custom hook to use the sidebar section context
const useSidebarSectionContext = () => {
  return React.useContext(SidebarSectionContext);
};

// Create types for the forwardRef components
type SidebarHeadlessComponent = <C extends React.ElementType = 'aside'>(
  props: SidebarHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarToggleHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: SidebarToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SidebarContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: SidebarItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarSectionHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SidebarSectionHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarSectionTitleHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SidebarSectionTitleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SidebarSectionContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SidebarSectionContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Sidebar component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled sidebars.
 */
export const SidebarHeadless = forwardRef(function SidebarHeadless<C extends React.ElementType = 'aside'>(
  { 
    as, 
    children, 
    className, 
    style, 
    defaultActiveItem, 
    activeItem, 
    onActiveChange, 
    collapsible,
    defaultExpanded,
    expanded,
    onExpandedChange,
    nested,
    autoExpandParent,
    ...props 
  }: Omit<SidebarHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const sidebarState = useSidebar({
    defaultActiveItem,
    activeItem,
    onActiveChange,
    collapsible,
    defaultExpanded,
    expanded,
    onExpandedChange,
    nested,
    autoExpandParent,
  });

  const sidebarProps = sidebarState.getSidebarProps();

  // Use the 'as' prop or default to 'aside'
  const ElementType: React.ElementType = as || 'aside';

  return (
    <SidebarContext.Provider value={sidebarState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...sidebarProps}
        {...props}
      >
        {children}
      </ElementType>
    </SidebarContext.Provider>
  );
}) as unknown as SidebarHeadlessComponent;

/**
 * A headless SidebarToggle component for toggling the sidebar.
 */
export const SidebarToggleHeadless = forwardRef(function SidebarToggleHeadless<C extends React.ElementType = 'button'>(
  { as, children, className, style, ...props }: Omit<SidebarToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToggleProps } = useSidebarContext();
  const toggleProps = getToggleProps();

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...toggleProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SidebarToggleHeadlessComponent;

/**
 * A headless SidebarContent component for the collapsible content.
 */
export const SidebarContentHeadless = forwardRef(function SidebarContentHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<SidebarContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { isExpanded } = useSidebarContext();

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      data-expanded={isExpanded}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SidebarContentHeadlessComponent;

/**
 * A headless SidebarItem component for navigation items.
 */
export const SidebarItemHeadless = forwardRef(function SidebarItemHeadless<C extends React.ElementType = 'a'>(
  { 
    as, 
    children, 
    className, 
    style, 
    id, 
    parentId, 
    disabled = false as any, 
    ...props 
  }: Omit<SidebarItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps, registerItem, unregisterItem } = useSidebarContext();
  const sectionContext = useSidebarSectionContext();
  const itemProps = getItemProps(id, disabled);
  
  // If item is in a section, use the section ID as parent
  const effectiveParentId = parentId || (sectionContext ? sectionContext.id : undefined);

  // Register and unregister the item
  useEffect(() => {
    registerItem(id, effectiveParentId);
    return () => unregisterItem(id);
  }, [id, effectiveParentId, registerItem, unregisterItem]);

  // Use the 'as' prop or default to 'a'
  const ElementType: React.ElementType = as || 'a';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...itemProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SidebarItemHeadlessComponent;

/**
 * A headless SidebarSection component for grouped items.
 */
export const SidebarSectionHeadless = forwardRef(function SidebarSectionHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    id, 
    parentId, 
    disabled = false as any, 
    ...props 
  }: Omit<SidebarSectionHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { registerItem, unregisterItem } = useSidebarContext();
  const parentContext = useSidebarSectionContext();
  
  // If section is nested in another section, use the parent section ID
  const effectiveParentId = parentId || (parentContext ? parentContext.id : undefined);

  // Register and unregister the section as an item
  useEffect(() => {
    registerItem(id, effectiveParentId);
    return () => unregisterItem(id);
  }, [id, effectiveParentId, registerItem, unregisterItem]);

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <SidebarSectionContext.Provider value={{ id }}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </ElementType>
    </SidebarSectionContext.Provider>
  );
}) as unknown as SidebarSectionHeadlessComponent;

/**
 * A headless SidebarSectionTitle component for section titles.
 */
export const SidebarSectionTitleHeadless = forwardRef(function SidebarSectionTitleHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<SidebarSectionTitleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSectionProps } = useSidebarContext();
  const sectionContext = useSidebarSectionContext();
  
  if (!sectionContext) {
    throw new Error('SidebarSectionTitle must be used within a SidebarSection');
  }
  
  const sectionProps = getSectionProps(sectionContext.id);

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...sectionProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SidebarSectionTitleHeadlessComponent;

/**
 * A headless SidebarSectionContent component for section content.
 */
export const SidebarSectionContentHeadless = forwardRef(function SidebarSectionContentHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<SidebarSectionContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { expandedSections } = useSidebarContext();
  const sectionContext = useSidebarSectionContext();
  
  if (!sectionContext) {
    throw new Error('SidebarSectionContent must be used within a SidebarSection');
  }
  
  const isExpanded = expandedSections[sectionContext.id] || false;
  const contentId = `sidebar-section-content-${sectionContext.id}`;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      id={contentId}
      className={className}
      style={style}
      data-expanded={isExpanded}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SidebarSectionContentHeadlessComponent;

// Add displayNames for better debugging
(SidebarHeadless as any).displayName = 'SidebarHeadless';
(SidebarToggleHeadless as any).displayName = 'SidebarToggleHeadless';
(SidebarContentHeadless as any).displayName = 'SidebarContentHeadless';
(SidebarItemHeadless as any).displayName = 'SidebarItemHeadless';
(SidebarSectionHeadless as any).displayName = 'SidebarSectionHeadless';
(SidebarSectionTitleHeadless as any).displayName = 'SidebarSectionTitleHeadless';
(SidebarSectionContentHeadless as any).displayName = 'SidebarSectionContentHeadless';

// Create a compound component
export const Sidebar = Object.assign(SidebarHeadless, {
  Toggle: SidebarToggleHeadless,
  Content: SidebarContentHeadless,
  Item: SidebarItemHeadless,
  Section: SidebarSectionHeadless,
  SectionTitle: SidebarSectionTitleHeadless,
  SectionContent: SidebarSectionContentHeadless,
});

export default Sidebar;
