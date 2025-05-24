import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './TabsHeadless';
import styled from 'styled-components';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs/TabsHeadless',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Styled components for the examples
const StyledTabList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
`;

const StyledTab = styled(Tabs.Tab)`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: ${props => props['data-state'] === 'active' ? 'bold' : 'normal'};
  color: ${props => props['data-state'] === 'active' ? '#3182ce' : 'inherit'};
  border-bottom: 2px solid ${props => props['data-state'] === 'active' ? '#3182ce' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: #3182ce;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(Tabs.Panel)`
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 0.375rem;
  min-height: 100px;
`;

const TabContainer = styled.div`
  width: 600px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Basic example
export const Basic: Story = {
  render: (args) => (
    <TabContainer>
      <Tabs defaultTab="tab1" {...args}>
        <StyledTabList>
          <StyledTab id="tab1">First Tab</StyledTab>
          <StyledTab id="tab2">Second Tab</StyledTab>
          <StyledTab id="tab3">Third Tab</StyledTab>
        </StyledTabList>
        <Tabs.Panels>
          <StyledTabPanel id="tab1">
            <h3>First Tab Content</h3>
            <p>This is the content for the first tab.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab2">
            <h3>Second Tab Content</h3>
            <p>This is the content for the second tab.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab3">
            <h3>Third Tab Content</h3>
            <p>This is the content for the third tab.</p>
          </StyledTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  ),
};

// With disabled tab
export const WithDisabledTab: Story = {
  render: (args) => (
    <TabContainer>
      <Tabs defaultTab="tab1" {...args}>
        <StyledTabList>
          <StyledTab id="tab1">Active Tab</StyledTab>
          <StyledTab id="tab2" disabled>Disabled Tab</StyledTab>
          <StyledTab id="tab3">Regular Tab</StyledTab>
        </StyledTabList>
        <Tabs.Panels>
          <StyledTabPanel id="tab1">
            <h3>Active Tab Content</h3>
            <p>This tab is active by default.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab2">
            <h3>Disabled Tab Content</h3>
            <p>This content should not be accessible via the disabled tab.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab3">
            <h3>Regular Tab Content</h3>
            <p>This is a regular tab that can be activated.</p>
          </StyledTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  ),
};

// Vertical tabs
const VerticalTabsContainer = styled(Tabs)`
  display: flex;
  width: 600px;
  min-height: 300px;
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
  font-weight: ${props => props['data-state'] === 'active' ? 'bold' : 'normal'};
  color: ${props => props['data-state'] === 'active' ? '#3182ce' : 'inherit'};
  border-right: 2px solid ${props => props['data-state'] === 'active' ? '#3182ce' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #f7fafc;
    color: #3182ce;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
`;

const VerticalTabPanels = styled(Tabs.Panels)`
  flex: 1;
  padding-left: 1rem;
`;

const VerticalTabPanel = styled(Tabs.Panel)`
  height: 100%;
  padding: 1rem;
`;

export const VerticalTabs: Story = {
  render: (args) => (
    <TabContainer>
      <VerticalTabsContainer orientation="vertical" {...args}>
        <VerticalTabList>
          <VerticalTab id="dashboard">Dashboard</VerticalTab>
          <VerticalTab id="profile">Profile</VerticalTab>
          <VerticalTab id="settings">Settings</VerticalTab>
          <VerticalTab id="help">Help & Support</VerticalTab>
        </VerticalTabList>
        <VerticalTabPanels>
          <VerticalTabPanel id="dashboard">
            <h3>Dashboard</h3>
            <p>View your dashboard statistics and analytics.</p>
          </VerticalTabPanel>
          <VerticalTabPanel id="profile">
            <h3>Profile</h3>
            <p>Manage your user profile and preferences.</p>
          </VerticalTabPanel>
          <VerticalTabPanel id="settings">
            <h3>Settings</h3>
            <p>Configure application settings and options.</p>
          </VerticalTabPanel>
          <VerticalTabPanel id="help">
            <h3>Help & Support</h3>
            <p>Get help and support for using the application.</p>
          </VerticalTabPanel>
        </VerticalTabPanels>
      </VerticalTabsContainer>
    </TabContainer>
  ),
};

// Controlled example
const ControlledExample = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <TabContainer>
      <div style={{ marginBottom: '1rem' }}>
        <p>Current active tab: <strong>{activeTab}</strong></p>
        <div>
          <button onClick={() => setActiveTab('tab1')} style={{ marginRight: '0.5rem' }}>
            Activate Tab 1
          </button>
          <button onClick={() => setActiveTab('tab2')} style={{ marginRight: '0.5rem' }}>
            Activate Tab 2
          </button>
          <button onClick={() => setActiveTab('tab3')}>
            Activate Tab 3
          </button>
        </div>
      </div>
      
      <Tabs 
        activeTab={activeTab} 
        onChange={(tabId) => {
          console.log(`Tab changed to ${tabId}`);
          setActiveTab(tabId);
        }}
      >
        <StyledTabList>
          <StyledTab id="tab1">First Tab</StyledTab>
          <StyledTab id="tab2">Second Tab</StyledTab>
          <StyledTab id="tab3">Third Tab</StyledTab>
        </StyledTabList>
        <Tabs.Panels>
          <StyledTabPanel id="tab1">
            <h3>First Tab Content</h3>
            <p>This is controlled content for the first tab.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab2">
            <h3>Second Tab Content</h3>
            <p>This is controlled content for the second tab.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab3">
            <h3>Third Tab Content</h3>
            <p>This is controlled content for the third tab.</p>
          </StyledTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Custom styled tabs
const ModernTabList = styled(Tabs.List)`
  display: flex;
  background-color: #f1f5f9;
  padding: 0.5rem;
  border-radius: 0.5rem;
  gap: 0.5rem;
`;

const ModernTab = styled(Tabs.Tab)`
  padding: 0.75rem 1.25rem;
  border: none;
  background: ${props => props['data-state'] === 'active' ? 'white' : 'transparent'};
  color: ${props => props['data-state'] === 'active' ? '#1e40af' : '#64748b'};
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props['data-state'] === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
  
  &:hover:not(:disabled) {
    background: ${props => props['data-state'] === 'active' ? 'white' : '#e2e8f0'};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ModernTabPanel = styled(Tabs.Panel)`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-top: 1rem;
  min-height: 150px;
`;

export const CustomStyled: Story = {
  render: (args) => (
    <TabContainer>
      <Tabs defaultTab="tab1" {...args}>
        <ModernTabList>
          <ModernTab id="tab1">Features</ModernTab>
          <ModernTab id="tab2">Specifications</ModernTab>
          <ModernTab id="tab3">Reviews</ModernTab>
        </ModernTabList>
        <Tabs.Panels>
          <ModernTabPanel id="tab1">
            <h3>Product Features</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Durable construction</li>
              <li>Modern design</li>
              <li>Easy to use</li>
            </ul>
          </ModernTabPanel>
          <ModernTabPanel id="tab2">
            <h3>Technical Specifications</h3>
            <ul>
              <li>Dimensions: 10" x 8" x 2"</li>
              <li>Weight: 2.5 lbs</li>
              <li>Material: Aircraft-grade aluminum</li>
              <li>Battery life: 12 hours</li>
            </ul>
          </ModernTabPanel>
          <ModernTabPanel id="tab3">
            <h3>Customer Reviews</h3>
            <p>Average rating: ★★★★☆ (4.2/5)</p>
            <p>"Great product, highly recommended!" - Jane D.</p>
            <p>"Works exactly as described." - John S.</p>
          </ModernTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  ),
};

// Manual activation example
export const ManualActivation: Story = {
  render: (args) => (
    <TabContainer>
      <Tabs defaultTab="tab1" manual={true} {...args}>
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Manual Activation:</strong> Tabs only activate on click, not on arrow key navigation</p>
        </div>
        <StyledTabList>
          <StyledTab id="tab1">First Tab</StyledTab>
          <StyledTab id="tab2">Second Tab</StyledTab>
          <StyledTab id="tab3">Third Tab</StyledTab>
        </StyledTabList>
        <Tabs.Panels>
          <StyledTabPanel id="tab1">
            <h3>First Tab Content</h3>
            <p>This tab uses manual activation. Try using arrow keys to navigate between tabs.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab2">
            <h3>Second Tab Content</h3>
            <p>The tab will only change when you click on it, not when you navigate with arrow keys.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab3">
            <h3>Third Tab Content</h3>
            <p>This demonstrates a more controlled tab interaction pattern.</p>
          </StyledTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  ),
};

// Activate on focus example
export const ActivateOnFocus: Story = {
  render: (args) => (
    <TabContainer>
      <Tabs defaultTab="tab1" activateOnFocus={true} {...args}>
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Activate on Focus:</strong> Tabs activate as soon as they receive focus</p>
        </div>
        <StyledTabList>
          <StyledTab id="tab1">First Tab</StyledTab>
          <StyledTab id="tab2">Second Tab</StyledTab>
          <StyledTab id="tab3">Third Tab</StyledTab>
        </StyledTabList>
        <Tabs.Panels>
          <StyledTabPanel id="tab1">
            <h3>First Tab Content</h3>
            <p>This tab uses activate-on-focus behavior. Try using arrow keys to navigate between tabs.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab2">
            <h3>Second Tab Content</h3>
            <p>The tab will change as soon as you navigate to it with arrow keys.</p>
          </StyledTabPanel>
          <StyledTabPanel id="tab3">
            <h3>Third Tab Content</h3>
            <p>This demonstrates a more immediate tab interaction pattern.</p>
          </StyledTabPanel>
        </Tabs.Panels>
      </Tabs>
    </TabContainer>
  ),
};
