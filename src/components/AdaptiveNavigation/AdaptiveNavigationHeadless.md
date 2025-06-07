# AdaptiveNavigationHeadless

A headless implementation of an adaptive navigation component that automatically adjusts its layout and behavior based on device type, screen size, orientation, and user preferences. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Responsive**: Automatically adapts to different screen sizes
- **Device-aware**: Optimizes layout for different device types
- **Orientation-aware**: Adjusts based on portrait or landscape orientation
- **User preference support**: Remembers user's preferred layout
- **Multiple layouts**: Supports horizontal, vertical, bottom, floating, sidebar, and drawer layouts
- **Icons-only mode**: Collapses to icons-only on smaller screens

## Basic Usage

```jsx
import { AdaptiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(AdaptiveNavigation)`
  display: flex;
  flex-direction: ${props => props['data-layout'] === 'horizontal' ? 'row' : 'column'};
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  ${props => props['data-layout'] === 'bottom' && `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
  `}
  
  ${props => props['data-layout'] === 'sidebar' && `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    padding-top: 60px;
  `}
  
  ${props => props['data-layout'] === 'drawer' && `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    transform: translateX(${props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 1000;
  `}
  
  ${props => props['data-layout'] === 'floating' && `
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
    border-radius: 8px;
    z-index: 1000;
  `}
