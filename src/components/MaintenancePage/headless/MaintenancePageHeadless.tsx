import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useMaintenancePage, 
  UseMaintenancePageReturn, 
  MaintenancePageOptions 
} from './useMaintenancePage';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Helper function to create polymorphic components
function createPolymorphicComponent<TDefaultElement extends React.ElementType>(
  displayName: string,
  defaultElement: TDefaultElement
) {
  return forwardRef<any, any>((props: any, ref: any) => {
    const { as, children, ...restProps } = props;
    const Component = as || defaultElement;
    return React.createElement(Component as any, { ...restProps, ref }, children);
  }) as any;
}

// Context for the MaintenancePage component
interface MaintenancePageContextValue extends UseMaintenancePageReturn {}

const MaintenancePageContext = createContext<MaintenancePageContextValue | null>(null);

// Hook to use MaintenancePage context
export function useMaintenancePageContext() {
  const context = useContext(MaintenancePageContext);
  if (!context) {
    throw new Error('useMaintenancePageContext must be used within a MaintenancePageHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends MaintenancePageOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const maintenancePageProps = useMaintenancePage(options);
    
    return (
      <MaintenancePageContext.Provider value={maintenancePageProps}>
        <div ref={ref}>
          {children}
        </div>
      </MaintenancePageContext.Provider>
    );
  }
);

Root.displayName = 'MaintenancePageHeadless.Root';

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
const Container = forwardRef(function Container<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<ContainerProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'div';
    const { getContainerProps } = useMaintenancePageContext();
    
    const containerProps = getContainerProps();
    
    return React.createElement(
      Component as any,
      {
        ...containerProps,
        ...props,
        ref,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
          minHeight: '100vh',
          ...props.style,
        },
      },
      children
    );
  });

Container.displayName = 'MaintenancePageHeadless.Container';

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
const Icon = forwardRef(function Icon<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<IconProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'div';
    const { icon } = useMaintenancePageContext();
    
    return React.createElement(
      Component as any,
      {
        ...props,
        ref,
        style: {
          fontSize: '72px',
          marginBottom: '24px',
          ...props.style,
        },
      },
      children || icon || '🔧'
    );
  });

Icon.displayName = 'MaintenancePageHeadless.Icon';

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
const Title = forwardRef(function Title<C extends React.ElementType = 'h1'>(
  { as, children, ...props }: Omit<TitleProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'h1';
    const { title } = useMaintenancePageContext();
    
    return React.createElement(
      Component as any,
      {
        ...props,
        ref,
        style: {
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: 'bold',
          ...props.style,
        },
      },
      children || title
    );
  });

Title.displayName = 'MaintenancePageHeadless.Title';

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
const Description = forwardRef(function Description<C extends React.ElementType = 'p'>(
  { as, children, ...props }: Omit<DescriptionProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'p';
    const { description } = useMaintenancePageContext();
    
    return React.createElement(
      Component as any,
      {
        ...props,
        ref,
        style: {
          margin: '0 0 32px 0',
          fontSize: '18px',
          color: '#666',
          maxWidth: '600px',
          ...props.style,
        },
      },
      children || description
    );
  });

Description.displayName = 'MaintenancePageHeadless.Description';

// Countdown component props
export type CountdownProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Countdown component
const Countdown = forwardRef(function Countdown<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<CountdownProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'div';
    const { showCountdown, timeRemaining, estimatedCompletion } = useMaintenancePageContext();
    
    if (!showCountdown || !timeRemaining) {
      return null;
    }
    
    const { days, hours, minutes, seconds } = timeRemaining;
    
    const formatDate = (date: string | Date) => {
      if (date instanceof Date) {
        return date.toLocaleString();
      }
      return new Date(date).toLocaleString();
    };
    
    return React.createElement(
      Component as any,
      {
        ...props,
        ref,
        style: {
          marginBottom: '32px',
          ...props.style,
        },
      },
      children || React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'div',
          { style: { marginBottom: '16px', fontSize: '16px', color: '#666' } },
          `Estimated completion: ${estimatedCompletion ? formatDate(estimatedCompletion) : 'Soon'}`
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'center', gap: '16px' } },
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            React.createElement(
              'div',
              { style: { fontSize: '32px', fontWeight: 'bold' } },
              days
            ),
            React.createElement(
              'div',
              { style: { fontSize: '14px', color: '#666' } },
              'Days'
            )
          ),
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            React.createElement(
              'div',
              { style: { fontSize: '32px', fontWeight: 'bold' } },
              hours
            ),
            React.createElement(
              'div',
              { style: { fontSize: '14px', color: '#666' } },
              'Hours'
            )
          ),
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            React.createElement(
              'div',
              { style: { fontSize: '32px', fontWeight: 'bold' } },
              minutes
            ),
            React.createElement(
              'div',
              { style: { fontSize: '14px', color: '#666' } },
              'Minutes'
            )
          ),
          React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            React.createElement(
              'div',
              { style: { fontSize: '32px', fontWeight: 'bold' } },
              seconds
            ),
            React.createElement(
              'div',
              { style: { fontSize: '14px', color: '#666' } },
              'Seconds'
            )
          )
        )
      )
    );
  });

