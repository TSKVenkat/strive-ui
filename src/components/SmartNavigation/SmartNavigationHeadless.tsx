import React, { forwardRef, createContext, useContext } from 'react';
import { useSmartNavigation, UseSmartNavigationProps, SmartNavigationItem, SmartNavigationUsageData } from './useSmartNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless SmartNavigation component
 */
export type SmartNavigationHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseSmartNavigationProps, 'items'> & {
    /** Navigation items to render */
    items: SmartNavigationItem[];
    /** Children to render inside the smart navigation */
    children: React.ReactNode | ((props: { 
      visibleItems: SmartNavigationItem[]; 
      hiddenItems: SmartNavigationItem[];
      usageData: Record<string, SmartNavigationUsageData>;
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
 * Props for the headless SmartNavigationItem component
 */
export type SmartNavigationItemHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: SmartNavigationItem;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SmartNavigationIcon component
 */
export type SmartNavigationIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: SmartNavigationItem;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SmartNavigationLabel component
 */
export type SmartNavigationLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The navigation item data */
    item: SmartNavigationItem;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SmartNavigationHiddenItems component
 */
export type SmartNavigationHiddenItemsHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the hidden items container */
    children?: React.ReactNode | ((items: SmartNavigationItem[]) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless SmartNavigationResetButton component
 */
export type SmartNavigationResetButtonHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the reset button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the smart navigation state
interface SmartNavigationContextValue {
  activeId: string | null;
  setActiveId: (id: string) => void;
  visibleItems: SmartNavigationItem[];
  hiddenItems: SmartNavigationItem[];
  usageData: Record<string, SmartNavigationUsageData>;
  resetUsageData: () => void;
  recordItemClick: (id: string) => void;
  updateContextTags: (tags: string[]) => void;
  getItemProps: <E extends HTMLElement = HTMLElement>(
    item: SmartNavigationItem,
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

const SmartNavigationContext = createContext<SmartNavigationContextValue | null>(null);

// Custom hook to use the smart navigation context
const useSmartNavigationContext = () => {
  const context = useContext<SmartNavigationContextValue | null>(SmartNavigationContext);
  if (!context) {
    throw new Error('SmartNavigation compound components must be used within a SmartNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type SmartNavigationHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: SmartNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SmartNavigationItemHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: SmartNavigationItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SmartNavigationIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SmartNavigationIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type SmartNavigationLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SmartNavigationLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SmartNavigationHiddenItemsHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SmartNavigationHiddenItemsHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type SmartNavigationResetButtonHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: SmartNavigationResetButtonHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless SmartNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled smart navigation implementations.
 */
export const SmartNavigationHeadless = forwardRef(function SmartNavigationHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    maxVisibleItems,
    enableLearning,
    enableContextAwareness,
    contextTags,
    storageKey,
    weightDecayFactor,
    clickWeightBoost,
    contextRelevanceBoost,
    recencyWindow,
    ariaLabel = 'Smart navigation',
    ...props 
  }: Omit<SmartNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const smartNavigationState = useSmartNavigation({
    items,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveChange,
    maxVisibleItems,
    enableLearning,
    enableContextAwareness,
    contextTags,
    storageKey,
    weightDecayFactor,
    clickWeightBoost,
    contextRelevanceBoost,
    recencyWindow,
  });

  const { 
    activeId,
    setActiveId,
    visibleItems,
    hiddenItems,
    usageData,
    resetUsageData,
    recordItemClick,
    updateContextTags,
    getContainerProps,
    getItemProps,
  } = smartNavigationState;

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <SmartNavigationContext.Provider 
      value={{ 
        activeId,
        setActiveId,
        visibleItems,
        hiddenItems,
        usageData,
        resetUsageData,
        recordItemClick,
        updateContextTags,
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
        {typeof children === 'function' 
          ? children({ visibleItems, hiddenItems, usageData }) 
          : children}
      </ElementType>
    </SmartNavigationContext.Provider>
  );
}) as unknown as SmartNavigationHeadlessComponent;

/**
 * A headless SmartNavigationItem component for rendering a navigation item.
 */
export const SmartNavigationItemHeadless = forwardRef(function SmartNavigationItemHeadless<C extends React.ElementType = 'a'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<SmartNavigationItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useSmartNavigationContext();
  
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
}) as unknown as SmartNavigationItemHeadlessComponent;

/**
 * A headless SmartNavigationIcon component for rendering a navigation item icon.
 */
export const SmartNavigationIconHeadless = forwardRef(function SmartNavigationIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<SmartNavigationIconHeadlessProps<C>, 'ref'>,
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
}) as unknown as SmartNavigationIconHeadlessComponent;

/**
 * A headless SmartNavigationLabel component for rendering a navigation item label.
 */
export const SmartNavigationLabelHeadless = forwardRef(function SmartNavigationLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    item,
    ...props 
  }: Omit<SmartNavigationLabelHeadlessProps<C>, 'ref'>,
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
}) as unknown as SmartNavigationLabelHeadlessComponent;

/**
 * A headless SmartNavigationHiddenItems component for rendering hidden items.
 */
export const SmartNavigationHiddenItemsHeadless = forwardRef(function SmartNavigationHiddenItemsHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SmartNavigationHiddenItemsHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { hiddenItems } = useSmartNavigationContext();
  
  // If there are no hidden items, don't render
  if (hiddenItems.length === 0) {
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
      {typeof children === 'function' ? children(hiddenItems) : children}
    </ElementType>
  );
}) as unknown as SmartNavigationHiddenItemsHeadlessComponent;

/**
 * A headless SmartNavigationResetButton component for resetting usage data.
 */
export const SmartNavigationResetButtonHeadless = forwardRef(function SmartNavigationResetButtonHeadless<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SmartNavigationResetButtonHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { resetUsageData } = useSmartNavigationContext();
  
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      onClick={() => resetUsageData()}
      aria-label="Reset navigation preferences"
      {...props}
    >
      {children || 'Reset'}
    </ElementType>
  );
}) as unknown as SmartNavigationResetButtonHeadlessComponent;

// Add displayNames for better debugging
(SmartNavigationHeadless as any).displayName = 'SmartNavigationHeadless';
(SmartNavigationItemHeadless as any).displayName = 'SmartNavigationItemHeadless';
(SmartNavigationIconHeadless as any).displayName = 'SmartNavigationIconHeadless';
(SmartNavigationLabelHeadless as any).displayName = 'SmartNavigationLabelHeadless';
(SmartNavigationHiddenItemsHeadless as any).displayName = 'SmartNavigationHiddenItemsHeadless';
(SmartNavigationResetButtonHeadless as any).displayName = 'SmartNavigationResetButtonHeadless';

// Create a compound component
export const SmartNavigation = Object.assign(SmartNavigationHeadless, {
  Item: SmartNavigationItemHeadless,
  Icon: SmartNavigationIconHeadless,
  Label: SmartNavigationLabelHeadless,
  HiddenItems: SmartNavigationHiddenItemsHeadless,
  ResetButton: SmartNavigationResetButtonHeadless,
});

export default SmartNavigation;
