import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useNotFoundPage, 
  UseNotFoundPageReturn, 
  NotFoundPageOptions 
} from './useNotFoundPage';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the NotFoundPage component
interface NotFoundPageContextValue extends UseNotFoundPageReturn {}

const NotFoundPageContext = createContext<NotFoundPageContextValue | null>(null);

// Hook to use NotFoundPage context
export function useNotFoundPageContext() {
  const context = useContext(NotFoundPageContext);
  if (!context) {
    throw new Error('useNotFoundPageContext must be used within a NotFoundPageHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends NotFoundPageOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const notFoundPageProps = useNotFoundPage(options);
    
    return (
      <NotFoundPageContext.Provider value={notFoundPageProps}>
        <div ref={ref}>
          {children}
        </div>
      </NotFoundPageContext.Provider>
    );
  }
);

Root.displayName = 'NotFoundPageHeadless.Root';

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
    const { getContainerProps } = useNotFoundPageContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
          minHeight: '100vh',
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'NotFoundPageHeadless.Container';

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
    const { icon } = useNotFoundPageContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          fontSize: '72px',
          marginBottom: '24px',
          ...props.style,
        }}
      >
        {children || icon || '404'}
      </Component>
    );
  }
);

Icon.displayName = 'NotFoundPageHeadless.Icon';

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
  <C extends React.ElementType = 'h1'>(
    { as, children, ...props }: TitleProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'h1';
    const { title } = useNotFoundPageContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: 'bold',
          ...props.style,
        }}
      >
        {children || title}
      </Component>
    );
  }
);

Title.displayName = 'NotFoundPageHeadless.Title';

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
const Description = forwardRef(
  <C extends React.ElementType = 'p'>(
    { as, children, ...props }: DescriptionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'p';
    const { description } = useNotFoundPageContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          margin: '0 0 32px 0',
          fontSize: '18px',
          color: '#666',
          maxWidth: '600px',
          ...props.style,
        }}
      >
        {children || description}
      </Component>
    );
  }
);

Description.displayName = 'NotFoundPageHeadless.Description';

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
const Action = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ActionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { actionText, getActionProps, showAction } = useNotFoundPageContext();
    
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
          padding: '12px 24px',
          fontSize: '16px',
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

Action.displayName = 'NotFoundPageHeadless.Action';

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
    const { content } = useNotFoundPageContext();
    
    if (!children && !content) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          marginTop: '32px',
          ...props.style,
        }}
      >
        {children || content}
      </Component>
    );
  }
);

Content.displayName = 'NotFoundPageHeadless.Content';

// Search component props
export type SearchProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Search component
const Search = forwardRef(
  <C extends React.ElementType = 'form'>(
    { as, children, ...props }: SearchProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'form';
    const { 
      showSearch, 
      getSearchFormProps, 
      getSearchInputProps 
    } = useNotFoundPageContext();
    
    if (!showSearch) {
      return null;
    }
    
    const formProps = getSearchFormProps();
    const inputProps = getSearchInputProps();
    
    return (
      <Component 
        {...formProps}
        {...props} 
        ref={ref}
        style={{
          marginTop: '32px',
          width: '100%',
          maxWidth: '500px',
          ...props.style,
        }}
      >
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            {...inputProps}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px 0 0 4px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </div>
        {children}
      </Component>
    );
  }
);

Search.displayName = 'NotFoundPageHeadless.Search';

// Suggestions component props
export type SuggestionsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Suggestions component
const Suggestions = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SuggestionsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { showSuggestions, suggestions } = useNotFoundPageContext();
    
    if (!showSuggestions || suggestions.length === 0) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{
          marginTop: '32px',
          ...props.style,
        }}
      >
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>
          You might be looking for:
        </h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <a 
                href={suggestion.href}
                style={{
                  color: '#0066cc',
                  textDecoration: 'none',
                  fontSize: '16px',
                }}
              >
                {suggestion.label}
              </a>
            </li>
          ))}
        </ul>
        {children}
      </Component>
    );
  }
);

Suggestions.displayName = 'NotFoundPageHeadless.Suggestions';

// Default component
const Default = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Action />
        <Search />
        <Suggestions />
      </Container>
    );
  }
);

Default.displayName = 'NotFoundPageHeadless.Default';

// Export all components
export const NotFoundPageHeadless = {
  Root,
  Container,
  Icon,
  Title,
  Description,
  Action,
  Content,
  Search,
  Suggestions,
  Default,
  useNotFoundPageContext,
};

export default NotFoundPageHeadless;
