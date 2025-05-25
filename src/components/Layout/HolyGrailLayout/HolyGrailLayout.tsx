import React, { forwardRef } from 'react';

export type HolyGrailLayoutVariant = 'fixed' | 'fluid' | 'responsive';

export interface HolyGrailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the layout
   */
  children: React.ReactNode;
  
  /**
   * The variant of the layout
   * @default 'responsive'
   */
  variant?: HolyGrailLayoutVariant;
  
  /**
   * Whether to include the left sidebar
   * @default true
   */
  hasLeftSidebar?: boolean;
  
  /**
   * Whether to include the right sidebar
   * @default false
   */
  hasRightSidebar?: boolean;
  
  /**
   * The width of the left sidebar
   * @default '250px'
   */
  leftSidebarWidth?: string;
  
  /**
   * The width of the right sidebar
   * @default '250px'
   */
  rightSidebarWidth?: string;
  
  /**
   * The height of the header
   * @default 'auto'
   */
  headerHeight?: string;
  
  /**
   * The height of the footer
   * @default 'auto'
   */
  footerHeight?: string;
  
  /**
   * The gap between the sections
   * @default '1rem'
   */
  gap?: string;
  
  /**
   * Whether the layout should take up the full height of the viewport
   * @default true
   */
  fullHeight?: boolean;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * HolyGrailLayout component for creating a classic web layout with header, footer, main content, and optional sidebars
 */
