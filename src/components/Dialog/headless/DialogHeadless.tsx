import React, { createContext, useContext, forwardRef } from 'react';
import { useDialog, UseDialogReturn, DialogOptions } from './useDialog';
import { ModalHeadless } from '../../Modal/headless/ModalHeadless';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Dialog component
interface DialogContextValue extends UseDialogReturn {}

const DialogContext = createContext<DialogContextValue | null>(null);

// Hook to use Dialog context
export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends DialogOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const dialogProps = useDialog(options);
    
    return (
      <DialogContext.Provider value={dialogProps}>
        <div ref={ref}>
          {children}
        </div>
      </DialogContext.Provider>
    );
  }
);

Root.displayName = 'DialogHeadless.Root';

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
    const { getTriggerProps } = useDialogContext();
    
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

Trigger.displayName = 'DialogHeadless.Trigger';

// Portal component
const Portal = forwardRef<HTMLDivElement, { children: React.ReactNode; portalId?: string; usePortal?: boolean }>(
  ({ children, portalId, usePortal }, ref) => {
    return (
      <ModalHeadless.Portal portalId={portalId} usePortal={usePortal}>
        {children}
      </ModalHeadless.Portal>
    );
  }
);

Portal.displayName = 'DialogHeadless.Portal';

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
    const { getOverlayProps, isOpen } = useDialogContext();
    
    if (!isOpen) {
      return null;
    }
    
    const overlayProps = getOverlayProps();
    
    return (
      <ModalHeadless.Overlay 
        as={as} 
        {...overlayProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </ModalHeadless.Overlay>
    );
  }
);

Overlay.displayName = 'DialogHeadless.Overlay';

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
    const { getContentProps, getContainerProps, isOpen } = useDialogContext();
    
    if (!isOpen) {
      return null;
    }
    
    const contentProps = getContentProps();
    const containerProps = getContainerProps();
    
    return (
      <ModalHeadless.Content 
        as={as} 
        {...contentProps} 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </ModalHeadless.Content>
    );
  }
);

Content.displayName = 'DialogHeadless.Content';

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
    const { getCloseButtonProps } = useDialogContext();
    
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

Close.displayName = 'DialogHeadless.Close';

// Confirm component props
export type ConfirmProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
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

// Confirm component
const Confirm = forwardRef(function Confirm<C extends React.ElementType = 'button'>(
    { as, children, value, ...props }: Omit<ConfirmProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) {
    const Component = as || 'button';
    const { getConfirmButtonProps } = useDialogContext();
    
    const confirmProps = getConfirmButtonProps(value);
    
    // Cast type to proper button type if needed
    if (confirmProps.type) {
      confirmProps.type = confirmProps.type as "button" | "submit" | "reset";
    } else {
      confirmProps.type = "button"; // Default to button if undefined
    }
    
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

Confirm.displayName = 'DialogHeadless.Confirm';

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
    const { getCancelButtonProps } = useDialogContext();
    
    const cancelProps = getCancelButtonProps(value);
    
    // Cast type to proper button type if needed
    if (cancelProps.type) {
      cancelProps.type = cancelProps.type as "button" | "submit" | "reset";
    } else {
      cancelProps.type = "button"; // Default to button if undefined
    }
    
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

Cancel.displayName = 'DialogHeadless.Cancel';

// Title component
const Title = forwardRef<HTMLHeadingElement, PolymorphicComponentPropsWithRef<'h2', { children: React.ReactNode }>>(
  (props, ref) => {
    return <ModalHeadless.Title {...props} ref={ref} />;
  }
);

Title.displayName = 'DialogHeadless.Title';

// Description component
const Description = forwardRef<HTMLParagraphElement, PolymorphicComponentPropsWithRef<'p', { children: React.ReactNode }>>(
  (props, ref) => {
    return <ModalHeadless.Description {...props} ref={ref} />;
  }
);

Description.displayName = 'DialogHeadless.Description';

// Export all components
export const DialogHeadless = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
  Confirm,
  Cancel,
  Title,
  Description,
  useDialogContext,
} as const;

// Type for the compound component
export type DialogHeadlessType = typeof DialogHeadless;

export default DialogHeadless as typeof DialogHeadless;
