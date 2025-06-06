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
    throw new globalThis.Error('useStatusAnimationContext must be used within a StatusAnimationHeadless.Root component');
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
const ContainerComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { getContainerProps, visible, circle, backgroundColor, size } = useStatusAnimationContext();
  
  if (!visible) {
    return null;
  }
  
  const containerProps = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
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
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
});

ContainerComponent.displayName = 'StatusAnimationHeadless.Container';

const Container = ContainerComponent as <C extends React.ElementType = 'div'>(
  props: ContainerProps<C>
) => React.ReactElement | null;

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
const SVGComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'svg', children, ...restProps } = props;
  const { getSvgProps } = useStatusAnimationContext();
  
  const svgProps = getSvgProps();
  
  return (
    <Component 
      {...svgProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

SVGComponent.displayName = 'StatusAnimationHeadless.SVG';

const SVG = SVGComponent as <C extends React.ElementType = 'svg'>(
  props: SVGProps<C>
) => React.ReactElement | null;

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
const PathComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'path', children, ...restProps } = props;
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
      {...restProps} 
      ref={ref}
      style={{
        ...animationStyle,
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
});

PathComponent.displayName = 'StatusAnimationHeadless.Path';

const Path = PathComponent as <C extends React.ElementType = 'path'>(
  props: PathProps<C>
) => React.ReactElement | null;

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
const SuccessComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      <SVG>
        <Path />
      </SVG>
      {children}
    </Component>
  );
});

SuccessComponent.displayName = 'StatusAnimationHeadless.Success';

const Success = SuccessComponent as <C extends React.ElementType = 'div'>(
  props: SuccessProps<C>
) => React.ReactElement | null;

// Error component props
export type StatusErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Error component
const StatusErrorComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      <SVG>
        <Path />
      </SVG>
      {children}
    </Component>
  );
});

StatusErrorComponent.displayName = 'StatusAnimationHeadless.Error';

const StatusError = StatusErrorComponent as <C extends React.ElementType = 'div'>(
  props: StatusErrorProps<C>
) => React.ReactElement | null;

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
const WarningComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      <SVG>
        <Path />
      </SVG>
      {children}
    </Component>
  );
});

WarningComponent.displayName = 'StatusAnimationHeadless.Warning';

const Warning = WarningComponent as <C extends React.ElementType = 'div'>(
  props: WarningProps<C>
) => React.ReactElement | null;

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
const InfoComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      <SVG>
        <Path />
      </SVG>
      {children}
    </Component>
  );
});

InfoComponent.displayName = 'StatusAnimationHeadless.Info';

const Info = InfoComponent as <C extends React.ElementType = 'div'>(
  props: InfoProps<C>
) => React.ReactElement | null;

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
const LoadingComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      <SVG>
        <Path />
      </SVG>
      {children}
    </Component>
  );
});

LoadingComponent.displayName = 'StatusAnimationHeadless.Loading';

const Loading = LoadingComponent as <C extends React.ElementType = 'div'>(
  props: LoadingProps<C>
) => React.ReactElement | null;

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
const TextComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
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
      {...restProps} 
      ref={ref}
      style={{
        color,
        marginLeft: '8px',
        ...restProps.style,
      }}
    >
      {children || getDefaultText()}
    </Component>
  );
});

TextComponent.displayName = 'StatusAnimationHeadless.Text';

const Text = TextComponent as <C extends React.ElementType = 'div'>(
  props: TextProps<C>
) => React.ReactElement | null;

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
const TriggerComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'button', children, ...restProps } = props;
  const { start } = useStatusAnimationContext();
  
  return (
    <Component 
      onClick={start}
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

TriggerComponent.displayName = 'StatusAnimationHeadless.Trigger';

const Trigger = TriggerComponent as <C extends React.ElementType = 'button'>(
  props: TriggerProps<C>
) => React.ReactElement | null;

// Export all components
export const StatusAnimationHeadless = {
  Root,
  Container,
  SVG,
  Path,
  Success,
  Error: StatusError,
  Warning,
  Info,
  Loading,
  Text,
  Trigger,
  useStatusAnimationContext,
};

export default StatusAnimationHeadless;
