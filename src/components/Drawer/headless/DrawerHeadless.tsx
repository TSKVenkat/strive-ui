import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useDrawer, UseDrawerReturn, DrawerOptions, DrawerPlacement } from './useDrawer';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Drawer component
interface DrawerContextValue extends UseDrawerReturn {}

const DrawerContext = createContext<DrawerContextValue | null>(null);

// Hook to use Drawer context
export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within a DrawerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends DrawerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const drawerProps = useDrawer(options);
    
    return (
      <DrawerContext.Provider value={drawerProps}>
        <div ref={ref}>
          {children}
        </div>
      </DrawerContext.Provider>
    );
  }
);

Root.displayName = 'DrawerHeadless.Root';

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
    const { getTriggerProps } = useDrawerContext();
    
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

Trigger.displayName = 'DrawerHeadless.Trigger';

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
  portalId = 'drawer-root',
  usePortal = true 
}) => {
  const { isOpen } = useDrawerContext();
  
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

Portal.displayName = 'DrawerHeadless.Portal';

// Backdrop component props
export type BackdropProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Backdrop component
const Backdrop = forwardRef(function Backdrop<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<BackdropProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    const { getBackdropProps, isOpen, hasBackdrop } = useDrawerContext();
    
    if (!isOpen || !hasBackdrop) {
      return null;
    }
    
    const backdropProps = getBackdropProps();
    
    return React.createElement(
      Component,
      {
        ...backdropProps,
        ...props,
        ref: ref,
        style: { 
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          ...props.style,
        }
      },
      children
    );
  }
);

Backdrop.displayName = 'DrawerHeadless.Backdrop';

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
    const { getContentProps, getContainerProps, isOpen } = useDrawerContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    const containerProps = getContainerProps();
    
    return React.createElement(
      Component,
      {
        ...contentProps,
        ...containerProps,
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

Content.displayName = 'DrawerHeadless.Content';

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
const Close = forwardRef(function Close<C extends React.ElementType = 'button'>(
    { as, children, ...props }: Omit<CloseProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'button';
    const { getCloseButtonProps } = useDrawerContext();
    
    const closeProps = getCloseButtonProps();
    
    return React.createElement(
      Component,
      {
        ...closeProps,
        ...props,
        ref: ref
      },
      children
    );
  }
);

Close.displayName = 'DrawerHeadless.Close';

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
        ...props,
        ref: ref
      },
      children
    );
  }
);

Header.displayName = 'DrawerHeadless.Header';

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
const Body = forwardRef(function Body<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<BodyProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ...props,
        ref: ref,
        style: { 
          flex: 1,
          overflow: 'auto',
          ...props.style,
        }
      },
      children
    );
  }
);

Body.displayName = 'DrawerHeadless.Body';

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
const Footer = forwardRef(function Footer<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<FooterProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ...props,
        ref: ref
      },
      children
    );
  }
);

Footer.displayName = 'DrawerHeadless.Footer';

// Export all components
export const DrawerHeadless = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Content,
  Close,
  Header,
  Body,
  Footer,
  useDrawerContext,
} as const;

// Type for the compound component
export type DrawerHeadlessType = typeof DrawerHeadless;

export default DrawerHeadless;
