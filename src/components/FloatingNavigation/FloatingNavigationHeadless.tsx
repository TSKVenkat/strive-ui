import React, { forwardRef, createContext, useContext } from 'react';
import { useFloatingNavigation, UseFloatingNavigationProps, FloatingNavigationItem, FloatingPosition } from './useFloatingNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless FloatingNavigation component
 */
export type FloatingNavigationHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseFloatingNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: FloatingNavigationItem[];
    /** Children to render inside the floating navigation */
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
 * Props for the headless FloatingNavigationToggle component
 */
export type FloatingNavigationToggleHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
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
 * Props for the headless FloatingNavigationContent component
 */
export type FloatingNavigationContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the content */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless FloatingNavigationItem component
 */
export type FloatingNavigationItemHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: FloatingNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless FloatingNavigationIcon component
 */
export type FloatingNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: FloatingNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless FloatingNavigationLabel component
 */
export type FloatingNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: FloatingNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless FloatingNavigationDragHandle component
 */
export type FloatingNavigationDragHandleHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the drag handle */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the floating navigation state
interface FloatingNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  position: FloatingPosition;
  setPosition: (position: FloatingPosition) => void;
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggleVisibility: () => void;
  collapsed: boolean;
  collapse: () => void;
  expand: () => void;
  toggleCollapsed: () => void;
  customPosition: { x: number; y: number } | null;
  resetPosition: () => void;
  handleDragStart: (event: React.MouseEvent | React.TouchEvent) => void;
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    item: FloatingNavigationItem,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    'aria-current': boolean | undefined;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  getToggleProps: <E extends HTMLElement = HTMLButtonElement>(props?: React.HTMLProps<E>) => {
    role: string;
    'aria-label': string;
    'aria-expanded': boolean;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
  };
}

const FloatingNavigationContext = createContext<FloatingNavigationContextValue | null>(null);

// Custom hook to use the floating navigation context
const useFloatingNavigationContext = () => {
  const context = useContext<FloatingNavigationContextValue | null>(FloatingNavigationContext);
  if (!context) {
    throw new Error('FloatingNavigation compound components must be used within a FloatingNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type FloatingNavigationHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type FloatingNavigationToggleHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: FloatingNavigationToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type FloatingNavigationContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type FloatingNavigationItemHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type FloatingNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type FloatingNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type FloatingNavigationDragHandleHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: FloatingNavigationDragHandleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless FloatingNavigation component for building custom floating navigation UIs.
 */
export const FloatingNavigationHeadless = forwardRef(function FloatingNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    orientation,
    size,
    variant,
    position,
    ariaLabel,
    onItemClick,
    ...props 
  }: Omit<FloatingNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Set default values
  const resolvedItems = items || ([] as FloatingNavigationItem[]);
  const resolvedOrientation = orientation || 'horizontal';
  const resolvedSize = size || 'medium';
  const resolvedVariant = variant || 'default';
  const resolvedPosition = position || 'bottom-right';
  const resolvedAriaLabel = ariaLabel || 'Floating navigation';

  const floatingNavigationState = useFloatingNavigation({
    items: resolvedItems,
    defaultActiveId: undefined,
    activeId: undefined,
    onActiveChange: () => {},
    defaultPosition: resolvedPosition,
    position: resolvedPosition,
    onPositionChange: () => {},
    draggable: false,
    visible: true,
    onVisibleChange: () => {},
    collapsed: false,
    onCollapsedChange: () => {},
    offset: 0,
    zIndex: 1000,
  });

  const { 
    activeId,
    setActiveId,
    position: currentPosition,
    setPosition,
    visible: isVisible,
    show,
    hide,
    toggleVisibility,
    collapsed: isCollapsed,
    collapse,
    expand,
    toggleCollapsed,
    customPosition,
    resetPosition,
    handleDragStart,
    getContainerProps,
    getItemProps,
    getToggleProps,
  } = floatingNavigationState;

  // Don't render anything if the navigation is not visible
  if (!isVisible) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <FloatingNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        position: currentPosition,
        setPosition,
        visible: isVisible,
        show,
        hide,
        toggleVisibility,
        collapsed: isCollapsed,
        collapse,
        expand,
        toggleCollapsed,
        customPosition,
        resetPosition,
        handleDragStart,
        getItemProps,
        getToggleProps,
      }}
    >
      <ElementType
        {...getContainerProps({
          className,
          style,
          ...props,
        })}
        ref={ref}
        role="navigation"
        aria-label={resolvedAriaLabel}
      >
        {children}
      </ElementType>
    </FloatingNavigationContext.Provider>
  );
}) as unknown as FloatingNavigationHeadlessComponent;

