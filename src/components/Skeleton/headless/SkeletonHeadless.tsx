import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useSkeleton, 
  UseSkeletonReturn, 
  SkeletonOptions,
  SkeletonVariant,
  SkeletonAnimation
} from './useSkeleton';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Skeleton component
interface SkeletonContextValue extends UseSkeletonReturn {}

const SkeletonContext = createContext<SkeletonContextValue | null>(null);

// Hook to use Skeleton context
export function useSkeletonContext() {
  const context = useContext(SkeletonContext);
  if (!context) {
    throw new Error('useSkeletonContext must be used within a SkeletonHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SkeletonOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const skeletonProps = useSkeleton(options);
    
    return (
      <SkeletonContext.Provider value={skeletonProps}>
        <div ref={ref}>
          {children}
        </div>
      </SkeletonContext.Provider>
    );
  }
);

Root.displayName = 'SkeletonHeadless.Root';

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
    const { getContainerProps, visible } = useSkeletonContext();
    
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

Container.displayName = 'SkeletonHeadless.Container';

// Item component props
export type ItemProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Override the variant for this specific item
     */
    variant?: SkeletonVariant;
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
      variant: itemVariant,
      width: itemWidth,
      height: itemHeight,
      borderRadius: itemBorderRadius,
      ...props 
    }: ItemProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getSkeletonProps, 
      animation, 
      variant: contextVariant 
    } = useSkeletonContext();
    
    const variant = itemVariant || contextVariant;
    
    const skeletonProps = getSkeletonProps();
    
    // Override dimensions if provided
    if (itemWidth !== undefined) {
      skeletonProps.style.width = itemWidth;
    }
    
    if (itemHeight !== undefined) {
      skeletonProps.style.height = itemHeight;
    }
    
    if (itemBorderRadius !== undefined) {
      skeletonProps.style.borderRadius = itemBorderRadius;
    }
    
    // Get animation styles
    const getAnimationStyles = () => {
      switch (animation) {
        case 'pulse':
          return {
            animation: 'skeleton-pulse 1.5s ease-in-out 0.5s infinite',
          };
        case 'wave':
          return {
            position: 'relative' as const,
            overflow: 'hidden' as const,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              transform: 'translateX(-100%)',
              backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))',
              animation: 'skeleton-wave 2s infinite',
            },
          };
        case 'shimmer':
          return {
            position: 'relative' as const,
            overflow: 'hidden' as const,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))',
              transform: 'translateX(-100%)',
              animation: 'skeleton-shimmer 2s infinite',
            },
          };
        case 'none':
        default:
          return {};
      }
    };
    
    return (
      <Component 
        {...skeletonProps} 
        {...props} 
        ref={ref}
        style={{
          backgroundColor: '#e0e0e0',
          ...skeletonProps.style,
          ...getAnimationStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Item.displayName = 'SkeletonHeadless.Item';

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
     * Override the lines for this specific text
     */
    lines?: number;
  }
>;

// Text component
const Text = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      width: textWidth,
      height: textHeight,
      lines: textLines,
      ...props 
    }: TextProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { lines: contextLines, fullWidth } = useSkeletonContext();
    
    const lines = textLines || contextLines;
    
    // Create an array of lines
    const lineItems = Array.from({ length: lines }, (_, index) => {
      // Make the last line shorter if there are multiple lines
      const width = index === lines - 1 && lines > 1 
        ? `${Math.floor(Math.random() * 50) + 30}%` 
        : fullWidth ? '100%' : textWidth;
      
      return (
        <Item
          key={index}
          variant="text"
          width={width}
          height={textHeight}
          style={{
            marginBottom: index < lines - 1 ? '8px' : 0,
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

Text.displayName = 'SkeletonHeadless.Text';

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
      size = '40px',
      ...props 
    }: CircleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Item
        as={Component}
        variant="circular"
        width={size}
        height={size}
        {...props}
        ref={ref}
      />
    );
  }
);

Circle.displayName = 'SkeletonHeadless.Circle';

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
    /**
     * Border radius of the rectangle
     */
    borderRadius?: string | number;
  }
>;

// Rectangle component
const Rectangle = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      width,
      height = '100px',
      borderRadius = '0',
      ...props 
    }: RectangleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { fullWidth } = useSkeletonContext();
    
    return (
      <Item
        as={Component}
        variant="rectangular"
        width={width || (fullWidth ? '100%' : '100px')}
        height={height}
        borderRadius={borderRadius}
        {...props}
        ref={ref}
      />
    );
  }
);

Rectangle.displayName = 'SkeletonHeadless.Rectangle';

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
    const { fullWidth } = useSkeletonContext();
    
    return (
      <Item
        as={Component}
        variant="rounded"
        width={width || (fullWidth ? '100%' : '100px')}
        height={height}
        borderRadius={borderRadius}
        {...props}
        ref={ref}
      />
    );
  }
);

Rounded.displayName = 'SkeletonHeadless.Rounded';

// Export all components
export const SkeletonHeadless = {
  Root,
  Container,
  Item,
  Text,
  Circle,
  Rectangle,
  Rounded,
  useSkeletonContext,
};

export default SkeletonHeadless;
