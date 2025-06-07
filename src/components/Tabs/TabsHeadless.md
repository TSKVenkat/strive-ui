# TabsHeadless

A headless implementation of tabs that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining accessibility and keyboard navigation features.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes and keyboard navigation
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Controlled or uncontrolled**: Works in both modes
- **Keyboard navigation**: Full keyboard support with customizable activation behavior
- **Vertical tabs support**: Works in both horizontal and vertical orientations

## Basic Usage

```jsx
import { Tabs } from 'pulseui';
import styled from 'styled-components';

// Create your own styled components
const StyledTabList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
`;

const StyledTab = styled(Tabs.Tab)`
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: ${props => props['data-state'] === 'active' ? 'bold' : 'normal'};
  border-bottom: 2px solid ${props => props['data-state'] === 'active' ? '#3182ce' : 'transparent'};
  
  &:hover {
    color: #3182ce;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
`;

const StyledTabPanel = styled(Tabs.Panel)`
  padding: 1rem 0;
`;

function MyTabs() {
  return (
    <Tabs defaultTab="tab1">
      <StyledTabList>
        <StyledTab id="tab1">First Tab</StyledTab>
        <StyledTab id="tab2">Second Tab</StyledTab>
        <StyledTab id="tab3" disabled>Disabled Tab</StyledTab>
      </StyledTabList>
      <Tabs.Panels>
        <StyledTabPanel id="tab1">
          Content for the first tab
        </StyledTabPanel>
        <StyledTabPanel id="tab2">
          Content for the second tab
        </StyledTabPanel>
        <StyledTabPanel id="tab3">
          Content for the disabled tab
        </StyledTabPanel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

## Advanced Usage

### Vertical Tabs

```jsx
import { Tabs } from 'pulseui';
import styled from 'styled-components';

const VerticalTabsContainer = styled(Tabs)`
  display: flex;
`;

const VerticalTabList = styled(Tabs.List)`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  width: 200px;
`;

const VerticalTab = styled(Tabs.Tab)`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  border-right: 2px solid ${props => props['data-state'] === 'active' ? '#3182ce' : 'transparent'};
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
`;

const VerticalTabPanels = styled(Tabs.Panels)`
  flex: 1;
  padding-left: 1rem;
`;

function VerticalTabs() {
  return (
    <VerticalTabsContainer orientation="vertical">
      <VerticalTabList>
        <VerticalTab id="tab1">Dashboard</VerticalTab>
        <VerticalTab id="tab2">Profile</VerticalTab>
        <VerticalTab id="tab3">Settings</VerticalTab>
      </VerticalTabList>
      <VerticalTabPanels>
        <Tabs.Panel id="tab1">Dashboard content</Tabs.Panel>
        <Tabs.Panel id="tab2">Profile content</Tabs.Panel>
        <Tabs.Panel id="tab3">Settings content</Tabs.Panel>
      </VerticalTabPanels>
    </VerticalTabsContainer>
  );
}
```

### Controlled Tabs

```jsx
import { useState } from 'react';
import { Tabs } from 'pulseui';

function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <Tabs 
      activeTab={activeTab} 
      onChange={(tabId) => {
        console.log(`Tab changed to ${tabId}`);
        setActiveTab(tabId);
      }}
    >
      <Tabs.List>
        <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
        <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

### Customizing Keyboard Behavior

```jsx
import { Tabs } from 'pulseui';

function CustomKeyboardTabs() {
  return (
    <Tabs 
      // Tabs will only activate on click, not on arrow key navigation
      manual={true}
      // Alternatively, you can make tabs activate on focus
      // activateOnFocus={true}
    >
      <Tabs.List>
        <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
        <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

### Polymorphic Usage

```jsx
import { Tabs } from 'pulseui';

function PolymorphicTabs() {
  return (
    <Tabs as="section">
      <Tabs.List as="nav">
        <Tabs.Tab id="tab1" as="a" href="#tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2" as="a" href="#tab2">Tab 2</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels as="main">
        <Tabs.Panel id="tab1" as="article">Content 1</Tabs.Panel>
        <Tabs.Panel id="tab2" as="article">Content 2</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

## Props

### Tabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultTab | string | - | The ID of the initially active tab |
| activeTab | string | - | The ID of the controlled active tab |
| onChange | (tabId: string) => void | - | Callback when active tab changes |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | The orientation of the tabs |
| activateOnFocus | boolean | false | Whether tabs should automatically activate on focus |
| manual | boolean | false | Whether the tabs should be manually activated (only via click) |
| as | React.ElementType | 'div' | The element type to render as |

### Tabs.List

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Tabs.Tab

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | The ID of the tab (required) |
| disabled | boolean | false | Whether the tab is disabled |
| as | React.ElementType | 'button' | The element type to render as |

### Tabs.Panels

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Tabs.Panel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | The ID of the tab panel (must match a tab ID) |
| as | React.ElementType | 'div' | The element type to render as |

## Accessibility

- Follows WAI-ARIA Tabs Pattern
- Proper ARIA roles, states, and properties
- Keyboard navigation:
  - Tab: Move focus to the active tab
  - Arrow keys: Navigate between tabs
  - Home/End: Navigate to first/last tab
  - Enter/Space: Activate tab
- Focus management
- Screen reader announcements
