import React, { forwardRef } from 'react';

export type DashboardGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type DashboardAreaTemplate = string;

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The dashboard items to render
   */
  children: React.ReactNode;
  
  /**
   * CSS grid template areas for the dashboard layout
   * @example '"header header" "sidebar content" "footer footer"'
   */
  areas?: DashboardAreaTemplate;
  
  /**
   * CSS grid template columns for the dashboard layout
   * @default '1fr'
   * @example 'repeat(3, 1fr)' or '250px 1fr' or 'auto 1fr auto'
   */
  columns?: string;
  
  /**
   * CSS grid template rows for the dashboard layout
   * @default 'auto'
   * @example 'auto 1fr auto' or 'repeat(3, auto)'
   */
  rows?: string;
  
  /**
   * Gap between dashboard items
   * @default 'md'
   */
  gap?: DashboardGap;
  
  /**
   * Horizontal gap between dashboard items
   */
  columnGap?: DashboardGap;
  
  /**
   * Vertical gap between dashboard items
   */
  rowGap?: DashboardGap;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether to fill the container height
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
 * DashboardLayout component for creating dashboard layouts using CSS Grid
 */
export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      areas,
      columns = '1fr',
      rows = 'auto',
      gap = 'md',
      columnGap,
      rowGap,
      fullWidth = true,
      fullHeight = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: DashboardGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Build the style object
    const dashboardStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: columns,
      gridTemplateRows: rows,
      ...(areas && { gridTemplateAreas: areas }),
      ...(gap !== 'none' && !columnGap && !rowGap && { gap: getGapValue(gap) }),
      ...(columnGap && { columnGap: getGapValue(columnGap) }),
      ...(rowGap && { rowGap: getGapValue(rowGap) }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={`strive-dashboard-layout ${className}`}
        style={dashboardStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';

export interface DashboardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the dashboard item
   */
  children?: React.ReactNode;
  
  /**
   * CSS grid area for the dashboard item
   * @example 'header' or 'sidebar' or 'content'
   */
  area?: string;
  
  /**
   * CSS grid column for the dashboard item
   * @example '1 / 3' or 'span 2' or '1 / -1'
   */
  column?: string;
  
  /**
   * CSS grid row for the dashboard item
   * @example '1 / 3' or 'span 2' or '1 / -1'
   */
  row?: string;
  
  /**
   * Background color of the dashboard item
   */
  backgroundColor?: string;
  
  /**
   * Whether to add a border to the dashboard item
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Whether to add a shadow to the dashboard item
   * @default false
   */
  shadowed?: boolean;
  
  /**
   * Whether to add padding to the dashboard item
   * @default true
   */
  padding?: boolean | string;
  
  /**
   * Whether to add rounded corners to the dashboard item
   * @default false
   */
  rounded?: boolean | string;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * DashboardItem component for individual items within a DashboardLayout
 */
export const DashboardItem = forwardRef<HTMLDivElement, DashboardItemProps>(
  (
    {
      children,
      area,
      column,
      row,
      backgroundColor,
      bordered = false,
      shadowed = false,
      padding = true,
      rounded = false,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const itemStyle: React.CSSProperties = {
      ...(area && { gridArea: area }),
      ...(column && { gridColumn: column }),
      ...(row && { gridRow: row }),
      ...(backgroundColor && { backgroundColor }),
      ...(bordered && { border: '1px solid #e0e0e0' }),
      ...(shadowed && { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }),
      ...(padding && { padding: typeof padding === 'string' ? padding : '1rem' }),
      ...(rounded && { borderRadius: typeof rounded === 'string' ? rounded : '4px' }),
      overflow: 'auto',
      ...style,
    };

    return (
      <div
        ref={ref}
        className={`strive-dashboard-item ${className}`}
        style={itemStyle}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DashboardItem.displayName = 'DashboardItem';

export interface DashboardHeaderProps extends Omit<DashboardItemProps, 'title'> {
  /**
   * Title to display in the header
   */
  title?: React.ReactNode;
  
  /**
   * Actions to display in the header (typically buttons or menus)
   */
  actions?: React.ReactNode;
  
  /**
   * Logo to display in the header
   */
  logo?: React.ReactNode;
  
  /**
   * User information to display in the header
   */
  userInfo?: React.ReactNode;
  
  /**
   * Whether to make the header sticky
   * @default false
   */
  sticky?: boolean;
}

/**
 * DashboardHeader component for the header section of a dashboard
 */
export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  (
    {
      children,
      title,
      actions,
      logo,
      userInfo,
      sticky = false,
      area = 'header',
      column = '1 / -1',
      backgroundColor = '#ffffff',
      bordered = true,
      shadowed = true,
      padding = '0.5rem 1rem',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      ...(sticky && {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }),
      ...style,
    };
    
    const titleStyle: React.CSSProperties = {
      fontWeight: 'bold',
      fontSize: '1.25rem',
      margin: 0,
    };

    return (
      <DashboardItem
        ref={ref}
        area={area}
        column={column}
        backgroundColor={backgroundColor}
        bordered={bordered}
        shadowed={shadowed}
        padding={padding}
        className={`strive-dashboard-header ${className}`}
        style={headerStyle}
        {...rest}
      >
        <div className="strive-dashboard-header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {logo && <div className="strive-dashboard-header-logo">{logo}</div>}
          {title && <h1 className="strive-dashboard-header-title" style={titleStyle}>{title}</h1>}
        </div>
        
        {children}
        
        <div className="strive-dashboard-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {actions && <div className="strive-dashboard-header-actions">{actions}</div>}
          {userInfo && <div className="strive-dashboard-header-user">{userInfo}</div>}
        </div>
      </DashboardItem>
    );
  }
);

DashboardHeader.displayName = 'DashboardHeader';

export interface DashboardSidebarProps extends DashboardItemProps {
  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Width of the sidebar when expanded
   * @default '250px'
   */
  width?: string | number;
  
  /**
   * Width of the sidebar when collapsed
   * @default '64px'
   */
  collapsedWidth?: string | number;
  
  /**
   * Whether to make the sidebar sticky
   * @default true
   */
  sticky?: boolean;
}

/**
 * DashboardSidebar component for the sidebar section of a dashboard
 */
export const DashboardSidebar = forwardRef<HTMLDivElement, DashboardSidebarProps>(
  (
    {
      children,
      collapsed = false,
      width = '250px',
      collapsedWidth = '64px',
      sticky = true,
      area = 'sidebar',
      backgroundColor = '#f5f5f5',
      bordered = true,
      shadowed = true,
      padding = true,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const sidebarStyle: React.CSSProperties = {
      width: collapsed ? collapsedWidth : width,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      ...(sticky && {
        position: 'sticky',
        top: '64px', // Assuming header height is 64px
        height: 'calc(100vh - 64px)',
        zIndex: 90,
      }),
      ...style,
    };

    return (
      <DashboardItem
        ref={ref}
        area={area}
        backgroundColor={backgroundColor}
        bordered={bordered}
        shadowed={shadowed}
        padding={padding}
        className={`strive-dashboard-sidebar ${collapsed ? 'strive-dashboard-sidebar-collapsed' : ''} ${className}`}
        style={sidebarStyle}
        {...rest}
      >
        {children}
      </DashboardItem>
    );
  }
);

DashboardSidebar.displayName = 'DashboardSidebar';

export interface DashboardContentProps extends DashboardItemProps {
  /**
   * Whether to add a scrollable container for the content
   * @default true
   */
  scrollable?: boolean;
}

/**
 * DashboardContent component for the main content section of a dashboard
 */
export const DashboardContent = forwardRef<HTMLDivElement, DashboardContentProps>(
  (
    {
      children,
      scrollable = true,
      area = 'content',
      backgroundColor = '#ffffff',
      bordered = false,
      shadowed = false,
      padding = true,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const contentStyle: React.CSSProperties = {
      ...(scrollable && {
        overflow: 'auto',
        height: '100%',
      }),
      ...style,
    };

    return (
      <DashboardItem
        ref={ref}
        area={area}
        backgroundColor={backgroundColor}
        bordered={bordered}
        shadowed={shadowed}
        padding={padding}
        className={`strive-dashboard-content ${className}`}
        style={contentStyle}
        {...rest}
      >
        {children}
      </DashboardItem>
    );
  }
);

DashboardContent.displayName = 'DashboardContent';

export interface DashboardFooterProps extends DashboardItemProps {
  /**
   * Copyright text to display in the footer
   */
  copyright?: React.ReactNode;
  
  /**
   * Links to display in the footer
   */
  links?: React.ReactNode;
  
  /**
   * Whether to make the footer sticky
   * @default false
   */
  sticky?: boolean;
}

/**
 * DashboardFooter component for the footer section of a dashboard
 */
export const DashboardFooter = forwardRef<HTMLDivElement, DashboardFooterProps>(
  (
    {
      children,
      copyright,
      links,
      sticky = false,
      area = 'footer',
      column = '1 / -1',
      backgroundColor = '#f5f5f5',
      bordered = true,
      shadowed = false,
      padding = '0.5rem 1rem',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Build the style object
    const footerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '48px',
      ...(sticky && {
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
      }),
      ...style,
    };

    return (
      <DashboardItem
        ref={ref}
        area={area}
        column={column}
        backgroundColor={backgroundColor}
        bordered={bordered}
        shadowed={shadowed}
        padding={padding}
        className={`strive-dashboard-footer ${className}`}
        style={footerStyle}
        {...rest}
      >
        {copyright && <div className="strive-dashboard-footer-copyright">{copyright}</div>}
        
        {children}
        
        {links && <div className="strive-dashboard-footer-links">{links}</div>}
      </DashboardItem>
    );
  }
);

DashboardFooter.displayName = 'DashboardFooter';
