import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useShimmer, 
  UseShimmerReturn, 
  ShimmerOptions,
  ShimmerShape,
  ShimmerDirection
} from './useShimmer';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Shimmer component
interface ShimmerContextValue extends UseShimmerReturn {}

const ShimmerContext = createContext<ShimmerContextValue | null>(null);

// Hook to use Shimmer context
export function useShimmerContext() {
  const context = useContext(ShimmerContext);
  if (!context) {
    throw new Error('useShimmerContext must be used within a ShimmerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ShimmerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const shimmerProps = useShimmer(options);
    
    return (
      <ShimmerContext.Provider value={shimmerProps}>
        <div ref={ref}>
          {children}
        </div>
      </ShimmerContext.Provider>
    );
  }
);

Root.displayName = 'ShimmerHeadless.Root';

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
    const { getContainerProps, visible } = useShimmerContext();
    
    if (!visible) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ShimmerHeadless.Container';

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
    shape?: ShimmerShape;
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
      getShimmerProps, 
      direction, 
      highlightColor,
      shape: contextShape,
    } = useShimmerContext();
    
    const shape = itemShape || contextShape;
    
    const shimmerProps = getShimmerProps();
    
    // Override dimensions if provided
    if (itemWidth !== undefined) {
      shimmerProps.style.width = itemWidth;
    }
    
    if (itemHeight !== undefined) {
      shimmerProps.style.height = itemHeight;
    }
    
    if (itemBorderRadius !== undefined) {
      shimmerProps.style.borderRadius = itemBorderRadius;
    }
    
    return (
      <Component 
        {...shimmerProps} 
        {...props} 
        ref={ref}
      >
        <Effect />
        {children}
      </Component>
    );
  }
);

Item.displayName = 'ShimmerHeadless.Item';

// Effect component props
export type EffectProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Effect component
const Effect = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: EffectProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getEffectProps, 
      direction, 
      highlightColor 
    } = useShimmerContext();
    
    const effectProps = getEffectProps();
    
    // Get direction styles
    const getDirectionStyles = () => {
      switch (direction) {
        case 'left-to-right':
          return {
            backgroundImage: `linear-gradient(to right, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            animation: 'shimmer-left-to-right infinite',
            transform: 'translateX(-100%)',
          };
        case 'right-to-left':
          return {
            backgroundImage: `linear-gradient(to left, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            animation: 'shimmer-right-to-left infinite',
            transform: 'translateX(100%)',
          };
        case 'top-to-bottom':
          return {
            backgroundImage: `linear-gradient(to bottom, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            animation: 'shimmer-top-to-bottom infinite',
            transform: 'translateY(-100%)',
          };
        case 'bottom-to-top':
          return {
            backgroundImage: `linear-gradient(to top, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            animation: 'shimmer-bottom-to-top infinite',
            transform: 'translateY(100%)',
          };
        default:
          return {
            backgroundImage: `linear-gradient(to right, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            animation: 'shimmer-left-to-right infinite',
            transform: 'translateX(-100%)',
          };
      }
    };
    
    return (
      <Component 
        {...effectProps} 
        {...props} 
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...getDirectionStyles(),
          ...effectProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Effect.displayName = 'ShimmerHeadless.Effect';

// Text component props
export type TextProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Override the width for this specific text
     */
    width?: string | number;
    /**
     * Override the height for this specific text
     */
    height?: string | number;
    /**
     * Number of lines
     */
    lines?: number;
    /**
     * Gap between lines
     */
    gap?: string | number;
  }
>;

// Text component
const Text = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      width: textWidth,
      height: textHeight = '16px',
      lines = 3,
      gap = '8px',
      ...props 
    }: TextProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { fullWidth } = useShimmerContext();
    
    // Create an array of lines
    const lineItems = Array.from({ length: lines }, (_, index) => {
      // Make the last line shorter if there are multiple lines
      const width = index === lines - 1 && lines > 1 
        ? `${Math.floor(Math.random() * 50) + 30}%` 
        : fullWidth ? '100%' : textWidth;
      
      return (
        <Item
          key={index}
          shape="text"
          width={width}
          height={textHeight}
          style={{
            marginBottom: index < lines - 1 ? gap : 0,
          }}
        />
      );
    });
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {lineItems}
      </Component>
    );
  }
);

Text.displayName = 'ShimmerHeadless.Text';

// Circle component props
export type CircleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Size of the circle
     */
    size?: string | number;
  }
>;

// Circle component
const Circle = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      size = '50px',
      ...props 
    }: CircleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Item
        as={Component}
        shape="circle"
        width={size}
        height={size}
        {...props}
        ref={ref}
      />
    );
  }
);

Circle.displayName = 'ShimmerHeadless.Circle';

// Rectangle component props
export type RectangleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Width of the rectangle
     */
    width?: string | number;
    /**
     * Height of the rectangle
     */
    height?: string | number;
  }
>;

// Rectangle component
const Rectangle = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      width,
      height = '100px',
      ...props 
    }: RectangleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { fullWidth } = useShimmerContext();
    
    return (
      <Item
        as={Component}
        shape="rectangle"
        width={width || (fullWidth ? '100%' : '200px')}
        height={height}
        {...props}
        ref={ref}
      />
    );
  }
);

Rectangle.displayName = 'ShimmerHeadless.Rectangle';

// Rounded component props
export type RoundedProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Width of the rounded rectangle
     */
    width?: string | number;
    /**
     * Height of the rounded rectangle
     */
    height?: string | number;
    /**
     * Border radius of the rounded rectangle
     */
    borderRadius?: string | number;
  }
>;

// Rounded component
const Rounded = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      width,
      height = '40px',
      borderRadius = '8px',
      ...props 
    }: RoundedProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { fullWidth } = useShimmerContext();
    
    return (
      <Item
        as={Component}
        shape="rounded"
        width={width || (fullWidth ? '100%' : '200px')}
        height={height}
        borderRadius={borderRadius}
        {...props}
        ref={ref}
      />
    );
  }
);

Rounded.displayName = 'ShimmerHeadless.Rounded';

// Export all components
export const ShimmerHeadless = {
  Root,
  Container,
  Item,
  Effect,
  Text,
  Circle,
  Rectangle,
  Rounded,
  useShimmerContext,
};

export default ShimmerHeadless;
