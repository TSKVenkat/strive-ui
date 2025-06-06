import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';

// Types
export interface DashboardLayoutContextProps {
  /**
   * Whether the sidebar is expanded
   */
  sidebarExpanded: boolean;
  /**
   * Toggle sidebar expanded state
   */
  toggleSidebar: () => void;
  /**
   * Expand the sidebar
   */
  expandSidebar: () => void;
  /**
   * Collapse the sidebar
   */
  collapseSidebar: () => void;
  /**
   * Current active route
   */
  activeRoute: string;
  /**
   * Set the active route
   */
  setActiveRoute: (route: string) => void;
  /**
   * Whether the sidebar is visible on mobile
   */
  mobileSidebarVisible: boolean;
  /**
   * Toggle mobile sidebar visibility
   */
  toggleMobileSidebar: () => void;
  /**
   * Whether the dashboard is in mobile view
   */
  isMobile: boolean;
  /**
   * Current theme mode
   */
  themeMode: 'light' | 'dark';
  /**
   * Toggle theme mode
   */
  toggleThemeMode: () => void;
}

export interface DashboardLayoutProps {
  /**
   * Initial sidebar expanded state
   */
  initialSidebarExpanded?: boolean;
  /**
   * Initial active route
   */
  initialActiveRoute?: string;
  /**
   * Initial theme mode
   */
  initialThemeMode?: 'light' | 'dark';
  /**
   * Breakpoint for mobile view (in px)
   */
  mobileBreakpoint?: number;
  /**
   * Whether to persist layout state in localStorage
   */
  persistState?: boolean;
  /**
   * Storage key for persisted state
   */
  storageKey?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Context
const DashboardLayoutContext = createContext<DashboardLayoutContextProps | undefined>(undefined);

/**
 * Hook to use dashboard layout context
 */
export const useDashboardLayout = (): DashboardLayoutContextProps => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayout must be used within a DashboardLayout component');
  }
  return context;
};

// Main component
const StyledDashboardLayout = styled(Box)`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
`;

/**
 * DashboardLayout is a flexible layout system for creating admin dashboards,
 * analytics interfaces, and other complex layouts.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  initialSidebarExpanded = true,
  initialActiveRoute = '/',
  initialThemeMode = 'light',
  mobileBreakpoint = 768,
  persistState = true,
  storageKey = 'strive-dashboard-layout',
  children
}) => {
  // Load persisted state if available
  const loadPersistedState = () => {
    if (persistState && typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          return {
            sidebarExpanded: parsedState.sidebarExpanded ?? initialSidebarExpanded,
            activeRoute: parsedState.activeRoute ?? initialActiveRoute,
            themeMode: parsedState.themeMode ?? initialThemeMode
          };
        }
      } catch (error) {
        console.error('Failed to load dashboard layout state:', error);
      }
    }
    return {
      sidebarExpanded: initialSidebarExpanded,
      activeRoute: initialActiveRoute,
      themeMode: initialThemeMode
    };
  };

  // State
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => loadPersistedState().sidebarExpanded);
  const [activeRoute, setActiveRoute] = useState<string>(() => loadPersistedState().activeRoute);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => loadPersistedState().themeMode);

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileBreakpoint]);

  // Persist state changes
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            sidebarExpanded,
            activeRoute,
            themeMode
          })
        );
      } catch (error) {
        console.error('Failed to save dashboard layout state:', error);
      }
    }
  }, [sidebarExpanded, activeRoute, themeMode, persistState, storageKey]);

  // Methods
  const toggleSidebar = () => setSidebarExpanded(prev => !prev);
  const expandSidebar = () => setSidebarExpanded(true);
  const collapseSidebar = () => setSidebarExpanded(false);
  const toggleMobileSidebar = () => setMobileSidebarVisible(prev => !prev);
  const toggleThemeMode = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  // Context value
  const contextValue: DashboardLayoutContextProps = {
    sidebarExpanded,
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    activeRoute,
    setActiveRoute,
    mobileSidebarVisible,
    toggleMobileSidebar,
    isMobile,
    themeMode,
    toggleThemeMode
  };

  return (
    <DashboardLayoutContext.Provider value={contextValue}>
      <StyledDashboardLayout data-theme={themeMode}>
        {children}
      </StyledDashboardLayout>
    </DashboardLayoutContext.Provider>
  );
};

// Subcomponents
export interface DashboardSidebarProps {
  /**
   * Width of the expanded sidebar
   */
  expandedWidth?: string;
  /**
   * Width of the collapsed sidebar
   */
  collapsedWidth?: string;
  /**
   * Logo component or element
   */
  logo?: React.ReactNode;
  /**
   * Collapsed logo component or element
   */
  collapsedLogo?: React.ReactNode;
  /**
   * Whether to show a toggle button
   */
  showToggleButton?: boolean;
  /**
   * Whether the sidebar has a fixed position
   */
  fixed?: boolean;
  /**
   * Custom toggle button component
   */
  toggleButton?: React.ReactNode;
  /**
   * Sidebar header component
   */
  header?: React.ReactNode;
  /**
   * Sidebar footer component
   */
  footer?: React.ReactNode;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const StyledSidebar = styled(motion.aside)<{
  $expanded: boolean;
  $expandedWidth: string;
  $collapsedWidth: string;
  $fixed: boolean;
  $isMobile: boolean;
}>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.common.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
  width: ${({ $expanded, $expandedWidth, $collapsedWidth, $isMobile }) => 
    $isMobile ? ($expanded ? '100%' : '0') : ($expanded ? $expandedWidth : $collapsedWidth)};
  position: ${({ $fixed }) => $fixed ? 'fixed' : 'relative'};
  left: 0;
  top: 0;
