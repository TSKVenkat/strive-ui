import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useBanner, 
  UseBannerReturn, 
  BannerOptions,
  BannerVariant
} from './useBanner';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Banner component
interface BannerContextValue extends UseBannerReturn {}

const BannerContext = createContext<BannerContextValue | null>(null);

// Hook to use Banner context
export function useBannerContext() {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBannerContext must be used within a BannerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends BannerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const bannerProps = useBanner(options);
    
    return (
      <BannerContext.Provider value={bannerProps}>
        <div ref={ref}>
          {children}
        </div>
      </BannerContext.Provider>
    );
  }
);

Root.displayName = 'BannerHeadless.Root';

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
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    const { getBannerProps, visible } = useBannerContext();
    
    if (!visible) {
      return null;
    }
    
    const containerProps = getBannerProps();
    
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

Container.displayName = 'BannerHeadless.Container';

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
    { as, children, ...props }: IconProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    const { hasIcon, variant } = useBannerContext();
    
    if (!hasIcon) {
      return null;
    }
    
    // Default icons based on variant
    const getDefaultIcon = () => {
      switch (variant) {
        case 'info':
          return '🔵';
        case 'success':
          return '✅';
        case 'warning':
          return '⚠️';
        case 'error':
          return '❌';
        default:
          return '🔵';
      }
    };
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || getDefaultIcon()}
      </Component>
    );
  }
);

Icon.displayName = 'BannerHeadless.Icon';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Content component
const Content = forwardRef(function Content<C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContentProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'BannerHeadless.Content';

// Title component props
export type TitleProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Title component
const Title = forwardRef(function Title<C extends React.ElementType = 'div'>(
    { as, children, ...props }: TitleProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = 'BannerHeadless.Title';

// Description component props
export type DescriptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Description component
const Description = forwardRef(function Description<C extends React.ElementType = 'div'>(
    { as, children, ...props }: DescriptionProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Description.displayName = 'BannerHeadless.Description';

// Actions component props
export type ActionsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Actions component
const Actions = forwardRef(function Actions<C extends React.ElementType = 'div'>(
    { as, children, ...props }: ActionsProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Actions.displayName = 'BannerHeadless.Actions';

// Close component props
export type CloseProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Close component
const Close = forwardRef(function Close<C extends React.ElementType = 'button'>(
    { as, children, ...props }: CloseProps<C>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'button';
    const { getCloseButtonProps, hasCloseButton, dismissible } = useBannerContext();
    
    if (!hasCloseButton || !dismissible) {
      return null;
    }
    
    const closeProps = getCloseButtonProps();
    
    return (
      <Component 
        {...closeProps} 
        {...props} 
        ref={ref}
      >
        {children || '×'}
      </Component>
    );
  }
);

Close.displayName = 'BannerHeadless.Close';

// Export all components
export const BannerHeadless = {
  Root,
  Container,
  Icon,
  Content,
  Title,
  Description,
  Actions,
  Close,
  useBannerContext,
} as const;

// Type for the compound component
export type BannerHeadlessType = typeof BannerHeadless;

export default BannerHeadless;
