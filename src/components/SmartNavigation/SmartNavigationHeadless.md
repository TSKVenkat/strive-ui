# SmartNavigationHeadless

A headless implementation of a smart navigation component that adapts to user behavior and context. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Learning capability**: Learns from user behavior to prioritize frequently used items
- **Context awareness**: Can prioritize items based on contextual relevance
- **Persistence**: Saves usage data to localStorage for consistent experience across sessions
- **Adaptive**: Automatically adjusts visible items based on usage patterns

## Basic Usage

```jsx
import { SmartNavigation } from 'strive-ui';
import styled from 'styled-components';

const Nav = styled(SmartNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(SmartNavigation.Item)`
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

const HiddenItemsMenu = styled(SmartNavigation.HiddenItems)`
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

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: auto;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

function MySmartNavigation() {
  const [showHiddenItems, setShowHiddenItems] = useState(false);
  
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      initialWeight: 10,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#dashboard',
      initialWeight: 9,
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      initialWeight: 8,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      href: '#tasks',
      initialWeight: 7,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      href: '#calendar',
      initialWeight: 6,
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      initialWeight: 5,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '#settings',
      initialWeight: 4,
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      enableLearning
      maxVisibleItems={5}
      storageKey="my-app-navigation"
    >
      {({ visibleItems, hiddenItems }) => (
        <>
          {visibleItems.map(item => (
            <NavItem key={item.id} item={item}>
              <SmartNavigation.Label item={item} />
            </NavItem>
          ))}
          
          {hiddenItems.length > 0 && (
            <>
              <MoreButton onClick={() => setShowHiddenItems(!showHiddenItems)}>
                More ▾
              </MoreButton>
              
              {showHiddenItems && (
                <HiddenItemsMenu>
                  {hiddenItems.map(item => (
                    <NavItem 
                      key={item.id} 
                      item={item}
                      onClick={() => setShowHiddenItems(false)}
                    >
                      <SmartNavigation.Label item={item} />
                    </NavItem>
                  ))}
                </HiddenItemsMenu>
              )}
            </>
          )}
        </>
      )}
    </Nav>
  );
}
```

## With Icons Example

```jsx
import { SmartNavigation } from 'strive-ui';
import styled from 'styled-components';

const Nav = styled(SmartNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(SmartNavigation.Item)`
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

const Icon = styled(SmartNavigation.Icon)`
  font-size: 18px;
`;

const HiddenItemsMenu = styled(SmartNavigation.HiddenItems)`
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

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: auto;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

function IconsExample() {
  const [showHiddenItems, setShowHiddenItems] = useState(false);
  
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
      initialWeight: 10,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
      initialWeight: 9,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
      initialWeight: 8,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
      initialWeight: 7,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '#calendar',
      initialWeight: 6,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      href: '#reports',
      initialWeight: 5,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
      initialWeight: 4,
    },
  ];

  return (
    <Nav
      items={items}
      defaultActiveId="home"
      enableLearning
      maxVisibleItems={5}
      storageKey="my-app-navigation"
    >
      {({ visibleItems, hiddenItems }) => (
        <>
          {visibleItems.map(item => (
            <NavItem key={item.id} item={item}>
              <Icon item={item} />
              <SmartNavigation.Label item={item} />
            </NavItem>
          ))}
          
          {hiddenItems.length > 0 && (
            <>
              <MoreButton onClick={() => setShowHiddenItems(!showHiddenItems)}>
                More ▾
              </MoreButton>
              
              {showHiddenItems && (
                <HiddenItemsMenu>
                  {hiddenItems.map(item => (
                    <NavItem 
                      key={item.id} 
                      item={item}
                      onClick={() => setShowHiddenItems(false)}
                    >
                      <Icon item={item} />
                      <SmartNavigation.Label item={item} />
                    </NavItem>
                  ))}
                </HiddenItemsMenu>
              )}
            </>
          )}
        </>
      )}
    </Nav>
  );
}
```

## Context Awareness Example

```jsx
import { SmartNavigation } from 'strive-ui';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Nav = styled(SmartNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(SmartNavigation.Item)`
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

