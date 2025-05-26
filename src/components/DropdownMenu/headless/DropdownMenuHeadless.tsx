import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useDropdownMenu, UseDropdownMenuReturn, DropdownMenuOptions, DropdownMenuItem } from './useDropdownMenu';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the DropdownMenu component
interface DropdownMenuContextValue extends UseDropdownMenuReturn {}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

// Hook to use DropdownMenu context
export function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('useDropdownMenuContext must be used within a DropdownMenuHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends DropdownMenuOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const dropdownMenuProps = useDropdownMenu(options);
    
    return (
      <DropdownMenuContext.Provider value={dropdownMenuProps}>
        <div ref={ref}>
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

Root.displayName = 'DropdownMenuHeadless.Root';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Trigger component
const Trigger = forwardRef(function Trigger<C extends React.ElementType = 'button'>(
    { as, children, ...props }: Omit<TriggerProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'button';
    const { getTriggerProps } = useDropdownMenuContext();
    
    const triggerProps = getTriggerProps();
    
    return React.createElement(
      Component,
      {
        ...triggerProps,
        ...props,
        ref: ref
      },
      children
    );
  }
);

Trigger.displayName = 'DropdownMenuHeadless.Trigger';

// Portal component props
export type PortalProps = {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
  /**
   * Whether to use a portal
   */
  usePortal?: boolean;
};

// Portal component
const Portal: React.FC<PortalProps> = ({ 
  children, 
  portalId = 'dropdown-menu-root',
  usePortal = true 
}) => {
  const { isOpen } = useDropdownMenuContext();
  
  // Create portal container if it doesn't exist
  React.useEffect(() => {
    if (!usePortal) return;
    
    let portalElement = document.getElementById(portalId);
    
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.id = portalId;
      document.body.appendChild(portalElement);
    }
    
    return () => {
      // Only remove the portal element if it's empty
      if (portalElement && portalElement.childNodes.length === 0) {
        portalElement.remove();
      }
    };
  }, [portalId, usePortal]);
  
  if (!isOpen) {
    return null;
  }
  
  if (!usePortal) {
    return <>{children}</>;
  }
  
  const portalElement = document.getElementById(portalId);
  
  if (!portalElement) {
    return null;
  }
  
  return createPortal(children, portalElement);
};

Portal.displayName = 'DropdownMenuHeadless.Portal';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Content component
const Content = forwardRef(function Content<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<ContentProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const { getContentProps, isOpen } = useDropdownMenuContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    
    return React.createElement(
      Component,
      {
        ...contentProps,
        ...props,
        ref: ref,
        style: { 
          ...contentProps.style,
          ...props.style,
        }
      },
      children
    );
  }
);

Content.displayName = 'DropdownMenuHeadless.Content';

// Arrow component props
export type ArrowProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Arrow component
const Arrow = forwardRef(function Arrow<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<ArrowProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const { getArrowProps, isOpen } = useDropdownMenuContext();
    
    if (!isOpen) {
      return null;
    }
    
    const arrowProps = getArrowProps();
    
    return React.createElement(
      Component,
      {
        ...arrowProps,
        ...props,
        ref: ref,
        style: { 
          ...arrowProps.style,
          ...props.style,
        }
      },
      children
    );
  }
);

Arrow.displayName = 'DropdownMenuHeadless.Arrow';

// Item component props
export type ItemProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
    /**
     * Item data
     */
    item: DropdownMenuItem;
    /**
     * Item index
     */
    index: number;
  }
>;

// Item component
const Item = forwardRef(function Item<C extends React.ElementType = 'div'>(
    { as, children, item, index, ...props }: Omit<ItemProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const { getItemProps, highlightedIndex, selectedIds } = useDropdownMenuContext();
    
    const itemProps = getItemProps(item, index);
    const isHighlighted = index === highlightedIndex;
    const isSelected = selectedIds.includes(item.id);
    
    return React.createElement(
      Component, 
      {
        ...itemProps, 
        ...props, 
        ref: ref,
        'data-highlighted': isHighlighted,
        'data-selected': isSelected,
        style: { 
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          opacity: item.disabled ? 0.5 : 1,
          ...props.style,
        }
      },
      children
    );
  }
);

