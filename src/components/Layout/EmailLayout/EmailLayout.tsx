import React, { forwardRef } from 'react';

export type EmailWidth = number | string;
export type EmailAlignment = 'left' | 'center' | 'right';
export type EmailTheme = 'light' | 'dark' | 'custom';

export interface EmailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the email layout
   */
  children: React.ReactNode;
  
  /**
   * The width of the email content
   * @default '600px'
   */
  width?: EmailWidth;
  
  /**
   * The maximum width of the email content
   * @default '100%'
   */
  maxWidth?: EmailWidth;
  
  /**
   * The alignment of the email content
   * @default 'center'
   */
  alignment?: EmailAlignment;
  
  /**
   * The theme of the email
   * @default 'light'
   */
  theme?: EmailTheme;
  
  /**
   * Custom theme colors when theme is set to 'custom'
   */
  customTheme?: {
    backgroundColor?: string;
    textColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  
  /**
   * Whether to include a header
   * @default false
   */
  showHeader?: boolean;
  
  /**
   * Content for the header
   */
  headerContent?: React.ReactNode;
  
  /**
   * Whether to include a footer
   * @default false
   */
  showFooter?: boolean;
  
  /**
   * Content for the footer
   */
  footerContent?: React.ReactNode;
  
  /**
   * Whether to include a preheader text (hidden text that appears in email clients)
   * @default false
   */
  showPreheader?: boolean;
  
  /**
   * The preheader text
   */
  preheaderText?: string;
  
  /**
   * Whether to use inline styles (recommended for email compatibility)
   * @default true
   */
  useInlineStyles?: boolean;
  
  /**
   * Whether to use table-based layout (recommended for email compatibility)
   * @default true
   */
  useTableLayout?: boolean;
  
  /**
   * Whether to include basic email reset styles
   * @default true
   */
  includeResetStyles?: boolean;
  
  /**
   * Whether to show a preview of the email
   * @default false
   */
  showPreview?: boolean;
  
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
 * EmailLayout component for creating email-optimized layouts
 */
export const EmailLayout = forwardRef<HTMLDivElement, EmailLayoutProps>(
  (
    {
      children,
      width = '600px',
      maxWidth = '100%',
      alignment = 'center',
      theme = 'light',
      customTheme = {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#1976d2',
        secondaryColor: '#f5f5f5',
      },
      showHeader = false,
      headerContent,
      showFooter = false,
      footerContent,
      showPreheader = false,
      preheaderText = '',
      useInlineStyles = true,
      useTableLayout = true,
      includeResetStyles = true,
      showPreview = false,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Get theme colors
    const getThemeColors = () => {
      if (theme === 'custom') {
        return customTheme;
      }
      
      return theme === 'light'
        ? {
            backgroundColor: '#ffffff',
            textColor: '#333333',
            primaryColor: '#1976d2',
            secondaryColor: '#f5f5f5',
          }
        : {
            backgroundColor: '#121212',
            textColor: '#ffffff',
            primaryColor: '#90caf9',
            secondaryColor: '#333333',
          };
    };
    
    const themeColors = getThemeColors();
    
    // Basic email reset styles
    const resetStyles = includeResetStyles
      ? `
        body, p, div, table, tr, td, th, tbody, thead, tfoot {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }
        
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        
        img, a img {
          border: 0;
          height: auto;
          outline: none;
          text-decoration: none;
        }
        
        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
        
        /* iOS blue links */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        
        /* Gmail blue links */
        u + #body a {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        
        /* Samsung blue links */
        #MessageViewBody a {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
      `
      : '';
    
    // Preheader style
    const preheaderStyle = {
      display: 'none',
      fontSize: '1px',
      color: themeColors.backgroundColor,
      lineHeight: '1px',
      maxHeight: '0px',
      maxWidth: '0px',
      opacity: 0,
      overflow: 'hidden',
    };
    
    // Container style
    const containerStyle: React.CSSProperties = {
      backgroundColor: themeColors.backgroundColor,
      color: themeColors.textColor,
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      ...(showPreview && {
        maxWidth: '100%',
        margin: '0 auto',
        padding: '20px',
      }),
      ...style,
    };
    
    // Content style
    const contentStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      margin: alignment === 'center' ? '0 auto' : alignment === 'right' ? '0 0 0 auto' : '0 auto 0 0',
      backgroundColor: themeColors.backgroundColor,
    };
    
    // Header style
    const headerStyle: React.CSSProperties = {
      padding: '20px',
      backgroundColor: themeColors.primaryColor,
      color: '#ffffff',
    };
    
    // Body style
    const bodyStyle: React.CSSProperties = {
      padding: '20px',
      backgroundColor: themeColors.backgroundColor,
    };
    
    // Footer style
    const footerStyle: React.CSSProperties = {
      padding: '20px',
      backgroundColor: themeColors.secondaryColor,
      color: themeColors.textColor,
      fontSize: '14px',
    };
    
    // Table-based layout
    if (useTableLayout) {
      return (
        <Component
          ref={ref}
          className={`strive-email-layout ${className}`}
          style={containerStyle}
          {...rest}
        >
          {includeResetStyles && (
            <style type="text/css">{resetStyles}</style>
          )}
          
          {showPreheader && (
            <div style={preheaderStyle}>
              {preheaderText}
            </div>
          )}
          
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            border="0"
            style={{ backgroundColor: themeColors.backgroundColor }}
          >
            <tr>
              <td align={alignment}>
                <table
                  width={typeof width === 'number' ? width : width}
                  cellPadding="0"
                  cellSpacing="0"
                  border="0"
                  style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
                >
                  {showHeader && (
                    <tr>
                      <td style={headerStyle}>
                        {headerContent || <div>Header</div>}
                      </td>
                    </tr>
                  )}
                  
                  <tr>
                    <td style={bodyStyle}>
                      {children}
                    </td>
                  </tr>
                  
                  {showFooter && (
                    <tr>
                      <td style={footerStyle}>
                        {footerContent || <div>Footer</div>}
                      </td>
                    </tr>
                  )}
                </table>
              </td>
            </tr>
          </table>
        </Component>
      );
    }
    
    // Div-based layout
    return (
      <Component
        ref={ref}
        className={`strive-email-layout ${className}`}
        style={containerStyle}
        {...rest}
      >
        {includeResetStyles && (
          <style type="text/css">{resetStyles}</style>
        )}
        
        {showPreheader && (
          <div style={preheaderStyle}>
            {preheaderText}
          </div>
        )}
        
        <div style={contentStyle}>
          {showHeader && (
            <div style={headerStyle}>
              {headerContent || <div>Header</div>}
            </div>
          )}
          
          <div style={bodyStyle}>
            {children}
          </div>
          
          {showFooter && (
            <div style={footerStyle}>
              {footerContent || <div>Footer</div>}
            </div>
          )}
        </div>
      </Component>
    );
  }
);

EmailLayout.displayName = 'EmailLayout';

/**
 * EmailSection component for creating sections within an email layout
 */
export interface EmailSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the email section
   */
  children: React.ReactNode;
  
  /**
   * The background color of the section
   */
  backgroundColor?: string;
  
  /**
   * The text color of the section
   */
  textColor?: string;
  
  /**
   * The padding of the section
   * @default '20px'
   */
  padding?: string | number;
  
  /**
   * Whether to use table-based layout
   * @default true
   */
  useTableLayout?: boolean;
  
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

export const EmailSection = forwardRef<HTMLDivElement, EmailSectionProps>(
  (
    {
      children,
      backgroundColor,
      textColor,
      padding = '20px',
      useTableLayout = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Section style
    const sectionStyle: React.CSSProperties = {
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      backgroundColor,
      color: textColor,
      ...style,
    };
    
    // Table-based layout
    if (useTableLayout) {
      return (
        <table
          ref={ref as React.Ref<HTMLTableElement>}
          className={`strive-email-section ${className}`}
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={sectionStyle}
          {...rest as any}
        >
          <tr>
            <td>
              {children}
            </td>
          </tr>
        </table>
      );
    }
    
    // Div-based layout
    return (
      <Component
        ref={ref}
        className={`strive-email-section ${className}`}
        style={sectionStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

EmailSection.displayName = 'EmailSection';

/**
 * EmailButton component for creating buttons within an email layout
 */
export interface EmailButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * The URL to link to
   */
  href: string;
  
  /**
   * The button text
   */
  children: React.ReactNode;
  
  /**
   * The background color of the button
   */
  backgroundColor?: string;
  
  /**
   * The text color of the button
   */
  textColor?: string;
  
  /**
   * The width of the button
   */
  width?: string | number;
  
  /**
   * The alignment of the button
   * @default 'center'
   */
  alignment?: EmailAlignment;
  
  /**
   * The padding of the button
   * @default '12px 24px'
   */
  padding?: string;
  
  /**
   * The border radius of the button
   * @default '4px'
   */
  borderRadius?: string | number;
  
  /**
   * Whether to use VML for Outlook compatibility
   * @default true
   */
  useVML?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

export const EmailButton = forwardRef<HTMLAnchorElement, EmailButtonProps>(
  (
    {
      href,
      children,
      backgroundColor = '#1976d2',
      textColor = '#ffffff',
      width,
      alignment = 'center',
      padding = '12px 24px',
      borderRadius = '4px',
      useVML = true,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Button style
    const buttonStyle: React.CSSProperties = {
      backgroundColor,
      color: textColor,
      display: 'inline-block',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '1.5',
      textAlign: 'center',
      textDecoration: 'none',
      padding,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      width: typeof width === 'number' ? `${width}px` : width,
      WebkitTextSizeAdjust: 'none',
      ...style,
    };
    
    // Table cell style
    const cellStyle: React.CSSProperties = {
      textAlign: alignment,
      padding: '10px 0',
    };
    
    // VML for Outlook
    const vml = useVML
      ? `
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:40px;v-text-anchor:middle;width:${width || '200px'};" arcsize="10%" stroke="f" fillcolor="${backgroundColor}">
          <w:anchorlock/>
          <center>
        <![endif]-->
        <a href="${href}" style="background-color:${backgroundColor};border-radius:${typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius};color:${textColor};display:inline-block;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:${width || '200px'};-webkit-text-size-adjust:none;">${children}</a>
        <!--[if mso]>
          </center>
        </v:roundrect>
        <![endif]-->
      `
      : null;
    
    return (
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        border="0"
        className={`strive-email-button ${className}`}
      >
        <tr>
          <td style={cellStyle}>
            {useVML ? (
              <div dangerouslySetInnerHTML={{ __html: vml || '' }} />
            ) : (
              <a
                ref={ref}
                href={href}
                style={buttonStyle}
                {...rest}
              >
                {children}
              </a>
            )}
          </td>
        </tr>
      </table>
    );
  }
);

EmailButton.displayName = 'EmailButton';
