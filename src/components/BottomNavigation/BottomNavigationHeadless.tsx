import React, { forwardRef, createContext, useContext } from 'react';
import { useBottomNavigation, UseBottomNavigationProps, BottomNavigationItem } from './useBottomNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless BottomNavigation component
 */
export type BottomNavigationHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseBottomNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: BottomNavigationItem[];
    /** Children to render inside the bottom navigation */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Aria label for the navigation */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless BottomNavigationItem component
 */
export type BottomNavigationItemHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: BottomNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless BottomNavigationIcon component
 */
export type BottomNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: BottomNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless BottomNavigationLabel component
 */
export type BottomNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: BottomNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless BottomNavigationBadge component
 */
export type BottomNavigationBadgeHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: BottomNavigationItem;
    /** Children to render inside the badge */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the bottom navigation state
interface BottomNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string) => void;
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggleVisibility: () => void;
  showLabels: boolean;
  showLabelsOnlyForActive: boolean;
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    item: BottomNavigationItem,
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

const BottomNavigationContext = createContext<BottomNavigationContextValue | null>(null);

// Custom hook to use the bottom navigation context
const useBottomNavigationContext = () => {
  const context = useContext<BottomNavigationContextValue | null>(BottomNavigationContext);
  if (!context) {
    throw new Error('BottomNavigation compound components must be used within a BottomNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type BottomNavigationHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: BottomNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type BottomNavigationItemHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: BottomNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BottomNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: BottomNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type BottomNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: BottomNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type BottomNavigationBadgeHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: BottomNavigationBadgeHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

/**
 * A headless BottomNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled bottom navigation implementations.
 */
export const BottomNavigationHeadless = forwardRef(function BottomNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    showLabels,
    showLabelsOnlyForActive,
    visible,
    onVisibleChange,
    hideOnScroll,
    scrollThreshold,
    ariaLabel = 'Bottom navigation',
    ...props 
  }: Omit<BottomNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const bottomNavigationState = useBottomNavigation({
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    showLabels,
    showLabelsOnlyForActive,
    visible,
    onVisibleChange,
    hideOnScroll,
    scrollThreshold,
  });

  const { 
    activeId,
    setActiveId,
    visible: isVisible,
    show,
    hide,
    toggleVisibility,
    showLabels: shouldShowLabels,
    showLabelsOnlyForActive: shouldShowLabelsOnlyForActive,
    getContainerProps,
    getItemProps,
  } = bottomNavigationState;

  // Don't render anything if the navigation is not visible
  if (!isVisible) {
    return null;
  }

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <BottomNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        visible: isVisible,
        show,
        hide,
        toggleVisibility,
        showLabels: shouldShowLabels,
        showLabelsOnlyForActive: shouldShowLabelsOnlyForActive,
        getItemProps,
      }}
    >
      <ElementType
        {...getContainerProps({
          className,
          style,
          'aria-label': ariaLabel,
          ...props,
        })}
        ref={ref}
      >
        {children}
      </ElementType>
    </BottomNavigationContext.Provider>
  );
}) as unknown as BottomNavigationHeadlessComponent;

/**
 * A headless BottomNavigationItem component for rendering a navigation item.
 */
export const BottomNavigationItemHeadless = forwardRef(function BottomNavigationItemHeadless<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<BottomNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useBottomNavigationContext();
  
  // Get props for the navigation item
  const itemProps = getItemProps(item, {
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button' or 'a' if href is provided
  const ElementType: React.ElementType = as || (item.href ? 'a' : 'button');

  return (
    <ElementType
      {...itemProps}
      ref={ref}
      {...(item.href ? { href: item.href } : {})}
    >
      {children}
    </ElementType>
  );
}) as unknown as BottomNavigationItemHeadlessComponent;

/**
 * A headless BottomNavigationIcon component for rendering a navigation item icon.
 */
export const BottomNavigationIconHeadless = forwardRef(function BottomNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<BottomNavigationIconHeadlessProps<C>, 'ref'>,
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
}) as unknown as BottomNavigationIconHeadlessComponent;

/**
 * A headless BottomNavigationLabel component for rendering a navigation item label.
 */
export const BottomNavigationLabelHeadless = forwardRef(function BottomNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<BottomNavigationLabelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { showLabels, showLabelsOnlyForActive, activeId } = useBottomNavigationContext();
  
  // Don't render if labels are disabled or if they should only be shown for active items and this item is not active
  if (!showLabels || (showLabelsOnlyForActive && item.id !== activeId)) {
    return null;
  }

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
}) as unknown as BottomNavigationLabelHeadlessComponent;

/**
 * A headless BottomNavigationBadge component for rendering a navigation item badge.
 */
export const BottomNavigationBadgeHeadless = forwardRef(function BottomNavigationBadgeHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<BottomNavigationBadgeHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // If there's no badge, don't render anything
  if (!item.badge && !children) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {children || item.badge}
    </ElementType>
  );
}) as unknown as BottomNavigationBadgeHeadlessComponent;

// Add displayNames for better debugging
(BottomNavigationHeadless as any).displayName = 'BottomNavigationHeadless';
(BottomNavigationItemHeadless as any).displayName = 'BottomNavigationItemHeadless';
(BottomNavigationIconHeadless as any).displayName = 'BottomNavigationIconHeadless';
(BottomNavigationLabelHeadless as any).displayName = 'BottomNavigationLabelHeadless';
(BottomNavigationBadgeHeadless as any).displayName = 'BottomNavigationBadgeHeadless';

// Create a compound component
export const BottomNavigation = Object.assign(BottomNavigationHeadless, {
  Item: BottomNavigationItemHeadless,
  Icon: BottomNavigationIconHeadless,
  Label: BottomNavigationLabelHeadless,
  Badge: BottomNavigationBadgeHeadless,
});

export default BottomNavigation;
