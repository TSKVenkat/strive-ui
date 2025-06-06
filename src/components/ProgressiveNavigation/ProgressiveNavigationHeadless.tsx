import React, { forwardRef, createContext, useContext } from 'react';
import { useProgressiveNavigation, UseProgressiveNavigationProps, ProgressiveNavigationItem } from './useProgressiveNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless ProgressiveNavigation component
 */
export type ProgressiveNavigationHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseProgressiveNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: ProgressiveNavigationItem[];
    /** Children to render inside the progressive navigation */
    children: React.ReactNode | ((props: { 
      visibleItems: ProgressiveNavigationItem[]; 
      overflowItems: ProgressiveNavigationItem[];
      isOverflowMenuOpen: boolean;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Aria label for the navigation */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless ProgressiveNavigationItem component
 */
export type ProgressiveNavigationItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: ProgressiveNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless ProgressiveNavigationIcon component
 */
export type ProgressiveNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: ProgressiveNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless ProgressiveNavigationLabel component
 */
export type ProgressiveNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: ProgressiveNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless ProgressiveNavigationOverflowToggle component
 */
export type ProgressiveNavigationOverflowToggleHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the overflow toggle */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless ProgressiveNavigationOverflowMenu component
 */
export type ProgressiveNavigationOverflowMenuHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the overflow menu */
    children?: React.ReactNode | ((items: ProgressiveNavigationItem[]) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the progressive navigation state
interface ProgressiveNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string) => void;
  overflowBehavior: 'collapse' | 'hide';
  setOverflowBehavior: (behavior: 'collapse' | 'hide') => void;
  isOverflowMenuOpen: boolean;
  openOverflowMenu: () => void;
  closeOverflowMenu: () => void;
  toggleOverflowMenu: () => void;
  visibleItems: ProgressiveNavigationItem[];
  overflowItems: ProgressiveNavigationItem[];
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: ProgressiveNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  getOverflowToggleProps: <E extends HTMLElement = HTMLButtonElement>(
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    'aria-haspopup': boolean;
    'aria-expanded': boolean;
    'aria-label': string;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
  getOverflowMenuProps: <E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    'aria-label': string;
    tabIndex: number;
  };
}

const ProgressiveNavigationContext = createContext<ProgressiveNavigationContextValue | null>(null);

// Custom hook to use the progressive navigation context
const useProgressiveNavigationContext = () => {
  const context = useContext<ProgressiveNavigationContextValue | null>(ProgressiveNavigationContext);
  if (!context) {
    throw new Error('ProgressiveNavigation compound components must be used within a ProgressiveNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type ProgressiveNavigationHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: ProgressiveNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type ProgressiveNavigationItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: ProgressiveNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type ProgressiveNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: ProgressiveNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type ProgressiveNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: ProgressiveNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type ProgressiveNavigationOverflowToggleHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: ProgressiveNavigationOverflowToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type ProgressiveNavigationOverflowMenuHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: ProgressiveNavigationOverflowMenuHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

/**
 * A headless ProgressiveNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled progressive navigation implementations.
 */
export const ProgressiveNavigationHeadless = forwardRef(function ProgressiveNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    currentStep,
    onStepClick,
    ariaLabel,
    allowClickToSteps,
    showLabels,
    size,
    variant,
    orientation,
    ...props 
  }: Omit<ProgressiveNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Set default values
  const resolvedItems = items || ([] as ProgressiveNavigationItem[]);
  const resolvedCurrentStep = currentStep ?? 0;
  const resolvedAriaLabel = ariaLabel || 'Progressive navigation';
  const resolvedAllowClickToSteps = allowClickToSteps ?? true;
  const resolvedShowLabels = showLabels ?? true;
  const resolvedSize = size || 'medium';
  const resolvedVariant = variant || 'default';
  const resolvedOrientation = orientation || 'horizontal';

  const progressiveNavigationState = useProgressiveNavigation({
    items: resolvedItems,
    defaultActiveId: String(resolvedCurrentStep),
    activeId: String(resolvedCurrentStep),
    onActiveChange: onStepClick,
    defaultOverflowBehavior: 'collapse',
    overflowBehavior: 'collapse',
    onOverflowBehaviorChange: () => {},
    isOverflowMenuOpen: false,
    onOverflowMenuOpenChange: () => {},
    minVisibleItems: 1,
    maxVisibleItems: 10,
    prioritizeItems: true,
    adaptToSpace: true,
    adaptToScreenSize: true,
  });

  const { 
    activeId,
    setActiveId,
    overflowBehavior,
    setOverflowBehavior,
    isOverflowMenuOpen,
    openOverflowMenu,
    closeOverflowMenu,
    toggleOverflowMenu,
    visibleItems,
    overflowItems,
    getContainerProps,
    getItemProps,
    getOverflowToggleProps,
    getOverflowMenuProps,
  } = progressiveNavigationState;

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <ProgressiveNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        overflowBehavior,
        setOverflowBehavior,
        isOverflowMenuOpen,
        openOverflowMenu,
        closeOverflowMenu,
        toggleOverflowMenu,
        visibleItems,
        overflowItems,
        getItemProps,
        getOverflowToggleProps,
        getOverflowMenuProps,
      }}
    >
      <ElementType
        {...getContainerProps({
          className,
          style,
          'aria-label': resolvedAriaLabel as any,
          ...props,
        })}
        ref={ref}
      >
        {typeof children === 'function' 
          ? children({ visibleItems, overflowItems, isOverflowMenuOpen }) 
          : children}
      </ElementType>
    </ProgressiveNavigationContext.Provider>
  );
}) as unknown as ProgressiveNavigationHeadlessComponent;

