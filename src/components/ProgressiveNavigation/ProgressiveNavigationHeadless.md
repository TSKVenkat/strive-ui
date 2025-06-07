# ProgressiveNavigationHeadless

A headless implementation of a progressive navigation component that adapts to available space and screen size. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Adaptive**: Automatically adjusts visible items based on available space
- **Priority-based**: Shows high-priority items first when space is limited
- **Responsive**: Can adapt to screen size changes
- **Overflow handling**: Provides overflow menu for items that don't fit

## Basic Usage

```jsx
import { ProgressiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(ProgressiveNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(ProgressiveNavigation.Item)`
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  
  &[aria-current="true"] {
    color: #1890ff;
    background-color: #e6f7ff;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowToggle = styled(ProgressiveNavigation.OverflowToggle)`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowMenu = styled(ProgressiveNavigation.OverflowMenu)`
  position: absolute;
  top: 100%;
  right: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  
  ${NavItem} {
    display: block;
    padding: 8px 16px;
    border-radius: 0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

function MyProgressiveNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      priority: 100,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#dashboard',
      priority: 90,
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      priority: 80,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      href: '#tasks',
      priority: 70,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      href: '#calendar',
      priority: 60,
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      priority: 50,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '#settings',
      priority: 40,
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      adaptToSpace
      prioritizeItems
    >
      {items.map(item => (
        <NavItem key={item.id} item={item}>
          <ProgressiveNavigation.Label item={item} />
        </NavItem>
      ))}
      
      <OverflowToggle>
        More ▾
      </OverflowToggle>
      
      <OverflowMenu>
        {overflowItems => (
          overflowItems.map(item => (
            <NavItem key={item.id} item={item}>
              <ProgressiveNavigation.Label item={item} />
            </NavItem>
          ))
        )}
      </OverflowMenu>
    </Nav>
  );
}
```

## With Icons Example

```jsx
import { ProgressiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(ProgressiveNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(ProgressiveNavigation.Item)`
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

const Icon = styled(ProgressiveNavigation.Icon)`
  font-size: 18px;
`;

const OverflowToggle = styled(ProgressiveNavigation.OverflowToggle)`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowMenu = styled(ProgressiveNavigation.OverflowMenu)`
  position: absolute;
  top: 100%;
  right: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  
  ${NavItem} {
    display: flex;
    padding: 8px 16px;
    border-radius: 0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

function IconsExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
      priority: 100,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
      priority: 90,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
      priority: 80,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
      priority: 70,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '#calendar',
      priority: 60,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      href: '#reports',
      priority: 50,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
      priority: 40,
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      adaptToSpace
      prioritizeItems
    >
      {({ visibleItems, overflowItems, isOverflowMenuOpen }) => (
        <>
          {visibleItems.map(item => (
            <NavItem key={item.id} item={item}>
              <Icon item={item} />
              <ProgressiveNavigation.Label item={item} />
            </NavItem>
          ))}
          
          <OverflowToggle>
            More ▾
          </OverflowToggle>
          
          <OverflowMenu>
            {overflowItems.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <ProgressiveNavigation.Label item={item} />
              </NavItem>
            ))}
          </OverflowMenu>
        </>
      )}
    </Nav>
  );
}
```

## Screen Size Adaptation Example

```jsx
import { ProgressiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(ProgressiveNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(ProgressiveNavigation.Item)`
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  
  &[aria-current="true"] {
    color: #1890ff;
    background-color: #e6f7ff;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowToggle = styled(ProgressiveNavigation.OverflowToggle)`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowMenu = styled(ProgressiveNavigation.OverflowMenu)`
  position: absolute;
  top: 100%;
  right: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  
  ${NavItem} {
    display: block;
    padding: 8px 16px;
    border-radius: 0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

function ScreenSizeExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      priority: 100,
      minBreakpoint: 0, // Always visible
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#dashboard',
      priority: 90,
      minBreakpoint: 0, // Always visible
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      priority: 80,
      minBreakpoint: 480, // Visible on screens >= 480px
    },
    {
      id: 'tasks',
      label: 'Tasks',
      href: '#tasks',
      priority: 70,
      minBreakpoint: 480, // Visible on screens >= 480px
    },
    {
      id: 'calendar',
      label: 'Calendar',
      href: '#calendar',
      priority: 60,
      minBreakpoint: 768, // Visible on screens >= 768px
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      priority: 50,
      minBreakpoint: 768, // Visible on screens >= 768px
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '#settings',
      priority: 40,
      minBreakpoint: 1024, // Visible on screens >= 1024px
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      adaptToScreenSize
      prioritizeItems
    >
      {({ visibleItems, overflowItems }) => (
        <>
          {visibleItems.map(item => (
            <NavItem key={item.id} item={item}>
              <ProgressiveNavigation.Label item={item} />
            </NavItem>
          ))}
          
          <OverflowToggle>
            More ▾
          </OverflowToggle>
          
          <OverflowMenu>
            {overflowItems.map(item => (
              <NavItem key={item.id} item={item}>
                <ProgressiveNavigation.Label item={item} />
              </NavItem>
            ))}
          </OverflowMenu>
        </>
      )}
    </Nav>
  );
}
```

## Combined Space and Screen Size Adaptation Example

```jsx
import { ProgressiveNavigation } from 'pulseui';
import styled from 'styled-components';

const Nav = styled(ProgressiveNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(ProgressiveNavigation.Item)`
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

const Icon = styled(ProgressiveNavigation.Icon)`
  font-size: 18px;
`;

const OverflowToggle = styled(ProgressiveNavigation.OverflowToggle)`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OverflowMenu = styled(ProgressiveNavigation.OverflowMenu)`
  position: absolute;
  top: 100%;
  right: 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  
  ${NavItem} {
    display: flex;
    padding: 8px 16px;
    border-radius: 0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

function CombinedExample() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
      priority: 100,
      minBreakpoint: 0, // Always visible
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
      priority: 90,
      minBreakpoint: 0, // Always visible
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
      priority: 80,
      minBreakpoint: 480, // Visible on screens >= 480px
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
      priority: 70,
      minBreakpoint: 480, // Visible on screens >= 480px
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '#calendar',
      priority: 60,
      minBreakpoint: 768, // Visible on screens >= 768px
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      href: '#reports',
      priority: 50,
      minBreakpoint: 768, // Visible on screens >= 768px
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
      priority: 40,
      minBreakpoint: 1024, // Visible on screens >= 1024px
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      adaptToSpace
      adaptToScreenSize
      prioritizeItems
      minVisibleItems={2}
      maxVisibleItems={7}
    >
      {({ visibleItems, overflowItems }) => (
        <>
          {visibleItems.map(item => (
            <NavItem key={item.id} item={item}>
              <Icon item={item} />
              <ProgressiveNavigation.Label item={item} />
            </NavItem>
          ))}
          
          <OverflowToggle>
            More ▾
          </OverflowToggle>
          
          <OverflowMenu>
            {overflowItems.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <ProgressiveNavigation.Label item={item} />
              </NavItem>
            ))}
          </OverflowMenu>
        </>
      )}
    </Nav>
  );
}
```

## Props

### ProgressiveNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | ProgressiveNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| defaultOverflowBehavior | 'collapse' \| 'hide' | 'collapse' | Default overflow behavior (uncontrolled) |
| overflowBehavior | 'collapse' \| 'hide' | - | Controlled overflow behavior |
| onOverflowBehaviorChange | (behavior: 'collapse' \| 'hide') => void | - | Callback when overflow behavior changes |
| isOverflowMenuOpen | boolean | - | Controlled overflow menu open state |
| onOverflowMenuOpenChange | (isOpen: boolean) => void | - | Callback when overflow menu open state changes |
| minVisibleItems | number | 1 | Minimum number of visible items before overflow |
| maxVisibleItems | number | Infinity | Maximum number of visible items before overflow |
| prioritizeItems | boolean | true | Whether to prioritize items by their priority value |
| adaptToSpace | boolean | false | Whether to adapt to available space |
| adaptToScreenSize | boolean | false | Whether to adapt to screen size |
| ariaLabel | string | 'Progressive navigation' | Aria label for the navigation |
| as | React.ElementType | 'nav' | The element type to render as |

### ProgressiveNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | ProgressiveNavigationItem | - | The navigation item data |
| as | React.ElementType | 'a' or 'div' if no href | The element type to render as |

### ProgressiveNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | ProgressiveNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### ProgressiveNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | ProgressiveNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### ProgressiveNavigation.OverflowToggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'button' | The element type to render as |

### ProgressiveNavigation.OverflowMenu

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| ((items: ProgressiveNavigationItem[]) => React.ReactNode) | - | Children to render inside the overflow menu |
| as | React.ElementType | 'div' | The element type to render as |

### ProgressiveNavigationItem Interface

```typescript
interface ProgressiveNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  priority: number;
  minBreakpoint?: number;
  data?: any;
}
```

## Accessibility

The ProgressiveNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="menuitem"` for each item
- `role="menu"` for the overflow menu
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- `aria-haspopup` and `aria-expanded` for the overflow toggle
- Keyboard navigation support with Enter and Space keys