Countdown.displayName = 'MaintenancePageHeadless.Countdown';

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
const Action = forwardRef(function Action<C extends React.ElementType = 'button'>(
  { as, children, ...props }: Omit<ActionProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'button';
    const { actionText, getActionProps, showAction } = useMaintenancePageContext();
    
    if (!showAction) {
      return null;
    }
    
    const actionProps = getActionProps();
    
    return React.createElement(
      Component as any,
      {
        ...actionProps,
        ...props,
        ref,
        style: {
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          ...props.style,
        },
      },
      children || actionText
    );
  });

Action.displayName = 'MaintenancePageHeadless.Action';

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
const Content = forwardRef(function Content<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<ContentProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'div';
    const { content } = useMaintenancePageContext();
    
    if (!children && !content) {
      return null;
    }
    
    return React.createElement(
      Component as any,
      {
        ...props,
        ref,
        style: {
          marginTop: '32px',
          ...props.style,
        },
      },
      children || content
    );
  });

Content.displayName = 'MaintenancePageHeadless.Content';

// Newsletter component props
export type NewsletterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Newsletter component
const Newsletter = forwardRef(function Newsletter<C extends React.ElementType = 'form'>(
  { as, children, ...props }: Omit<NewsletterProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = (as || 'form') as React.ElementType;
    const { 
      showNewsletter, 
      getNewsletterFormProps, 
      getEmailInputProps 
    } = useMaintenancePageContext();
    
    if (!showNewsletter) {
      return null;
    }
    
    const formProps = getNewsletterFormProps();
    const inputProps = getEmailInputProps();
    
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
        <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
          Get notified when we're back
        </div>
        <div style={{ display: 'flex' }}>
          <input
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
            Subscribe
          </button>
        </div>
        {children}
      </Component>
    );
  });

Newsletter.displayName = 'MaintenancePageHeadless.Newsletter';

// Social component props
export type SocialProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Social component
const Social = forwardRef(function Social<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<SocialProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = (as || 'div') as React.ElementType;
    const { showSocial, socialLinks } = useMaintenancePageContext();
    
    if (!showSocial || socialLinks.length === 0) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref as any}
        style={{
          marginTop: '32px',
          ...props.style,
        }}
      >
        <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
          Follow us for updates
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '16px',
        }}>
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontSize: '16px',
              }}
            >
              {link.icon || link.name}
            </a>
          ))}
        </div>
        {children}
      </Component>
    );
  });

Social.displayName = 'MaintenancePageHeadless.Social';

// RefreshInfo component props
export type RefreshInfoProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// RefreshInfo component
const RefreshInfo = forwardRef(function RefreshInfo<C extends React.ElementType = 'div'>(
  { as, children, ...props }: Omit<RefreshInfoProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = (as || 'div') as React.ElementType;
    const { autoRefresh, refreshCountdown } = useMaintenancePageContext();
    
    if (!autoRefresh) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref as any}
        style={{
          marginTop: '32px',
          fontSize: '14px',
          color: '#666',
          ...props.style,
        }}
      >
        {children || (
          <div>
            This page will automatically refresh in {refreshCountdown} seconds
          </div>
        )}
      </Component>
    );
  });

RefreshInfo.displayName = 'MaintenancePageHeadless.RefreshInfo';

// Default component
const Default = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Container ref={ref} {...props}>
        <Icon />
        <Title />
        <Description />
        <Countdown />
        <Action />
        <Newsletter />
        <Social />
        <RefreshInfo />
      </Container>
    );
  }
);

Default.displayName = 'MaintenancePageHeadless.Default';

// Export all components
export const MaintenancePageHeadless = {
  Root,
  Container,
  Icon,
  Title,
  Description,
  Countdown,
  Action,
  Content,
  Newsletter,
  Social,
  RefreshInfo,
  Default,
  useMaintenancePageContext,
};

export default MaintenancePageHeadless;
