# SidebarHeadless

A headless implementation of a sidebar navigation that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining accessibility and proper interaction patterns.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Collapsible**: Built-in collapsible functionality for responsive layouts
- **Nested navigation**: Support for nested sections and items
- **Controlled or uncontrolled**: Works in both modes for active items and expanded state

## Basic Usage

```jsx
import { Sidebar } from 'pulseui';
import styled from 'styled-components';

// Create your own styled components
const StyledSidebar = styled(Sidebar)`
  width: 250px;
  background-color: #f7fafc;
  padding: 1rem;
  height: 100vh;
`;

const StyledContent = styled(Sidebar.Content)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledItem = styled(Sidebar.Item)`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  
  &[data-state="active"] {
    background-color: #ebf8ff;
    color: #3182ce;
    font-weight: 500;
  }
  
  &:hover:not([disabled]) {
    background-color: #e2e8f0;
  }
`;

function MySidebar() {
  return (
    <StyledSidebar defaultActiveItem="dashboard">
      <StyledContent>
        <StyledItem id="dashboard" href="/dashboard">Dashboard</StyledItem>
        <StyledItem id="profile" href="/profile">Profile</StyledItem>
        <StyledItem id="settings" href="/settings">Settings</StyledItem>
        <StyledItem id="help" href="/help">Help & Support</StyledItem>
      </StyledContent>
    </StyledSidebar>
  );
}
```

## Collapsible Sidebar

```jsx
import { Sidebar } from 'pulseui';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const StyledSidebar = styled(Sidebar)`
  width: ${props => props['data-expanded'] ? '250px' : '60px'};
  background-color: #2d3748;
  color: white;
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const StyledToggle = styled(Sidebar.Toggle)`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: ${props => props['aria-expanded'] ? 'flex-end' : 'center'};
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
`;

const StyledContent = styled(Sidebar.Content)`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const StyledItem = styled(Sidebar.Item)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #cbd5e0;
  text-decoration: none;
  cursor: pointer;
  
  .icon {
    margin-right: ${props => props.theme.isExpanded ? '0.75rem' : '0'};
    font-size: 1.25rem;
  }
  
  .text {
    white-space: nowrap;
    opacity: ${props => props.theme.isExpanded ? 1 : 0};
    transition: opacity 0.2s ease;
  }
  
  &[data-state="active"] {
    background-color: #4a5568;
    color: white;
  }
  
  &:hover:not([disabled]) {
    background-color: #4a5568;
  }
`;

function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <ThemeProvider theme={{ isExpanded }}>
      <StyledSidebar 
        defaultActiveItem="dashboard" 
        collapsible 
        expanded={isExpanded}
        onExpandedChange={setIsExpanded}
        data-expanded={isExpanded}
      >
        <StyledToggle>
          {isExpanded ? <FaTimes /> : <FaBars />}
        </StyledToggle>
        <StyledContent>
          <StyledItem id="dashboard" href="/dashboard">
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
          </StyledItem>
          <StyledItem id="profile" href="/profile">
            <span className="icon">👤</span>
            <span className="text">Profile</span>
          </StyledItem>
          <StyledItem id="settings" href="/settings">
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
          </StyledItem>
          <StyledItem id="help" href="/help">
            <span className="icon">❓</span>
            <span className="text">Help & Support</span>
          </StyledItem>
        </StyledContent>
      </StyledSidebar>
    </ThemeProvider>
  );
}
```

## Nested Sidebar

```jsx
import { Sidebar } from 'pulseui';
import styled from 'styled-components';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const StyledSidebar = styled(Sidebar)`
  width: 280px;
  background-color: #f7fafc;
  padding: 1rem;
  height: 100vh;
`;

const StyledContent = styled(Sidebar.Content)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledItem = styled(Sidebar.Item)`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  
  &[data-state="active"] {
    background-color: #ebf8ff;
    color: #3182ce;
    font-weight: 500;
  }
  
  &:hover:not([disabled]) {
    background-color: #e2e8f0;
  }
`;

const StyledSection = styled(Sidebar.Section)`
  margin-bottom: 0.25rem;
`;

const StyledSectionTitle = styled(Sidebar.SectionTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  color: #2d3748;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #e2e8f0;
  }
  
  .chevron {
    transition: transform 0.2s ease;
    transform: ${props => props['data-state'] === 'expanded' ? 'rotate(0deg)' : 'rotate(-90deg)'};
  }
`;

const StyledSectionContent = styled(Sidebar.SectionContent)`
  display: ${props => props['data-expanded'] ? 'flex' : 'none'};
  flex-direction: column;
  padding-left: 1rem;
  gap: 0.25rem;
