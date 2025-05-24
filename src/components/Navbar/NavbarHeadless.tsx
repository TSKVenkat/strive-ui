import React, { forwardRef, useEffect } from 'react';
import { useNavbar, UseNavbarProps } from './useNavbar';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless Navbar component
 */
export type NavbarHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  UseNavbarProps & {
    /** Children to render inside the navbar */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless NavbarBrand component
 */
export type NavbarBrandHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the brand area */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless NavbarToggle component
 */
export type NavbarToggleHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
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
 * Props for the headless NavbarContent component
 */
export type NavbarContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the headless NavbarItem component
 */
export type NavbarItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the navbar item */
    children: React.ReactNode;
    /** ID of the navbar item */
    id: string;
    /** Whether the item is disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the navbar state
const NavbarContext = React.createContext<ReturnType<typeof useNavbar> | null>(null);

// Custom hook to use the navbar context
const useNavbarContext = () => {
  const context = React.useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar compound components must be used within a NavbarHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type NavbarHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: NavbarHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type NavbarBrandHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: NavbarBrandHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type NavbarToggleHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: NavbarToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type NavbarContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: NavbarContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type NavbarItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: NavbarItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Navbar component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled navbars.
 */
export const NavbarHeadless = forwardRef(function NavbarHeadless<C extends React.ElementType = 'nav'>(
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
    ...props 
  }: Omit<NavbarHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const navbarState = useNavbar({
    defaultActiveItem,
    activeItem,
    onActiveChange,
    collapsible,
    defaultExpanded,
    expanded,
    onExpandedChange,
  });

  const navbarProps = navbarState.getNavbarProps();

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <NavbarContext.Provider value={navbarState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...navbarProps}
        {...props}
      >
        {children}
      </ElementType>
    </NavbarContext.Provider>
  );
}) as unknown as NavbarHeadlessComponent;

/**
 * A headless NavbarBrand component for the logo or brand name.
 */
export const NavbarBrandHeadless = forwardRef(function NavbarBrandHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<NavbarBrandHeadlessProps<C>, 'ref'>,
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
}) as unknown as NavbarBrandHeadlessComponent;

/**
 * A headless NavbarToggle component for toggling the navbar on mobile.
 */
export const NavbarToggleHeadless = forwardRef(function NavbarToggleHeadless<C extends React.ElementType = 'button'>(
  { as, children, className, style, ...props }: Omit<NavbarToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToggleProps } = useNavbarContext();
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
}) as unknown as NavbarToggleHeadlessComponent;

/**
 * A headless NavbarContent component for the collapsible content.
 */
export const NavbarContentHeadless = forwardRef(function NavbarContentHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<NavbarContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { isExpanded } = useNavbarContext();

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
}) as unknown as NavbarContentHeadlessComponent;

/**
 * A headless NavbarItem component for navigation items.
 */
export const NavbarItemHeadless = forwardRef(function NavbarItemHeadless<C extends React.ElementType = 'a'>(
  { as, children, className, style, id, disabled = false, ...props }: Omit<NavbarItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps, registerItem, unregisterItem } = useNavbarContext();
  const itemProps = getItemProps(id, disabled);

  // Register and unregister the item
  useEffect(() => {
    registerItem(id);
    return () => unregisterItem(id);
  }, [id, registerItem, unregisterItem]);

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
}) as unknown as NavbarItemHeadlessComponent;

// Add displayNames for better debugging
(NavbarHeadless as any).displayName = 'NavbarHeadless';
(NavbarBrandHeadless as any).displayName = 'NavbarBrandHeadless';
(NavbarToggleHeadless as any).displayName = 'NavbarToggleHeadless';
(NavbarContentHeadless as any).displayName = 'NavbarContentHeadless';
(NavbarItemHeadless as any).displayName = 'NavbarItemHeadless';

// Create a compound component
export const Navbar = Object.assign(NavbarHeadless, {
  Brand: NavbarBrandHeadless,
  Toggle: NavbarToggleHeadless,
  Content: NavbarContentHeadless,
  Item: NavbarItemHeadless,
});

export default Navbar;
