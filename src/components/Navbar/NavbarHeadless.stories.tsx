import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './NavbarHeadless';
import styled from 'styled-components';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navigation/NavbarHeadless',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// Styled components for the examples
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
  cursor: pointer;
  
  &[data-state="active"] {
    color: white;
    background-color: #4a5568;
  }
  
  &:hover:not([disabled]) {
    background-color: #4a5568;
  }
  
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Basic example
export const Basic: Story = {
  render: (args) => (
    <StyledNavbar defaultActiveItem="home" {...args}>
      <StyledBrand>My App</StyledBrand>
      <StyledContent>
        <StyledNavItem id="home">Home</StyledNavItem>
        <StyledNavItem id="about">About</StyledNavItem>
        <StyledNavItem id="services">Services</StyledNavItem>
        <StyledNavItem id="contact">Contact</StyledNavItem>
      </StyledContent>
    </StyledNavbar>
  ),
};

// With disabled item
export const WithDisabledItem: Story = {
  render: (args) => (
    <StyledNavbar defaultActiveItem="home" {...args}>
      <StyledBrand>My App</StyledBrand>
      <StyledContent>
        <StyledNavItem id="home">Home</StyledNavItem>
        <StyledNavItem id="about">About</StyledNavItem>
        <StyledNavItem id="services" disabled>Services</StyledNavItem>
        <StyledNavItem id="contact">Contact</StyledNavItem>
      </StyledContent>
    </StyledNavbar>
  ),
};

// Responsive navbar
const ResponsiveNavbar = styled(Navbar)`
  background-color: #2d3748;
  padding: 1rem;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const NavbarToggle = styled(Navbar.Toggle)`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ResponsiveContent = styled(Navbar.Content)`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: ${props => props['data-expanded'] ? 'flex' : 'none'};
    flex-basis: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
    width: 100%;
  }
`;

export const Responsive: Story = {
  render: (args) => (
    <ResponsiveNavbar defaultActiveItem="home" collapsible defaultExpanded={false} {...args}>
      <StyledBrand>My App</StyledBrand>
      <NavbarToggle>☰</NavbarToggle>
      <ResponsiveContent>
        <StyledNavItem id="home">Home</StyledNavItem>
        <StyledNavItem id="about">About</StyledNavItem>
        <StyledNavItem id="services">Services</StyledNavItem>
        <StyledNavItem id="contact">Contact</StyledNavItem>
      </ResponsiveContent>
    </ResponsiveNavbar>
  ),
};

// Controlled navbar
const ControlledExample = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f7fafc' }}>
        <p>Current active item: <strong>{activeItem}</strong></p>
        <p>Navbar is: <strong>{isExpanded ? 'expanded' : 'collapsed'}</strong></p>
        <div>
          <button onClick={() => setActiveItem('home')} style={{ marginRight: '0.5rem' }}>
            Activate Home
          </button>
          <button onClick={() => setActiveItem('about')} style={{ marginRight: '0.5rem' }}>
            Activate About
          </button>
          <button onClick={() => setActiveItem('services')} style={{ marginRight: '0.5rem' }}>
            Activate Services
          </button>
          <button onClick={() => setActiveItem('contact')} style={{ marginRight: '0.5rem' }}>
            Activate Contact
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'} Navbar
          </button>
        </div>
      </div>
      
      <ResponsiveNavbar 
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
        <StyledBrand>My App</StyledBrand>
        <NavbarToggle>☰</NavbarToggle>
        <ResponsiveContent>
          <StyledNavItem id="home">Home</StyledNavItem>
          <StyledNavItem id="about">About</StyledNavItem>
          <StyledNavItem id="services">Services</StyledNavItem>
          <StyledNavItem id="contact">Contact</StyledNavItem>
        </ResponsiveContent>
      </ResponsiveNavbar>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Modern styled navbar
const ModernNavbar = styled(Navbar)`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ModernBrand = styled(Navbar.Brand)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3182ce;
`;

const ModernToggle = styled(Navbar.Toggle)`
  display: none;
  background: none;
  border: none;
  color: #4a5568;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ModernContent = styled(Navbar.Content)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: ${props => props['data-expanded'] ? 'flex' : 'none'};
    position: absolute;
    top: 4rem;
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
`;

const ModernNavItem = styled(Navbar.Item)`
  color: #4a5568;
  text-decoration: none;
  padding: 0.5rem;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3182ce;
    transition: width 0.3s ease;
  }
  
  &[data-state="active"] {
    color: #3182ce;
    
    &::after {
      width: 100%;
    }
  }
  
  &:hover:not([disabled]) {
    color: #3182ce;
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 1rem;
    
    &::after {
      display: none;
    }
    
    &[data-state="active"] {
      background-color: #ebf8ff;
    }
    
    &:hover:not([disabled]) {
      background-color: #ebf8ff;
    }
  }
`;

export const ModernStyled: Story = {
  render: (args) => (
    <ModernNavbar defaultActiveItem="home" collapsible defaultExpanded={false} {...args}>
              <ModernBrand>Pulse UI</ModernBrand>
      <ModernToggle>☰</ModernToggle>
      <ModernContent>
        <ModernNavItem id="home">Home</ModernNavItem>
        <ModernNavItem id="components">Components</ModernNavItem>
        <ModernNavItem id="docs">Documentation</ModernNavItem>
        <ModernNavItem id="examples">Examples</ModernNavItem>
        <ModernNavItem id="github">GitHub</ModernNavItem>
      </ModernContent>
    </ModernNavbar>
  ),
};
