# NavbarHeadless

A headless implementation of a navigation bar that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining accessibility and responsive behavior.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Responsive**: Built-in collapsible functionality for mobile views
- **Controlled or uncontrolled**: Works in both modes for active items and expanded state

## Basic Usage

```jsx
import { Navbar } from 'pulseui';
import styled from 'styled-components';

// Create your own styled components
const StyledNavbar = styled(Navbar)`
  background-color: #2d3748;
  padding: 1rem;
  color: white;
`;

const StyledBrand = styled(Navbar.Brand)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
`;

const StyledContent = styled(Navbar.Content)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledNavItem = styled(Navbar.Item)`
  color: #cbd5e0;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  
  &[data-state="active"] {
    color: white;
    background-color: #4a5568;
  }
  
  &:hover:not([disabled]) {
    background-color: #4a5568;
  }
`;

function MyNavbar() {
  return (
    <StyledNavbar defaultActiveItem="home">
      <StyledBrand>My App</StyledBrand>
      <StyledContent>
        <StyledNavItem id="home" href="/">Home</StyledNavItem>
        <StyledNavItem id="about" href="/about">About</StyledNavItem>
        <StyledNavItem id="services" href="/services">Services</StyledNavItem>
        <StyledNavItem id="contact" href="/contact">Contact</StyledNavItem>
      </StyledContent>
    </StyledNavbar>
  );
}
```

## Responsive Navbar

```jsx
import { Navbar } from 'pulseui';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const StyledNavbar = styled(Navbar)`
  background-color: #2d3748;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBrand = styled(Navbar.Brand)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const StyledToggle = styled(Navbar.Toggle)`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const StyledContent = styled(Navbar.Content)`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 4rem;
    left: 0;
    right: 0;
    background-color: #2d3748;
    flex-direction: column;
    padding: 1rem;
    transform: ${props => props['data-expanded'] ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props['data-expanded'] ? '1' : '0'};
    visibility: ${props => props['data-expanded'] ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 10;
  }
`;

const StyledNavItem = styled(Navbar.Item)`
  color: #cbd5e0;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  
  &[data-state="active"] {
    color: white;
    background-color: #4a5568;
  }
  
  &:hover:not([disabled]) {
    background-color: #4a5568;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

function ResponsiveNavbar() {
  return (
    <StyledNavbar defaultActiveItem="home" collapsible defaultExpanded={false}>
      <StyledBrand>My App</StyledBrand>
      <StyledToggle>
        {({ isExpanded }) => isExpanded ? <FaTimes /> : <FaBars />}
      </StyledToggle>
      <StyledContent>
        <StyledNavItem id="home" href="/">Home</StyledNavItem>
        <StyledNavItem id="about" href="/about">About</StyledNavItem>
        <StyledNavItem id="services" href="/services">Services</StyledNavItem>
        <StyledNavItem id="contact" href="/contact">Contact</StyledNavItem>
      </StyledContent>
    </StyledNavbar>
  );
}
```

## Controlled Navbar

```jsx
import { useState } from 'react';
import { Navbar } from 'pulseui';
import styled from 'styled-components';

function ControlledNavbar() {
  const [activeItem, setActiveItem] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Navbar 
      activeItem={activeItem} 
      onActiveChange={(id) => {
        console.log(`Navigation to ${id}`);
        setActiveItem(id);
      }}
      collapsible
      expanded={isExpanded}
      onExpandedChange={(expanded) => {
        console.log(`Navbar ${expanded ? 'expanded' : 'collapsed'}`);
        setIsExpanded(expanded);
      }}
    >
      <Navbar.Brand>My App</Navbar.Brand>
      <Navbar.Toggle>Menu</Navbar.Toggle>
      <Navbar.Content>
        <Navbar.Item id="home" href="/">Home</Navbar.Item>
        <Navbar.Item id="about" href="/about">About</Navbar.Item>
        <Navbar.Item id="services" href="/services">Services</Navbar.Item>
        <Navbar.Item id="contact" href="/contact">Contact</Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
}
```

## Polymorphic Usage

```jsx
import { Navbar } from 'pulseui';

function PolymorphicNavbar() {
  return (
    <Navbar as="header">
      <Navbar.Brand as="h1">My App</Navbar.Brand>
      <Navbar.Toggle as="span" role="button">Menu</Navbar.Toggle>
      <Navbar.Content as="nav">
        <Navbar.Item id="home" as="a" href="/">Home</Navbar.Item>
        <Navbar.Item id="about" as="a" href="/about">About</Navbar.Item>
        <Navbar.Item id="services" as="button" onClick={() => showServices()}>Services</Navbar.Item>
        <Navbar.Item id="contact" as="a" href="/contact">Contact</Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
}
```

## Props

### Navbar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultActiveItem | string | - | The ID of the initially active item |
| activeItem | string | - | The ID of the controlled active item |
| onActiveChange | (itemId: string) => void | - | Callback when active item changes |
| collapsible | boolean | false | Whether the navbar is collapsible on smaller screens |
| defaultExpanded | boolean | false | Whether the navbar is initially expanded (when collapsible) |
| expanded | boolean | - | Whether the navbar is controlled expanded (when collapsible) |
| onExpandedChange | (expanded: boolean) => void | - | Callback when expanded state changes |
| as | React.ElementType | 'nav' | The element type to render as |

### Navbar.Brand

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Navbar.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'button' | The element type to render as |

### Navbar.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### Navbar.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | The ID of the navbar item (required) |
| disabled | boolean | false | Whether the item is disabled |
| as | React.ElementType | 'a' | The element type to render as |

## Accessibility

- Follows WAI-ARIA Navigation Pattern
- Proper ARIA roles and attributes
- `aria-current="page"` for the active item
- `aria-expanded` for the toggle button
- `aria-controls` for the toggle button to reference the content
- `aria-label` for the toggle button
- `aria-disabled` for disabled items
