import React, { forwardRef, createContext, useContext } from 'react';
import { useResizable, UseResizableReturn, ResizableOptions, ResizeDirection } from './useResizable';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the Resizable component
interface ResizableContextValue extends UseResizableReturn {}

const ResizableContext = createContext<ResizableContextValue | null>(null);

// Hook to use Resizable context
export function useResizableContext() {
  const context = useContext(ResizableContext);
  if (!context) {
    throw new Error('useResizableContext must be used within a ResizableHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ResizableOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const resizableProps = useResizable(options);
    
    return (
      <ResizableContext.Provider value={resizableProps}>
        <div {...resizableProps.getResizableProps()} ref={ref}>
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);

Root.displayName = 'ResizableHeadless.Root';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: { size: { width: number; height: number }, isResizing: boolean }) => React.ReactNode);
  }
>;

// Content component
const Content = forwardRef<any, any>(
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { size, isResizing } = useResizableContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {typeof children === 'function' 
          ? children({ size, isResizing }) 
          : children}
      </Component>
    );
  }
);

Content.displayName = 'ResizableHeadless.Content';

// Handle component props
export interface HandleProps {
  /**
   * Direction of the resize handle
   */
  direction: ResizeDirection;
  /**
   * Children of the component
   */
  children?: React.ReactNode | ((props: { isResizing: boolean }) => React.ReactNode);
}

// Handle component
const Handle = forwardRef<HTMLDivElement, HandleProps>(
  ({ direction, children }, ref) => {
    const { getHandleProps, isResizing, resizeDirection } = useResizableContext();
    const isThisHandleResizing = isResizing && resizeDirection === direction;
    
    return (
      <div {...getHandleProps(direction)} ref={ref}>
        {children && (typeof children === 'function' 
          ? children({ isResizing: isThisHandleResizing }) 
          : children)}
      </div>
    );
  }
);

Handle.displayName = 'ResizableHeadless.Handle';

// Export all components
export const ResizableHeadless = {
  Root,
  Content,
  Handle,
  useResizableContext,
};

export default ResizableHeadless;
