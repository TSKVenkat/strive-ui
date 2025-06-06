import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useContextMenu, UseContextMenuReturn, ContextMenuOptions } from './useContextMenu';
import { DropdownMenuItem } from '../../DropdownMenu/headless/useDropdownMenu';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ContextMenu component
interface ContextMenuContextValue extends UseContextMenuReturn {}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

// Hook to use ContextMenu context
export function useContextMenuContext() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenuContext must be used within a ContextMenuHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ContextMenuOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const contextMenuProps = useContextMenu(options);
    
    return (
      <ContextMenuContext.Provider value={contextMenuProps}>
        <div ref={ref}>
          {children}
        </div>
      </ContextMenuContext.Provider>
    );
  }
);

Root.displayName = 'ContextMenuHeadless.Root';

// Target component props
export type TargetProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Target component
const Target = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Target.displayName = 'ContextMenuHeadless.Target';

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
  portalId = 'context-menu-root',
  usePortal = true 
}) => {
  const { isOpen } = useContextMenuContext();
  
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

Portal.displayName = 'ContextMenuHeadless.Portal';

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
const Content = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'ContextMenuHeadless.Content';

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
const Item = forwardRef<any, any>(
  ({ as, children, item, index, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Item.displayName = 'ContextMenuHeadless.Item';

// Divider component props
export type DividerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {}
>;

// Divider component
const Divider = forwardRef<any, any>(
  ({ as, ...props }, ref) => {
    const Component = as || 'hr';
    
    return (
      <Component
        ref={ref}
        {...props}
      />
    );
  }
);

Divider.displayName = 'ContextMenuHeadless.Divider';

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
const Header = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Header.displayName = 'ContextMenuHeadless.Header';

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
const Group = forwardRef<any, any>(
  ({ as, children, label, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = 'ContextMenuHeadless.Group';

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
const Search = forwardRef<any, any>(
  ({ as, placeholder, ...props }, ref) => {
    const Component = as || 'input';
    
    return (
      <Component
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

Search.displayName = 'ContextMenuHeadless.Search';

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
const Empty = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Empty.displayName = 'ContextMenuHeadless.Empty';

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
const Checkbox = forwardRef<any, any>(
  ({ as, itemId, children, ...props }, ref) => {
    const Component = as || 'input';
    
    return (
      <Component
        ref={ref}
        type="checkbox"
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Checkbox.displayName = 'ContextMenuHeadless.Checkbox';

// Export all components
export const ContextMenuHeadless = {
  Root,
  Target,
  Portal,
  Content,
  Item,
  Divider,
  Header,
  Group,
  Search,
  Empty,
  Checkbox,
  useContextMenuContext,
};

export default ContextMenuHeadless;
