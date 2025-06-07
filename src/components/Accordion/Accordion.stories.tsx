import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Accordion, AccordionProps } from './Accordion';
import styled from 'styled-components';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: 'Accordion component for displaying collapsible content panels.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select', options: ['default', 'bordered', 'filled'] },
    },
    allowMultiple: {
      control: 'boolean',
    },
  }
} as Meta;

export const Basic = () => (
  <Accordion>
    <Accordion.Item id="item1">
      <Accordion.Header>What is Pulse UI?</Accordion.Header>
      <Accordion.Panel>
        <p>Pulse UI is a modern React component library designed to help developers build beautiful and accessible user interfaces with ease.</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item2">
      <Accordion.Header>How do I install Pulse UI?</Accordion.Header>
      <Accordion.Panel>
        <p>You can install Pulse UI using npm or yarn:</p>
        <pre>npm install @pulseui/core</pre>
        <p>or</p>
        <pre>yarn add @pulseui/core</pre>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item3">
      <Accordion.Header>Is Pulse UI accessible?</Accordion.Header>
      <Accordion.Panel>
        <p>Yes! Pulse UI is built with accessibility in mind. All components follow WAI-ARIA guidelines and are thoroughly tested for keyboard navigation, screen reader support, and other accessibility requirements.</p>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Default</h3>
      <Accordion variant="default">
        <Accordion.Item id="default1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 1</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="default2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 2</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
    
    <div>
      <h3>Bordered</h3>
      <Accordion variant="bordered">
        <Accordion.Item id="bordered1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 1</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="bordered2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 2</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
    
    <div>
      <h3>Filled</h3>
      <Accordion variant="filled">
        <Accordion.Item id="filled1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 1</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="filled2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 2</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  </div>
);

export const AllowMultiple = () => (
  <Accordion allowMultiple defaultExpandedItems={['item1']}>
    <Accordion.Item id="item1">
      <Accordion.Header>Section 1</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 1</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item2">
      <Accordion.Header>Section 2</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 2</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item3">
      <Accordion.Header>Section 3</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 3</p>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);

export const DefaultExpanded = () => (
  <Accordion defaultExpandedItems={['item2']}>
    <Accordion.Item id="item1">
      <Accordion.Header>Section 1</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 1</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item2">
      <Accordion.Header>Section 2 (Default Expanded)</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 2</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item3">
      <Accordion.Header>Section 3</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 3</p>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);

export const Controlled = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['item1']);
  
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setExpandedItems(['item1'])}>Expand Item 1</button>
        <button onClick={() => setExpandedItems(['item2'])} style={{ marginLeft: '0.5rem' }}>Expand Item 2</button>
        <button onClick={() => setExpandedItems(['item3'])} style={{ marginLeft: '0.5rem' }}>Expand Item 3</button>
        <button onClick={() => setExpandedItems([])} style={{ marginLeft: '0.5rem' }}>Collapse All</button>
      </div>
      
      <Accordion 
        expandedItems={expandedItems}
        onChange={(newExpandedItems) => {
          console.log('Expanded items:', newExpandedItems);
          setExpandedItems(newExpandedItems);
        }}
      >
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 1</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 2</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item3">
          <Accordion.Header>Section 3</Accordion.Header>
          <Accordion.Panel>
            <p>Content for section 3</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export const WithDisabledItem = () => (
  <Accordion>
    <Accordion.Item id="item1">
      <Accordion.Header>Section 1</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 1</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item2" isDisabled>
      <Accordion.Header>Section 2 (Disabled)</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 2</p>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item3">
      <Accordion.Header>Section 3</Accordion.Header>
      <Accordion.Panel>
        <p>Content for section 3</p>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);

const RichContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  p {
    margin: 0;
  }
`;

export const WithRichContent = () => (
  <Accordion variant="bordered">
    <Accordion.Item id="item1">
      <Accordion.Header>Product Information</Accordion.Header>
      <Accordion.Panel>
        <RichContent>
          <h4>Premium Wireless Headphones</h4>
          <p>Experience crystal-clear audio with our premium wireless headphones. Featuring noise cancellation technology and long-lasting battery life.</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>Price:</strong> $199.99
            </div>
            <div>
              <strong>Rating:</strong> ★★★★★ (4.8/5)
            </div>
          </div>
          <button style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', backgroundColor: '#1890FF', color: 'white', border: 'none', borderRadius: '4px' }}>
            Add to Cart
          </button>
        </RichContent>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item2">
      <Accordion.Header>Specifications</Accordion.Header>
      <Accordion.Panel>
        <RichContent>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}><strong>Battery Life</strong></td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>Up to 30 hours</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}><strong>Connectivity</strong></td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>Bluetooth 5.0</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}><strong>Weight</strong></td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>250g</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}><strong>Charging</strong></td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>USB-C</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}><strong>Colors</strong></td>
                <td style={{ padding: '0.5rem' }}>Black, White, Blue</td>
              </tr>
            </tbody>
          </table>
        </RichContent>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item id="item3">
      <Accordion.Header>Customer Reviews</Accordion.Header>
      <Accordion.Panel>
        <RichContent>
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>John D.</strong>
              <span>★★★★★</span>
            </div>
            <p>These headphones are amazing! The sound quality is exceptional and the noise cancellation works perfectly.</p>
          </div>
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Sarah M.</strong>
              <span>★★★★☆</span>
            </div>
            <p>Great headphones overall. Battery life is impressive, but they're a bit heavy for long listening sessions.</p>
          </div>
          <div style={{ padding: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Michael T.</strong>
              <span>★★★★★</span>
            </div>
            <p>Best headphones I've ever owned. The sound is crisp and clear, and they're very comfortable.</p>
          </div>
        </RichContent>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);
