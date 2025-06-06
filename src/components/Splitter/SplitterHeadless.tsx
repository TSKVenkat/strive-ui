import React, { forwardRef, createContext, useContext } from 'react';
import { useSplitter, UseSplitterReturn, SplitterOptions } from './useSplitter';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the Splitter component
interface SplitterContextValue extends UseSplitterReturn {}

const SplitterContext = createContext<SplitterContextValue | null>(null);

// Hook to use Splitter context
export function useSplitterContext() {
  const context = useContext(SplitterContext);
  if (!context) {
    throw new Error('useSplitterContext must be used within a SplitterHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SplitterOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const splitterProps = useSplitter(options);
    
    return (
      <SplitterContext.Provider value={splitterProps}>
        <div {...splitterProps.getContainerProps()} ref={ref}>
          {children}
        </div>
      </SplitterContext.Provider>
    );
  }
);

Root.displayName = 'SplitterHeadless.Root';

// Pane component props
export type PaneProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Index of the pane
     */
    index: number;
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: { size: number; isCollapsed: boolean }) => React.ReactNode);
  }
>;

// Pane component
const Pane = forwardRef<any, any>(
  ({ as, index, children, ...props }, ref) => {
    const Component = as || 'div';
    const { getPaneProps, sizes } = useSplitterContext();
    const size = sizes[index] || 0;
    const isCollapsed = size === 0;
    
    return (
      <Component {...getPaneProps(index)} {...props} ref={ref}>
        {typeof children === 'function' ? children({ size, isCollapsed }) : children}
      </Component>
    );
  }
);

Pane.displayName = 'SplitterHeadless.Pane';

// Gutter component props
export type GutterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Index of the gutter
     */
    index: number;
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: { isDragging: boolean }) => React.ReactNode);
  }
>;

// Gutter component
const Gutter = forwardRef<any, any>(
  ({ as, index, children, ...props }, ref) => {
    const Component = as || 'div';
    const { getGutterProps, isDragging, draggedGutterIndex } = useSplitterContext();
    const isThisGutterDragging = isDragging && draggedGutterIndex === index;
    
    return (
      <Component {...getGutterProps(index) as any} {...props} ref={ref}>
        {children && (typeof children === 'function' 
          ? children({ isDragging: isThisGutterDragging }) 
          : children)}
      </Component>
    );
  }
);

Gutter.displayName = 'SplitterHeadless.Gutter';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      sizes: number[];
      collapsePane: (index: number) => void;
      expandPane: (index: number) => void;
      resetSizes: () => void;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { sizes, collapsePane, expandPane, resetSizes } = useSplitterContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ sizes, collapsePane, expandPane, resetSizes }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'SplitterHeadless.Controls';

// Export all components
export const SplitterHeadless = {
  Root,
  Pane,
  Gutter,
  Controls,
  useSplitterContext,
};

export default SplitterHeadless;
