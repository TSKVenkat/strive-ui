import React, { forwardRef, useState, useEffect } from 'react';

export type MobileViewport = 'device-width' | number;
export type MobileOrientation = 'portrait' | 'landscape' | 'both';
export type MobileTheme = 'light' | 'dark' | 'system' | 'custom';
export type MobileNavPosition = 'top' | 'bottom' | 'none';

export interface MobileLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the mobile layout
   */
  children: React.ReactNode;
  
  /**
   * The viewport width
   * @default 'device-width'
   */
  viewport?: MobileViewport;
  
  /**
   * The maximum width of the layout
   * @default '480px'
   */
  maxWidth?: string | number;
  
  /**
   * The supported orientation
   * @default 'both'
   */
  orientation?: MobileOrientation;
  
  /**
   * Whether to lock the orientation
   * @default false
   */
  lockOrientation?: boolean;
  
  /**
   * The theme of the mobile layout
   * @default 'light'
   */
  theme?: MobileTheme;
  
  /**
   * Custom theme colors when theme is set to 'custom'
   */
  customTheme?: {
    backgroundColor?: string;
    textColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
    surfaceColor?: string;
  };
  
  /**
   * Whether to show a status bar
   * @default false
   */
  showStatusBar?: boolean;
  
  /**
   * The content for the status bar
   */
  statusBarContent?: React.ReactNode;
  
  /**
   * The position of the navigation bar
   * @default 'bottom'
   */
  navPosition?: MobileNavPosition;
  
  /**
   * The content for the navigation bar
   */
  navContent?: React.ReactNode;
  
  /**
   * Whether to show a safe area inset
   * @default true
   */
  safeAreaInset?: boolean;
  
  /**
   * Whether to prevent overscroll/bounce effect
   * @default true
   */
  preventOverscroll?: boolean;
  
  /**
   * Whether to hide the address bar on scroll
   * @default true
   */
  hideAddressBar?: boolean;
  
  /**
   * Whether to use 100vh fix for mobile browsers
   * @default true
   */
  use100vhFix?: boolean;
  
  /**
   * Whether to show a device frame
   * @default false
   */
  showDeviceFrame?: boolean;
  
  /**
   * The type of device frame to show
   * @default 'phone'
   */
  deviceFrameType?: 'phone' | 'tablet';
  
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
 * MobileLayout component for creating mobile-optimized layouts
 */
