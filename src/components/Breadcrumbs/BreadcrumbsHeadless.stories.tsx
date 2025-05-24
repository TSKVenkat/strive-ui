import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './BreadcrumbsHeadless';
import styled from 'styled-components';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/BreadcrumbsHeadless',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// Styled components for the examples
const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 0.375rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const StyledList = styled(Breadcrumbs.List)`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledItem = styled(Breadcrumbs.Item)`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Breadcrumbs.Link)`
  color: ${props => props['data-current'] ? '#1a202c' : '#4a5568'};
  text-decoration: ${props => props['data-current'] ? 'none' : 'underline'};
  font-weight: ${props => props['data-current'] ? 'bold' : 'normal'};
  cursor: ${props => props['data-current'] ? 'default' : 'pointer'};
  
  &:hover:not([data-current="true"]) {
    color: #3182ce;
  }
  
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const StyledSeparator = styled(Breadcrumbs.Separator)`
  margin: 0 0.5rem;
  color: #a0aec0;
`;

const StyledCollapsed = styled(Breadcrumbs.Collapsed)`
  margin: 0 0.5rem;
  color: #4a5568;
  cursor: pointer;
  
  &:hover {
    color: #3182ce;
  }
`;

// Basic example
export const Basic: Story = {
  render: (args) => {
    const items = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
      { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true },
    ];
    
    return (
      <StyledBreadcrumbs 
        items={items}
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
        {...args}
      >
        <StyledList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <StyledSeparator>/</StyledSeparator>}
              <StyledItem item={item}>
                <StyledLink item={item}>{item.label}</StyledLink>
              </StyledItem>
            </React.Fragment>
          ))}
        </StyledList>
      </StyledBreadcrumbs>
    );
  },
};

// With disabled item
export const WithDisabledItem: Story = {
  render: (args) => {
    const items = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'electronics', label: 'Electronics', href: '/products/electronics', disabled: true },
      { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true },
    ];
    
    return (
      <StyledBreadcrumbs 
        items={items}
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
        {...args}
      >
        <StyledList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <StyledSeparator>/</StyledSeparator>}
              <StyledItem item={item}>
                <StyledLink item={item}>{item.label}</StyledLink>
              </StyledItem>
            </React.Fragment>
          ))}
        </StyledList>
      </StyledBreadcrumbs>
    );
  },
};

// Collapsible breadcrumbs
const CollapsibleExample = () => {
  const [showAll, setShowAll] = useState(false);
  
  const items = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
    { id: 'computers', label: 'Computers', href: '/products/electronics/computers' },
    { id: 'laptops', label: 'Laptops', href: '/products/electronics/computers/laptops' },
    { id: 'gaming', label: 'Gaming', href: '/products/electronics/computers/laptops/gaming' },
    { id: 'asus', label: 'Asus ROG', href: '/products/electronics/computers/laptops/gaming/asus-rog', isCurrent: true },
  ];
  
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Collapse' : 'Show All'} Breadcrumbs
        </button>
      </div>
      
      <StyledBreadcrumbs 
        items={items}
        maxItems={showAll ? undefined : 4}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
      >
        <StyledList>
          {({ items: visibleItems, isCollapsed, collapsedItems }) => (
            <>
              {visibleItems.map((item, index, array) => (
                <React.Fragment key={item.id}>
                  {index > 0 && index === 1 && isCollapsed && (
                    <>
                      <StyledSeparator>/</StyledSeparator>
                      <StyledCollapsed onClick={() => setShowAll(true)}>
                        ...{collapsedItems.length} more
                      </StyledCollapsed>
                    </>
                  )}
                  {index > 0 && (index > 1 || !isCollapsed) && <StyledSeparator>/</StyledSeparator>}
                  <StyledItem item={item}>
                    <StyledLink item={item}>{item.label}</StyledLink>
                  </StyledItem>
                </React.Fragment>
              ))}
            </>
          )}
        </StyledList>
      </StyledBreadcrumbs>
    </div>
  );
};

export const Collapsible: Story = {
  render: () => <CollapsibleExample />,
};

// With custom separator
export const CustomSeparator: Story = {
  render: (args) => {
    const items = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
      { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true },
    ];
    
    const ChevronSeparator = styled(Breadcrumbs.Separator)`
      margin: 0 0.5rem;
      color: #a0aec0;
    `;
    
    return (
      <StyledBreadcrumbs 
        items={items}
        separator=">"
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
        {...args}
      >
        <StyledList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <ChevronSeparator>›</ChevronSeparator>}
              <StyledItem item={item}>
                <StyledLink item={item}>{item.label}</StyledLink>
              </StyledItem>
            </React.Fragment>
          ))}
        </StyledList>
      </StyledBreadcrumbs>
    );
  },
};

// With icons
export const WithIcons: Story = {
  render: (args) => {
    const items = [
      { id: 'home', label: 'Home', href: '/', icon: '🏠' },
      { id: 'products', label: 'Products', href: '/products', icon: '📦' },
      { id: 'electronics', label: 'Electronics', href: '/products/electronics', icon: '💻' },
      { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true, icon: '💻' },
    ];
    
    const IconLink = styled(StyledLink)`
      display: flex;
      align-items: center;
      
      .icon {
        margin-right: 0.25rem;
      }
    `;
    
    return (
      <StyledBreadcrumbs 
        items={items}
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
        {...args}
      >
        <StyledList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <StyledSeparator>/</StyledSeparator>}
              <StyledItem item={item}>
                <IconLink item={item}>
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </IconLink>
              </StyledItem>
            </React.Fragment>
          ))}
        </StyledList>
      </StyledBreadcrumbs>
    );
  },
};

// Modern styled breadcrumbs
export const ModernStyled: Story = {
  render: (args) => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
      { id: 'users', label: 'Users', href: '/dashboard/users' },
      { id: 'settings', label: 'Settings', href: '/dashboard/users/settings' },
      { id: 'profile', label: 'Profile', href: '/dashboard/users/settings/profile', isCurrent: true },
    ];
    
    const ModernBreadcrumbs = styled(Breadcrumbs)`
      padding: 0.75rem 1rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const ModernList = styled(Breadcrumbs.List)`
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    `;
    
    const ModernItem = styled(Breadcrumbs.Item)`
      display: flex;
      align-items: center;
    `;
    
    const ModernLink = styled(Breadcrumbs.Link)`
      color: ${props => props['data-current'] ? '#3182ce' : '#718096'};
      text-decoration: none;
      font-weight: ${props => props['data-current'] ? '600' : '400'};
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      
      &:hover:not([data-current="true"]) {
        background-color: #f7fafc;
        color: #4a5568;
      }
    `;
    
    const ModernSeparator = styled(Breadcrumbs.Separator)`
      margin: 0 0.25rem;
      color: #cbd5e0;
      font-size: 0.75rem;
    `;
    
    return (
      <ModernBreadcrumbs 
        items={items}
        onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
        {...args}
      >
        <ModernList>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <ModernSeparator>/</ModernSeparator>}
              <ModernItem item={item}>
                <ModernLink item={item}>{item.label}</ModernLink>
              </ModernItem>
            </React.Fragment>
          ))}
        </ModernList>
      </ModernBreadcrumbs>
    );
  },
};
