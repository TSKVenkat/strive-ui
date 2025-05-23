import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';

// Types
export interface NavigationItem {
  /**
   * Item label
   */
  label: string;
  /**
   * Item URL
   */
  url?: string;
  /**
   * Item icon
   */
  icon?: React.ReactNode;
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Item children (for dropdown menus)
   */
  children?: NavigationItem[];
  /**
   * Custom render function
   */
  render?: (item: NavigationItem, index: number) => React.ReactNode;
  /**
   * Additional props
   */
  [key: string]: any;
}

export interface ResponsiveNavigationProps {
  /**
   * Navigation items
   */
  items: NavigationItem[];
  /**
   * Navigation logo
   */
  logo?: React.ReactNode;
  /**
   * Mobile breakpoint
   */
  mobileBreakpoint?: string;
  /**
   * Whether to show the mobile menu
   */
  showMobileMenu?: boolean;
  /**
   * Mobile menu toggle handler
   */
  onMobileMenuToggle?: (isOpen: boolean) => void;
  /**
   * Navigation variant
   */
  variant?: 'horizontal' | 'vertical';
  /**
   * Whether to show the search bar
   */
  showSearch?: boolean;
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
  /**
   * Search handler
   */
  onSearch?: (query: string) => void;
  /**
   * Whether to show user menu
   */
  showUserMenu?: boolean;
  /**
   * User menu items
   */
  userMenuItems?: NavigationItem[];
  /**
   * User avatar
   */
  userAvatar?: React.ReactNode;
  /**
   * User name
   */
  userName?: string;
  /**
   * Whether to show notifications
   */
  showNotifications?: boolean;
  /**
   * Notification count
   */
  notificationCount?: number;
  /**
   * Notification handler
   */
  onNotificationClick?: () => void;
  /**
   * Whether to stick the navigation to the top
   */
  sticky?: boolean;
  /**
   * Whether to show a shadow
   */
  shadow?: boolean;
  /**
   * Whether to show a border
   */
  bordered?: boolean;
  /**
   * Whether to use a transparent background
   */
  transparent?: boolean;
  /**
   * Navigation color scheme
   */
  colorScheme?: 'light' | 'dark' | 'primary';
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Context
interface NavigationContextProps {
  isMobile: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  colorScheme: 'light' | 'dark' | 'primary';
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Styled components
const NavContainer = styled(Box)<{ 
  $sticky: boolean; 
  $shadow: boolean; 
  $bordered: boolean;
  $transparent: boolean;
  $colorScheme: string;
}>`
  position: ${({ $sticky }) => $sticky ? 'sticky' : 'relative'};
  top: 0;
  z-index: 1000;
  width: 100%;
  box-shadow: ${({ $shadow, theme }) => $shadow ? theme.shadows.md : 'none'};
  border-bottom: ${({ $bordered, theme }) => $bordered ? `1px solid ${theme.colors.neutral[200]}` : 'none'};
  background-color: ${({ $transparent, $colorScheme, theme }) => {
    if ($transparent) return 'transparent';
    switch ($colorScheme) {
      case 'dark':
        return theme.colors.neutral[900];
      case 'primary':
        return theme.colors.primary.main;
      default:
        return theme.colors.common.white;
    }
  }};
  color: ${({ $colorScheme, theme }) => {
    switch ($colorScheme) {
      case 'dark':
        return theme.colors.common.white;
      case 'primary':
        return theme.colors.common.white;
      default:
        return theme.colors.neutral[900];
    }
  }};
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing[4]};
`;

const NavItems = styled.ul<{ $isMobile: boolean; $isOpen: boolean; $variant: string; $colorScheme: string }>`
  display: ${({ $isMobile, $isOpen, $variant }) => 
    $isMobile 
      ? ($isOpen ? 'flex' : 'none') 
      : ($variant === 'horizontal' ? 'flex' : 'block')
  };
  flex-direction: ${({ $isMobile, $variant }) => 
    $isMobile || $variant === 'vertical' ? 'column' : 'row'
  };
  list-style: none;
  margin: 0;
  padding: 0;
  
  ${({ $isMobile, theme }) => $isMobile && `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${theme.colors.common.white};
    box-shadow: ${theme.shadows.md};
    padding: ${theme.spacing[2]};
    z-index: 1000;
  `}
  
  ${({ $isMobile, $colorScheme, theme }) => $isMobile && `
    background-color: ${
      $colorScheme === 'dark' 
        ? theme.colors.neutral[900] 
        : $colorScheme === 'primary' 
          ? theme.colors.primary.main 
          : theme.colors.common.white
    };
  `}
`;

const NavItem = styled.li<{ $active: boolean; $disabled: boolean; $colorScheme: string }>`
  margin: ${({ theme }) => `0 ${theme.spacing[2]}`};
  
  &:first-child {
    margin-left: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
  
  a {
    display: block;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    text-decoration: none;
    font-weight: ${({ $active, theme }) => $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
    color: ${({ $active, $disabled, $colorScheme, theme }) => {
      if ($disabled) {
        return $colorScheme === 'light' ? theme.colors.neutral[400] : theme.colors.neutral[500];
      }
      
      if ($active) {
        switch ($colorScheme) {
          case 'dark':
            return theme.colors.primary.main;
          case 'primary':
            return theme.colors.common.white;
          default:
            return theme.colors.primary.main;
        }
      }
      
      switch ($colorScheme) {
        case 'dark':
          return theme.colors.neutral[300];
        case 'primary':
          return theme.colors.common.white;
        default:
          return theme.colors.neutral[700];
      }
    }};
    background-color: ${({ $active, $colorScheme, theme }) => {
      if ($active) {
        switch ($colorScheme) {
          case 'dark':
            return 'rgba(255, 255, 255, 0.1)';
          case 'primary':
            return 'rgba(255, 255, 255, 0.2)';
          default:
            return theme.colors.primary[50];
        }
      }
      return 'transparent';
    }};
    cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
    opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${({ $active, $disabled, $colorScheme, theme }) => {
        if ($disabled) return 'transparent';
        
        if ($active) {
          switch ($colorScheme) {
            case 'dark':
              return 'rgba(255, 255, 255, 0.15)';
            case 'primary':
              return 'rgba(255, 255, 255, 0.25)';
            default:
              return theme.colors.primary[100];
          }
        }
        
        switch ($colorScheme) {
          case 'dark':
            return 'rgba(255, 255, 255, 0.05)';
          case 'primary':
            return 'rgba(255, 255, 255, 0.1)';
          default:
            return theme.colors.neutral[100];
        }
      }};
    }
  }
`;

const NavItemWithChildren = styled(NavItem)`
  position: relative;
`;

const NavItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const NavItemIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
`;

const NavItemLabel = styled.span``;

const NavItemCaret = styled.span<{ $isOpen: boolean }>`
  margin-left: ${({ theme }) => theme.spacing[1]};
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const Dropdown = styled(motion.ul)<{ $colorScheme: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  list-style: none;
  margin: ${({ theme }) => theme.spacing[1]} 0 0;
  padding: ${({ theme }) => theme.spacing[1]};
  background-color: ${({ theme, $colorScheme }) => 
    $colorScheme === 'dark' 
      ? theme.colors.neutral[800] 
      : $colorScheme === 'primary' 
        ? theme.colors.primary.dark 
        : theme.colors.common.white
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 1000;
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean; $colorScheme: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.neutral[700] 
      : theme.colors.common.white
  };
  
  &:hover {
    color: ${({ $colorScheme, theme }) => 
      $colorScheme === 'light' 
        ? theme.colors.neutral[900] 
        : theme.colors.common.white
    };
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 0 ${({ theme }) => theme.spacing[2]};
`;

const SearchInput = styled.input<{ $colorScheme: string }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  padding-left: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.neutral[300] 
      : 'rgba(255, 255, 255, 0.2)'
  };
  background-color: ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.common.white 
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.neutral[900] 
      : theme.colors.common.white
  };
  
  &::placeholder {
    color: ${({ $colorScheme, theme }) => 
      $colorScheme === 'light' 
        ? theme.colors.neutral[500] 
        : 'rgba(255, 255, 255, 0.5)'
    };
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SearchIcon = styled.span<{ $colorScheme: string }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.neutral[500] 
      : 'rgba(255, 255, 255, 0.5)'
  };
`;

const UserMenuContainer = styled.div`
  position: relative;
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const UserMenuTrigger = styled.button<{ $colorScheme: string }>`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $colorScheme, theme }) => 
    $colorScheme === 'light' 
      ? theme.colors.neutral[700] 
      : theme.colors.common.white
  };
  
