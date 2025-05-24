import React, { forwardRef } from 'react';
import { useBreadcrumbs, UseBreadcrumbsProps, BreadcrumbItem } from './useBreadcrumbs';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless Breadcrumbs component
 */
export type BreadcrumbsHeadlessProps<C extends React.ElementType = 'nav'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseBreadcrumbsProps, 'items'> & {
    /** Children to render inside the breadcrumbs */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Array of breadcrumb items */
    items?: BreadcrumbItem[];
  }
>;

/**
 * Props for the headless BreadcrumbsList component
 */
export type BreadcrumbsListHeadlessProps<C extends React.ElementType = 'ol'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the breadcrumbs list */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless BreadcrumbsItem component
 */
export type BreadcrumbsItemHeadlessProps<C extends React.ElementType = 'li'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the breadcrumb item */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Breadcrumb item data */
    item: BreadcrumbItem;
  }
>;

/**
 * Props for the headless BreadcrumbsSeparator component
 */
export type BreadcrumbsSeparatorHeadlessProps<C extends React.ElementType = 'li'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the separator */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless BreadcrumbsCollapsed component
 */
export type BreadcrumbsCollapsedHeadlessProps<C extends React.ElementType = 'li'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the collapsed indicator */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Callback when the collapsed indicator is clicked */
    onClick?: (event: React.MouseEvent) => void;
  }
>;

/**
 * Props for the headless BreadcrumbsLink component
 */
export type BreadcrumbsLinkHeadlessProps<C extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the breadcrumb link */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Breadcrumb item data */
    item: BreadcrumbItem;
  }
>;

// Create a context to share the breadcrumbs state
const BreadcrumbsContext = React.createContext<ReturnType<typeof useBreadcrumbs> | null>(null);

// Custom hook to use the breadcrumbs context
const useBreadcrumbsContext = () => {
  const context = React.useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('Breadcrumbs compound components must be used within a BreadcrumbsHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type BreadcrumbsHeadlessComponent = <C extends React.ElementType = 'nav'>(
  props: BreadcrumbsHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BreadcrumbsListHeadlessComponent = <C extends React.ElementType = 'ol'>(
  props: BreadcrumbsListHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BreadcrumbsItemHeadlessComponent = <C extends React.ElementType = 'li'>(
  props: BreadcrumbsItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BreadcrumbsSeparatorHeadlessComponent = <C extends React.ElementType = 'li'>(
  props: BreadcrumbsSeparatorHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BreadcrumbsCollapsedHeadlessComponent = <C extends React.ElementType = 'li'>(
  props: BreadcrumbsCollapsedHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type BreadcrumbsLinkHeadlessComponent = <C extends React.ElementType = 'a'>(
  props: BreadcrumbsLinkHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Breadcrumbs component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled breadcrumbs.
 */
export const BreadcrumbsHeadless = forwardRef(function BreadcrumbsHeadless<C extends React.ElementType = 'nav'>(
  { 
    as, 
    children, 
    className, 
    style, 
    items = [],
    onItemClick,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    separator,
    ...props 
  }: Omit<BreadcrumbsHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const breadcrumbsState = useBreadcrumbs({
    items,
    onItemClick,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    separator,
  });

  const breadcrumbsProps = breadcrumbsState.getBreadcrumbsProps();

  // Use the 'as' prop or default to 'nav'
  const ElementType: React.ElementType = as || 'nav';

  return (
    <BreadcrumbsContext.Provider value={breadcrumbsState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...breadcrumbsProps}
        {...props}
      >
        {children}
      </ElementType>
    </BreadcrumbsContext.Provider>
  );
}) as unknown as BreadcrumbsHeadlessComponent;

/**
 * A headless BreadcrumbsList component for the list of breadcrumb items.
 */
export const BreadcrumbsListHeadless = forwardRef(function BreadcrumbsListHeadless<C extends React.ElementType = 'ol'>(
  { as, children, className, style, ...props }: Omit<BreadcrumbsListHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'ol'
  const ElementType: React.ElementType = as || 'ol';

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
}) as unknown as BreadcrumbsListHeadlessComponent;

/**
 * A headless BreadcrumbsItem component for individual breadcrumb items.
 */
export const BreadcrumbsItemHeadless = forwardRef(function BreadcrumbsItemHeadless<C extends React.ElementType = 'li'>(
  { as, children, className, style, item, ...props }: Omit<BreadcrumbsItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'li'
  const ElementType: React.ElementType = as || 'li';

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
}) as unknown as BreadcrumbsItemHeadlessComponent;

/**
 * A headless BreadcrumbsSeparator component for the separator between items.
 */
export const BreadcrumbsSeparatorHeadless = forwardRef(function BreadcrumbsSeparatorHeadless<C extends React.ElementType = 'li'>(
  { as, children, className, style, ...props }: Omit<BreadcrumbsSeparatorHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSeparatorProps, separator } = useBreadcrumbsContext();
  const separatorProps = getSeparatorProps();

  // Use the 'as' prop or default to 'li'
  const ElementType: React.ElementType = as || 'li';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...separatorProps}
      {...props}
    >
      {children || separator}
    </ElementType>
  );
}) as unknown as BreadcrumbsSeparatorHeadlessComponent;

/**
 * A headless BreadcrumbsCollapsed component for the collapsed indicator.
 */
export const BreadcrumbsCollapsedHeadless = forwardRef(function BreadcrumbsCollapsedHeadless<C extends React.ElementType = 'li'>(
  { as, children, className, style, onClick, ...props }: Omit<BreadcrumbsCollapsedHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getCollapsedProps, collapsedItems } = useBreadcrumbsContext();
  const collapsedProps = getCollapsedProps();

  // Use the 'as' prop or default to 'li'
  const ElementType: React.ElementType = as || 'li';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...collapsedProps}
      onClick={onClick}
      {...props}
    >
      {children || `...`}
    </ElementType>
  );
}) as unknown as BreadcrumbsCollapsedHeadlessComponent;

/**
 * A headless BreadcrumbsLink component for the breadcrumb item links.
 */
export const BreadcrumbsLinkHeadless = forwardRef(function BreadcrumbsLinkHeadless<C extends React.ElementType = 'a'>(
  { as, children, className, style, item, ...props }: Omit<BreadcrumbsLinkHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps } = useBreadcrumbsContext();
  const itemProps = getItemProps(item);

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
}) as unknown as BreadcrumbsLinkHeadlessComponent;

// Add displayNames for better debugging
(BreadcrumbsHeadless as any).displayName = 'BreadcrumbsHeadless';
(BreadcrumbsListHeadless as any).displayName = 'BreadcrumbsListHeadless';
(BreadcrumbsItemHeadless as any).displayName = 'BreadcrumbsItemHeadless';
(BreadcrumbsSeparatorHeadless as any).displayName = 'BreadcrumbsSeparatorHeadless';
(BreadcrumbsCollapsedHeadless as any).displayName = 'BreadcrumbsCollapsedHeadless';
(BreadcrumbsLinkHeadless as any).displayName = 'BreadcrumbsLinkHeadless';

// Create a compound component
export const Breadcrumbs = Object.assign(BreadcrumbsHeadless, {
  List: BreadcrumbsListHeadless,
  Item: BreadcrumbsItemHeadless,
  Separator: BreadcrumbsSeparatorHeadless,
  Collapsed: BreadcrumbsCollapsedHeadless,
  Link: BreadcrumbsLinkHeadless,
});

export default Breadcrumbs;
