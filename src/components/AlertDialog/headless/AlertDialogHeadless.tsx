import React, { createContext, useContext, forwardRef } from 'react';
import { useAlertDialog, UseAlertDialogReturn, AlertDialogOptions } from './useAlertDialog';
import { DialogHeadless } from '../../Dialog/headless/DialogHeadless';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the AlertDialog component
interface AlertDialogContextValue extends UseAlertDialogReturn {}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

// Hook to use AlertDialog context
export function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialogContext must be used within an AlertDialogHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends AlertDialogOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const alertDialogProps = useAlertDialog(options);
    
    return (
      <AlertDialogContext.Provider value={alertDialogProps}>
        <div ref={ref}>
          {children}
        </div>
      </AlertDialogContext.Provider>
    );
  }
);

Root.displayName = 'AlertDialogHeadless.Root';

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
    const { getTriggerProps } = useAlertDialogContext();
    
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

Trigger.displayName = 'AlertDialogHeadless.Trigger';

// Portal component
const Portal = forwardRef<HTMLDivElement, { children: React.ReactNode; portalId?: string; usePortal?: boolean }>(
  function Portal({ children, portalId, usePortal }, ref) {
    return (
      <DialogHeadless.Portal portalId={portalId} usePortal={usePortal}>
        {children}
      </DialogHeadless.Portal>
    );
  }
);

Portal.displayName = 'AlertDialogHeadless.Portal';

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
const Overlay = forwardRef(function Overlay<C extends React.ElementType = 'div'>(
    { as, children, ...props }: Omit<OverlayProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const { getOverlayProps, isOpen } = useAlertDialogContext();
    
    if (!isOpen) {
      return null;
    }
    
    const overlayProps = getOverlayProps();
    
    return (
      <DialogHeadless.Overlay 
        as={as} 
        {...overlayProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </DialogHeadless.Overlay>
    );
  }
);

Overlay.displayName = 'AlertDialogHeadless.Overlay';

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
    const { getContentProps, getContainerProps, isOpen } = useAlertDialogContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    const containerProps = getContainerProps();
    
    return (
      <DialogHeadless.Content 
        as={as} 
        {...contentProps} 
        {...containerProps} 
        {...props} 
        ref={ref}
        role="alertdialog"
      >
        {children}
      </DialogHeadless.Content>
    );
  }
);

Content.displayName = 'AlertDialogHeadless.Content';

// Action component props
export type ActionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Value to pass to the onConfirm callback
     */
    value?: any;
  }
>;

// Action component
const Action = forwardRef(function Action<C extends React.ElementType = 'button'>(
    { as, children, value, ...props }: Omit<ActionProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'button';
    const { getConfirmButtonProps } = useAlertDialogContext();
    
    const confirmProps = getConfirmButtonProps(value);
    
    return React.createElement(
      Component,
      {
        ...confirmProps,
        ...props,
        ref: ref
      },
      children
    );
  }
);

Action.displayName = 'AlertDialogHeadless.Action';

// Cancel component props
export type CancelProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Value to pass to the onCancel callback
     */
    value?: any;
  }
>;

// Cancel component
const Cancel = forwardRef(function Cancel<C extends React.ElementType = 'button'>(
    { as, children, value, ...props }: Omit<CancelProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'button';
    const { getCancelButtonProps } = useAlertDialogContext();
    
    const cancelProps = getCancelButtonProps(value);
    
    return React.createElement(
      Component,
      {
        ...cancelProps,
        ...props,
        ref: ref
      },
      children
    );
  }
);

Cancel.displayName = 'AlertDialogHeadless.Cancel';

// Title component
const Title = forwardRef<HTMLHeadingElement, PolymorphicComponentPropsWithRef<'h2', { children: React.ReactNode }>>(
  function Title(props, ref) {
    return <DialogHeadless.Title {...props} ref={ref} />;
  }
);

Title.displayName = 'AlertDialogHeadless.Title';

// Description component
const Description = forwardRef<HTMLParagraphElement, PolymorphicComponentPropsWithRef<'p', { children: React.ReactNode }>>(
  function Description(props, ref) {
    return <DialogHeadless.Description {...props} ref={ref} />;
  }
);

Description.displayName = 'AlertDialogHeadless.Description';

// Export all components
export const AlertDialogHeadless = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Action,
  Cancel,
  Title,
  Description,
  useAlertDialogContext,
} as const;

// Type for the compound component
export type AlertDialogHeadlessType = typeof AlertDialogHeadless;

export default AlertDialogHeadless;
