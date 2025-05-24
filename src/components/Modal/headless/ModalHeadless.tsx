import React, { createContext, useContext, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModal, UseModalReturn, ModalOptions } from './useModal';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Modal component
interface ModalContextValue extends UseModalReturn {}

const ModalContext = createContext<ModalContextValue | null>(null);

// Hook to use Modal context
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ModalOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const modalProps = useModal(options);
    
    return (
      <ModalContext.Provider value={modalProps}>
        <div ref={ref}>
          {children}
        </div>
      </ModalContext.Provider>
    );
  }
);

Root.displayName = 'ModalHeadless.Root';

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
    const { getTriggerProps } = useModalContext();
    
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

Trigger.displayName = 'ModalHeadless.Trigger';

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
  portalId = 'modal-root',
  usePortal = true 
}) => {
  const { isOpen } = useModalContext();
  
  // Create portal container if it doesn't exist
  useEffect(() => {
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

Portal.displayName = 'ModalHeadless.Portal';

// Overlay component props
export type OverlayProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Overlay component
const Overlay = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: OverlayProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getOverlayProps, isOpen } = useModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const overlayProps = getOverlayProps();
    
    return (
      <Component 
        {...overlayProps} 
        {...props} 
        ref={ref}
        style={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Overlay.displayName = 'ModalHeadless.Overlay';

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
    const { getContentProps, getContainerProps, isOpen } = useModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...contentProps} 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{ 
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '20px',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          position: 'relative',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'ModalHeadless.Content';

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
const Close = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: CloseProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = useModalContext();
    
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

Close.displayName = 'ModalHeadless.Close';

// Title component props
export type TitleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Title component
const Title = forwardRef(
  <C extends React.ElementType = 'h2'>(
    { as, children, ...props }: TitleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'h2';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        id="modal-title"
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = 'ModalHeadless.Title';

// Description component props
export type DescriptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Description component
const Description = forwardRef(
  <C extends React.ElementType = 'p'>(
    { as, children, ...props }: DescriptionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'p';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        id="modal-description"
      >
        {children}
      </Component>
    );
  }
);

Description.displayName = 'ModalHeadless.Description';

// Export all components
export const ModalHeadless = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
  Title,
  Description,
  useModalContext,
};

export default ModalHeadless;