`;

const SidebarHeader = styled.div<{ $expanded: boolean }>`
  padding: ${({ theme, $expanded }) => $expanded ? theme.spacing[4] : `${theme.spacing[4]} ${theme.spacing[2]}`};
  display: flex;
  align-items: center;
  justify-content: ${({ $expanded }) => $expanded ? 'space-between' : 'center'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[2]};
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 2px;
  }
`;

const SidebarFooter = styled.div<{ $expanded: boolean }>`
  padding: ${({ theme, $expanded }) => $expanded ? theme.spacing[4] : `${theme.spacing[4]} ${theme.spacing[2]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: ${({ $expanded }) => $expanded ? 'flex-start' : 'center'};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[600]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
`;

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  expandedWidth = '280px',
  collapsedWidth = '80px',
  logo,
  collapsedLogo,
  showToggleButton = true,
  fixed = false,
  toggleButton,
  header,
  footer,
  css,
  children
}) => {
  const { 
    sidebarExpanded, 
    toggleSidebar, 
    isMobile, 
    mobileSidebarVisible,
    toggleMobileSidebar
  } = useDashboardLayout();
  
  // Determine if sidebar is visible
  const isVisible = isMobile ? mobileSidebarVisible : true;
  const isExpanded = isMobile ? mobileSidebarVisible : sidebarExpanded;
  
  // Default toggle button
  const defaultToggleButton = (
    <ToggleButton onClick={isMobile ? toggleMobileSidebar : toggleSidebar} aria-label="Toggle sidebar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {sidebarExpanded ? (
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor" />
        ) : (
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor" />
        )}
      </svg>
    </ToggleButton>
  );
  
  return (
    <>
      {isMobile && mobileSidebarVisible && (
        <Overlay 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleMobileSidebar}
        />
      )}
      
      <StyledSidebar
        $expanded={isExpanded}
        $expandedWidth={expandedWidth}
        $collapsedWidth={collapsedWidth}
        $fixed={fixed}
        $isMobile={isMobile}
        initial={isMobile ? { x: '-100%' } : false}
        animate={isMobile ? { x: mobileSidebarVisible ? 0 : '-100%' } : false}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={css}
      >
        {header ? (
          header
        ) : (
          <SidebarHeader $expanded={isExpanded}>
            {isExpanded ? logo : (collapsedLogo || logo)}
            {showToggleButton && !isMobile && (toggleButton || defaultToggleButton)}
          </SidebarHeader>
        )}
        
        <SidebarContent>
          {children}
        </SidebarContent>
        
        {footer && (
          <SidebarFooter $expanded={isExpanded}>
            {footer}
          </SidebarFooter>
        )}
      </StyledSidebar>
    </>
  );
};

