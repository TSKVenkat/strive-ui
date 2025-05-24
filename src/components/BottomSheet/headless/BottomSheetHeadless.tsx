import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useBottomSheet, UseBottomSheetReturn, BottomSheetOptions } from './useBottomSheet';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the BottomSheet component
interface BottomSheetContextValue extends UseBottomSheetReturn {}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

// Hook to use BottomSheet context
export function useBottomSheetContext() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheetContext must be used within a BottomSheetHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends BottomSheetOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const bottomSheetProps = useBottomSheet(options);
    
    return (
      <BottomSheetContext.Provider value={bottomSheetProps}>
        <div ref={ref}>
          {children}
        </div>
      </BottomSheetContext.Provider>
    );
  }
);

Root.displayName = 'BottomSheetHeadless.Root';

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
    const { getTriggerProps } = useBottomSheetContext();
    
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

Trigger.displayName = 'BottomSheetHeadless.Trigger';

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
  portalId = 'bottom-sheet-root',
  usePortal = true 
}) => {
  const { isOpen } = useBottomSheetContext();
  
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

Portal.displayName = 'BottomSheetHeadless.Portal';

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
const Backdrop = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BackdropProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getBackdropProps, isOpen } = useBottomSheetContext();
    
    if (!isOpen) {
      return null;
    }
    
    const backdropProps = getBackdropProps();
    
    return (
      <Component 
        {...backdropProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Backdrop.displayName = 'BottomSheetHeadless.Backdrop';

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps, isOpen } = useBottomSheetContext();
    
    if (!isOpen) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{ 
          ...containerProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'BottomSheetHeadless.Container';

// DragHandle component props
export type DragHandleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// DragHandle component
const DragHandle = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: DragHandleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getDragHandleProps } = useBottomSheetContext();
    
    const dragHandleProps = getDragHandleProps();
    
    return (
      <Component 
        {...dragHandleProps} 
        {...props} 
        ref={ref}
        style={{ 
          ...dragHandleProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

DragHandle.displayName = 'BottomSheetHeadless.DragHandle';

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
    const { getContentProps } = useBottomSheetContext();
    
    const contentProps = getContentProps();
    
    return (
      <Component 
        {...contentProps} 
        {...props} 
        ref={ref}
        style={{ 
          overflow: 'auto',
          height: '100%',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'BottomSheetHeadless.Content';

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
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Header.displayName = 'BottomSheetHeadless.Header';

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
const Body = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BodyProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{ 
          flex: 1,
          overflow: 'auto',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Body.displayName = 'BottomSheetHeadless.Body';

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
const Footer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FooterProps<C>,
    ref: PolymorphicRef<C>
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

Footer.displayName = 'BottomSheetHeadless.Footer';

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
    const { getCloseButtonProps } = useBottomSheetContext();
    
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

Close.displayName = 'BottomSheetHeadless.Close';

// FullScreenToggle component props
export type FullScreenToggleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FullScreenToggle component
const FullScreenToggle = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: FullScreenToggleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getFullScreenButtonProps, isFullScreen } = useBottomSheetContext();
    
    const fullScreenProps = getFullScreenButtonProps();
    
    return (
      <Component 
        {...fullScreenProps} 
        {...props} 
        ref={ref}
      >
        {children || (isFullScreen ? 'Exit Full Screen' : 'Full Screen')}
      </Component>
    );
  }
);

FullScreenToggle.displayName = 'BottomSheetHeadless.FullScreenToggle';

// Export all components
export const BottomSheetHeadless = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Container,
  DragHandle,
  Content,
  Header,
  Body,
  Footer,
  Close,
  FullScreenToggle,
  useBottomSheetContext,
};

export default BottomSheetHeadless;
