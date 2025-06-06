import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useProgress, 
  UseProgressReturn, 
  ProgressOptions,
  ProgressSize,
  ProgressVariant
} from './useProgress';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ProgressCircle component
interface ProgressCircleContextValue extends UseProgressReturn {
  /**
   * Radius of the circle
   */
  radius: number;
  /**
   * Circumference of the circle
   */
  circumference: number;
  /**
   * Stroke width of the circle
   */
  strokeWidth: number;
  /**
   * Size of the circle in pixels
   */
  circleSize: number;
}

const ProgressCircleContext = createContext<ProgressCircleContextValue | null>(null);

// Hook to use ProgressCircle context
export function useProgressCircleContext() {
  const context = useContext(ProgressCircleContext);
  if (!context) {
    throw new Error('useProgressCircleContext must be used within a ProgressCircleHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ProgressOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * Size of the circle in pixels
   */
  circleSize?: number;
  /**
   * Stroke width of the circle
   */
  strokeWidth?: number;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, circleSize = 48, strokeWidth = 4, ...options }, ref) => {
    const progressProps = useProgress(options);
    
    // Calculate circle properties
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    const contextValue: ProgressCircleContextValue = {
      ...progressProps,
      radius,
      circumference,
      strokeWidth,
      circleSize,
    };
    
    return (
      <ProgressCircleContext.Provider value={contextValue}>
        <div ref={ref}>
          {children}
        </div>
      </ProgressCircleContext.Provider>
    );
  }
);

Root.displayName = 'ProgressCircleHeadless.Root';

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
const Container = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps, circleSize } = useProgressCircleContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          position: 'relative',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ProgressCircleHeadless.Container';

// SVG component props
export type SVGProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// SVG component
const SVG = forwardRef<any, any>(
  <C extends React.ElementType = 'svg'>(
    { as, children, ...props }: SVGProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'svg';
    const { circleSize } = useProgressCircleContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
        style={{
          transform: 'rotate(-90deg)',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

SVG.displayName = 'ProgressCircleHeadless.SVG';

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
const Track = forwardRef<any, any>(
  <C extends React.ElementType = 'circle'>(
    { as, children, ...props }: TrackProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'circle';
    const { radius, strokeWidth, circleSize } = useProgressCircleContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        cx={circleSize / 2}
        cy={circleSize / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
      >
        {children}
      </Component>
    );
  }
);

Track.displayName = 'ProgressCircleHeadless.Track';

// Indicator component props
export type IndicatorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Indicator component
const Indicator = forwardRef<any, any>(
  <C extends React.ElementType = 'circle'>(
    { as, children, ...props }: IndicatorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'circle';
    const { 
      radius, 
      circumference, 
      percentage, 
      strokeWidth, 
      circleSize,
      variant,
      animated
    } = useProgressCircleContext();
    
    // Calculate stroke dash offset based on percentage
    const strokeDashoffset = variant === 'determinate' 
      ? circumference - (percentage / 100) * circumference 
      : 0;
    
    // Get animation styles
    const getAnimationStyles = () => {
      if (!animated) return {};
      
      if (variant === 'indeterminate') {
        return {
          animation: 'progress-circle-rotate 2s linear infinite',
          strokeDasharray: `${circumference * 0.75} ${circumference * 0.25}`,
        };
      }
      
      return {};
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        cx={circleSize / 2}
        cy={circleSize / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: variant === 'determinate' ? 'stroke-dashoffset 0.3s ease' : undefined,
          ...getAnimationStyles(),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Indicator.displayName = 'ProgressCircleHeadless.Indicator';

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
const Label = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LabelProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getLabelProps, getFormattedLabel, showLabel, circleSize } = useProgressCircleContext();
    
    if (!showLabel) {
      return null;
    }
    
    const labelProps = getLabelProps();
    
    return (
      <Component 
        {...labelProps} 
        {...props} 
        ref={ref}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          ...props.style,
        }}
      >
        {children || getFormattedLabel()}
      </Component>
    );
  }
);

Label.displayName = 'ProgressCircleHeadless.Label';

// Export all components
export const ProgressCircleHeadless = {
  Root,
  Container,
  SVG,
  Track,
  Indicator,
  Label,
  useProgressCircleContext,
};

export default ProgressCircleHeadless;