export interface DashboardHeaderProps {
  /**
   * Header title
   */
  title?: React.ReactNode;
  /**
   * Whether to show a sidebar toggle button
   */
  showSidebarToggle?: boolean;
  /**
   * Custom sidebar toggle button
   */
  sidebarToggleButton?: React.ReactNode;
  /**
   * Whether the header has a fixed position
   */
  fixed?: boolean;
  /**
   * Header height
   */
  height?: string;
  /**
   * Actions to display on the right side
   */
  actions?: React.ReactNode;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const StyledHeader = styled(Box)<{ $fixed: boolean; $height: string }>`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.common.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  height: ${({ $height }) => $height};
  width: 100%;
  position: ${({ $fixed }) => $fixed ? 'fixed' : 'relative'};
  top: 0;
  z-index: 5;
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-right: ${({ theme }) => theme.spacing[3]};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  showSidebarToggle = true,
  sidebarToggleButton,
  fixed = true,
  height = '64px',
  actions,
  css,
  children
}) => {
  const { isMobile, toggleMobileSidebar } = useDashboardLayout();
  
  // Default mobile menu button
  const defaultMobileButton = (
    <MobileMenuButton onClick={toggleMobileSidebar} aria-label="Toggle menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
      </svg>
    </MobileMenuButton>
  );
  
  return (
    <StyledHeader $fixed={fixed} $height={height} css={css}>
      {isMobile && showSidebarToggle && (sidebarToggleButton || defaultMobileButton)}
      
      {title && (typeof title === 'string' ? <HeaderTitle>{title}</HeaderTitle> : title)}
      
      {children}
      
      {actions && <HeaderActions>{actions}</HeaderActions>}
    </StyledHeader>
  );
};

export interface DashboardContentProps {
  /**
   * Whether to add padding
   */
  padding?: boolean | string;
  /**
   * Whether the content should fill the available height
   */
  fullHeight?: boolean;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const StyledContent = styled(Box)<{ 
  $padding: boolean | string;
  $fullHeight: boolean;
  $headerHeight: string;
}>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $padding, theme }) => 
    typeof $padding === 'string' 
      ? $padding 
      : ($padding ? theme.spacing[4] : '0')
  };
  height: ${({ $fullHeight, $headerHeight }) => 
    $fullHeight ? `calc(100vh - ${$headerHeight})` : 'auto'
  };
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 4px;
  }
`;

export const DashboardContent: React.FC<DashboardContentProps> = ({
  padding = true,
  fullHeight = true,
  css,
  children
}) => {
  return (
    <StyledContent 
      $padding={padding} 
      $fullHeight={fullHeight}
      $headerHeight="64px"
      css={css}
    >
      {children}
    </StyledContent>
  );
};

export interface DashboardFooterProps {
  /**
   * Whether the footer has a fixed position
   */
  fixed?: boolean;
  /**
   * Footer height
   */
  height?: string;
  /**
   * Copyright text
   */
  copyright?: React.ReactNode;
  /**
   * Links to display
   */
  links?: Array<{
    label: string;
    href: string;
    target?: string;
  }>;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const StyledFooter = styled(Box)<{ $fixed: boolean; $height: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.common.white};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  height: ${({ $height }) => $height};
  width: 100%;
  position: ${({ $fixed }) => $fixed ? 'fixed' : 'relative'};
  bottom: 0;
  z-index: 5;
`;

const Copyright = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FooterLink = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: underline;
  }
`;

export const DashboardFooter: React.FC<DashboardFooterProps> = ({
  fixed = false,
  height = '48px',
  copyright,
  links,
  css,
  children
}) => {
  return (
    <StyledFooter $fixed={fixed} $height={height} css={css}>
      {copyright && <Copyright>{copyright}</Copyright>}
      
      {children}
      
      {links && (
        <FooterLinks>
          {links.map((link, index) => (
            <FooterLink 
              key={index} 
              href={link.href} 
              target={link.target || '_self'}
            >
              {link.label}
            </FooterLink>
          ))}
        </FooterLinks>
      )}
    </StyledFooter>
  );
};

export interface DashboardNavItemProps {
  /**
   * Item label
   */
  label: string;
  /**
   * Item icon
   */
  icon?: React.ReactNode;
  /**
   * Item route or identifier
   */
  route?: string;
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether the item has a notification badge
   */
  hasNotification?: boolean;
  /**
   * Notification count
   */
  notificationCount?: number;
  /**
   * Custom badge content
   */
  badge?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements (for nested items)
   */
  children?: React.ReactNode;
}

const StyledNavItem = styled.div<{ 
  $active: boolean;
  $disabled: boolean;
  $hasChildren: boolean;
  $expanded: boolean;
}>`
  position: relative;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  &:hover {
    .nav-item-content {
      background-color: ${({ theme, $active, $disabled }) => 
        $disabled ? 'transparent' : ($active ? theme.colors.primary[50] : theme.colors.neutral[100])
      };
    }
  }
`;

const NavItemContent = styled.div<{ $active: boolean; $expanded: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.primary[50] : 'transparent'
  };
  transition: background-color 0.2s ease;
`;

const NavItemIcon = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary.main : theme.colors.neutral[700]
  };
`;

const NavItemLabel = styled.span<{ $active: boolean; $expanded: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme, $active }) => 
    $active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular
  };
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary.main : theme.colors.neutral[900]
  };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ $expanded }) => $expanded ? 1 : 0};
  max-width: ${({ $expanded }) => $expanded ? '100%' : 0};
  transition: max-width 0.3s ease, opacity 0.2s ease;
