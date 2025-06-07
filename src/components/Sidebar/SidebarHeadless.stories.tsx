import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './SidebarHeadless';
import styled from 'styled-components';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Navigation/SidebarHeadless',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Styled components for the examples
const StyledSidebar = styled(Sidebar)`
  width: 250px;
  background-color: #f7fafc;
  padding: 1rem;
  height: 100vh;
  border-right: 1px solid #e2e8f0;
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
  
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Container for the stories
const Container = styled.div`
  display: flex;
  height: 500px;
  border: 1px solid #e2e8f0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
`;

// Basic example
export const Basic: Story = {
  render: (args) => (
    <Container>
      <StyledSidebar defaultActiveItem="dashboard" {...args}>
        <StyledContent>
          <StyledItem id="dashboard">Dashboard</StyledItem>
          <StyledItem id="profile">Profile</StyledItem>
          <StyledItem id="settings">Settings</StyledItem>
          <StyledItem id="help">Help & Support</StyledItem>
        </StyledContent>
      </StyledSidebar>
      <Content>
        <h2>Main Content</h2>
        <p>Select an item from the sidebar to navigate.</p>
      </Content>
    </Container>
  ),
};

// With disabled item
export const WithDisabledItem: Story = {
  render: (args) => (
    <Container>
      <StyledSidebar defaultActiveItem="dashboard" {...args}>
        <StyledContent>
          <StyledItem id="dashboard">Dashboard</StyledItem>
          <StyledItem id="profile">Profile</StyledItem>
          <StyledItem id="settings" disabled>Settings</StyledItem>
          <StyledItem id="help">Help & Support</StyledItem>
        </StyledContent>
      </StyledSidebar>
      <Content>
        <h2>Main Content</h2>
        <p>The "Settings" item is disabled and cannot be selected.</p>
      </Content>
    </Container>
  ),
};

// Collapsible sidebar
const CollapsibleSidebar = styled(Sidebar)`
  width: ${props => props['data-expanded'] ? '250px' : '60px'};
  background-color: #2d3748;
  color: white;
  height: 100%;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const ToggleButton = styled(Sidebar.Toggle)`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: ${props => props['aria-expanded'] ? 'flex-end' : 'center'};
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const CollapsibleItem = styled(Sidebar.Item)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #cbd5e0;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
  
  .icon {
    margin-right: ${props => props['data-expanded'] ? '0.75rem' : '0'};
    font-size: 1.25rem;
    min-width: 24px;
    text-align: center;
  }
  
  .text {
    white-space: nowrap;
    opacity: ${props => props['data-expanded'] ? 1 : 0};
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

const CollapsibleExample = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <Container>
      <CollapsibleSidebar 
        defaultActiveItem="dashboard" 
        collapsible 
        expanded={isExpanded}
        onExpandedChange={setIsExpanded}
        data-expanded={isExpanded}
      >
        <ToggleButton data-expanded={isExpanded}>
          {isExpanded ? '◀' : '▶'}
        </ToggleButton>
        <StyledContent>
          <CollapsibleItem id="dashboard" data-expanded={isExpanded}>
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
          </CollapsibleItem>
          <CollapsibleItem id="profile" data-expanded={isExpanded}>
            <span className="icon">👤</span>
            <span className="text">Profile</span>
          </CollapsibleItem>
          <CollapsibleItem id="settings" data-expanded={isExpanded}>
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
          </CollapsibleItem>
          <CollapsibleItem id="help" data-expanded={isExpanded}>
            <span className="icon">❓</span>
            <span className="text">Help</span>
          </CollapsibleItem>
        </StyledContent>
      </CollapsibleSidebar>
      <Content>
        <h2>Main Content</h2>
        <p>Click the toggle button to collapse or expand the sidebar.</p>
      </Content>
    </Container>
  );
};

export const Collapsible: Story = {
  render: () => <CollapsibleExample />,
};

// Nested sidebar
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
  display: ${props => props['data-expanded'] ? 'block' : 'none'};
  padding-left: 1rem;
  margin-top: 0.25rem;
  
  ${StyledItem} {
    margin-bottom: 0.25rem;
  }
`;

const NestedItem = styled(StyledItem)`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
`;

export const Nested: Story = {
  render: (args) => (
    <Container>
      <StyledSidebar defaultActiveItem="performance" nested autoExpandParent {...args}>
        <StyledContent>
          <StyledItem id="dashboard">Dashboard</StyledItem>
          
          <StyledSection id="reports">
            <StyledSectionTitle>
              <span>Reports</span>
              <span className="chevron">▼</span>
            </StyledSectionTitle>
            <StyledSectionContent>
              <NestedItem id="sales">Sales Report</NestedItem>
              <NestedItem id="inventory">Inventory Report</NestedItem>
              <NestedItem id="customers">Customer Report</NestedItem>
            </StyledSectionContent>
          </StyledSection>
          
          <StyledSection id="analytics">
            <StyledSectionTitle>
              <span>Analytics</span>
              <span className="chevron">▼</span>
            </StyledSectionTitle>
            <StyledSectionContent>
              <NestedItem id="performance">Performance</NestedItem>
              <NestedItem id="traffic">Traffic</NestedItem>
              <NestedItem id="conversion">Conversion</NestedItem>
            </StyledSectionContent>
          </StyledSection>
          
          <StyledItem id="settings">Settings</StyledItem>
        </StyledContent>
      </StyledSidebar>
      <Content>
        <h2>Main Content</h2>
        <p>Click on section titles to expand or collapse them.</p>
        <p>When you select a nested item, its parent section will automatically expand.</p>
      </Content>
    </Container>
  ),
};

