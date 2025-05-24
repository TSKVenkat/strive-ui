# BottomNavigationHeadless

A headless implementation of a bottom navigation component that provides a mobile-friendly navigation bar fixed to the bottom of the screen. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Label control**: Show/hide labels or show only for active items
- **Badge support**: Display notification badges
- **Scroll behavior**: Option to hide when scrolling down
- **Visibility control**: Show/hide the navigation

## Basic Usage

```jsx
import { BottomNavigation } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  height: 60px;
`;

const Item = styled(BottomNavigation.Item)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;
  
  &[aria-current="true"] {
    color: #1890ff;
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Icon = styled(BottomNavigation.Icon)`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Label = styled(BottomNavigation.Label)`
  font-size: 12px;
`;

function MyBottomNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      onClick: () => console.log('Home clicked'),
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      onClick: () => console.log('Search clicked'),
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: '⭐',
      onClick: () => console.log('Favorites clicked'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => console.log('Profile clicked'),
    },
  ];

  return (
    <Container
      items={items}
      defaultActiveId="home"
      showLabels={true}
    >
      {items.map(item => (
        <Item key={item.id} item={item}>
          <Icon item={item} />
          <Label item={item} />
        </Item>
      ))}
    </Container>
  );
}
```

## With Badges Example

```jsx
import { BottomNavigation } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  height: 64px;
  padding: 0 16px;
`;

const Item = styled(BottomNavigation.Item)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  
  &[aria-current="true"] {
    color: #1890ff;
  }
`;

const IconContainer = styled.div`
  position: relative;
  margin-bottom: 4px;
`;

const Icon = styled(BottomNavigation.Icon)`
  font-size: 24px;
`;

const Badge = styled(BottomNavigation.Badge)`
  position: absolute;
  top: -6px;
  right: -10px;
  background-color: #ff4d4f;
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

const Label = styled(BottomNavigation.Label)`
  font-size: 12px;
  margin-top: 2px;
`;

function BottomNavigationWithBadges() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      onClick: () => console.log('Home clicked'),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '✉️',
      badge: 3,
      onClick: () => console.log('Messages clicked'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      badge: 12,
      onClick: () => console.log('Notifications clicked'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => console.log('Profile clicked'),
    },
  ];

  return (
    <Container
      items={items}
      defaultActiveId="home"
      showLabels={true}
    >
      {items.map(item => (
        <Item key={item.id} item={item}>
          <IconContainer>
            <Icon item={item} />
            {item.badge && (
              <Badge item={item}>
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </IconContainer>
          <Label item={item} />
        </Item>
      ))}
    </Container>
  );
}
```

## Hide on Scroll Example

```jsx
import { BottomNavigation } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  height: 60px;
  transition: transform 0.3s ease;
`;

const Item = styled(BottomNavigation.Item)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;
  
  &[aria-current="true"] {
    color: #1890ff;
  }
`;

const Icon = styled(BottomNavigation.Icon)`
  font-size: 24px;
  margin-bottom: 4px;
`;

const Label = styled(BottomNavigation.Label)`
  font-size: 12px;
`;

function HideOnScrollBottomNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      onClick: () => console.log('Home clicked'),
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: '🔍',
      onClick: () => console.log('Explore clicked'),
    },
    {
      id: 'create',
      label: 'Create',
      icon: '➕',
      onClick: () => console.log('Create clicked'),
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: '❤️',
      onClick: () => console.log('Activity clicked'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => console.log('Profile clicked'),
    },
  ];

  return (
    <>
      {/* Content that can be scrolled */}
      <div style={{ height: '200vh', padding: '20px' }}>
        <h1>Scroll down to see the bottom navigation hide</h1>
        <p>Scroll back up to see it reappear</p>
        {/* Add more content here */}
      </div>
      
      <Container
        items={items}
        defaultActiveId="home"
        showLabels={true}
        hideOnScroll={true}
        scrollThreshold={50}
      >
        {items.map(item => (
          <Item key={item.id} item={item}>
            <Icon item={item} />
            <Label item={item} />
          </Item>
        ))}
      </Container>
    </>
  );
}
```

## Labels Only for Active Item Example

```jsx
import { BottomNavigation } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #121212;
  color: #fff;
  display: flex;
  justify-content: space-around;
  height: 60px;
  padding: 0 16px;
`;

const Item = styled(BottomNavigation.Item)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &[aria-current="true"] {
    color: #fff;
  }
`;

const Icon = styled(BottomNavigation.Icon)`
  font-size: 24px;
  transition: transform 0.2s ease;
  
  ${Item}[aria-current="true"] & {
    transform: translateY(-4px);
  }
`;

const Label = styled(BottomNavigation.Label)`
  font-size: 12px;
  margin-top: 4px;
  transition: opacity 0.2s ease;
`;

function ActiveLabelBottomNavigation() {
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      onClick: () => console.log('Home clicked'),
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      onClick: () => console.log('Search clicked'),
    },
    {
      id: 'library',
      label: 'Library',
      icon: '📚',
      onClick: () => console.log('Library clicked'),
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: '✨',
      onClick: () => console.log('Premium clicked'),
    },
  ];

  return (
    <Container
      items={items}
      defaultActiveId="home"
      showLabels={true}
      showLabelsOnlyForActive={true}
    >
      {items.map(item => (
        <Item key={item.id} item={item}>
          <Icon item={item} />
          <Label item={item} />
        </Item>
      ))}
    </Container>
  );
}
```

## Props

### BottomNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | BottomNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| showLabels | boolean | true | Whether to show labels |
| showLabelsOnlyForActive | boolean | false | Whether to show labels only for active item |
| visible | boolean | true | Whether the bottom navigation is visible |
| onVisibleChange | (visible: boolean) => void | - | Callback when visibility changes |
| hideOnScroll | boolean | false | Whether to hide the bottom navigation when scrolling down |
| scrollThreshold | number | 50 | Scroll threshold for hiding the bottom navigation |
| ariaLabel | string | 'Bottom navigation' | Aria label for the navigation |
| as | React.ElementType | 'nav' | The element type to render as |

### BottomNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BottomNavigationItem | - | The navigation item data |
| as | React.ElementType | 'button' or 'a' if href is provided | The element type to render as |

### BottomNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BottomNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### BottomNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BottomNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### BottomNavigation.Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BottomNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### BottomNavigationItem Interface

```typescript
interface BottomNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  data?: any;
}
```

## Accessibility

The BottomNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="button"` for each item
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- Keyboard navigation support with Enter and Space keys
