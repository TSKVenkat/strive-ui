import React, { createContext, useContext, forwardRef } from 'react';
import { 
  usePulse, 
  UsePulseReturn, 
  PulseOptions,
  PulseSize,
  PulseShape
} from './usePulse';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Pulse component
interface PulseContextValue extends UsePulseReturn {}

const PulseContext = createContext<PulseContextValue | null>(null);

// Hook to use Pulse context
export function usePulseContext() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulseContext must be used within a PulseHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends PulseOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const pulseProps = usePulse(options);
    
    return (
      <PulseContext.Provider value={pulseProps}>
        <div ref={ref}>
          {children}
        </div>
      </PulseContext.Provider>
    );
  }
);

Root.displayName = 'PulseHeadless.Root';

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
    const { getContainerProps, visible, centered } = usePulseContext();
    
    if (!visible) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    // Get container styles
    const getContainerStyles = () => {
      const styles: React.CSSProperties = {
        position: 'relative',
      };
      
      if (centered) {
        styles.display = 'flex';
        styles.justifyContent = 'center';
        styles.alignItems = 'center';
      }
      
      return styles;
    };
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          ...getContainerStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'PulseHeadless.Container';

// Item component props
export type ItemProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Override the shape for this specific item
     */
    shape?: PulseShape;
    /**
     * Override the width for this specific item
     */
    width?: string | number;
    /**
     * Override the height for this specific item
     */
    height?: string | number;
    /**
     * Override the border radius for this specific item
     */
    borderRadius?: string | number;
  }
>;

// Item component
const Item = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      children, 
      shape: itemShape,
      width: itemWidth,
      height: itemHeight,
      borderRadius: itemBorderRadius,
      ...props 
    }: ItemProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getPulseProps, 
      shape: contextShape,
      count,
      continuous,
    } = usePulseContext();
    
    const shape = itemShape || contextShape;
    
    const pulseProps = getPulseProps();
    
    // Override dimensions if provided
    if (itemWidth !== undefined) {
      pulseProps.style.width = itemWidth;
    }
    
    if (itemHeight !== undefined) {
      pulseProps.style.height = itemHeight;
    }
    
    if (itemBorderRadius !== undefined) {
      pulseProps.style.borderRadius = itemBorderRadius;
    }
    
    // Create pulse effects
    const pulseEffects = Array.from({ length: count }, (_, index) => (
      <Effect key={index} index={index} />
    ));
    
    return (
      <Component 
        {...pulseProps} 
        {...props} 
        ref={ref}
        style={{
          ...pulseProps.style,
          ...props.style,
        }}
      >
        {pulseEffects}
        {children}
      </Component>
    );
  }
);

Item.displayName = 'PulseHeadless.Item';

// Effect component props
export type EffectProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Index of the effect
     */
    index: number;
  }
>;

// Effect component
const Effect = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, index, ...props }: EffectProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getEffectProps, 
      color, 
      continuous,
      scale,
      opacity,
      shape,
    } = usePulseContext();
    
    const effectProps = getEffectProps(index);
    
    // Get animation styles
    const getAnimationStyles = () => {
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        backgroundColor: color,
        opacity,
        animation: `pulse-effect ${continuous ? 'infinite' : '1'} both`,
        animationTimingFunction: 'ease-out',
        transform: 'scale(1)',
        ...effectProps.style,
      };
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          ...getAnimationStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Effect.displayName = 'PulseHeadless.Effect';

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
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          position: 'relative',
          zIndex: 1,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'PulseHeadless.Content';

// Export all components
export const PulseHeadless = {
  Root,
  Container,
  Item,
  Effect,
  Content,
  usePulseContext,
};

export default PulseHeadless;