// Controlled sidebar
const ControlledExample = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
          <h3>Controls</h3>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Active Item:</strong> {activeItem}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Sidebar:</strong> {isExpanded ? 'Expanded' : 'Collapsed'}
          </div>
          <div>
            <button onClick={() => setIsExpanded(!isExpanded)} style={{ marginRight: '0.5rem' }}>
              {isExpanded ? 'Collapse' : 'Expand'} Sidebar
            </button>
            <select 
              value={activeItem} 
              onChange={(e) => setActiveItem(e.target.value)}
              style={{ padding: '0.25rem' }}
            >
              <option value="dashboard">Dashboard</option>
              <option value="profile">Profile</option>
              <option value="settings">Settings</option>
              <option value="help">Help</option>
            </select>
          </div>
        </div>
        
        <StyledSidebar 
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
          style={{ flex: 1, height: 'auto' }}
        >
          <StyledContent>
            <StyledItem id="dashboard">Dashboard</StyledItem>
            <StyledItem id="profile">Profile</StyledItem>
            <StyledItem id="settings">Settings</StyledItem>
            <StyledItem id="help">Help & Support</StyledItem>
          </StyledContent>
        </StyledSidebar>
      </div>
      <Content>
        <h2>Main Content</h2>
        <p>This example demonstrates a controlled sidebar where the active item and expanded state are managed externally.</p>
        <p>Use the controls above to change the active item or toggle the sidebar.</p>
      </Content>
    </Container>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Modern styled sidebar
const ModernSidebar = styled(Sidebar)`
  width: 280px;
  background-color: white;
  height: 100%;
  border-right: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3182ce;
`;

const ModernContent = styled(Sidebar.Content)`
  padding: 1rem;
`;

const ModernItem = styled(Sidebar.Item)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .icon {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &[data-state="active"] {
    background-color: #ebf8ff;
    color: #3182ce;
    font-weight: 500;
  }
  
  &:hover:not([disabled]) {
    background-color: #f7fafc;
    transform: translateX(2px);
  }
`;

const ModernSection = styled(Sidebar.Section)`
  margin-bottom: 0.5rem;
`;

const ModernSectionTitle = styled(Sidebar.SectionTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  
  .chevron {
    transition: transform 0.2s ease;
    transform: ${props => props['data-state'] === 'expanded' ? 'rotate(180deg)' : 'rotate(0deg)'};
    font-size: 0.75rem;
  }
`;

const ModernSectionContent = styled(Sidebar.SectionContent)`
  overflow: hidden;
  max-height: ${props => props['data-expanded'] ? '500px' : '0'};
  transition: max-height 0.3s ease;
`;

export const ModernStyled: Story = {
  render: (args) => (
    <Container>
      <ModernSidebar defaultActiveItem="dashboard" nested autoExpandParent {...args}>
        <SidebarHeader>
          <Logo>Pulse UI</Logo>
        </SidebarHeader>
        <ModernContent>
          <ModernItem id="dashboard">
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </ModernItem>
          
          <ModernSection id="management">
            <ModernSectionTitle>
              <span>Management</span>
              <span className="chevron">▼</span>
            </ModernSectionTitle>
            <ModernSectionContent>
              <ModernItem id="users">
                <span className="icon">👥</span>
                <span>Users</span>
              </ModernItem>
              <ModernItem id="products">
                <span className="icon">📦</span>
                <span>Products</span>
              </ModernItem>
              <ModernItem id="orders">
                <span className="icon">🛒</span>
                <span>Orders</span>
              </ModernItem>
            </ModernSectionContent>
          </ModernSection>
          
          <ModernSection id="reports">
            <ModernSectionTitle>
              <span>Reports</span>
              <span className="chevron">▼</span>
            </ModernSectionTitle>
            <ModernSectionContent>
              <ModernItem id="analytics">
                <span className="icon">📈</span>
                <span>Analytics</span>
              </ModernItem>
              <ModernItem id="exports">
                <span className="icon">📤</span>
                <span>Exports</span>
              </ModernItem>
            </ModernSectionContent>
          </ModernSection>
          
          <ModernItem id="settings">
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </ModernItem>
          
          <ModernItem id="help">
            <span className="icon">❓</span>
            <span>Help & Support</span>
          </ModernItem>
        </ModernContent>
      </ModernSidebar>
      <Content>
        <h2>Main Content</h2>
        <p>This example demonstrates a modern styled sidebar with sections and items.</p>
      </Content>
    </Container>
  ),
};
