import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useSnackbar, 
  UseSnackbarReturn, 
  SnackbarOptions,
  SnackbarVariant,
  SnackbarPosition
} from './useSnackbar';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Snackbar component
interface SnackbarContextValue extends UseSnackbarReturn {}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

// Hook to use Snackbar context
export function useSnackbarContext() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbarContext must be used within a SnackbarHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SnackbarOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const snackbarProps = useSnackbar(options);
    
    return (
      <SnackbarContext.Provider value={snackbarProps}>
        <div ref={ref}>
          {children}
        </div>
      </SnackbarContext.Provider>
    );
  }
);

Root.displayName = 'SnackbarHeadless.Root';

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
  portalId = 'snackbar-root',
  usePortal = true 
}) => {
  const { visible } = useSnackbarContext();
  
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
  
  if (!visible) {
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

Portal.displayName = 'SnackbarHeadless.Portal';

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
    const { getSnackbarProps, position } = useSnackbarContext();
    
    const snackbarProps = getSnackbarProps();
    
    // Get position styles
    const getPositionStyles = () => {
      const baseStyles = {
        position: 'fixed',
        zIndex: 1000,
      } as React.CSSProperties;
      
      switch (position) {
        case 'top':
          return {
            ...baseStyles,
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'top-left':
          return {
            ...baseStyles,
            top: '16px',
            left: '16px',
          };
        case 'top-right':
          return {
            ...baseStyles,
            top: '16px',
            right: '16px',
          };
        case 'bottom':
          return {
            ...baseStyles,
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'bottom-left':
          return {
            ...baseStyles,
            bottom: '16px',
            left: '16px',
          };
        case 'bottom-right':
          return {
            ...baseStyles,
            bottom: '16px',
            right: '16px',
          };
        default:
          return {
            ...baseStyles,
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
          };
      }
    };
    
    return (
      <Component 
        {...snackbarProps} 
        {...props} 
        ref={ref}
        style={{
          ...getPositionStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'SnackbarHeadless.Container';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Content component
const Content = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContentProps<C>,
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

Content.displayName = 'SnackbarHeadless.Content';

// Action component props
export type ActionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Action component
const Action = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ActionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getActionButtonProps, hasAction } = useSnackbarContext();
    
    if (!hasAction) {
      return null;
    }
    
    const actionProps = getActionButtonProps();
    
    return (
      <Component 
        {...actionProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Action.displayName = 'SnackbarHeadless.Action';

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
    const { getCloseButtonProps, hasCloseButton, dismissible } = useSnackbarContext();
    
    if (!hasCloseButton || !dismissible) {
      return null;
    }
    
    const closeProps = getCloseButtonProps();
    
    return (
      <Component 
        {...closeProps} 
        {...props} 
        ref={ref}
      >
        {children || '×'}
      </Component>
    );
  }
);

Close.displayName = 'SnackbarHeadless.Close';

// Export all components
export const SnackbarHeadless = {
  Root,
  Portal,
  Container,
  Content,
  Action,
  Close,
  useSnackbarContext,
};

export default SnackbarHeadless;