`;

const NavItemBadge = styled.div<{ $hasCount: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  background-color: ${({ theme, $hasCount }) => 
    $hasCount ? theme.colors.primary.main : theme.colors.error.main
  };
  color: ${({ theme }) => theme.colors.common.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  min-width: ${({ $hasCount }) => $hasCount ? '20px' : '8px'};
  height: ${({ $hasCount }) => $hasCount ? '20px' : '8px'};
  border-radius: ${({ $hasCount }) => $hasCount ? '10px' : '50%'};
  padding: ${({ $hasCount }) => $hasCount ? '0 6px' : 0};
`;

const ChildrenContainer = styled(motion.div)`
  margin-left: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding-left: ${({ theme }) => theme.spacing[2]};
  border-left: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  label,
  icon,
  route,
  active: propActive,
  disabled = false,
  hasNotification = false,
  notificationCount,
  badge,
  onClick,
  css,
  children
}) => {
  const { activeRoute, setActiveRoute, sidebarExpanded } = useDashboardLayout();
  const [expanded, setExpanded] = useState(false);
  
  // Determine if item is active
  const active = propActive !== undefined ? propActive : (route ? activeRoute === route : false);
  
  // Handle click
  const handleClick = () => {
    if (disabled) return;
    
    if (children) {
      setExpanded(prev => !prev);
    }
    
    if (route) {
      setActiveRoute(route);
    }
    
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <StyledNavItem
      $active={active}
      $disabled={disabled}
      $hasChildren={!!children}
      $expanded={sidebarExpanded}
      style={css}
    >
      <NavItemContent 
        className="nav-item-content"
        $active={active}
        $expanded={sidebarExpanded}
        onClick={handleClick}
      >
        {icon && <NavItemIcon $active={active}>{icon}</NavItemIcon>}
        
        <NavItemLabel $active={active} $expanded={sidebarExpanded}>
          {label}
        </NavItemLabel>
        
        {(hasNotification || notificationCount || badge) && sidebarExpanded && (
          badge || (
            <NavItemBadge $hasCount={!!notificationCount}>
              {notificationCount || ''}
            </NavItemBadge>
          )
        )}
        
        {children && sidebarExpanded && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              marginLeft: 'auto',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <path
              d="M7 10l5 5 5-5z"
              fill="currentColor"
            />
          </svg>
        )}
      </NavItemContent>
      
      {children && sidebarExpanded && (
        <AnimatePresence>
          {expanded && (
            <ChildrenContainer
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </ChildrenContainer>
          )}
        </AnimatePresence>
      )}
    </StyledNavItem>
  );
};

// Export all components
export default {
  DashboardLayout,
  DashboardSidebar,
  DashboardHeader,
  DashboardContent,
  DashboardFooter,
  DashboardNavItem,
  useDashboardLayout
};
