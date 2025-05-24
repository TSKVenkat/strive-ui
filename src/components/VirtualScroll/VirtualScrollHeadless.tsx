import React, { forwardRef, createContext, useContext } from 'react';
import { useVirtualScroll, UseVirtualScrollProps, VirtualItem } from './useVirtualScroll';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless VirtualScroll component
 */
export type VirtualScrollHeadlessProps<T, C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseVirtualScrollProps<T>, 'items'> & {
    /** Items to render in the virtual list */
    items: T[];
    /** Children to render inside the virtual scroll container */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Custom aria-label for the list */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless VirtualScrollContent component
 */
export type VirtualScrollContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the virtual scroll content */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless VirtualScrollItem component
 */
export type VirtualScrollItemHeadlessProps<T, C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Virtual item data */
    virtualItem: VirtualItem<T>;
    /** Children to render inside the virtual scroll item */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the virtual scroll state
interface VirtualScrollContextValue<T> {
  virtualItems: VirtualItem<T>[];
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    virtualItem: VirtualItem<T>,
    props?: React.HTMLProps<E>
  ) => {
    style: React.CSSProperties;
    'data-index': number;
    role: string;
    'aria-rowindex'?: number;
  };
}

const VirtualScrollContext = createContext<VirtualScrollContextValue<any> | null>(null);

// Custom hook to use the virtual scroll context
const useVirtualScrollContext = <T,>() => {
  const context = useContext<VirtualScrollContextValue<T> | null>(VirtualScrollContext);
  if (!context) {
    throw new Error('VirtualScroll compound components must be used within a VirtualScrollHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type VirtualScrollHeadlessComponent = <T, C extends React.ElementType = 'div'>(
  props: VirtualScrollHeadlessProps<T, C> & { ref?: React.Ref<any> }
) => JSX.Element;

type VirtualScrollContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: VirtualScrollContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type VirtualScrollItemHeadlessComponent = <T, C extends React.ElementType = 'div'>(
  props: VirtualScrollItemHeadlessProps<T, C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless VirtualScroll component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled virtual scrolling implementations.
 */
export const VirtualScrollHeadless = forwardRef(function VirtualScrollHeadless<T, C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items,
    itemHeight,
    height,
    width,
    overscan,
    initialScrollOffset,
    onScroll,
    onItemsRendered,
    horizontal,
    smoothScroll,
    itemKey,
    ariaLabel,
    ...props 
  }: Omit<VirtualScrollHeadlessProps<T, C>, 'ref'>,
  ref: React.Ref<any>
) {
  const virtualScrollState = useVirtualScroll<T>({
    items,
    itemHeight,
    height,
    width,
    overscan,
    initialScrollOffset,
    onScroll,
    onItemsRendered,
    horizontal,
    smoothScroll,
    itemKey,
  });

  const { 
    virtualItems, 
    getContainerProps, 
    getItemProps 
  } = virtualScrollState;

  const containerProps = getContainerProps({
    className,
    style,
    'aria-label': ariaLabel,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <VirtualScrollContext.Provider value={{ virtualItems, getItemProps }}>
      <ElementType
        {...containerProps}
        ref={ref}
      >
        {children}
      </ElementType>
    </VirtualScrollContext.Provider>
  );
}) as unknown as VirtualScrollHeadlessComponent;

/**
 * A headless VirtualScrollContent component that contains the virtualized items.
 */
export const VirtualScrollContentHeadless = forwardRef(function VirtualScrollContentHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<VirtualScrollContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getContentProps } = useVirtualScroll({
    items: [],
    itemHeight: 0,
    height: 0,
  });

  const contentProps = getContentProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...contentProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as VirtualScrollContentHeadlessComponent;

/**
 * A headless VirtualScrollItem component for rendering individual virtualized items.
 */
export const VirtualScrollItemHeadless = forwardRef(function VirtualScrollItemHeadless<T, C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    virtualItem,
    ...props 
  }: Omit<VirtualScrollItemHeadlessProps<T, C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useVirtualScrollContext<T>();
  
  const itemProps = getItemProps(virtualItem, {
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...itemProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as VirtualScrollItemHeadlessComponent;

// Add displayNames for better debugging
(VirtualScrollHeadless as any).displayName = 'VirtualScrollHeadless';
(VirtualScrollContentHeadless as any).displayName = 'VirtualScrollContentHeadless';
(VirtualScrollItemHeadless as any).displayName = 'VirtualScrollItemHeadless';

// Create a compound component
export const VirtualScroll = Object.assign(VirtualScrollHeadless, {
  Content: VirtualScrollContentHeadless,
  Item: VirtualScrollItemHeadless,
});

export default VirtualScroll;
