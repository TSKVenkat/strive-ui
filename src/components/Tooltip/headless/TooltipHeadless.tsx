import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip, UseTooltipReturn, TooltipOptions } from './useTooltip';
import { PopoverPlacement } from '../../Popover/headless/usePopover';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Tooltip component
interface TooltipContextValue extends UseTooltipReturn {}

const TooltipContext = createContext<TooltipContextValue | null>(null);

// Hook to use Tooltip context
export function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltipContext must be used within a TooltipHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends TooltipOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const tooltipProps = useTooltip(options);
    
    return (
      <TooltipContext.Provider value={tooltipProps}>
        <div ref={ref}>
          {children}
        </div>
      </TooltipContext.Provider>
    );
  }
);

Root.displayName = 'TooltipHeadless.Root';

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
  <C extends React.ElementType = 'span'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'span';
    const { getTriggerProps } = useTooltipContext();
    
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

Trigger.displayName = 'TooltipHeadless.Trigger';

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
  portalId = 'tooltip-root',
  usePortal = true 
}) => {
  const { isOpen } = useTooltipContext();
  
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

Portal.displayName = 'TooltipHeadless.Portal';

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
    const { getContentProps, isOpen } = useTooltipContext();
    
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

Content.displayName = 'TooltipHeadless.Content';

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
    const { getArrowProps, isOpen } = useTooltipContext();
    
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

Arrow.displayName = 'TooltipHeadless.Arrow';

// Export all components
export const TooltipHeadless = {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  useTooltipContext,
};

export default TooltipHeadless;
