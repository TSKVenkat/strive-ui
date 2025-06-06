import React, { forwardRef, createContext, useContext } from 'react';
import { useQuickActions, UseQuickActionsProps, QuickAction } from './useQuickActions';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless QuickActions component
 */
export type QuickActionsHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseQuickActionsProps, 'actions'> & {
    /** Quick actions to render */
    actions: QuickAction[];
    /** Children to render inside the quick actions */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Aria label for the menu */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless QuickActionsSearch component
 */
export type QuickActionsSearchHeadlessProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the search input */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Whether to auto focus the search input */
    autoFocus?: boolean;
  }
>;

/**
 * Props for the headless QuickActionsList component
 */
export type QuickActionsListHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the list */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsItem component
 */
export type QuickActionsItemHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The quick action data */
    action: QuickAction;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsIcon component
 */
export type QuickActionsIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The quick action data */
    action: QuickAction;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsLabel component
 */
export type QuickActionsLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The quick action data */
    action: QuickAction;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsShortcut component
 */
export type QuickActionsShortcutHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The quick action data */
    action: QuickAction;
    /** Children to render inside the shortcut */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsDescription component
 */
export type QuickActionsDescriptionHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The quick action data */
    action: QuickAction;
    /** Children to render inside the description */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsEmpty component
 */
export type QuickActionsEmptyHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the empty state */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsGroup component
 */
export type QuickActionsGroupHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Group name */
    name: string;
    /** Children to render inside the group */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless QuickActionsGroupLabel component
 */
export type QuickActionsGroupLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Group name */
    name: string;
    /** Children to render inside the group label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the quick actions state
interface QuickActionsContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activeActionId: string | null;
  filteredActions: QuickAction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerAction: (id: string) => void;
  getActionProps: <E extends HTMLElement = HTMLDivElement>(
    action: QuickAction,
    props?: React.HTMLProps<E>
  ) => {
    role: string;
    id: string;
    tabIndex: number;
    'aria-disabled': boolean | undefined;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onMouseEnter: () => void;
    'aria-selected': boolean;
  };
  getSearchInputProps: <E extends HTMLInputElement = HTMLInputElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLInputElement>;
    role: string;
    'aria-label': string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoFocus?: boolean;
  };
}

const QuickActionsContext = createContext<QuickActionsContextValue | null>(null);

// Custom hook to use the quick actions context
const useQuickActionsContext = () => {
  const context = useContext<QuickActionsContextValue | null>(QuickActionsContext);
  if (!context) {
    throw new Error('QuickActions compound components must be used within a QuickActionsHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type QuickActionsHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type QuickActionsSearchHeadlessComponent = <C extends React.ElementType = 'input'>(
  props: QuickActionsSearchHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsListHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsListHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsItemHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type QuickActionsLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsShortcutHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsShortcutHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type QuickActionsDescriptionHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsDescriptionHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type QuickActionsEmptyHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsEmptyHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsGroupHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsGroupHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type QuickActionsGroupLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: QuickActionsGroupLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless QuickActions component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled quick actions implementations.
 */
export const QuickActionsHeadless = forwardRef(function QuickActionsHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    actions,
    isOpen: controlledIsOpen,
    onOpenChange,
    closeOnAction,
    enableShortcuts,
    enableKeyboardNavigation,
    enableSearch,
    initialSearchQuery,
    onActionTriggered,
    ariaLabel = 'Quick actions' as any,
    ...props 
  }: Omit<QuickActionsHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const quickActionsState = useQuickActions({
    actions,
    isOpen: controlledIsOpen,
    onOpenChange,
    closeOnAction,
    enableShortcuts,
    enableKeyboardNavigation,
    enableSearch,
    initialSearchQuery,
    onActionTriggered,
  });

  const { 
    isOpen,
    open,
    close,
    toggle,
    activeActionId,
    filteredActions,
    searchQuery,
    setSearchQuery,
    triggerAction,
    getContainerProps,
    getSearchInputProps,
    getActionProps,
  } = quickActionsState;

  // Don't render anything if the menu is closed
  if (!isOpen) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <QuickActionsContext.Provider 
      value={{ 
        isOpen,
        open,
        close,
        toggle,
        activeActionId,
        filteredActions,
        searchQuery,
        setSearchQuery,
        triggerAction,
        getActionProps,
        getSearchInputProps,
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
    </QuickActionsContext.Provider>
  );
}) as unknown as QuickActionsHeadlessComponent;

/**
 * A headless QuickActionsSearch component for searching actions.
 */
export const QuickActionsSearchHeadless = forwardRef(function QuickActionsSearchHeadless<C extends React.ElementType = 'input'>(
  { 
    as, 
    children, 
    className, 
    style, 
    placeholder,
    autoFocus,
    ...props 
  }: Omit<QuickActionsSearchHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSearchInputProps } = useQuickActionsContext();
  
  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...getSearchInputProps({
        className,
        style,
        placeholder,
        autoFocus,
        ...props,
      })}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as QuickActionsSearchHeadlessComponent;

/**
 * A headless QuickActionsList component for rendering the list of actions.
 */