`;

const NavItem = styled(AdaptiveNavigation.Item)`
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &[aria-current="true"] {
    color: #1890ff;
    background-color: #e6f7ff;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Icon = styled(AdaptiveNavigation.Icon)`
  font-size: 20px;
`;

const Label = styled(AdaptiveNavigation.Label)`
  font-size: 14px;
`;

const Toggle = styled(AdaptiveNavigation.Toggle)`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: ${props => ['sidebar', 'drawer'].includes(props['data-layout']) ? 'block' : 'none'};
`;

function MyAdaptiveNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
    },
  ];

  return (
    <>
      <AdaptiveNavigation
        items={items}
        defaultActiveId="home"
        adaptToScreenSize
        adaptToDeviceType
        adaptToOrientation
        breakpoints={{
          mobile: 'bottom',
          tablet: 'sidebar',
          desktop: 'horizontal',
        }}
      >
        {({ currentLayout, isOpen }) => (
          <>
            <Toggle>
              {isOpen ? '✕' : '☰'}
            </Toggle>
            
            {items.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <Label item={item} />
              </NavItem>
            ))}
          </>
        )}
      </AdaptiveNavigation>
      
      {/* Main content */}
      <div style={{ padding: '20px', marginBottom: '60px' }}>
        <h1>My App</h1>
        <p>Content goes here...</p>
      </div>
    </>
  );
}
```

## Drawer Layout Example

```jsx
import { AdaptiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(AdaptiveNavigation)`
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: white;
  
  ${props => props['data-layout'] === 'drawer' && `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    padding: 20px;
    transform: translateX(${props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 1000;
  `}
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavItem = styled(AdaptiveNavigation.Item)`
  text-decoration: none;
  color: #e0e0e0;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &[aria-current="true"] {
    background-color: #2c2c2c;
    color: #1890ff;
  }
  
  &:hover {
    background-color: #2c2c2c;
  }
`;

const Icon = styled(AdaptiveNavigation.Icon)`
  font-size: 20px;
`;

const Label = styled(AdaptiveNavigation.Label)`
  font-size: 16px;
`;

const Toggle = styled(AdaptiveNavigation.Toggle)`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: none;
  border: none;
  color: ${props => props.isOpen ? 'white' : 'black'};
  font-size: 24px;
  cursor: pointer;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-left: 40px;
  font-size: 20px;
`;

function DrawerExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '#calendar',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      href: '#reports',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
    },
  ];

  return (
    <>
      <AdaptiveNavigation
        items={items}
        defaultActiveId="home"
        defaultLayout="drawer"
        adaptToScreenSize={false}
      >
        {({ isOpen, close }) => (
          <>
            <Toggle>
              {isOpen ? '✕' : '☰'}
            </Toggle>
            
            <Overlay isOpen={isOpen} onClick={close} />
            
            <Logo>
              <span>🚀</span>
              <span>My App</span>
            </Logo>
            
            {items.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <Label item={item} />
              </NavItem>
            ))}
          </>
        )}
      </AdaptiveNavigation>
      
      <Header>
        <Title>Dashboard</Title>
      </Header>
      
      {/* Main content */}
      <div style={{ padding: '20px' }}>
        <h2>Welcome to the Dashboard</h2>
        <p>Content goes here...</p>
      </div>
    </>
  );
}
```

## Bottom Navigation Example

```jsx
import { AdaptiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(AdaptiveNavigation)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  
  ${props => props['data-layout'] === 'bottom' && `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 1000;
  `}
`;

const NavItem = styled(AdaptiveNavigation.Item)`
  text-decoration: none;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  width: 20%;
  
  &[aria-current="true"] {
    color: #1890ff;
  }
`;

const Icon = styled(AdaptiveNavigation.Icon)`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Label = styled(AdaptiveNavigation.Label)`
  font-size: 12px;
`;

function BottomNavigationExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      href: '#search',
    },
    {
      id: 'add',
      label: 'Add',
      icon: '➕',
      href: '#add',
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: '🔔',
      href: '#notifications',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      href: '#profile',
    },
  ];

  return (
    <>
      <AdaptiveNavigation
        items={items}
        defaultActiveId="home"
        defaultLayout="bottom"
        adaptToScreenSize={false}
        collapseToIcons
      >
        {items.map(item => (
          <NavItem key={item.id} item={item}>
            <Icon item={item} />
            <Label item={item} />
          </NavItem>
        ))}
      </AdaptiveNavigation>
      
      {/* Main content */}
      <div style={{ padding: '20px', marginBottom: '70px' }}>
        <h1>My App</h1>
        <p>Content goes here...</p>
      </div>
    </>
  );
}
```

## Layout Switcher Example

```jsx
import { AdaptiveNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Nav = styled(AdaptiveNavigation)`
  display: flex;
  flex-direction: ${props => props['data-layout'] === 'horizontal' ? 'row' : 'column'};
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  ${props => props['data-layout'] === 'bottom' && `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
    flex-direction: row;
  `}
  
  ${props => props['data-layout'] === 'sidebar' && `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    padding-top: 60px;
  `}
  
  ${props => props['data-layout'] === 'drawer' && `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    transform: translateX(${props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 1000;
  `}
  
  ${props => props['data-layout'] === 'floating' && `
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
    border-radius: 8px;
    z-index: 1000;
  `}
`;

const NavItem = styled(AdaptiveNavigation.Item)`
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &[aria-current="true"] {
    color: #1890ff;
    background-color: #e6f7ff;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Icon = styled(AdaptiveNavigation.Icon)`
  font-size: 20px;
`;

const Label = styled(AdaptiveNavigation.Label)`
  font-size: 14px;
`;

const Toggle = styled(AdaptiveNavigation.Toggle)`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: ${props => ['sidebar', 'drawer'].includes(props['data-layout']) ? 'block' : 'none'};
`;

const LayoutSwitcher = styled(AdaptiveNavigation.LayoutSwitcher)`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1001;
  display: flex;
  gap: 8px;
`;

const LayoutButton = styled.button`
  background: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  
  &.active {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
  
  &:hover:not(.active) {
    background-color: #f5f5f5;
  }
`;

function LayoutSwitcherExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
    },
  ];

  const layouts = [
    { id: 'horizontal', label: 'Horizontal' },
    { id: 'vertical', label: 'Vertical' },
    { id: 'bottom', label: 'Bottom' },
    { id: 'sidebar', label: 'Sidebar' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'floating', label: 'Floating' },
  ];

  return (
    <>
      <AdaptiveNavigation
        items={items}
        defaultActiveId="home"
        defaultLayout="horizontal"
        adaptToScreenSize={false}
        adaptToUserPreferences
        storageKey="my-app-navigation-layout"
      >
        {({ currentLayout, isOpen }) => (
          <>
            <Toggle>
              {isOpen ? '✕' : '☰'}
            </Toggle>
            
            <LayoutSwitcher>
              {({ currentLayout, setLayout }) => (
                layouts.map(layout => (
                  <LayoutButton
                    key={layout.id}
                    className={currentLayout === layout.id ? 'active' : ''}
                    onClick={() => setLayout(layout.id as any)}
                  >
                    {layout.label}
                  </LayoutButton>
                ))
              )}
            </LayoutSwitcher>
            
            {items.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <Label item={item} />
              </NavItem>
            ))}
          </>
        )}
      </AdaptiveNavigation>
      
      {/* Main content */}
      <div style={{ padding: '20px', marginTop: '60px', marginBottom: '60px' }}>
        <h1>My App</h1>
        <p>Try different layouts using the buttons in the top-right corner.</p>
        <p>Your preference will be saved for your next visit.</p>
      </div>
    </>
  );
}
```

## Props

### AdaptiveNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | AdaptiveNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| defaultLayout | NavigationLayout | 'horizontal' | Default layout to use (uncontrolled) |
| layout | NavigationLayout | - | Controlled layout |
| onLayoutChange | (layout: NavigationLayout) => void | - | Callback when layout changes |
| breakpoints | BreakpointConfig | { mobile: 'bottom', tablet: 'sidebar', desktop: 'horizontal' } | Breakpoint configuration for responsive layouts |
| adaptToScreenSize | boolean | true | Whether to adapt to screen size automatically |
| adaptToUserPreferences | boolean | true | Whether to adapt to user preferences |
| adaptToDeviceType | boolean | true | Whether to adapt to device type |
| adaptToOrientation | boolean | true | Whether to adapt to orientation |
| isOpen | boolean | - | Whether the navigation is open (for drawer/sidebar layouts) |
| onOpenChange | (isOpen: boolean) => void | - | Callback when open state changes |
| collapseToIcons | boolean | true | Whether to collapse items to icons only when space is limited |
| storageKey | string | 'pulseui-adaptive-navigation' | Storage key for persisting user preferences |
| ariaLabel | string | 'Adaptive navigation' | Aria label for the navigation |
| as | React.ElementType | 'nav' | The element type to render as |

### AdaptiveNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | AdaptiveNavigationItem | - | The navigation item data |
| as | React.ElementType | 'a' or 'div' if no href | The element type to render as |

### AdaptiveNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | AdaptiveNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### AdaptiveNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | AdaptiveNavigationItem | - | The navigation item data |
| hideInIconsMode | boolean | true | Whether to hide the label when in icons-only mode |
| as | React.ElementType | 'div' | The element type to render as |

### AdaptiveNavigation.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'button' | The element type to render as |

### AdaptiveNavigation.LayoutSwitcher

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| ((props: { currentLayout: NavigationLayout; setLayout: (layout: NavigationLayout) => void; }) => React.ReactNode) | - | Children to render inside the layout switcher |
| as | React.ElementType | 'div' | The element type to render as |

### AdaptiveNavigationItem Interface

```typescript
interface AdaptiveNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  minBreakpoint?: number;
  data?: any;
}
```

### NavigationLayout Type

```typescript
type NavigationLayout = 'horizontal' | 'vertical' | 'bottom' | 'floating' | 'sidebar' | 'drawer';
```

### BreakpointConfig Interface

```typescript
interface BreakpointConfig {
  mobile?: NavigationLayout;
  tablet?: NavigationLayout;
  desktop?: NavigationLayout;
  custom?: {
    minWidth: number;
    layout: NavigationLayout;
  }[];
}
```

## Accessibility

The AdaptiveNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="menuitem"` for each item
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- `aria-expanded`, `aria-controls`, and `aria-label` for the toggle button
- Keyboard navigation support with Enter and Space keys
