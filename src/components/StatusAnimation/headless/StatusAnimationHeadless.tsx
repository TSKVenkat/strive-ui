import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useStatusAnimation, 
  UseStatusAnimationReturn, 
  StatusAnimationOptions,
  StatusType
} from './useStatusAnimation';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the StatusAnimation component
interface StatusAnimationContextValue extends UseStatusAnimationReturn {}

const StatusAnimationContext = createContext<StatusAnimationContextValue | null>(null);

// Hook to use StatusAnimation context
export function useStatusAnimationContext() {
  const context = useContext(StatusAnimationContext);
  if (!context) {
    throw new Error('useStatusAnimationContext must be used within a StatusAnimationHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends StatusAnimationOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const statusAnimationProps = useStatusAnimation(options);
    
    return (
      <StatusAnimationContext.Provider value={statusAnimationProps}>
        <div ref={ref}>
          {children}
        </div>
      </StatusAnimationContext.Provider>
    );
  }
);

Root.displayName = 'StatusAnimationHeadless.Root';

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
    const { getContainerProps, visible, circle, backgroundColor, size } = useStatusAnimationContext();
    
    if (!visible) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...(circle ? {
            borderRadius: '50%',
            backgroundColor,
            width: size,
            height: size,
          } : {}),
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'StatusAnimationHeadless.Container';

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
const SVG = forwardRef(
  <C extends React.ElementType = 'svg'>(
    { as, children, ...props }: SVGProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'svg';
    const { getSvgProps } = useStatusAnimationContext();
    
    const svgProps = getSvgProps();
    
    return (
      <Component 
        {...svgProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

SVG.displayName = 'StatusAnimationHeadless.SVG';

// Path component props
export type PathProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Path component
const Path = forwardRef(
  <C extends React.ElementType = 'path'>(
    { as, children, ...props }: PathProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'path';
    const { 
      getPathData, 
      getAnimationStyle, 
      color, 
      strokeWidth, 
      type 
    } = useStatusAnimationContext();
    
    const pathData = getPathData();
    const animationStyle = getAnimationStyle();
    
    return (
      <Component 
        d={pathData}
        fill={type === 'loading' ? 'none' : color}
        stroke={type === 'loading' ? color : 'none'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props} 
        ref={ref}
        style={{
          ...animationStyle,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Path.displayName = 'StatusAnimationHeadless.Path';

// Success component props
export type SuccessProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Success component
const Success = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SuccessProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        <SVG>
          <Path />
        </SVG>
        {children}
      </Component>
    );
  }
);

Success.displayName = 'StatusAnimationHeadless.Success';

// Error component props
export type ErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Error component
const Error = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        <SVG>
          <Path />
        </SVG>
        {children}
      </Component>
    );
  }
);

Error.displayName = 'StatusAnimationHeadless.Error';

// Warning component props
export type WarningProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Warning component
const Warning = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: WarningProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        <SVG>
          <Path />
        </SVG>
        {children}
      </Component>
    );
  }
);

Warning.displayName = 'StatusAnimationHeadless.Warning';

// Info component props
export type InfoProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Info component
const Info = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: InfoProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        <SVG>
          <Path />
        </SVG>
        {children}
      </Component>
    );
  }
);

Info.displayName = 'StatusAnimationHeadless.Info';

// Loading component props
export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Loading component
const Loading = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        <SVG>
          <Path />
        </SVG>
        {children}
      </Component>
    );
  }
);

Loading.displayName = 'StatusAnimationHeadless.Loading';

// Text component props
export type TextProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Text component
const Text = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: TextProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { type, color } = useStatusAnimationContext();
    
    // Get default text based on type
    const getDefaultText = () => {
      switch (type) {
        case 'success':
          return 'Success!';
        case 'error':
          return 'Error!';
        case 'warning':
          return 'Warning!';
        case 'info':
          return 'Information';
        case 'loading':
          return 'Loading...';
        default:
          return '';
      }
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          color,
          marginLeft: '8px',
          ...props.style,
        }}
      >
        {children || getDefaultText()}
      </Component>
    );
  }
);

Text.displayName = 'StatusAnimationHeadless.Text';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Trigger component
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { start } = useStatusAnimationContext();
    
    return (
      <Component 
        onClick={start}
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Trigger.displayName = 'StatusAnimationHeadless.Trigger';

// Export all components
export const StatusAnimationHeadless = {
  Root,
  Container,
  SVG,
  Path,
  Success,
  Error,
  Warning,
  Info,
  Loading,
  Text,
  Trigger,
  useStatusAnimationContext,
};

export default StatusAnimationHeadless;
