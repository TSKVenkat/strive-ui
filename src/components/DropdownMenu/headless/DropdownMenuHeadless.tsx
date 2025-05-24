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
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps } = useDropdownMenuContext();
    
    const triggerProps = getTriggerProps();
    
    return (
      <Component 
        {...triggerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
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
const Content = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContentProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContentProps, isOpen } = useDropdownMenuContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    
    return (
      <Component 
        {...contentProps} 
        {...props} 
        ref={ref}
        style={{ 
          ...contentProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
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
const Arrow = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ArrowProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getArrowProps, isOpen } = useDropdownMenuContext();
    
    if (!isOpen) {
      return null;
    }
    
    const arrowProps = getArrowProps();
    
    return (
      <Component 
        {...arrowProps} 
        {...props} 
        ref={ref}
        style={{ 
          ...arrowProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
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
const Item = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, item, index, ...props }: ItemProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getItemProps, highlightedIndex, selectedIds } = useDropdownMenuContext();
    
    const itemProps = getItemProps(item, index);
    const isHighlighted = index === highlightedIndex;
    const isSelected = selectedIds.includes(item.id);
    
    return (
      <Component 
        {...itemProps} 
        {...props} 
        ref={ref}
        data-highlighted={isHighlighted}
        data-selected={isSelected}
        style={{ 
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          opacity: item.disabled ? 0.5 : 1,
          ...props.style,
        }}
      >
        {children}
      </Component>
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
const Divider = forwardRef(
  <C extends React.ElementType = 'hr'>(
    { as, ...props }: DividerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'hr';
    
    return (
      <Component 
        role="separator"
        {...props} 
        ref={ref}
      />
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
const Header = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: HeaderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        role="presentation"
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
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
const Group = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, label, ...props }: GroupProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        role="group"
        aria-labelledby={label ? `group-label-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined}
        {...props} 
        ref={ref}
      >
        {label && (
          <div 
            id={`group-label-${label.replace(/\s+/g, '-').toLowerCase()}`}
            role="presentation"
          >
            {label}
          </div>
        )}
        {children}
      </Component>
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
const Search = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, placeholder, ...props }: SearchProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getSearchInputProps } = useDropdownMenuContext();
    
    const searchProps = getSearchInputProps();
    
    return (
      <Component 
        type="text"
        {...searchProps} 
        placeholder={placeholder || searchProps.placeholder}
        {...props} 
        ref={ref}
        onClick={(e: React.MouseEvent) => {
          // Prevent closing the dropdown when clicking the search input
          e.stopPropagation();
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      />
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
const Empty = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: EmptyProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { filteredItems } = useDropdownMenuContext();
    
    if (filteredItems.length > 0) {
      return null;
    }
    
    return (
      <Component 
        role="presentation"
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
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
const Checkbox = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, itemId, children, ...props }: CheckboxProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { selectedIds, toggleSelection } = useDropdownMenuContext();
    
    const isChecked = selectedIds.includes(itemId);
    
    return (
      <Component 
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleSelection(itemId)}
        onClick={(e: React.MouseEvent) => {
          // Prevent triggering the item click handler
          e.stopPropagation();
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
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
};

export default DropdownMenuHeadless;
