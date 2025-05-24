import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useSpinner, 
  UseSpinnerReturn, 
  SpinnerOptions,
  SpinnerSize,
  SpinnerVariant
} from './useSpinner';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Spinner component
interface SpinnerContextValue extends UseSpinnerReturn {}

const SpinnerContext = createContext<SpinnerContextValue | null>(null);

// Hook to use Spinner context
export function useSpinnerContext() {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinnerContext must be used within a SpinnerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SpinnerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const spinnerProps = useSpinner(options);
    
    return (
      <SpinnerContext.Provider value={spinnerProps}>
        <div ref={ref}>
          {children}
        </div>
      </SpinnerContext.Provider>
    );
  }
);

Root.displayName = 'SpinnerHeadless.Root';

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
    const { getContainerProps, visible, centered, fullWidth, inline } = useSpinnerContext();
    
    if (!visible) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    // Get container styles
    const getContainerStyles = () => {
      const styles: React.CSSProperties = {};
      
      if (centered) {
        styles.display = 'flex';
        styles.justifyContent = 'center';
        styles.alignItems = 'center';
      }
      
      if (fullWidth) {
        styles.width = '100%';
      }
      
      if (inline) {
        styles.display = 'inline-flex';
        styles.verticalAlign = 'middle';
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

Container.displayName = 'SpinnerHeadless.Container';

// Spinner component props
export type SpinnerElementProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Spinner component
const SpinnerElement = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SpinnerElementProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getSpinnerProps, size, variant } = useSpinnerContext();
    
    const spinnerProps = getSpinnerProps();
    
    // Get size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return { width: '16px', height: '16px' };
        case 'medium':
          return { width: '32px', height: '32px' };
        case 'large':
          return { width: '48px', height: '48px' };
        default:
          return { width: '32px', height: '32px' };
      }
    };
    
    // Get variant styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'border':
          return {
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spinner-border linear infinite',
          };
        case 'grow':
          return {
            backgroundColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spinner-grow linear infinite',
            opacity: 0,
          };
        case 'dots':
          return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
          };
        case 'ripple':
          return {
            position: 'relative' as const,
            width: '100%',
            height: '100%',
          };
        case 'dual-ring':
          return {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            position: 'relative' as const,
          };
        default:
          return {};
      }
    };
    
    return (
      <Component 
        {...spinnerProps} 
        {...props} 
        ref={ref}
        style={{
          ...getSizeStyles(),
          ...getVariantStyles(),
          ...spinnerProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

SpinnerElement.displayName = 'SpinnerHeadless.Spinner';

// Dot component props
export type DotProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Index of the dot
     */
    index?: number;
  }
>;

// Dot component
const Dot = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, index = 0, ...props }: DotProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { variant, size } = useSpinnerContext();
    
    if (variant !== 'dots') {
      return null;
    }
    
    // Get dot size based on spinner size
    const getDotSize = () => {
      switch (size) {
        case 'small':
          return { width: '4px', height: '4px' };
        case 'medium':
          return { width: '8px', height: '8px' };
        case 'large':
          return { width: '12px', height: '12px' };
        default:
          return { width: '8px', height: '8px' };
      }
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          ...getDotSize(),
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          animation: 'spinner-dot-bounce infinite ease',
          animationDelay: `${index * 0.1}s`,
          ...props.style,
        }}
      />
    );
  }
);

Dot.displayName = 'SpinnerHeadless.Dot';

// Ripple component props
export type RippleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Index of the ripple
     */
    index?: number;
  }
>;

// Ripple component
const Ripple = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, index = 0, ...props }: RippleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { variant } = useSpinnerContext();
    
    if (variant !== 'ripple') {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          position: 'absolute',
          border: '4px solid currentColor',
          opacity: 1,
          borderRadius: '50%',
          animation: 'spinner-ripple ease-out infinite',
          animationDelay: `${index * 0.5}s`,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          ...props.style,
        }}
      />
    );
  }
);

Ripple.displayName = 'SpinnerHeadless.Ripple';

// Ring component props
export type RingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Whether this is the outer ring
     */
    outer?: boolean;
  }
>;

// Ring component
const Ring = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, outer = false, ...props }: RingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { variant } = useSpinnerContext();
    
    if (variant !== 'dual-ring') {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: '2px solid transparent',
          borderTopColor: 'currentColor',
          borderLeftColor: outer ? 'transparent' : 'currentColor',
          borderRadius: '50%',
          animation: 'spinner-dual-ring linear infinite',
          animationDirection: outer ? 'reverse' : 'normal',
          ...props.style,
        }}
      />
    );
  }
);

Ring.displayName = 'SpinnerHeadless.Ring';

// Label component props
export type LabelProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Whether the label is visually hidden
     */
    srOnly?: boolean;
  }
>;

// Label component
const Label = forwardRef(
  <C extends React.ElementType = 'span'>(
    { as, children, srOnly = true, ...props }: LabelProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'span';
    const { label } = useSpinnerContext();
    
    // Get sr-only styles
    const getSrOnlyStyles = () => {
      if (!srOnly) return {};
      
      return {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        borderWidth: 0,
      };
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          ...getSrOnlyStyles(),
          ...props.style,
        }}
      >
        {children || label}
      </Component>
    );
  }
);

Label.displayName = 'SpinnerHeadless.Label';

// Export all components
export const SpinnerHeadless = {
  Root,
  Container,
  Spinner: SpinnerElement,
  Dot,
  Ripple,
  Ring,
  Label,
  useSpinnerContext,
};

export default SpinnerHeadless;
