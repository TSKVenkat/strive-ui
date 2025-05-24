import React, { Component, createContext, useContext, forwardRef } from 'react';
import { 
  useErrorBoundary, 
  UseErrorBoundaryReturn, 
  ErrorBoundaryOptions 
} from './useErrorBoundary';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ErrorBoundary component
interface ErrorBoundaryContextValue extends UseErrorBoundaryReturn {}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextValue | null>(null);

// Hook to use ErrorBoundary context
export function useErrorBoundaryContext() {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundaryContext must be used within a ErrorBoundaryHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ErrorBoundaryOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// ErrorBoundary class component
class ErrorBoundaryClass extends Component<
  {
    children: React.ReactNode;
    setError: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; setError: (error: Error, errorInfo: React.ErrorInfo) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Call setError to update the error state
    this.props.setError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return null here because the fallback UI is rendered by the Root component
      return null;
    }

    return this.props.children;
  }
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, fallback, ...options }, ref) => {
    const errorBoundaryProps = useErrorBoundary(options);
    const { hasError } = errorBoundaryProps;
    
    return (
      <ErrorBoundaryContext.Provider value={errorBoundaryProps}>
        <div ref={ref}>
          <ErrorBoundaryClass setError={errorBoundaryProps.setError}>
            {!hasError && children}
          </ErrorBoundaryClass>
          {hasError && fallback}
        </div>
      </ErrorBoundaryContext.Provider>
    );
  }
);

Root.displayName = 'ErrorBoundaryHeadless.Root';

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
    const { getErrorContainerProps } = useErrorBoundaryContext();
    
    const containerProps = getErrorContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          padding: '24px',
          backgroundColor: '#fff3f3',
          borderRadius: '8px',
          border: '1px solid #ffcdd2',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ErrorBoundaryHeadless.Container';

// Title component props
export type TitleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Title component
const Title = forwardRef(
  <C extends React.ElementType = 'h3'>(
    { as, children, ...props }: TitleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'h3';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 16px 0',
          color: '#d32f2f',
          fontSize: '20px',
          fontWeight: 'bold',
          ...props.style,
        }}
      >
        {children || 'Something went wrong'}
      </Component>
    );
  }
);

Title.displayName = 'ErrorBoundaryHeadless.Title';

// Message component props
export type MessageProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Message component
const Message = forwardRef(
  <C extends React.ElementType = 'p'>(
    { as, children, ...props }: MessageProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'p';
    const { error } = useErrorBoundaryContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 16px 0',
          color: '#5d4037',
          ...props.style,
        }}
      >
        {children || (error ? error.message : 'An unexpected error occurred')}
      </Component>
    );
  }
);

Message.displayName = 'ErrorBoundaryHeadless.Message';

// Details component props
export type DetailsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Whether to show the error details
     */
    show?: boolean;
  }
>;

// Details component
const Details = forwardRef(
  <C extends React.ElementType = 'pre'>(
    { as, children, show = false, ...props }: DetailsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'pre';
    const { error, errorInfo } = useErrorBoundaryContext();
    
    if (!show) {
      return null;
    }
    
    const errorDetails = error ? `${error.toString()}\n\n${errorInfo?.componentStack || ''}` : '';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '16px 0',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto',
          maxHeight: '200px',
          ...props.style,
        }}
      >
        {children || errorDetails}
      </Component>
    );
  }
);

Details.displayName = 'ErrorBoundaryHeadless.Details';

// Reset component props
export type ResetProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Reset component
const Reset = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ResetProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getResetButtonProps } = useErrorBoundaryContext();
    
    const resetButtonProps = getResetButtonProps();
    
    return (
      <Component 
        {...resetButtonProps}
        {...props} 
        ref={ref}
        style={{
          padding: '8px 16px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          ...props.style,
        }}
      >
        {children || 'Try Again'}
      </Component>
    );
  }
);

Reset.displayName = 'ErrorBoundaryHeadless.Reset';

// Icon component props
export type IconProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Icon component
const Icon = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: IconProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          color: '#d32f2f',
          ...props.style,
        }}
      >
        {children || '⚠️'}
      </Component>
    );
  }
);

Icon.displayName = 'ErrorBoundaryHeadless.Icon';

// Fallback component
const Fallback = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Container ref={ref} {...props}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Icon />
          <Title />
          <Message />
          <Reset />
        </div>
      </Container>
    );
  }
);

Fallback.displayName = 'ErrorBoundaryHeadless.Fallback';

// Developer component
const Developer = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Container ref={ref} {...props}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Title />
          <Message />
          <Details show={true} />
          <div style={{ marginTop: '16px' }}>
            <Reset />
          </div>
        </div>
      </Container>
    );
  }
);

Developer.displayName = 'ErrorBoundaryHeadless.Developer';

// Export all components
export const ErrorBoundaryHeadless = {
  Root,
  Container,
  Title,
  Message,
  Details,
  Reset,
  Icon,
  Fallback,
  Developer,
  useErrorBoundaryContext,
};

export default ErrorBoundaryHeadless;
