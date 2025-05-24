import React, { forwardRef } from 'react';
import { useInfiniteScroll, UseInfiniteScrollProps } from './useInfiniteScroll';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless InfiniteScroll component
 */
export type InfiniteScrollHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseInfiniteScrollProps & {
    /** Children to render inside the infinite scroll container */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless InfiniteScrollSentinel component
 */
export type InfiniteScrollSentinelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the sentinel */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless InfiniteScrollLoading component
 */
export type InfiniteScrollLoadingHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the loading indicator */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Custom aria-label for the loading indicator */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless InfiniteScrollError component
 */
export type InfiniteScrollErrorHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the error message */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Function to retry loading data */
    onRetry?: () => void;
  }
>;

/**
 * Props for the headless InfiniteScrollEnd component
 */
export type InfiniteScrollEndHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the end message */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the infinite scroll state
const InfiniteScrollContext = React.createContext<ReturnType<typeof useInfiniteScroll> | null>(null);

// Custom hook to use the infinite scroll context
const useInfiniteScrollContext = () => {
  const context = React.useContext(InfiniteScrollContext);
  if (!context) {
    throw new Error('InfiniteScroll compound components must be used within an InfiniteScrollHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type InfiniteScrollHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: InfiniteScrollHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type InfiniteScrollSentinelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: InfiniteScrollSentinelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type InfiniteScrollLoadingHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: InfiniteScrollLoadingHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type InfiniteScrollErrorHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: InfiniteScrollErrorHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type InfiniteScrollEndHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: InfiniteScrollEndHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless InfiniteScroll component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled infinite scroll implementations.
 */
export const InfiniteScrollHeadless = forwardRef(function InfiniteScrollHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    loadMore,
    hasMore,
    isLoading,
    threshold,
    useWindowScroll,
    onError,
    disabled,
    resetErrorOnHasMoreChange,
    ...props 
  }: Omit<InfiniteScrollHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const infiniteScrollState = useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading,
    threshold,
    useWindowScroll,
    onError,
    disabled,
    resetErrorOnHasMoreChange,
  });

  const containerProps = infiniteScrollState.getContainerProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <InfiniteScrollContext.Provider value={infiniteScrollState}>
      <ElementType
        {...containerProps}
        ref={ref}
      >
        {children}
      </ElementType>
    </InfiniteScrollContext.Provider>
  );
}) as unknown as InfiniteScrollHeadlessComponent;

/**
 * A headless InfiniteScrollSentinel component that triggers loading more data when it becomes visible.
 */
export const InfiniteScrollSentinelHeadless = forwardRef(function InfiniteScrollSentinelHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<InfiniteScrollSentinelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSentinelProps } = useInfiniteScrollContext();
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
    >
      {children}
    </ElementType>
  );
}) as unknown as InfiniteScrollSentinelHeadlessComponent;

/**
 * A headless InfiniteScrollLoading component for displaying a loading indicator.
 */
export const InfiniteScrollLoadingHeadless = forwardRef(function InfiniteScrollLoadingHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ariaLabel, ...props }: Omit<InfiniteScrollLoadingHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLoadingProps } = useInfiniteScrollContext();
  const loadingProps = getLoadingProps({
    className,
    style,
    'aria-label': ariaLabel,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...loadingProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as InfiniteScrollLoadingHeadlessComponent;

/**
 * A headless InfiniteScrollError component for displaying error messages.
 */
export const InfiniteScrollErrorHeadless = forwardRef(function InfiniteScrollErrorHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, onRetry, ...props }: Omit<InfiniteScrollErrorHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getErrorProps, triggerLoadMore } = useInfiniteScrollContext();
  const errorProps = getErrorProps({
    className,
    style,
    onClick: onRetry || triggerLoadMore,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...errorProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as InfiniteScrollErrorHeadlessComponent;

/**
 * A headless InfiniteScrollEnd component for displaying an end message.
 */
export const InfiniteScrollEndHeadless = forwardRef(function InfiniteScrollEndHeadless<C extends React.ElementType = 'div'>(
  { as, children, className, style, ...props }: Omit<InfiniteScrollEndHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getEndMessageProps } = useInfiniteScrollContext();
  const endMessageProps = getEndMessageProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...endMessageProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as InfiniteScrollEndHeadlessComponent;

// Add displayNames for better debugging
(InfiniteScrollHeadless as any).displayName = 'InfiniteScrollHeadless';
(InfiniteScrollSentinelHeadless as any).displayName = 'InfiniteScrollSentinelHeadless';
(InfiniteScrollLoadingHeadless as any).displayName = 'InfiniteScrollLoadingHeadless';
(InfiniteScrollErrorHeadless as any).displayName = 'InfiniteScrollErrorHeadless';
(InfiniteScrollEndHeadless as any).displayName = 'InfiniteScrollEndHeadless';

// Create a compound component
export const InfiniteScroll = Object.assign(InfiniteScrollHeadless, {
  Sentinel: InfiniteScrollSentinelHeadless,
  Loading: InfiniteScrollLoadingHeadless,
  Error: InfiniteScrollErrorHeadless,
  End: InfiniteScrollEndHeadless,
});

export default InfiniteScroll;