export const MobileLayout = forwardRef<HTMLDivElement, MobileLayoutProps>(
  (
    {
      children,
      viewport = 'device-width',
      maxWidth = '480px',
      orientation = 'both',
      lockOrientation = false,
      theme = 'light',
      customTheme = {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        primaryColor: '#1976d2',
        secondaryColor: '#f5f5f5',
        surfaceColor: '#ffffff',
      },
      showStatusBar = false,
      statusBarContent,
      navPosition = 'bottom',
      navContent,
      safeAreaInset = true,
      preventOverscroll = true,
      hideAddressBar = true,
      use100vhFix = true,
      showDeviceFrame = false,
      deviceFrameType = 'phone',
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [viewHeight, setViewHeight] = useState('100vh');
    const [currentOrientation, setCurrentOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
    
    // Get theme colors
    const getThemeColors = () => {
      if (theme === 'custom') {
        return customTheme;
      }
      
      const themeToUse = theme === 'system' ? systemTheme : theme;
      
      return themeToUse === 'light'
        ? {
            backgroundColor: '#ffffff',
            textColor: '#333333',
            primaryColor: '#1976d2',
            secondaryColor: '#f5f5f5',
            surfaceColor: '#ffffff',
          }
        : {
            backgroundColor: '#121212',
            textColor: '#ffffff',
            primaryColor: '#90caf9',
            secondaryColor: '#333333',
            surfaceColor: '#1e1e1e',
          };
    };
    
    const themeColors = getThemeColors();
    
    // Fix for 100vh on mobile
    useEffect(() => {
      if (!use100vhFix) return;
      
      const updateViewHeight = () => {
        setViewHeight(`${window.innerHeight}px`);
      };
      
      updateViewHeight();
      window.addEventListener('resize', updateViewHeight);
      
      return () => {
        window.removeEventListener('resize', updateViewHeight);
      };
    }, [use100vhFix]);
    
    // Detect orientation
    useEffect(() => {
      if (orientation === 'both' && !lockOrientation) return;
      
      const updateOrientation = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        setCurrentOrientation(isPortrait ? 'portrait' : 'landscape');
      };
      
      updateOrientation();
      window.addEventListener('resize', updateOrientation);
      
      return () => {
        window.removeEventListener('resize', updateOrientation);
      };
    }, [orientation, lockOrientation]);
    
    // Detect system theme
    useEffect(() => {
      if (theme !== 'system') return;
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      updateSystemTheme(mediaQuery);
      mediaQuery.addEventListener('change', updateSystemTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', updateSystemTheme);
      };
    }, [theme]);
    
    // Hide address bar on page load
    useEffect(() => {
      if (!hideAddressBar) return;
      
      const hideAddressBarHandler = () => {
        if (document.documentElement.scrollHeight > window.innerHeight) {
          setTimeout(() => window.scrollTo(0, 1), 0);
        }
      };
      
      window.addEventListener('load', hideAddressBarHandler);
      window.addEventListener('orientationchange', hideAddressBarHandler);
      
      return () => {
        window.removeEventListener('load', hideAddressBarHandler);
        window.removeEventListener('orientationchange', hideAddressBarHandler);
      };
    }, [hideAddressBar]);
    
    // Lock orientation if needed
    useEffect(() => {
      if (!lockOrientation || !('screen' in window && 'orientation' in window.screen)) return;
      
      const lockScreenOrientation = async () => {
        try {
          if (orientation === 'portrait') {
            await (window.screen as any).orientation.lock('portrait');
          } else if (orientation === 'landscape') {
            await (window.screen as any).orientation.lock('landscape');
          }
        } catch (error) {
          console.error('Failed to lock orientation:', error);
        }
      };
      
      lockScreenOrientation();
      
      return () => {
        if ('screen' in window && 'orientation' in window.screen) {
          (window.screen as any).orientation.unlock();
        }
      };
    }, [lockOrientation, orientation]);
    
    // Prevent overscroll/bounce effect
    useEffect(() => {
      if (!preventOverscroll) return;
      
      const preventOverscrollHandler = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      document.addEventListener('touchmove', preventOverscrollHandler, { passive: false });
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        document.removeEventListener('touchmove', preventOverscrollHandler);
      };
    }, [preventOverscroll]);
    
    // Add viewport meta tag
    useEffect(() => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const viewportContent = viewport === 'device-width'
        ? `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`
        : `width=${viewport}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`;
      
      if (viewportMeta) {
        viewportMeta.setAttribute('content', viewportContent);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = viewportContent;
        document.head.appendChild(meta);
        
        return () => {
          document.head.removeChild(meta);
        };
      }
    }, [viewport]);
    
    // Check if orientation is supported
    const isOrientationSupported = () => {
      if (orientation === 'both') return true;
      return orientation === currentOrientation;
    };
    
    // Status bar style
    const statusBarStyle: React.CSSProperties = {
      height: '24px',
      backgroundColor: themeColors.primaryColor,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      fontSize: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    };
    
    // Navigation bar style
    const navBarStyle: React.CSSProperties = {
      height: '56px',
      backgroundColor: themeColors.surfaceColor,
      color: themeColors.textColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 10px',
      boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      bottom: 0,
      zIndex: 1000,
    };
    
    // Container style
    const containerStyle: React.CSSProperties = {
      backgroundColor: themeColors.backgroundColor,
      color: themeColors.textColor,
      width: '100%',
      height: use100vhFix ? viewHeight : '100vh',
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      ...(safeAreaInset && {
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }),
      ...style,
    };
    
    // Content style
    const contentStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      position: 'relative',
    };
    
    // Device frame styles
    const getDeviceFrameStyle = (): React.CSSProperties => {
      if (!showDeviceFrame) return {};
      
      const baseStyle: React.CSSProperties = {
        margin: '20px auto',
        borderRadius: deviceFrameType === 'phone' ? '36px' : '20px',
        boxShadow: '0 0 0 10px #111, 0 0 0 11px #333, 0 20px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      };
      
      if (deviceFrameType === 'phone') {
        return {
          ...baseStyle,
          width: '375px',
          height: '812px',
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 40px)',
        };
      }
      
      return {
        ...baseStyle,
        width: '768px',
        height: '1024px',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 40px)',
      };
    };
    
    // Default status bar content
    const defaultStatusBarContent = (
      <>
        <div>9:41 AM</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L6 22"></path>
              <path d="M10 6L10 22"></path>
              <path d="M14 10L14 22"></path>
              <path d="M18 14L18 22"></path>
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 10L21 10"></path>
              <path d="M3 10L15 10"></path>
              <path d="M12 19C12 19 18 13 18 9.99998C18 6.99996 15.3137 4.99996 12 4.99996C8.68629 4.99996 6 6.99996 6 9.99998C6 13 12 19 12 19Z"></path>
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7H17"></path>
              <path d="M7 12H17"></path>
              <path d="M7 17H17"></path>
            </svg>
          </div>
        </div>
      </>
    );
    
    // Default navigation content
    const defaultNavContent = (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: '12px', marginTop: '4px' }}>Home</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span style={{ fontSize: '12px', marginTop: '4px' }}>Search</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: '12px', marginTop: '4px' }}>Profile</span>
        </div>
      </>
    );
    
    // If orientation is not supported, show a message
    if (!isOrientationSupported()) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: themeColors.backgroundColor,
            color: themeColors.textColor,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12" y2="18"></line>
          </svg>
          <h2 style={{ marginTop: '20px' }}>Please rotate your device</h2>
          <p>This application is designed to be used in {orientation} orientation.</p>
        </div>
      );
    }
    
    // If using device frame
    if (showDeviceFrame) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px',
          }}
        >
          <div style={getDeviceFrameStyle()}>
            <Component
              ref={ref}
              className={`strive-mobile-layout ${className}`}
              style={containerStyle}
              {...rest}
            >
              {showStatusBar && (
                <div style={statusBarStyle}>
                  {statusBarContent || defaultStatusBarContent}
                </div>
              )}
              
              <div style={contentStyle}>
                {children}
              </div>
              
              {navPosition !== 'none' && (
                <div style={navBarStyle}>
                  {navContent || defaultNavContent}
                </div>
              )}
            </Component>
          </div>
        </div>
      );
    }
    
    // Regular layout
    return (
      <Component
        ref={ref}
        className={`strive-mobile-layout ${className}`}
        style={containerStyle}
        {...rest}
      >
        {showStatusBar && (
          <div style={statusBarStyle}>
            {statusBarContent || defaultStatusBarContent}
          </div>
        )}
        
        <div style={contentStyle}>
          {children}
        </div>
        
        {navPosition !== 'none' && (
          <div style={navBarStyle}>
            {navContent || defaultNavContent}
          </div>
        )}
      </Component>
    );
  }
);