Item.displayName = 'DropdownMenuHeadless.Item';

// Divider component props
export type DividerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {}
>;

// Divider component
const Divider = forwardRef(function Divider<C extends React.ElementType = 'hr'>(
    { as, ...props }: Omit<DividerProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'hr';
    
    return React.createElement(
      Component,
      {
        role: "separator",
        ...props,
        ref: ref
      }
    );
  }
);

Divider.displayName = 'DropdownMenuHeadless.Divider';

// Header component props
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Header component
const Header = forwardRef(function Header<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<HeaderProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        role: "presentation",
        ...props,
        ref: ref
      },
      children
    );
  }
);

Header.displayName = 'DropdownMenuHeadless.Header';

// Group component props
export type GroupProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
    /**
     * Label for the group
     */
    label?: string;
  }
>;

// Group component
const Group = forwardRef(function Group<C extends React.ElementType = 'div'>(
    { as, children, label, ...props }: Omit<GroupProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const labelId = label ? `group-label-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;
    
    return React.createElement(
      Component,
      {
        role: "group",
        "aria-labelledby": labelId,
        ...props,
        ref: ref
      },
      [
        label && React.createElement(
          'div',
          {
            key: 'label',
            id: labelId,
            role: "presentation"
          },
          label
        ),
        children
      ]
    );
  }
);

Group.displayName = 'DropdownMenuHeadless.Group';

// Search component props
export type SearchProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Placeholder for the search input
     */
    placeholder?: string;
  }
>;

// Search component
const Search = forwardRef(function Search<C extends React.ElementType = 'input'>(
    { as, placeholder, ...props }: Omit<SearchProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'input';
    const { getSearchInputProps } = useDropdownMenuContext();
    
    const searchProps = getSearchInputProps();
    
    const handleClick = (e: React.MouseEvent) => {
      // Prevent closing the dropdown when clicking the search input
      e.stopPropagation();
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return React.createElement(
      Component,
      {
        type: "text",
        ...searchProps,
        placeholder: placeholder || searchProps.placeholder,
        ...props,
        ref: ref,
        onClick: handleClick
      }
    );
  }
);

Search.displayName = 'DropdownMenuHeadless.Search';

// Empty component props
export type EmptyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Empty component
const Empty = forwardRef(function Empty<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<EmptyProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const { filteredItems } = useDropdownMenuContext();
    
    if (filteredItems.length > 0) {
      return null;
    }
    
    return React.createElement(
      Component,
      {
        role: "presentation",
        ...props,
        ref: ref
      },
      children
    );
  }
);

Empty.displayName = 'DropdownMenuHeadless.Empty';

// Checkbox component props
export type CheckboxProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Item ID to associate with this checkbox
     */
    itemId: string;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Checkbox component
const Checkbox = forwardRef(function Checkbox<C extends React.ElementType = 'input'>(
    { as, itemId, children, ...props }: Omit<CheckboxProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'input';
    const { selectedIds, toggleSelection } = useDropdownMenuContext();
    
    const isChecked = selectedIds.includes(itemId);
    
    const handleChange = () => toggleSelection(itemId);
    
    const handleClick = (e: React.MouseEvent) => {
      // Prevent triggering the item click handler
      e.stopPropagation();
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return React.createElement(
      Component,
      {
        type: "checkbox",
        checked: isChecked,
        onChange: handleChange,
        onClick: handleClick,
        ...props,
        ref: ref
      },
      children
    );
  }
);

Checkbox.displayName = 'DropdownMenuHeadless.Checkbox';

// Export all components
export const DropdownMenuHeadless = {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  Item,
  Divider,
  Header,
  Group,
  Search,
  Empty,
  Checkbox,
  useDropdownMenuContext,
} as const;

// Type for the compound component
export type DropdownMenuHeadlessType = typeof DropdownMenuHeadless;

export default DropdownMenuHeadless;