/**
 * A headless ProgressiveNavigationItem component for rendering a navigation item.
 */
export const ProgressiveNavigationItemHeadless = forwardRef(function ProgressiveNavigationItemHeadless<C extends React.ElementType = 'a'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<ProgressiveNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useProgressiveNavigationContext();
  
  // Get props for the navigation item
  const itemProps = getItemProps(item, {
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'a'
  const ElementType: React.ElementType = as || (item.href ? 'a' : 'div');

  return (
    <ElementType
      {...itemProps}
      ref={ref}
      {...(item.href ? { href: item.href } : {})}
    >
      {children}
    </ElementType>
  );
}) as unknown as ProgressiveNavigationItemHeadlessComponent;

/**
 * A headless ProgressiveNavigationIcon component for rendering a navigation item icon.
 */
export const ProgressiveNavigationIconHeadless = forwardRef(function ProgressiveNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<ProgressiveNavigationIconHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // If there's no icon, don't render anything
  if (!item.icon && !children) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      {children || item.icon}
    </ElementType>
  );
}) as unknown as ProgressiveNavigationIconHeadlessComponent;

/**
 * A headless ProgressiveNavigationLabel component for rendering a navigation item label.
 */
export const ProgressiveNavigationLabelHeadless = forwardRef(function ProgressiveNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<ProgressiveNavigationLabelHeadlessProps<C>, 'ref'>,
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
      {children || item.label}
    </ElementType>
  );
}) as unknown as ProgressiveNavigationLabelHeadlessComponent;

/**
 * A headless ProgressiveNavigationOverflowToggle component for rendering the overflow toggle button.
 */
export const ProgressiveNavigationOverflowToggleHeadless = forwardRef(function ProgressiveNavigationOverflowToggleHeadless<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<ProgressiveNavigationOverflowToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getOverflowToggleProps, overflowItems } = useProgressiveNavigationContext();
  
  // If there are no overflow items, don't render the toggle
  if (overflowItems.length === 0) {
    return null;
  }
  
  // Get props for the overflow toggle
  const toggleProps = getOverflowToggleProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      {...toggleProps}
      ref={ref}
    >
      {children || 'More'}
    </ElementType>
  );
}) as unknown as ProgressiveNavigationOverflowToggleHeadlessComponent;

/**
 * A headless ProgressiveNavigationOverflowMenu component for rendering the overflow menu.
 */
export const ProgressiveNavigationOverflowMenuHeadless = forwardRef(function ProgressiveNavigationOverflowMenuHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<ProgressiveNavigationOverflowMenuHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getOverflowMenuProps, overflowItems, isOverflowMenuOpen } = useProgressiveNavigationContext();
  
  // If there are no overflow items or the menu is not open, don't render
  if (overflowItems.length === 0 || !isOverflowMenuOpen) {
    return null;
  }
  
  // Get props for the overflow menu
  const menuProps = getOverflowMenuProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...menuProps}
      ref={ref}
    >
      {typeof children === 'function' ? children(overflowItems) : children}
    </ElementType>
  );
}) as unknown as ProgressiveNavigationOverflowMenuHeadlessComponent;

// Add displayNames for better debugging
(ProgressiveNavigationHeadless as any).displayName = 'ProgressiveNavigationHeadless';
(ProgressiveNavigationItemHeadless as any).displayName = 'ProgressiveNavigationItemHeadless';
(ProgressiveNavigationIconHeadless as any).displayName = 'ProgressiveNavigationIconHeadless';
(ProgressiveNavigationLabelHeadless as any).displayName = 'ProgressiveNavigationLabelHeadless';
(ProgressiveNavigationOverflowToggleHeadless as any).displayName = 'ProgressiveNavigationOverflowToggleHeadless';
(ProgressiveNavigationOverflowMenuHeadless as any).displayName = 'ProgressiveNavigationOverflowMenuHeadless';

// Create a compound component
export const ProgressiveNavigation = Object.assign(ProgressiveNavigationHeadless, {
  Item: ProgressiveNavigationItemHeadless,
  Icon: ProgressiveNavigationIconHeadless,
  Label: ProgressiveNavigationLabelHeadless,
  OverflowToggle: ProgressiveNavigationOverflowToggleHeadless,
  OverflowMenu: ProgressiveNavigationOverflowMenuHeadless,
});

export default ProgressiveNavigation;