export const QuickActionsListHeadless = forwardRef(function QuickActionsListHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<QuickActionsListHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      role="group"
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as QuickActionsListHeadlessComponent;

/**
 * A headless QuickActionsItem component for rendering an action item.
 */
export const QuickActionsItemHeadless = forwardRef(function QuickActionsItemHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    action,
    ...props 
  }: Omit<QuickActionsItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getActionProps } = useQuickActionsContext();
  
  // Get props for the action item
  const actionProps = getActionProps(action, {
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...actionProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as QuickActionsItemHeadlessComponent;

/**
 * A headless QuickActionsIcon component for rendering an action icon.
 */
export const QuickActionsIconHeadless = forwardRef(function QuickActionsIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    action,
    ...props 
  }: Omit<QuickActionsIconHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // If there's no icon, don't render anything
  if (!action.icon && !children) {
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
      {children || action.icon}
    </ElementType>
  );
}) as unknown as QuickActionsIconHeadlessComponent;

/**
 * A headless QuickActionsLabel component for rendering an action label.
 */
export const QuickActionsLabelHeadless = forwardRef(function QuickActionsLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    action,
    ...props 
  }: Omit<QuickActionsLabelHeadlessProps<C>, 'ref'>,
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
      {children || action.label}
    </ElementType>
  );
}) as unknown as QuickActionsLabelHeadlessComponent;

/**
 * A headless QuickActionsShortcut component for rendering an action keyboard shortcut.
 */
export const QuickActionsShortcutHeadless = forwardRef(function QuickActionsShortcutHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    action,
    ...props 
  }: Omit<QuickActionsShortcutHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // If there's no shortcut, don't render anything
  if (!action.shortcut && !children) {
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
      {children || action.shortcut}
    </ElementType>
  );
}) as unknown as QuickActionsShortcutHeadlessComponent;

/**
 * A headless QuickActionsDescription component for rendering an action description.
 */
export const QuickActionsDescriptionHeadless = forwardRef(function QuickActionsDescriptionHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    action,
    ...props 
  }: Omit<QuickActionsDescriptionHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // If there's no description, don't render anything
  if (!action.description && !children) {
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
      {children || action.description}
    </ElementType>
  );
}) as unknown as QuickActionsDescriptionHeadlessComponent;

/**
 * A headless QuickActionsEmpty component for rendering an empty state.
 */
export const QuickActionsEmptyHeadless = forwardRef(function QuickActionsEmptyHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<QuickActionsEmptyHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { filteredActions } = useQuickActionsContext();
  
  // Only render if there are no filtered actions
  if (filteredActions.length > 0) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      role="status"
      className={className}
      style={style}
      {...props}
    >
      {children || 'No actions found'}
    </ElementType>
  );
}) as unknown as QuickActionsEmptyHeadlessComponent;

/**
 * A headless QuickActionsGroup component for grouping actions.
 */
export const QuickActionsGroupHeadless = forwardRef(function QuickActionsGroupHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    name,
    ...props 
  }: Omit<QuickActionsGroupHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { filteredActions } = useQuickActionsContext();
  
  // Only render if there are actions in this group
  const hasActionsInGroup = filteredActions.some(action => action.group === name);
  
  if (!hasActionsInGroup) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      role="group"
      aria-label={name}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as QuickActionsGroupHeadlessComponent;

/**
 * A headless QuickActionsGroupLabel component for rendering a group label.
 */
export const QuickActionsGroupLabelHeadless = forwardRef(function QuickActionsGroupLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    name,
    ...props 
  }: Omit<QuickActionsGroupLabelHeadlessProps<C>, 'ref'>,
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
      {children || name}
    </ElementType>
  );
}) as unknown as QuickActionsGroupLabelHeadlessComponent;

// Add displayNames for better debugging
(QuickActionsHeadless as any).displayName = 'QuickActionsHeadless';
(QuickActionsSearchHeadless as any).displayName = 'QuickActionsSearchHeadless';
(QuickActionsListHeadless as any).displayName = 'QuickActionsListHeadless';
(QuickActionsItemHeadless as any).displayName = 'QuickActionsItemHeadless';
(QuickActionsIconHeadless as any).displayName = 'QuickActionsIconHeadless';
(QuickActionsLabelHeadless as any).displayName = 'QuickActionsLabelHeadless';
(QuickActionsShortcutHeadless as any).displayName = 'QuickActionsShortcutHeadless';
(QuickActionsDescriptionHeadless as any).displayName = 'QuickActionsDescriptionHeadless';
(QuickActionsEmptyHeadless as any).displayName = 'QuickActionsEmptyHeadless';
(QuickActionsGroupHeadless as any).displayName = 'QuickActionsGroupHeadless';
(QuickActionsGroupLabelHeadless as any).displayName = 'QuickActionsGroupLabelHeadless';

// Create a compound component
export const QuickActions = Object.assign(QuickActionsHeadless, {
  Search: QuickActionsSearchHeadless,
  List: QuickActionsListHeadless,
  Item: QuickActionsItemHeadless,
  Icon: QuickActionsIconHeadless,
  Label: QuickActionsLabelHeadless,
  Shortcut: QuickActionsShortcutHeadless,
  Description: QuickActionsDescriptionHeadless,
  Empty: QuickActionsEmptyHeadless,
  Group: QuickActionsGroupHeadless,
  GroupLabel: QuickActionsGroupLabelHeadless,
});

export default QuickActions;
