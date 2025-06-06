import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopover, UsePopoverReturn, PopoverOptions, PopoverPlacement } from './usePopover';
import { PolymorphicComponentPropsWithRef, PolymorphicRef, polymorphicForwardRef, assignDisplayName } from '../../../types/polymorphic';

// Context for the Popover component
interface PopoverContextValue extends UsePopoverReturn {}

const PopoverContext = createContext<PopoverContextValue | null>(null);

// Hook to use Popover context
export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within a PopoverHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends PopoverOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const popoverProps = usePopover(options);
    
    return (
      <PopoverContext.Provider value={popoverProps}>
        <div ref={ref}>
          {children}
        </div>
      </PopoverContext.Provider>
    );
  }
);

Root.displayName = 'PopoverHeadless.Root';

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
const Trigger = polymorphicForwardRef<'button', {
  children: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps } = usePopoverContext();
    
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

assignDisplayName(Trigger, 'PopoverHeadless.Trigger');

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
  portalId = 'popover-root',
  usePortal = true 
}) => {
  const { isOpen } = usePopoverContext();
  
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

Portal.displayName = 'PopoverHeadless.Portal';

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
const Content = polymorphicForwardRef<'div', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children?: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'div';
    const { getContentProps, isOpen } = usePopoverContext();
    
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

assignDisplayName(Content, 'PopoverHeadless.Content');

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
const Arrow = polymorphicForwardRef<'div', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children?: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'div';
    const { getArrowProps, isOpen } = usePopoverContext();
    
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

assignDisplayName(Arrow, 'PopoverHeadless.Arrow');

// Close component props
export type CloseProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Close component
const Close = polymorphicForwardRef<'button', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children?: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = usePopoverContext();
    
    const closeProps = getCloseButtonProps();
    
    return (
      <Component 
        {...closeProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

assignDisplayName(Close, 'PopoverHeadless.Close');

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
const Header = polymorphicForwardRef<'div', {
  children: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

assignDisplayName(Header, 'PopoverHeadless.Header');

// Body component props
export type BodyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Body component
const Body = polymorphicForwardRef<'div', {
  children: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

assignDisplayName(Body, 'PopoverHeadless.Body');

// Footer component props
export type FooterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Footer component
const Footer = polymorphicForwardRef<'div', {
  children: React.ReactNode;
}>(
  (
    { as, children, ...props }: PolymorphicComponentPropsWithRef<any, { children: React.ReactNode }>,
    ref: React.ForwardedRef<any>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

assignDisplayName(Footer, 'PopoverHeadless.Footer');

// Export all components
export const PopoverHeadless = {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  Close,
  Header,
  Body,
  Footer,
  usePopoverContext,
};

export default PopoverHeadless;
