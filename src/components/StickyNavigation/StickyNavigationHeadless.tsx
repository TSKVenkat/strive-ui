import React, { forwardRef, createContext, useContext } from 'react';
import { useStickyNavigation, UseStickyNavigationProps, StickyNavigationItem } from './useStickyNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless StickyNavigation component
 */
export type StickyNavigationHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseStickyNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: StickyNavigationItem[];
    /** Children to render inside the sticky navigation */
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
 * Props for the headless StickyNavigationSentinel component
 */
export type StickyNavigationSentinelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless StickyNavigationItem component
 */
export type StickyNavigationItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: StickyNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless StickyNavigationIcon component
 */
export type StickyNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: StickyNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless StickyNavigationLabel component
 */
export type StickyNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: StickyNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the sticky navigation state
interface StickyNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string) => void;
  isSticky: boolean;
  isVisible: boolean;
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: StickyNavigationItem,
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

const StickyNavigationContext = createContext<StickyNavigationContextValue | null>(null);

// Custom hook to use the sticky navigation context
const useStickyNavigationContext = () => {
  const context = useContext<StickyNavigationContextValue | null>(StickyNavigationContext);
  if (!context) {
    throw new Error('StickyNavigation compound components must be used within a StickyNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type StickyNavigationHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: StickyNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type StickyNavigationSentinelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: StickyNavigationSentinelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type StickyNavigationItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: StickyNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type StickyNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: StickyNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type StickyNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: StickyNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless StickyNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled sticky navigation implementations.
 */
export const StickyNavigationHeadless = forwardRef(function StickyNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    isSticky: controlledIsSticky,
    onStickyChange,
    stickyOffset,
    zIndex,
    stickyWithShadow,
    animateSticky,
    hideOnScroll,
    scrollThreshold,
    ariaLabel = 'Sticky navigation' as any,
    ...props 
  }: Omit<StickyNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const stickyNavigationState = useStickyNavigation({
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    isSticky: controlledIsSticky,
    onStickyChange,
    stickyOffset,
    zIndex,
    stickyWithShadow,
    animateSticky,
    hideOnScroll,
    scrollThreshold,
  });

  const { 
    activeId,
    setActiveId,
    isSticky,
    isVisible,
    getContainerProps,
    getItemProps,
  } = stickyNavigationState;

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <StickyNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        isSticky,
        isVisible,
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
    </StickyNavigationContext.Provider>
  );
}) as unknown as StickyNavigationHeadlessComponent;

/**
 * A headless StickyNavigationSentinel component for detecting when to make the navigation sticky.
 */
export const StickyNavigationSentinelHeadless = forwardRef(function StickyNavigationSentinelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<StickyNavigationSentinelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSentinelProps } = useStickyNavigation({
    items: [],
  });
  
  // Get props for the sentinel element
  const sentinelProps = getSentinelProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...sentinelProps}
      ref={ref}
    />
  );
}) as unknown as StickyNavigationSentinelHeadlessComponent;

/**
 * A headless StickyNavigationItem component for rendering a navigation item.
 */
export const StickyNavigationItemHeadless = forwardRef(function StickyNavigationItemHeadless<C extends React.ElementType = 'a'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<StickyNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useStickyNavigationContext();
  
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
}) as unknown as StickyNavigationItemHeadlessComponent;

/**
 * A headless StickyNavigationIcon component for rendering a navigation item icon.
 */
export const StickyNavigationIconHeadless = forwardRef(function StickyNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<StickyNavigationIconHeadlessProps<C>, 'ref'>,
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
}) as unknown as StickyNavigationIconHeadlessComponent;

/**
 * A headless StickyNavigationLabel component for rendering a navigation item label.
 */
export const StickyNavigationLabelHeadless = forwardRef(function StickyNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<StickyNavigationLabelHeadlessProps<C>, 'ref'>,
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
}) as unknown as StickyNavigationLabelHeadlessComponent;

// Add displayNames for better debugging
(StickyNavigationHeadless as any).displayName = 'StickyNavigationHeadless';
(StickyNavigationSentinelHeadless as any).displayName = 'StickyNavigationSentinelHeadless';
(StickyNavigationItemHeadless as any).displayName = 'StickyNavigationItemHeadless';
(StickyNavigationIconHeadless as any).displayName = 'StickyNavigationIconHeadless';
(StickyNavigationLabelHeadless as any).displayName = 'StickyNavigationLabelHeadless';

// Create a compound component
export const StickyNavigation = Object.assign(StickyNavigationHeadless, {
  Sentinel: StickyNavigationSentinelHeadless,
  Item: StickyNavigationItemHeadless,
  Icon: StickyNavigationIconHeadless,
  Label: StickyNavigationLabelHeadless,
});

export default StickyNavigation;
