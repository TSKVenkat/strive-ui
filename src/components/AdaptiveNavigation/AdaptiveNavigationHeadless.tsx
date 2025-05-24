import React, { forwardRef, createContext, useContext } from 'react';
import { 
  useAdaptiveNavigation, 
  UseAdaptiveNavigationProps, 
  AdaptiveNavigationItem, 
  NavigationLayout 
} from './useAdaptiveNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless AdaptiveNavigation component
 */
export type AdaptiveNavigationHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseAdaptiveNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: AdaptiveNavigationItem[];
    /** Children to render inside the adaptive navigation */
    children: React.ReactNode | ((props: { 
      filteredItems: AdaptiveNavigationItem[]; 
      currentLayout: NavigationLayout;
      isOpen: boolean;
      iconsOnly: boolean;
      screenSize: 'mobile' | 'tablet' | 'desktop';
      orientation: 'portrait' | 'landscape';
      deviceType: 'mobile' | 'tablet' | 'desktop';
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
 * Props for the headless AdaptiveNavigationItem component
 */
export type AdaptiveNavigationItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: AdaptiveNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless AdaptiveNavigationIcon component
 */
export type AdaptiveNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: AdaptiveNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless AdaptiveNavigationLabel component
 */
export type AdaptiveNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: AdaptiveNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Whether to hide the label when in icons-only mode */
    hideInIconsMode?: boolean;
  }
>;

/**
 * Props for the headless AdaptiveNavigationToggle component
 */
export type AdaptiveNavigationToggleHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the toggle */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless AdaptiveNavigationLayoutSwitcher component
 */
export type AdaptiveNavigationLayoutSwitcherHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the layout switcher */
    children?: React.ReactNode | ((props: {
      currentLayout: NavigationLayout;
      setLayout: (layout: NavigationLayout) => void;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the adaptive navigation state
interface AdaptiveNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string) => void;
  currentLayout: NavigationLayout;
  setLayout: (layout: NavigationLayout) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  iconsOnly: boolean;
  setIconsOnly: (iconsOnly: boolean) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  filteredItems: AdaptiveNavigationItem[];
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: AdaptiveNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  getToggleProps: <E extends HTMLElement = HTMLButtonElement>(
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-label': string;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
}

const AdaptiveNavigationContext = createContext<AdaptiveNavigationContextValue | null>(null);

// Custom hook to use the adaptive navigation context
const useAdaptiveNavigationContext = () => {
  const context = useContext<AdaptiveNavigationContextValue | null>(AdaptiveNavigationContext);
  if (!context) {
    throw new Error('AdaptiveNavigation compound components must be used within an AdaptiveNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type AdaptiveNavigationHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: AdaptiveNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AdaptiveNavigationItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: AdaptiveNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AdaptiveNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: AdaptiveNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type AdaptiveNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: AdaptiveNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type AdaptiveNavigationToggleHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: AdaptiveNavigationToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AdaptiveNavigationLayoutSwitcherHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: AdaptiveNavigationLayoutSwitcherHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless AdaptiveNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled adaptive navigation implementations.
 */
export const AdaptiveNavigationHeadless = forwardRef(function AdaptiveNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    defaultLayout,
    layout: controlledLayout,
    onLayoutChange,
    breakpoints,
    adaptToScreenSize,
    adaptToUserPreferences,
    adaptToDeviceType,
    adaptToOrientation,
    isOpen: controlledIsOpen,
    onOpenChange,
    collapseToIcons,
    storageKey,
    ariaLabel = 'Adaptive navigation',
    ...props 
  }: Omit<AdaptiveNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const adaptiveNavigationState = useAdaptiveNavigation({
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    defaultLayout,
    layout: controlledLayout,
    onLayoutChange,
    breakpoints,
    adaptToScreenSize,
    adaptToUserPreferences,
    adaptToDeviceType,
    adaptToOrientation,
    isOpen: controlledIsOpen,
    onOpenChange,
    collapseToIcons,
    storageKey,
  });

  const { 
    activeId,
    setActiveId,
    currentLayout,
    setLayout,
    isOpen,
    open,
    close,
    toggle,
    iconsOnly,
    setIconsOnly,
    screenSize,
    orientation,
    deviceType,
    filteredItems,
    getContainerProps,
    getItemProps,
    getToggleProps,
  } = adaptiveNavigationState;

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <AdaptiveNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        currentLayout,
        setLayout,
        isOpen,
        open,
        close,
        toggle,
        iconsOnly,
        setIconsOnly,
        screenSize,
        orientation,
        deviceType,
        filteredItems,
        getItemProps,
        getToggleProps,
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
        {typeof children === 'function' 
          ? children({ 
              filteredItems, 
              currentLayout, 
              isOpen, 
              iconsOnly, 
              screenSize, 
              orientation, 
              deviceType 
            }) 
          : children}
      </ElementType>
    </AdaptiveNavigationContext.Provider>
  );
}) as unknown as AdaptiveNavigationHeadlessComponent;

/**
 * A headless AdaptiveNavigationItem component for rendering a navigation item.
 */
export const AdaptiveNavigationItemHeadless = forwardRef(function AdaptiveNavigationItemHeadless<C extends React.ElementType = 'a'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<AdaptiveNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useAdaptiveNavigationContext();
  
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
}) as unknown as AdaptiveNavigationItemHeadlessComponent;

/**
 * A headless AdaptiveNavigationIcon component for rendering a navigation item icon.
 */
export const AdaptiveNavigationIconHeadless = forwardRef(function AdaptiveNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<AdaptiveNavigationIconHeadlessProps<C>, 'ref'>,
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
}) as unknown as AdaptiveNavigationIconHeadlessComponent;

/**
 * A headless AdaptiveNavigationLabel component for rendering a navigation item label.
 */
export const AdaptiveNavigationLabelHeadless = forwardRef(function AdaptiveNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    hideInIconsMode = true,
    ...props 
  }: Omit<AdaptiveNavigationLabelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { iconsOnly } = useAdaptiveNavigationContext();
  
  // If in icons-only mode and hideInIconsMode is true, don't render
  if (iconsOnly && hideInIconsMode) {
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
}) as unknown as AdaptiveNavigationLabelHeadlessComponent;

/**
 * A headless AdaptiveNavigationToggle component for toggling the navigation.
 */
export const AdaptiveNavigationToggleHeadless = forwardRef(function AdaptiveNavigationToggleHeadless<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AdaptiveNavigationToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToggleProps, isOpen } = useAdaptiveNavigationContext();
  
  // Get props for the toggle button
  const toggleProps = getToggleProps({
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
      {children || (isOpen ? 'Close' : 'Menu')}
    </ElementType>
  );
}) as unknown as AdaptiveNavigationToggleHeadlessComponent;

