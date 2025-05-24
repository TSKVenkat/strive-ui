import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useProgress, 
  UseProgressReturn, 
  ProgressOptions,
  ProgressSize,
  ProgressVariant
} from './useProgress';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ProgressBar component
interface ProgressBarContextValue extends UseProgressReturn {}

const ProgressBarContext = createContext<ProgressBarContextValue | null>(null);

// Hook to use ProgressBar context
export function useProgressBarContext() {
  const context = useContext(ProgressBarContext);
  if (!context) {
    throw new Error('useProgressBarContext must be used within a ProgressBarHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ProgressOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const progressBarProps = useProgress(options);
    
    return (
      <ProgressBarContext.Provider value={progressBarProps}>
        <div ref={ref}>
          {children}
        </div>
      </ProgressBarContext.Provider>
    );
  }
);

Root.displayName = 'ProgressBarHeadless.Root';

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
    const { getContainerProps, size } = useProgressBarContext();
    
    const containerProps = getContainerProps();
    
    // Get size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return { height: '4px' };
        case 'medium':
          return { height: '8px' };
        case 'large':
          return { height: '12px' };
        default:
          return { height: '8px' };
      }
    };
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          ...getSizeStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ProgressBarHeadless.Container';

// Track component props
export type TrackProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Track component
const Track = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: TrackProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Track.displayName = 'ProgressBarHeadless.Track';

// Buffer component props
export type BufferProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Buffer component
const Buffer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BufferProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getBufferBarProps, hasBuffer } = useProgressBarContext();
    
    if (!hasBuffer) {
      return null;
    }
    
    const bufferProps = getBufferBarProps();
    
    return (
      <Component 
        {...bufferProps} 
        {...props} 
        ref={ref}
        style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'width 0.3s ease',
          ...bufferProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Buffer.displayName = 'ProgressBarHeadless.Buffer';

// Bar component props
export type BarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Bar component
const Bar = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BarProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getProgressBarProps, 
      variant, 
      animated, 
      striped 
    } = useProgressBarContext();
    
    const barProps = getProgressBarProps();
    
    // Get animation styles
    const getAnimationStyles = () => {
      if (!animated) return {};
      
      if (variant === 'indeterminate') {
        return {
          animation: 'progress-bar-indeterminate 2s linear infinite',
          width: '100%',
          transformOrigin: '0% 50%',
        };
      }
      
      if (striped) {
        return {
          backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
          backgroundSize: '1rem 1rem',
          animation: 'progress-bar-stripes 1s linear infinite',
        };
      }
      
      return {};
    };
    
    return (
      <Component 
        {...barProps} 
        {...props} 
        ref={ref}
        style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: variant === 'determinate' ? 'width 0.3s ease' : undefined,
          ...getAnimationStyles(),
          ...barProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Bar.displayName = 'ProgressBarHeadless.Bar';

// Label component props
export type LabelProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Label component
const Label = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LabelProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getLabelProps, getFormattedLabel, showLabel } = useProgressBarContext();
    
    if (!showLabel) {
      return null;
    }
    
    const labelProps = getLabelProps();
    
    return (
      <Component 
        {...labelProps} 
        {...props} 
        ref={ref}
      >
        {children || getFormattedLabel()}
      </Component>
    );
  }
);

Label.displayName = 'ProgressBarHeadless.Label';

// Export all components
export const ProgressBarHeadless = {
  Root,
  Container,
  Track,
  Buffer,
  Bar,
  Label,
  useProgressBarContext,
};

export default ProgressBarHeadless;