  &:hover {
    background-color: ${({ $colorScheme, theme }) => 
      $colorScheme === 'light' 
        ? theme.colors.neutral[100] 
        : 'rgba(255, 255, 255, 0.1)'
    };
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: ${({ theme }) => theme.spacing[2]};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  margin-right: ${({ theme }) => theme.spacing[1]};
`;

const NotificationBadge = styled.span<{ $colorScheme: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.error.main};
  color: ${({ theme }) => theme.colors.common.white};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  position: absolute;
  top: -5px;
  right: -5px;
`;

/**
 * ResponsiveNavigation component provides a flexible and responsive navigation system
 * that adapts to different screen sizes and supports various features like dropdowns,
 * search, user menu, and notifications.
 */
export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items = [],
  logo,
  mobileBreakpoint = '768px',
  showMobileMenu,
  onMobileMenuToggle,
  variant = 'horizontal',
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  showUserMenu = false,
  userMenuItems = [],
  userAvatar,
  userName,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  sticky = false,
  shadow = true,
  bordered = false,
  transparent = false,
  colorScheme = 'light',
  css,
  children
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      const breakpoint = parseInt(mobileBreakpoint.replace('px', ''));
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileBreakpoint]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveItemId(null);
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(newState);
    }
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(false);
    }
  };
  
  // Toggle dropdown
  const toggleDropdown = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };
  
  // Handle notification click
  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };
  
  // Render nav items
  const renderNavItems = (navItems: NavigationItem[], level = 0) => {
    return navItems.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const itemId = `nav-item-${level}-${index}`;
      const isActive = activeItemId === itemId;
      
      if (hasChildren) {
        return (
          <NavItemWithChildren 
            key={index} 
            $active={item.active || false} 
            $disabled={item.disabled || false}
            $colorScheme={colorScheme}
          >
            <a 
              href={item.url || '#'} 
              onClick={(e) => {
                e.preventDefault();
                if (!item.disabled) {
                  toggleDropdown(itemId);
                }
              }}
            >
              <NavItemContent>
                {item.icon && <NavItemIcon>{item.icon}</NavItemIcon>}
                <NavItemLabel>{item.label}</NavItemLabel>
                <NavItemCaret $isOpen={isActive}>▼</NavItemCaret>
              </NavItemContent>
            </a>
            
            <AnimatePresence>
              {isActive && (
                <Dropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  $colorScheme={colorScheme}
                >
                  {renderNavItems(item.children, level + 1)}
                </Dropdown>
              )}
            </AnimatePresence>
          </NavItemWithChildren>
        );
      }
      
      return (
        <NavItem 
          key={index} 
          $active={item.active || false} 
          $disabled={item.disabled || false}
          $colorScheme={colorScheme}
        >
          {item.render ? (
            item.render(item, index)
          ) : (
            <a 
              href={item.url || '#'} 
              onClick={(e) => {
                if (item.disabled || !item.url) {
                  e.preventDefault();
                }
                
                if (isMobile) {
                  closeMenu();
                }
              }}
            >
              <NavItemContent>
                {item.icon && <NavItemIcon>{item.icon}</NavItemIcon>}
                <NavItemLabel>{item.label}</NavItemLabel>
              </NavItemContent>
            </a>
          )}
        </NavItem>
      );
    });
  };
  
  // Context value
  const contextValue = {
    isMobile,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    activeItemId,
    setActiveItemId,
    colorScheme
  };
  
  return (
    <NavigationContext.Provider value={contextValue}>
      <NavContainer
        ref={navRef}
        $sticky={sticky}
        $shadow={shadow}
        $bordered={bordered}
        $transparent={transparent}
        $colorScheme={colorScheme}
        css={css}
      >
        <NavInner>
          {logo && <NavLogo>{logo}</NavLogo>}
          
          {isMobile && (
            <MobileMenuButton 
              onClick={toggleMenu} 
              $isOpen={isMenuOpen}
              $colorScheme={colorScheme}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
                </svg>
              )}
            </MobileMenuButton>
          )}
          
          <NavItems 
            $isMobile={isMobile} 
            $isOpen={isMenuOpen || !!showMobileMenu} 
            $variant={variant}
            $colorScheme={colorScheme}
          >
            {renderNavItems(items)}
          </NavItems>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {showSearch && (
              <SearchContainer>
                <SearchIcon $colorScheme={colorScheme}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" />
                  </svg>
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearch}
                  $colorScheme={colorScheme}
                />
              </SearchContainer>
            )}
            
            {showNotifications && (
              <UserMenuContainer>
                <UserMenuTrigger 
                  onClick={handleNotificationClick}
                  $colorScheme={colorScheme}
                  aria-label="Notifications"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
                  </svg>
                  
                  {notificationCount > 0 && (
                    <NotificationBadge $colorScheme={colorScheme}>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </NotificationBadge>
                  )}
                </UserMenuTrigger>
              </UserMenuContainer>
            )}
            
            {showUserMenu && (
              <UserMenuContainer>
                <UserMenuTrigger 
                  onClick={toggleUserMenu}
                  $colorScheme={colorScheme}
                  aria-label="User menu"
                >
                  {userAvatar && <UserAvatar>{userAvatar}</UserAvatar>}
                  {userName && <UserName>{userName}</UserName>}
                  <NavItemCaret $isOpen={isUserMenuOpen}>▼</NavItemCaret>
                </UserMenuTrigger>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <Dropdown
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      $colorScheme={colorScheme}
                      style={{ right: 0, left: 'auto' }}
                    >
                      {renderNavItems(userMenuItems)}
                    </Dropdown>
                  )}
                </AnimatePresence>
              </UserMenuContainer>
            )}
          </div>
        </NavInner>
        
        {children}
      </NavContainer>
    </NavigationContext.Provider>
  );
};

export default ResponsiveNavigation;