const Icon = styled(SmartNavigation.Icon)`
  font-size: 18px;
`;

const HiddenItemsMenu = styled(SmartNavigation.HiddenItems)`
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

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: auto;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ContextSelector = styled.div`
  margin-bottom: 16px;
  
  button {
    margin-right: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background-color: white;
    cursor: pointer;
    
    &.active {
      background-color: #1890ff;
      color: white;
      border-color: #1890ff;
    }
  }
`;

function ContextAwarenessExample() {
  const [showHiddenItems, setShowHiddenItems] = useState(false);
  const [currentContext, setCurrentContext] = useState(['work']);
  
  const items = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '#home',
      initialWeight: 10,
      tags: ['work', 'personal'],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '#dashboard',
      initialWeight: 9,
      tags: ['work', 'analytics'],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      href: '#projects',
      initialWeight: 8,
      tags: ['work', 'management'],
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '✓',
      href: '#tasks',
      initialWeight: 7,
      tags: ['work', 'management'],
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '#calendar',
      initialWeight: 6,
      tags: ['work', 'personal', 'management'],
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: '📷',
      href: '#photos',
      initialWeight: 5,
      tags: ['personal', 'media'],
    },
    {
      id: 'music',
      label: 'Music',
      icon: '🎵',
      href: '#music',
      initialWeight: 4,
      tags: ['personal', 'media'],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      href: '#reports',
      initialWeight: 3,
      tags: ['work', 'analytics'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '#settings',
      initialWeight: 2,
      tags: ['work', 'personal'],
    },
  ];

  const contexts = [
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
    { id: 'management', label: 'Management' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'media', label: 'Media' },
  ];

  return (
    <div>
      <ContextSelector>
        <p>Select context:</p>
        {contexts.map(context => (
          <button
            key={context.id}
            className={currentContext.includes(context.id) ? 'active' : ''}
            onClick={() => setCurrentContext([context.id])}
          >
            {context.label}
          </button>
        ))}
      </ContextSelector>
      
      <Nav
        items={items}
        defaultActiveId="home"
        enableLearning
        enableContextAwareness
        contextTags={currentContext}
        maxVisibleItems={5}
        storageKey="my-app-navigation"
        contextRelevanceBoost={2}
      >
        {({ visibleItems, hiddenItems }) => (
          <>
            {visibleItems.map(item => (
              <NavItem key={item.id} item={item}>
                <Icon item={item} />
                <SmartNavigation.Label item={item} />
              </NavItem>
            ))}
            
            {hiddenItems.length > 0 && (
              <>
                <MoreButton onClick={() => setShowHiddenItems(!showHiddenItems)}>
                  More ▾
                </MoreButton>
                
                {showHiddenItems && (
                  <HiddenItemsMenu>
                    {hiddenItems.map(item => (
                      <NavItem 
                        key={item.id} 
                        item={item}
                        onClick={() => setShowHiddenItems(false)}
                      >
                        <Icon item={item} />
                        <SmartNavigation.Label item={item} />
                      </NavItem>
                    ))}
                  </HiddenItemsMenu>
                )}
              </>
            )}
          </>
        )}
      </Nav>
    </div>
  );
}
```

## Reset Button Example

```jsx
import { SmartNavigation } from 'strive-ui';
import styled from 'styled-components';

const Nav = styled(SmartNavigation)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`;