/**
 * A headless FloatingNavigationToggle component for toggling the collapsed state.
 */
export const FloatingNavigationToggleHeadless = forwardRef(function FloatingNavigationToggleHeadless<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<FloatingNavigationToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToggleProps, collapsed } = useFloatingNavigationContext();
  
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
      {children || (collapsed ? 'Expand' : 'Collapse')}
    </ElementType>
  );
}) as unknown as FloatingNavigationToggleHeadlessComponent;

/**
 * A headless FloatingNavigationContent component for rendering the content.
 */
export const FloatingNavigationContentHeadless = forwardRef(function FloatingNavigationContentHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<FloatingNavigationContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { collapsed } = useFloatingNavigationContext();
  
  // Don't render anything if the navigation is collapsed
  if (collapsed) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="menu"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as FloatingNavigationContentHeadlessComponent;

/**
 * A headless FloatingNavigationItem component for rendering a navigation item.
 */
export const FloatingNavigationItemHeadless = forwardRef(function FloatingNavigationItemHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<FloatingNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useFloatingNavigationContext();
  
  // Get props for the navigation item
  const itemProps = getItemProps(item, {
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
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
}) as unknown as FloatingNavigationItemHeadlessComponent;

/**
 * A headless FloatingNavigationIcon component for rendering a navigation item icon.
 */
export const FloatingNavigationIconHeadless = forwardRef(function FloatingNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<FloatingNavigationIconHeadlessProps<C>, 'ref'>,
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
}) as unknown as FloatingNavigationIconHeadlessComponent;

/**
 * A headless FloatingNavigationLabel component for rendering a navigation item label.
 */
export const FloatingNavigationLabelHeadless = forwardRef(function FloatingNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<FloatingNavigationLabelHeadlessProps<C>, 'ref'>,
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
}) as unknown as FloatingNavigationLabelHeadlessComponent;

/**
 * A headless FloatingNavigationDragHandle component for dragging the navigation.
 */
export const FloatingNavigationDragHandleHeadless = forwardRef(function FloatingNavigationDragHandleHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<FloatingNavigationDragHandleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { handleDragStart } = useFloatingNavigationContext();

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        cursor: 'move',
        ...style,
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      aria-label="Drag to move"
      role="button"
      tabIndex={0}
      {...props}
    >
      {children || '⋮⋮'}
    </ElementType>
  );
}) as unknown as FloatingNavigationDragHandleHeadlessComponent;

// Add displayNames for better debugging
(FloatingNavigationHeadless as any).displayName = 'FloatingNavigationHeadless';
(FloatingNavigationToggleHeadless as any).displayName = 'FloatingNavigationToggleHeadless';
(FloatingNavigationContentHeadless as any).displayName = 'FloatingNavigationContentHeadless';
(FloatingNavigationItemHeadless as any).displayName = 'FloatingNavigationItemHeadless';
(FloatingNavigationIconHeadless as any).displayName = 'FloatingNavigationIconHeadless';
(FloatingNavigationLabelHeadless as any).displayName = 'FloatingNavigationLabelHeadless';
(FloatingNavigationDragHandleHeadless as any).displayName = 'FloatingNavigationDragHandleHeadless';

// Create a compound component
export const FloatingNavigation = Object.assign(FloatingNavigationHeadless, {
  Toggle: FloatingNavigationToggleHeadless,
  Content: FloatingNavigationContentHeadless,
  Item: FloatingNavigationItemHeadless,
  Icon: FloatingNavigationIconHeadless,
  Label: FloatingNavigationLabelHeadless,
  DragHandle: FloatingNavigationDragHandleHeadless,
});

export default FloatingNavigation;