`;

function NestedSidebar() {
  return (
    <StyledSidebar defaultActiveItem="analytics" nested autoExpandParent>
      <StyledContent>
        <StyledItem id="dashboard" href="/dashboard">Dashboard</StyledItem>
        
        <StyledSection id="reports">
          <StyledSectionTitle>
            <span>Reports</span>
            <span className="chevron">
              <FaChevronDown />
            </span>
          </StyledSectionTitle>
          <StyledSectionContent>
            <StyledItem id="sales" href="/reports/sales">Sales Report</StyledItem>
            <StyledItem id="inventory" href="/reports/inventory">Inventory Report</StyledItem>
            <StyledItem id="customers" href="/reports/customers">Customer Report</StyledItem>
          </StyledSectionContent>
        </StyledSection>
        
        <StyledSection id="analytics">
          <StyledSectionTitle>
            <span>Analytics</span>
            <span className="chevron">
              <FaChevronDown />
            </span>
          </StyledSectionTitle>
          <StyledSectionContent>
            <StyledItem id="performance" href="/analytics/performance">Performance</StyledItem>
            <StyledItem id="traffic" href="/analytics/traffic">Traffic</StyledItem>
            <StyledItem id="conversion" href="/analytics/conversion">Conversion</StyledItem>
          </StyledSectionContent>
        </StyledSection>
        
        <StyledItem id="settings" href="/settings">Settings</StyledItem>
      </StyledContent>
    </StyledSidebar>
  );
}
```

## Controlled Sidebar

```jsx
import { useState } from 'react';
import { Sidebar } from 'pulseui';
import styled from 'styled-components';

function ControlledSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    reports: true,
    analytics: false
  });
  
  const handleSectionToggle = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  return (
    <Sidebar 
      activeItem={activeItem} 
      onActiveChange={(id) => {
        console.log(`Navigation to ${id}`);
        setActiveItem(id);
      }}
      collapsible
      expanded={isExpanded}
      onExpandedChange={(expanded) => {
        console.log(`Sidebar ${expanded ? 'expanded' : 'collapsed'}`);
        setIsExpanded(expanded);
      }}
      nested
    >
      <Sidebar.Toggle>
        {isExpanded ? 'Collapse' : 'Expand'}
      </Sidebar.Toggle>
      <Sidebar.Content>
        <Sidebar.Item id="dashboard" href="/dashboard">Dashboard</Sidebar.Item>
        
        {/* You would need to implement custom section expansion logic */}
        <Sidebar.Section id="reports">
          <Sidebar.SectionTitle onClick={() => handleSectionToggle('reports')}>
            Reports {expandedSections.reports ? '▼' : '▶'}
          </Sidebar.SectionTitle>
          {expandedSections.reports && (
            <div>
              <Sidebar.Item id="sales" href="/reports/sales">Sales Report</Sidebar.Item>
              <Sidebar.Item id="inventory" href="/reports/inventory">Inventory Report</Sidebar.Item>
            </div>
          )}
        </Sidebar.Section>
        
        <Sidebar.Item id="settings" href="/settings">Settings</Sidebar.Item>
      </Sidebar.Content>
    </Sidebar>
  );
}
```

## Props

### Sidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultActiveItem | string | - | The ID of the initially active item |
| activeItem | string | - | The ID of the controlled active item |
| onActiveChange | (itemId: string) => void | - | Callback when active item changes |
| collapsible | boolean | false | Whether the sidebar is collapsible |
| defaultExpanded | boolean | true | Whether the sidebar is initially expanded (when collapsible) |
| expanded | boolean | - | Whether the sidebar is controlled expanded (when collapsible) |
| onExpandedChange | (expanded: boolean) => void | - | Callback when expanded state changes |
| nested | boolean | false | Whether the sidebar supports nested items |
| autoExpandParent | boolean | true | Whether to auto-expand parent items when a child is active |
| as | React.ElementType | 'aside' | The element type to render as |

### Sidebar.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'button' | The element type to render as |

### Sidebar.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Sidebar.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | The ID of the sidebar item (required) |
| parentId | string | - | ID of the parent section (for nested items) |
| disabled | boolean | false | Whether the item is disabled |
| as | React.ElementType | 'a' | The element type to render as |

### Sidebar.Section

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | The ID of the sidebar section (required) |
| parentId | string | - | ID of the parent section (for nested sections) |
| disabled | boolean | false | Whether the section is disabled |
| as | React.ElementType | 'div' | The element type to render as |

### Sidebar.SectionTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Sidebar.SectionContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

## Accessibility

- Follows WAI-ARIA Navigation Pattern
- Proper ARIA roles and attributes
- `aria-current="page"` for the active item
- `aria-expanded` for collapsible sections
- `aria-controls` for section titles to reference their content
- `aria-disabled` for disabled items