const NavItem = styled(SmartNavigation.Item)`
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

const HiddenItemsMenu = styled(SmartNavigation.HiddenItems)`
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

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: auto;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ResetButton = styled(SmartNavigation.ResetButton)`
  background: none;
  border: 1px solid #d9d9d9;
  color: #333;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 8px;
  font-size: 12px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

function ResetButtonExample() {
  const [showHiddenItems, setShowHiddenItems] = useState(false);
  
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      initialWeight: 10,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#dashboard',
      initialWeight: 9,
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      initialWeight: 8,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      href: '#tasks',
      initialWeight: 7,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      href: '#calendar',
      initialWeight: 6,
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      initialWeight: 5,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '#settings',
      initialWeight: 4,
    },
  ];

  return (
    <div>
      <p>Click on items to see how the navigation adapts to your usage patterns.</p>
      
      <Nav
        items={items}
        defaultActiveId="home"
        enableLearning
        maxVisibleItems={5}
        storageKey="my-app-navigation"
      >
        {({ visibleItems, hiddenItems, usageData }) => (
          <>
            {visibleItems.map(item => (
              <NavItem key={item.id} item={item}>
                <SmartNavigation.Label item={item} />
                {usageData[item.id]?.clickCount > 0 && (
                  <small style={{ marginLeft: '4px', color: '#999' }}>
                    ({usageData[item.id]?.clickCount})
                  </small>
                )}
              </NavItem>
            ))}
            
            {hiddenItems.length > 0 && (
              <>
                <MoreButton onClick={() => setShowHiddenItems(!showHiddenItems)}>
                  More ▾
                </MoreButton>
                
                {showHiddenItems && (
                  <HiddenItemsMenu>
                    {hiddenItems.map(item => (
                      <NavItem 
                        key={item.id} 
                        item={item}
                        onClick={() => setShowHiddenItems(false)}
                      >
                        <SmartNavigation.Label item={item} />
                        {usageData[item.id]?.clickCount > 0 && (
                          <small style={{ marginLeft: '4px', color: '#999' }}>
                            ({usageData[item.id]?.clickCount})
                          </small>
                        )}
                      </NavItem>
                    ))}
                  </HiddenItemsMenu>
                )}
              </>
            )}
            
            <ResetButton>
              Reset Navigation
            </ResetButton>
          </>
        )}
      </Nav>
    </div>
  );
}
```

## Props

### SmartNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | SmartNavigationItem[] | - | Array of navigation items to render |
| defaultActiveId | string | - | Default active item ID (uncontrolled) |
| activeId | string | - | Controlled active item ID |
| onActiveChange | (id: string) => void | - | Callback when active item changes |
| maxVisibleItems | number | Infinity | Maximum number of items to show before hiding |
| enableLearning | boolean | true | Whether to enable learning from user behavior |
| enableContextAwareness | boolean | false | Whether to enable context awareness |
| contextTags | string[] | [] | Current context tags to prioritize items by |
| storageKey | string | 'strive-ui-smart-navigation' | Storage key for persisting usage data |
| weightDecayFactor | number | 0.9 | Weight decay factor (0-1, lower means faster decay) |
| clickWeightBoost | number | 1 | Weight boost for each click |
| contextRelevanceBoost | number | 0.5 | Weight boost for contextual relevance |
| recencyWindow | number | 604800000 (7 days) | Time window in milliseconds for recency boost |
| ariaLabel | string | 'Smart navigation' | Aria label for the navigation |
| as | React.ElementType | 'nav' | The element type to render as |

### SmartNavigation.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | SmartNavigationItem | - | The navigation item data |
| as | React.ElementType | 'a' or 'div' if no href | The element type to render as |

### SmartNavigation.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | SmartNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### SmartNavigation.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | SmartNavigationItem | - | The navigation item data |
| as | React.ElementType | 'div' | The element type to render as |

### SmartNavigation.HiddenItems

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| ((items: SmartNavigationItem[]) => React.ReactNode) | - | Children to render inside the hidden items container |
| as | React.ElementType | 'div' | The element type to render as |

### SmartNavigation.ResetButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | 'Reset' | Children to render inside the reset button |
| as | React.ElementType | 'button' | The element type to render as |

### SmartNavigationItem Interface

```typescript
interface SmartNavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  initialWeight?: number;
  tags?: string[];
  data?: any;
}
```

### SmartNavigationUsageData Interface

```typescript
interface SmartNavigationUsageData {
  id: string;
  clickCount: number;
  lastClickTime: number;
  weight: number;
}
```

## Accessibility

The SmartNavigationHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="navigation"` for the container
- `role="menuitem"` for each item
- `aria-current` to indicate the active item
- `aria-disabled` to indicate disabled items
- Keyboard navigation support with Enter and Space keys