MobileLayout.displayName = 'MobileLayout';

/**
 * MobileScreen component for creating screens within a mobile layout
 */
export interface MobileScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the mobile screen
   */
  children: React.ReactNode;
  
  /**
   * Whether the screen is active
   * @default true
   */
  active?: boolean;
  
  /**
   * The background color of the screen
   */
  backgroundColor?: string;
  
  /**
   * The padding of the screen
   * @default '16px'
   */
  padding?: string | number;
  
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

export const MobileScreen = forwardRef<HTMLDivElement, MobileScreenProps>(
  (
    {
      children,
      active = true,
      backgroundColor,
      padding = '16px',
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Screen style
    const screenStyle: React.CSSProperties = {
      display: active ? 'block' : 'none',
      backgroundColor,
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-mobile-screen ${className}`}
        style={screenStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

MobileScreen.displayName = 'MobileScreen';

/**
 * MobileTabBar component for creating a tab bar within a mobile layout
 */
export interface MobileTabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The tabs to render in the tab bar
   */
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  
  /**
   * The active tab ID
   */
  activeTab: string;
  
  /**
   * Callback when a tab is selected
   */
  onTabChange: (tabId: string) => void;
  
  /**
   * The position of the tab bar
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
  
  /**
   * The background color of the tab bar
   */
  backgroundColor?: string;
  
  /**
   * The text color of the tab bar
   */
  textColor?: string;
  
  /**
   * The active text color of the tab bar
   */
  activeColor?: string;
  
  /**
   * Whether to show labels
   * @default true
   */
  showLabels?: boolean;
  
  /**
   * Whether to show a divider
   * @default true
   */
  showDivider?: boolean;
  
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

export const MobileTabBar = forwardRef<HTMLDivElement, MobileTabBarProps>(
  (
    {
      tabs,
      activeTab,
      onTabChange,
      position = 'bottom',
      backgroundColor = '#ffffff',
      textColor = '#757575',
      activeColor = '#1976d2',
      showLabels = true,
      showDivider = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Tab bar style
    const tabBarStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor,
      padding: '8px 0',
      position: 'sticky',
      [position]: 0,
      zIndex: 1000,
      ...(showDivider && {
        borderTop: position === 'bottom' ? '1px solid #e0e0e0' : 'none',
        borderBottom: position === 'top' ? '1px solid #e0e0e0' : 'none',
      }),
      ...style,
    };
    
    // Tab style
    const getTabStyle = (isActive: boolean): React.CSSProperties => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      color: isActive ? activeColor : textColor,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    });
    
    return (
      <Component
        ref={ref}
        className={`strive-mobile-tab-bar ${className}`}
        style={tabBarStyle}
        {...rest}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <div
              key={tab.id}
              style={getTabStyle(isActive)}
              onClick={() => onTabChange(tab.id)}
              role="button"
              tabIndex={0}
              aria-selected={isActive}
              aria-label={tab.label}
            >
              {tab.icon}
              {showLabels && (
                <span style={{ fontSize: '12px', marginTop: '4px' }}>
                  {tab.label}
                </span>
              )}
            </div>
          );
        })}
      </Component>
    );
  }
);

MobileTabBar.displayName = 'MobileTabBar';