export const HolyGrailLayout = forwardRef<HTMLDivElement, HolyGrailLayoutProps>(
  (
    {
      children,
      variant = 'responsive',
      hasLeftSidebar = true,
      hasRightSidebar = false,
      leftSidebarWidth = '250px',
      rightSidebarWidth = '250px',
      headerHeight = 'auto',
      footerHeight = 'auto',
      gap = '1rem',
      fullHeight = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Validate that we have the correct children
    const childrenArray = React.Children.toArray(children);
    
    // Find the header, footer, left sidebar, right sidebar, and main content
    const header = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === HolyGrailHeader
    );
    
    const footer = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === HolyGrailFooter
    );
    
    const leftSidebar = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === HolyGrailLeftSidebar
    );
    
    const rightSidebar = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === HolyGrailRightSidebar
    );
    
    const content = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === HolyGrailContent
    );
    
    // Build the grid template based on the variant and presence of sidebars
    let gridTemplateAreas = '';
    let gridTemplateColumns = '';
    
    if (variant === 'fixed' || variant === 'fluid') {
      // Fixed and fluid variants use a similar layout, just with different width constraints
      gridTemplateAreas = `
        "header header header"
        "${hasLeftSidebar ? 'left-sidebar' : 'content'} content ${hasRightSidebar ? 'right-sidebar' : 'content'}"
        "footer footer footer"
      `;
      
      gridTemplateColumns = `
        ${hasLeftSidebar ? leftSidebarWidth : '0'} 
        1fr 
        ${hasRightSidebar ? rightSidebarWidth : '0'}
      `;
    } else if (variant === 'responsive') {
      // Responsive variant uses a more flexible layout
      gridTemplateAreas = `
        "header"
        "${hasLeftSidebar ? 'left-sidebar' : 'content'}"
        "content"
        "${hasRightSidebar ? 'right-sidebar' : 'content'}"
        "footer"
      `;
      
      gridTemplateColumns = '1fr';
    }
    
    // Build the grid template rows
    const gridTemplateRows = `
      ${headerHeight}
      ${hasLeftSidebar || hasRightSidebar ? 'auto' : ''}
      1fr
      ${hasLeftSidebar && hasRightSidebar ? 'auto' : ''}
      ${footerHeight}
    `;
    
    // Build the container style
    const containerStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateAreas,
      gridTemplateColumns,
      gridTemplateRows,
      gap,
      ...(fullHeight && { minHeight: '100vh' }),
      ...(variant === 'fixed' && { maxWidth: '1200px', margin: '0 auto' }),
      ...(variant === 'fluid' && { width: '100%' }),
      ...style,
    };
    
    // Add media queries for responsive variant
    if (variant === 'responsive') {
      // We'll use CSS custom properties for the responsive layout
      // These will be set via a style tag in the component
      const styleTag = `
        @media (min-width: 768px) {
          .strive-holy-grail-layout.responsive {
            grid-template-areas:
              "header header header"
              "${hasLeftSidebar ? 'left-sidebar' : 'content'} content ${hasRightSidebar ? 'right-sidebar' : 'content'}"
              "footer footer footer";
            grid-template-columns:
              ${hasLeftSidebar ? leftSidebarWidth : '0'} 
              1fr 
              ${hasRightSidebar ? rightSidebarWidth : '0'};
          }
        }
      `;
      
      // Add the style tag to the document if it doesn't exist
      if (typeof document !== 'undefined' && !document.getElementById('strive-holy-grail-layout-style')) {
        const style = document.createElement('style');
        style.id = 'strive-holy-grail-layout-style';
        style.innerHTML = styleTag;
        document.head.appendChild(style);
      }
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-layout ${variant} ${className}`}
        style={containerStyle}
        {...rest}
      >
        {header}
        {hasLeftSidebar && leftSidebar}
        {content}
        {hasRightSidebar && rightSidebar}
        {footer}
      </Component>
    );
  }
);

HolyGrailLayout.displayName = 'HolyGrailLayout';

/**
 * HolyGrailHeader component for the header section of the HolyGrailLayout
 */
export interface HolyGrailHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content of the header
   */
  children: React.ReactNode;
  
  /**
   * Whether the header is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * The component used for the root node
   * @default 'header'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const HolyGrailHeader = forwardRef<HTMLElement, HolyGrailHeaderProps>(
  (
    {
      children,
      sticky = false,
      as: Component = 'header',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const headerStyle: React.CSSProperties = {
      gridArea: 'header',
      ...(sticky && {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }),
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-header ${sticky ? 'sticky' : ''} ${className}`}
        style={headerStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

HolyGrailHeader.displayName = 'HolyGrailHeader';

/**
 * HolyGrailLeftSidebar component for the left sidebar section of the HolyGrailLayout
 */
export interface HolyGrailLeftSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content of the left sidebar
   */
  children: React.ReactNode;
  
  /**
   * Whether the sidebar is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * The component used for the root node
   * @default 'aside'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const HolyGrailLeftSidebar = forwardRef<HTMLElement, HolyGrailLeftSidebarProps>(
  (
    {
      children,
      sticky = false,
      as: Component = 'aside',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const sidebarStyle: React.CSSProperties = {
      gridArea: 'left-sidebar',
      ...(sticky && {
        position: 'sticky',
        top: 0,
        height: 'fit-content',
        alignSelf: 'start',
        zIndex: 90,
      }),
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-left-sidebar ${sticky ? 'sticky' : ''} ${className}`}
        style={sidebarStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

HolyGrailLeftSidebar.displayName = 'HolyGrailLeftSidebar';

/**
 * HolyGrailContent component for the main content section of the HolyGrailLayout
 */
export interface HolyGrailContentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content of the main content area
   */
  children: React.ReactNode;
  
  /**
   * The component used for the root node
   * @default 'main'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const HolyGrailContent = forwardRef<HTMLElement, HolyGrailContentProps>(
  (
    {
      children,
      as: Component = 'main',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const contentStyle: React.CSSProperties = {
      gridArea: 'content',
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-content ${className}`}
        style={contentStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

HolyGrailContent.displayName = 'HolyGrailContent';

/**
 * HolyGrailRightSidebar component for the right sidebar section of the HolyGrailLayout
 */
export interface HolyGrailRightSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content of the right sidebar
   */
  children: React.ReactNode;
  
  /**
   * Whether the sidebar is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * The component used for the root node
   * @default 'aside'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const HolyGrailRightSidebar = forwardRef<HTMLElement, HolyGrailRightSidebarProps>(
  (
    {
      children,
      sticky = false,
      as: Component = 'aside',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const sidebarStyle: React.CSSProperties = {
      gridArea: 'right-sidebar',
      ...(sticky && {
        position: 'sticky',
        top: 0,
        height: 'fit-content',
        alignSelf: 'start',
        zIndex: 90,
      }),
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-right-sidebar ${sticky ? 'sticky' : ''} ${className}`}
        style={sidebarStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

HolyGrailRightSidebar.displayName = 'HolyGrailRightSidebar';

/**
 * HolyGrailFooter component for the footer section of the HolyGrailLayout
 */
export interface HolyGrailFooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content of the footer
   */
  children: React.ReactNode;
  
  /**
   * Whether the footer is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * The component used for the root node
   * @default 'footer'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const HolyGrailFooter = forwardRef<HTMLElement, HolyGrailFooterProps>(
  (
    {
      children,
      sticky = false,
      as: Component = 'footer',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const footerStyle: React.CSSProperties = {
      gridArea: 'footer',
      ...(sticky && {
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
      }),
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-holy-grail-footer ${sticky ? 'sticky' : ''} ${className}`}
        style={footerStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

HolyGrailFooter.displayName = 'HolyGrailFooter';
