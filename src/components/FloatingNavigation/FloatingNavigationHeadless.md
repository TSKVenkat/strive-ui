# FloatingNavigationHeadless

A headless implementation of a floating navigation component that can be positioned anywhere on the screen. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Positioning**: Predefined positions or custom positioning
- **Draggable**: Optional draggable functionality
- **Collapsible**: Expand/collapse functionality
- **Visibility control**: Show/hide the navigation
- **Keyboard navigation**: Full keyboard support

## Basic Usage

```jsx
import { FloatingNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(FloatingNavigation)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 240px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
`;

const Title = styled.div`
  font-weight: 600;
`;

const DragHandle = styled(FloatingNavigation.DragHandle)`
  cursor: move;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Toggle = styled(FloatingNavigation.Toggle)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Content = styled(FloatingNavigation.Content)`
  padding: 8px 0;
`;

const Item = styled(FloatingNavigation.Item)`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &[aria-current="true"] {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Icon = styled(FloatingNavigation.Icon)`
  margin-right: 12px;
`;

function MyFloatingNavigation() {
  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      onClick: () => console.log('Dashboard clicked'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => console.log('Profile clicked'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => console.log('Settings clicked'),
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      onClick: () => console.log('Help clicked'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: '🚪',
      onClick: () => console.log('Logout clicked'),
    },
  ];

  return (
    <Container
      items={items}
      defaultPosition="bottom-right"
      draggable
      defaultActiveId="dashboard"
    >
      <Header>
        <Title>Navigation</Title>
        <div style={{ display: 'flex' }}>
          <DragHandle>⋮⋮</DragHandle>
          <Toggle>✕</Toggle>
        </div>
      </Header>
      
      <Content>
        {items.map(item => (
          <Item key={item.id} item={item}>
            <Icon item={item} />
            <FloatingNavigation.Label item={item} />
          </Item>
        ))}
      </Content>
    </Container>
  );
}
```

## Collapsible Navigation Example

```jsx
import { FloatingNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(FloatingNavigation)`
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: width 0.3s ease;
  width: ${props => props.collapsed ? '60px' : '240px'};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  padding: 16px;
  border-bottom: 1px solid #333;
`;

const Title = styled.div`
  font-weight: 600;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const Toggle = styled(FloatingNavigation.Toggle)`
  background: none;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #333;
  }
`;

const Content = styled(FloatingNavigation.Content)`
  padding: 8px 0;
`;

const Item = styled(FloatingNavigation.Item)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
  
  &[aria-current="true"] {
    background-color: #0050b3;
  }
`;

const Icon = styled(FloatingNavigation.Icon)`
  font-size: 20px;
  ${props => !props.collapsed && 'margin-right: 12px;'}
`;

const Label = styled(FloatingNavigation.Label)`
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

function CollapsibleFloatingNavigation() {
  const [collapsed, setCollapsed] = useState(false);
  
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
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      onClick: () => console.log('Notifications clicked'),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '✉️',
      onClick: () => console.log('Messages clicked'),
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
      defaultPosition="left-center"
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
    >
      <Header collapsed={collapsed}>
        <Title collapsed={collapsed}>Menu</Title>
        <Toggle>
          {collapsed ? '→' : '←'}
        </Toggle>
      </Header>
      
      <Content>
        {items.map(item => (
          <Item key={item.id} item={item}>
            <Icon item={item} collapsed={collapsed} />
            <Label item={item} collapsed={collapsed} />
          </Item>
        ))}
      </Content>
    </Container>
  );
}
```

## Draggable Navigation Example

```jsx
import { FloatingNavigation } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(FloatingNavigation)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 280px;
  border: 1px solid #eaeaea;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
  background-color: #f9f9f9;
`;

const DragHandle = styled(FloatingNavigation.DragHandle)`
  cursor: move;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Title = styled.div`
  font-weight: 600;
  flex: 1;
`;

const PositionControls = styled.div`
  display: flex;
  gap: 4px;
`;

const PositionButton = styled.button`
  background: none;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.active {
    background-color: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const Content = styled(FloatingNavigation.Content)`
  padding: 12px;
`;

const Item = styled(FloatingNavigation.Item)`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &[aria-current="true"] {
    background-color: #f0f7ff;
    color: #1890ff;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Icon = styled(FloatingNavigation.Icon)`
  margin-right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function DraggableFloatingNavigation() {
  const [position, setPosition] = useState('bottom-right');
  
  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      onClick: () => console.log('Dashboard clicked'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      onClick: () => console.log('Analytics clicked'),
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      onClick: () => console.log('Customers clicked'),
    },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      onClick: () => console.log('Products clicked'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => console.log('Settings clicked'),
    },
  ];
  
  const positions = [
    'top-left', 'top-center', 'top-right',
    'left-center', 'center', 'right-center',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  return (
    <Container
      items={items}
      position={position}
      onPositionChange={setPosition}
      draggable
    >
      <Header>
        <DragHandle>⋮⋮</DragHandle>
        <Title>Draggable Menu</Title>
      </Header>
      
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>Position:</div>
          <PositionControls>
            {positions.map(pos => (
              <PositionButton
                key={pos}
                className={position === pos ? 'active' : ''}
                onClick={() => setPosition(pos)}
              >
                {pos}
              </PositionButton>
            ))}
          </PositionControls>
        </div>
        
        {items.map(item => (
          <Item key={item.id} item={item}>
            <Icon item={item} />
            <FloatingNavigation.Label item={item} />
          </Item>
        ))}
      </Content>
    </Container>
  );
}
```

## Props

### FloatingNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | FloatingNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| defaultPosition | FloatingPosition | 'bottom-right' | Default position of the floating navigation (uncontrolled) |
| position | FloatingPosition | - | Controlled position of the floating navigation |
| onPositionChange | (position: FloatingPosition) => void | - | Callback when position changes |
| draggable | boolean | false | Whether the floating navigation is draggable |
| visible | boolean | true | Whether the floating navigation is visible |
| onVisibleChange | (visible: boolean) => void | - | Callback when visibility changes |
| collapsed | boolean | false | Whether the floating navigation is collapsed |
| onCollapsedChange | (collapsed: boolean) => void | - | Callback when collapsed state changes |
| offset | number | 16 | Offset from the edge of the screen |
| zIndex | number | 1000 | Z-index of the floating navigation |
| ariaLabel | string | 'Floating navigation' | Aria label for the navigation |
| as | React.ElementType | 'div' | The element type to render as |

### FloatingNavigation.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'button' | The element type to render as |

### FloatingNavigation.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### FloatingNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | FloatingNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' or 'a' if href is provided | The element type to render as |

### FloatingNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | FloatingNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### FloatingNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | FloatingNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### FloatingNavigation.DragHandle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### FloatingNavigationItem Interface

```typescript
interface FloatingNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
  data?: any;
}
```

### FloatingPosition Type

```typescript
type FloatingPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-center' | 'right-center' | 'center';
```

## Accessibility

The FloatingNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="menu"` for the content
- `role="menuitem"` for each item
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- `aria-expanded` to indicate the expanded/collapsed state
- `aria-label` for the drag handle
- Keyboard navigation support
