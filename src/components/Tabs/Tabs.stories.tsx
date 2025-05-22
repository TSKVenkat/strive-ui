import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Tabs, TabsProps } from './Tabs';
import styled from 'styled-components';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: 'Tabs component for organizing content into separate views.'
      }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
    },
    variant: {
      control: { type: 'select', options: ['default', 'contained', 'pills'] },
    },
    fullWidth: {
      control: 'boolean',
    },
    centered: {
      control: 'boolean',
    },
  }
} as Meta;

const TabContent = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: 150px;
`;

export const Basic = () => (
  <Tabs defaultTab="tab1">
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="tab1">
        <TabContent>
          <h3>Content 1</h3>
          <p>This is the content for Tab 1</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <TabContent>
          <h3>Content 2</h3>
          <p>This is the content for Tab 2</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <TabContent>
          <h3>Content 3</h3>
          <p>This is the content for Tab 3</p>
        </TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Default</h3>
      <Tabs defaultTab="tab1" variant="default">
        <Tabs.List>
          <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="tab1">
            <TabContent>Content for Tab 1</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <TabContent>Content for Tab 2</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <TabContent>Content for Tab 3</TabContent>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
    
    <div>
      <h3>Contained</h3>
      <Tabs defaultTab="tab1" variant="contained">
        <Tabs.List>
          <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="tab1">
            <TabContent>Content for Tab 1</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <TabContent>Content for Tab 2</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <TabContent>Content for Tab 3</TabContent>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
    
    <div>
      <h3>Pills</h3>
      <Tabs defaultTab="tab1" variant="pills">
        <Tabs.List>
          <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="tab1">
            <TabContent>Content for Tab 1</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <TabContent>Content for Tab 2</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <TabContent>Content for Tab 3</TabContent>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  </div>
);

export const Vertical = () => (
  <Tabs defaultTab="tab1" orientation="vertical">
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="tab1">
        <TabContent>
          <h3>Content 1</h3>
          <p>This is the content for Tab 1</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <TabContent>
          <h3>Content 2</h3>
          <p>This is the content for Tab 2</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <TabContent>
          <h3>Content 3</h3>
          <p>This is the content for Tab 3</p>
        </TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);

export const WithIcons = () => (
  <Tabs defaultTab="home">
    <Tabs.List>
      <Tabs.Tab 
        id="home" 
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Home
      </Tabs.Tab>
      <Tabs.Tab 
        id="profile" 
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Profile
      </Tabs.Tab>
      <Tabs.Tab 
        id="settings" 
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Settings
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="home">
        <TabContent>
          <h3>Home</h3>
          <p>Welcome to the home tab!</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="profile">
        <TabContent>
          <h3>Profile</h3>
          <p>This is your profile information.</p>
        </TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="settings">
        <TabContent>
          <h3>Settings</h3>
          <p>Adjust your account settings here.</p>
        </TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);

export const FullWidth = () => (
  <Tabs defaultTab="tab1" fullWidth>
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="tab1">
        <TabContent>Content for Tab 1</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <TabContent>Content for Tab 2</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <TabContent>Content for Tab 3</TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);

export const Centered = () => (
  <Tabs defaultTab="tab1" centered>
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="tab1">
        <TabContent>Content for Tab 1</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <TabContent>Content for Tab 2</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <TabContent>Content for Tab 3</TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);

export const Controlled = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('tab1')}>Activate Tab 1</button>
        <button onClick={() => setActiveTab('tab2')} style={{ marginLeft: '0.5rem' }}>Activate Tab 2</button>
        <button onClick={() => setActiveTab('tab3')} style={{ marginLeft: '0.5rem' }}>Activate Tab 3</button>
      </div>
      
      <Tabs 
        activeTab={activeTab} 
        onChange={(tabId) => {
          console.log(`Tab changed to: ${tabId}`);
          setActiveTab(tabId);
        }}
      >
        <Tabs.List>
          <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="tab1">
            <TabContent>Content for Tab 1</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <TabContent>Content for Tab 2</TabContent>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <TabContent>Content for Tab 3</TabContent>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};

export const WithDisabledTab = () => (
  <Tabs defaultTab="tab1">
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2" disabled>Tab 2 (Disabled)</Tabs.Tab>
      <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panels>
      <Tabs.Panel id="tab1">
        <TabContent>Content for Tab 1</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <TabContent>Content for Tab 2</TabContent>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <TabContent>Content for Tab 3</TabContent>
      </Tabs.Panel>
    </Tabs.Panels>
  </Tabs>
);
