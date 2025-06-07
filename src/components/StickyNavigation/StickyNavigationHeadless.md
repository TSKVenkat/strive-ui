# StickyNavigationHeadless

A headless implementation of a sticky navigation component that sticks to the top of the viewport when scrolling past it. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Intersection Observer**: Uses modern browser APIs for efficient sticky detection
- **Scroll behavior**: Option to hide when scrolling down
- **Animation**: Smooth transitions for sticky state changes
- **Shadow control**: Option to add shadow when sticky

## Basic Usage

```jsx
import { StickyNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* Content before the navigation */
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled(StickyNavigation)`
  background-color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  ${props => props.isSticky && `
    padding: 12px 16px;
  `}
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const Menu = styled.div`
  display: flex;
  gap: 24px;
`;

const NavItem = styled(StickyNavigation.Item)`
  text-decoration: none;
  color: #333;
  position: relative;
  padding: 4px 0;
  
  &[aria-current="true"] {
    color: #1890ff;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #1890ff;
    }
  }
  
  &:hover {
    color: #1890ff;
  }
`;

function MyStickyNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
    },
    {
      id: 'about',
      label: 'About',
      href: '#about',
    },
    {
      id: 'services',
      label: 'Services',
      href: '#services',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      href: '#portfolio',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact',
    },
  ];

  return (
    <>
      <Container>
        Scroll down to see sticky navigation
      </Container>
      
      <StickyNavigation.Sentinel />
      
      <Nav
        items={items}
        defaultActiveId="home"
        stickyOffset={0}
        stickyWithShadow
        animateSticky
      >
        {({ isSticky }) => (
          <>
            <Logo>My Website</Logo>
            <Menu>
              {items.map(item => (
                <NavItem key={item.id} item={item}>
                  <StickyNavigation.Label item={item} />
                </NavItem>
              ))}
            </Menu>
          </>
        )}
      </Nav>
      
      {/* Content after the navigation */}
      <div style={{ height: '200vh', padding: '20px' }}>
        <h1>Page Content</h1>
        <p>Scroll up and down to see the sticky navigation in action.</p>
      </div>
    </>
  );
}
```

## Hide on Scroll Example

```jsx
import { StickyNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* Content before the navigation */
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled(StickyNavigation)`
  background-color: #1e1e1e;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const Menu = styled.div`
  display: flex;
  gap: 24px;
`;

const NavItem = styled(StickyNavigation.Item)`
  text-decoration: none;
  color: #e0e0e0;
  position: relative;
  padding: 4px 0;
  
  &[aria-current="true"] {
    color: #1890ff;
  }
  
  &:hover {
    color: #1890ff;
  }
`;

function HideOnScrollExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
    },
    {
      id: 'about',
      label: 'About',
      href: '#about',
    },
    {
      id: 'services',
      label: 'Services',
      href: '#services',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      href: '#portfolio',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact',
    },
  ];

  return (
    <>
      <Container>
        Scroll down to see sticky navigation
      </Container>
      
      <StickyNavigation.Sentinel />
      
      <Nav
        items={items}
        defaultActiveId="home"
        stickyOffset={0}
        stickyWithShadow
        animateSticky
        hideOnScroll
        scrollThreshold={50}
      >
        <Logo>My Website</Logo>
        <Menu>
          {items.map(item => (
            <NavItem key={item.id} item={item}>
              <StickyNavigation.Label item={item} />
            </NavItem>
          ))}
        </Menu>
      </Nav>
      
      {/* Content after the navigation */}
      <div style={{ height: '200vh', padding: '20px' }}>
        <h1>Page Content</h1>
        <p>Scroll up and down to see the sticky navigation in action.</p>
        <p>The navigation will hide when scrolling down and show when scrolling up.</p>
      </div>
    </>
  );
}
```

## With Icons Example

```jsx
import { StickyNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* Content before the navigation */
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled(StickyNavigation)`
  background-color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  ${props => props.isSticky && `
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `}
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Menu = styled.div`
  display: flex;
  gap: 24px;
`;

const NavItem = styled(StickyNavigation.Item)`
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &[aria-current="true"] {
    color: #1890ff;
    background-color: #e6f7ff;
  }
  
  &:hover {
    color: #1890ff;
    background-color: #f0f9ff;
  }
`;

const Icon = styled(StickyNavigation.Icon)`
  font-size: 18px;
`;

function IconsExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
    },
    {
      id: 'about',
      label: 'About',
      icon: '👥',
      href: '#about',
    },
    {
      id: 'services',
      label: 'Services',
      icon: '🛠️',
      href: '#services',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '🖼️',
      href: '#portfolio',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '✉️',
      href: '#contact',
    },
  ];

  return (
    <>
      <Container>
        Scroll down to see sticky navigation
      </Container>
      
      <StickyNavigation.Sentinel />
      
      <Nav
        items={items}
        defaultActiveId="home"
        stickyOffset={0}
        animateSticky
      >
        {({ isSticky }) => (
          <>
            <Logo>
              <span>🚀</span>
              <span>My Website</span>
            </Logo>
            <Menu>
              {items.map(item => (
                <NavItem key={item.id} item={item}>
                  <Icon item={item} />
                  <StickyNavigation.Label item={item} />
                </NavItem>
              ))}
            </Menu>
          </>
        )}
      </Nav>
      
      {/* Content after the navigation */}
      <div style={{ height: '200vh', padding: '20px' }}>
        <h1>Page Content</h1>
        <p>Scroll up and down to see the sticky navigation in action.</p>
      </div>
    </>
  );
}
```

## Responsive Example

```jsx
import { StickyNavigation } from 'pulseui';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* Content before the navigation */
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled(StickyNavigation)`
  background-color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  ${props => props.isSticky && `
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `}
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const Menu = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

const NavItem = styled(StickyNavigation.Item)`
  text-decoration: none;
  color: #333;
  position: relative;
  padding: 4px 0;
  
  &[aria-current="true"] {
    color: #1890ff;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #1890ff;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  
  &:hover {
    color: #1890ff;
  }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function ResponsiveExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
    },
    {
      id: 'about',
      label: 'About',
      href: '#about',
    },
    {
      id: 'services',
      label: 'Services',
      href: '#services',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      href: '#portfolio',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact',
    },
  ];

  return (
    <>
      <Container>
        Scroll down to see sticky navigation
      </Container>
      
      <StickyNavigation.Sentinel />
      
      <Nav
        items={items}
        defaultActiveId="home"
        stickyOffset={0}
        stickyWithShadow
        animateSticky
      >
        {({ isSticky }) => (
          <>
            <Logo>My Website</Logo>
            
            <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? '✕' : '☰'}
            </MenuButton>
            
            <Menu isOpen={isMenuOpen}>
              {items.map(item => (
                <NavItem 
                  key={item.id} 
                  item={item}
                  onClick={() => isMobile && setIsMenuOpen(false)}
                >
                  <StickyNavigation.Label item={item} />
                </NavItem>
              ))}
            </Menu>
          </>
        )}
      </Nav>
      
      {/* Content after the navigation */}
      <div style={{ height: '200vh', padding: '20px' }}>
        <h1>Page Content</h1>
        <p>Scroll up and down to see the sticky navigation in action.</p>
        <p>Resize the window to see the responsive behavior.</p>
      </div>
    </>
  );
}
```

## Props

### StickyNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | StickyNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| isSticky | boolean | - | Controlled sticky state |
| onStickyChange | (isSticky: boolean) => void | - | Callback when sticky state changes |
| stickyOffset | number | 0 | Offset from the top of the viewport when the navigation becomes sticky |
| zIndex | number | 1000 | Z-index of the sticky navigation |
| stickyWithShadow | boolean | true | Whether to add a shadow when the navigation is sticky |
| animateSticky | boolean | true | Whether to animate the sticky transition |
| hideOnScroll | boolean | false | Whether to hide the navigation when scrolling down |
| scrollThreshold | number | 50 | Scroll threshold for hiding the navigation |
| ariaLabel | string | 'Sticky navigation' | Aria label for the navigation |
| as | React.ElementType | 'nav' | The element type to render as |

### StickyNavigation.Sentinel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### StickyNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | StickyNavigationItem | - | The navigation item data |
| as | React.ElementType | 'a' or 'div' if no href | The element type to render as |

### StickyNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | StickyNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### StickyNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | StickyNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### StickyNavigationItem Interface

```typescript
interface StickyNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  data?: any;
}
```

## Accessibility

The StickyNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="menuitem"` for each item
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- Keyboard navigation support with Enter and Space keys
