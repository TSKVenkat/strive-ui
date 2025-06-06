import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useEmptyState, 
  UseEmptyStateReturn, 
  EmptyStateOptions,
  EmptyStateType
} from './useEmptyState';
import { PolymorphicComponentPropsWithRef, PolymorphicRef, polymorphicForwardRef } from '../../../types/polymorphic';

// Context for the EmptyState component
interface EmptyStateContextValue extends UseEmptyStateReturn {}

const EmptyStateContext = createContext<EmptyStateContextValue | null>(null);

// Hook to use EmptyState context
export function useEmptyStateContext() {
  const context = useContext(EmptyStateContext);
  if (!context) {
    throw new (globalThis as any).Error('useEmptyStateContext must be used within a EmptyStateHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends EmptyStateOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const emptyStateProps = useEmptyState(options);
    
    if (!emptyStateProps.visible) {
      return null;
    }
    
    return (
      <EmptyStateContext.Provider value={emptyStateProps}>
        <div ref={ref}>
          {children}
        </div>
      </EmptyStateContext.Provider>
    );
  }
);

Root.displayName = 'EmptyStateHeadless.Root';

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
const Container = polymorphicForwardRef<'div', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useEmptyStateContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        role="status"
        aria-live="polite"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'EmptyStateHeadless.Container';

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
const Icon = polymorphicForwardRef<'div', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { icon, type } = useEmptyStateContext();
    
    // Default icon based on type if no icon or children provided
    const renderDefaultIcon = () => {
      // This would typically be SVG icons, but we'll use simple text for demonstration
      switch (type) {
        case 'empty':
          return '📭';
        case 'noData':
          return '📊';
        case 'noResults':
          return '🔍';
        case 'offline':
          return '📶';
        case 'error':
          return '⚠️';
        default:
          return '📭';
      }
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          ...props.style,
        }}
      >
        {children || icon || renderDefaultIcon()}
      </Component>
    );
  }
);

Icon.displayName = 'EmptyStateHeadless.Icon';

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
const Title = polymorphicForwardRef<'h3', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'h3';
    const { title } = useEmptyStateContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 'bold',
          ...props.style,
        }}
      >
        {children || title}
      </Component>
    );
  }
);

Title.displayName = 'EmptyStateHeadless.Title';

// Description component props
export type DescriptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Description component
const Description = polymorphicForwardRef<'p', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'p';
    const { description } = useEmptyStateContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          color: '#666',
          ...props.style,
        }}
      >
        {children || description}
      </Component>
    );
  }
);

Description.displayName = 'EmptyStateHeadless.Description';

// Action component props
export type ActionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Action component
const Action = polymorphicForwardRef<'button', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'button';
    const { actionText, getActionProps, showAction } = useEmptyStateContext();
    
    if (!showAction) {
      return null;
    }
    
    const actionProps = getActionProps();
    
    return (
      <Component 
        {...actionProps}
        {...props} 
        ref={ref}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          ...props.style,
        }}
      >
        {children || actionText}
      </Component>
    );
  }
);

Action.displayName = 'EmptyStateHeadless.Action';

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
const Content = polymorphicForwardRef<'div', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { content } = useEmptyStateContext();
    
    if (!children && !content) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          marginTop: '24px',
          ...props.style,
        }}
      >
        {children || content}
      </Component>
    );
  }
);

Content.displayName = 'EmptyStateHeadless.Content';

// Empty component
const Empty = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
      </Container>
    );
  }
);

Empty.displayName = 'EmptyStateHeadless.Empty';

// NoData component
const NoData = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { setType } = useEmptyStateContext();
    
    // Update type to 'noData'
    React.useEffect(() => {
      setType('noData');
    }, [setType]);
    
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
      </Container>
    );
  }
);

NoData.displayName = 'EmptyStateHeadless.NoData';

// NoResults component
const NoResults = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { setType } = useEmptyStateContext();
    
    // Update type to 'noResults'
    React.useEffect(() => {
      setType('noResults');
    }, [setType]);
    
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
      </Container>
    );
  }
);

NoResults.displayName = 'EmptyStateHeadless.NoResults';

// Offline component
const Offline = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { setType } = useEmptyStateContext();
    
    // Update type to 'offline'
    React.useEffect(() => {
      setType('offline');
    }, [setType]);
    
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
      </Container>
    );
  }
);

Offline.displayName = 'EmptyStateHeadless.Offline';

// Error component
const Error = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { setType } = useEmptyStateContext();
    
    // Update type to 'error'
    React.useEffect(() => {
      setType('error');
    }, [setType]);
    
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
      </Container>
    );
  }
);

Error.displayName = 'EmptyStateHeadless.Error';

// Export all components
export const EmptyStateHeadless = {
  Root,
  Container,
  Icon,
  Title,
  Description,
  Action,
  Content,
  Empty,
  NoData,
  NoResults,
  Offline,
  Error,
  useEmptyStateContext,
};

export default EmptyStateHeadless;
