import React, { forwardRef } from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the container
   */
  children?: React.ReactNode;
  
  /**
   * Maximum width of the container
   * @default 'lg'
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
  
  /**
   * Center the container horizontally
   * @default true
   */
  centered?: boolean;
  
  /**
   * Add padding to the container
   * @default true
   */
  padding?: boolean | string;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Fluid container that takes up 100% of the width
   * @default false
   */
  fluid?: boolean;
}

/**
 * Container component for constraining content width and centering it horizontally
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      maxWidth = 'lg',
      centered = true,
      padding = true,
      as: Component = 'div',
      className = '',
      fluid = false,
      ...rest
    },
    ref
  ) => {
    // Map maxWidth to actual CSS values
    const maxWidthMap = {
      xs: '320px',
      sm: '384px',
      md: '448px',
      lg: '512px',
      xl: '576px',
      '2xl': '672px',
      '3xl': '768px',
      '4xl': '896px',
      '5xl': '1024px',
      '6xl': '1152px',
      '7xl': '1280px',
      full: '100%',
      none: 'none',
    };

    // Build the style object
    const style: React.CSSProperties = {
      maxWidth: fluid ? '100%' : maxWidthMap[maxWidth],
      marginLeft: centered ? 'auto' : undefined,
      marginRight: centered ? 'auto' : undefined,
      width: '100%',
      ...(padding && { padding: typeof padding === 'string' ? padding : '1rem' }),
      ...rest.style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-container ${className}`}
        style={style}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