/**
 * A headless AdaptiveNavigationLayoutSwitcher component for switching between layouts.
 */
export const AdaptiveNavigationLayoutSwitcherHeadless = forwardRef(function AdaptiveNavigationLayoutSwitcherHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AdaptiveNavigationLayoutSwitcherHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { currentLayout, setLayout } = useAdaptiveNavigationContext();
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {typeof children === 'function' 
        ? children({ currentLayout, setLayout }) 
        : children}
    </ElementType>
  );
}) as unknown as AdaptiveNavigationLayoutSwitcherHeadlessComponent;

// Add displayNames for better debugging
(AdaptiveNavigationHeadless as any).displayName = 'AdaptiveNavigationHeadless';
(AdaptiveNavigationItemHeadless as any).displayName = 'AdaptiveNavigationItemHeadless';
(AdaptiveNavigationIconHeadless as any).displayName = 'AdaptiveNavigationIconHeadless';
(AdaptiveNavigationLabelHeadless as any).displayName = 'AdaptiveNavigationLabelHeadless';
(AdaptiveNavigationToggleHeadless as any).displayName = 'AdaptiveNavigationToggleHeadless';
(AdaptiveNavigationLayoutSwitcherHeadless as any).displayName = 'AdaptiveNavigationLayoutSwitcherHeadless';

// Create a compound component
export const AdaptiveNavigation = Object.assign(AdaptiveNavigationHeadless, {
  Item: AdaptiveNavigationItemHeadless,
  Icon: AdaptiveNavigationIconHeadless,
  Label: AdaptiveNavigationLabelHeadless,
  Toggle: AdaptiveNavigationToggleHeadless,
  LayoutSwitcher: AdaptiveNavigationLayoutSwitcherHeadless,
});

export default AdaptiveNavigation;
