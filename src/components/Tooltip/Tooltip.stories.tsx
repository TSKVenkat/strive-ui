import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Tooltip, TooltipProps } from './Tooltip';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styled from 'styled-components';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: 'Tooltips display informative text when users hover over, focus on, or tap an element.'
      }
    }
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'The content to display in the tooltip',
    },
    placement: {
      control: { 
        type: 'select', 
        options: [
          'top', 'top-start', 'top-end',
          'right', 'right-start', 'right-end',
          'bottom', 'bottom-start', 'bottom-end',
          'left', 'left-start', 'left-end'
        ] 
      },
      description: 'The placement of the tooltip relative to the trigger element',
    },
    trigger: {
      control: { 
        type: 'select', 
        options: ['hover', 'click', 'focus', 'manual'] 
      },
      description: 'The event that triggers the tooltip',
    },
    hasArrow: {
      control: 'boolean',
      description: 'Whether to show an arrow pointing to the trigger element',
    },
    followCursor: {
      control: 'boolean',
      description: 'Whether the tooltip should follow the cursor',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'The size of the tooltip',
    },
    variant: {
      control: { type: 'select', options: ['light', 'dark', 'colored'] },
      description: 'The variant of the tooltip',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the tooltip should be interactive (can be hovered/clicked)',
    },
    animation: {
      control: { type: 'select', options: ['fade', 'scale', 'shift', 'none'] },
      description: 'Animation style for the tooltip',
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in ms',
    },
  },
} as Meta;

const Template: Story<TooltipProps> = (args) => (
  <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  content: 'This is a tooltip',
  placement: 'top',
  hasArrow: true,
  size: 'md',
  variant: 'dark',
  animation: 'shift',
};

export const Placements = () => (
  <Grid>
    <PlacementContainer>
      <Tooltip content="Top Start" placement="top-start">
        <Button variant="secondary" size="sm">Top Start</Button>
      </Tooltip>
      <Tooltip content="Top" placement="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Top End" placement="top-end">
        <Button variant="secondary" size="sm">Top End</Button>
      </Tooltip>
    </PlacementContainer>
    
    <PlacementContainer>
      <Tooltip content="Left Start" placement="left-start">
        <Button variant="secondary" size="sm">Left Start</Button>
      </Tooltip>
      <div style={{ width: '120px' }}></div>
      <Tooltip content="Right Start" placement="right-start">
        <Button variant="secondary" size="sm">Right Start</Button>
      </Tooltip>
    </PlacementContainer>
    
    <PlacementContainer>
      <Tooltip content="Left" placement="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Tooltip>
      <div style={{ width: '120px' }}></div>
      <Tooltip content="Right" placement="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
    </PlacementContainer>
    
    <PlacementContainer>
      <Tooltip content="Left End" placement="left-end">
        <Button variant="secondary" size="sm">Left End</Button>
      </Tooltip>
      <div style={{ width: '120px' }}></div>
      <Tooltip content="Right End" placement="right-end">
        <Button variant="secondary" size="sm">Right End</Button>
      </Tooltip>
    </PlacementContainer>
    
    <PlacementContainer>
      <Tooltip content="Bottom Start" placement="bottom-start">
        <Button variant="secondary" size="sm">Bottom Start</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Bottom End" placement="bottom-end">
        <Button variant="secondary" size="sm">Bottom End</Button>
      </Tooltip>
    </PlacementContainer>
  </Grid>
);

export const Variants = () => (
  <Grid>
    <Tooltip content="Light variant tooltip" variant="light">
      <Button variant="secondary">Light</Button>
    </Tooltip>
    
    <Tooltip content="Dark variant tooltip" variant="dark">
      <Button variant="secondary">Dark</Button>
    </Tooltip>
    
    <Tooltip content="Colored variant tooltip" variant="colored">
      <Button variant="secondary">Colored</Button>
    </Tooltip>
  </Grid>
);

export const Sizes = () => (
  <Grid>
    <Tooltip content="Small size tooltip" size="sm">
      <Button>Small</Button>
    </Tooltip>
    
    <Tooltip content="Medium size tooltip" size="md">
      <Button>Medium</Button>
    </Tooltip>
    
    <Tooltip content="Large size tooltip" size="lg">
      <Button>Large</Button>
    </Tooltip>
  </Grid>
);

export const Triggers = () => (
  <Grid>
    <Tooltip content="Hover to see me" trigger="hover">
      <Button variant="secondary">Hover</Button>
    </Tooltip>
    
    <Tooltip content="Click to see me" trigger="click">
      <Button variant="secondary">Click</Button>
    </Tooltip>
    
    <Tooltip content="Focus to see me" trigger="focus">
      <Button variant="secondary">Focus</Button>
    </Tooltip>
    
    <Tooltip content="Multiple triggers" trigger={['hover', 'focus']}>
      <Button variant="secondary">Multiple</Button>
    </Tooltip>
  </Grid>
);

export const WithoutArrow = () => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
    <Tooltip content="Tooltip without arrow" hasArrow={false}>
      <Button>No Arrow</Button>
    </Tooltip>
  </div>
);

export const FollowCursor = () => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
    <Tooltip content="Following your cursor" followCursor>
      <Button style={{ padding: '10px 50px' }}>Move cursor over me</Button>
    </Tooltip>
  </div>
);

export const Animations = () => (
  <Grid>
    <Tooltip content="Fade animation" animation="fade" animationDuration={300}>
      <Button variant="secondary">Fade</Button>
    </Tooltip>
    
    <Tooltip content="Scale animation" animation="scale" animationDuration={300}>
      <Button variant="secondary">Scale</Button>
    </Tooltip>
    
    <Tooltip content="Shift animation" animation="shift" animationDuration={300}>
      <Button variant="secondary">Shift</Button>
    </Tooltip>
    
    <Tooltip content="No animation" animation="none">
      <Button variant="secondary">None</Button>
    </Tooltip>
  </Grid>
);

export const Interactive = () => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
    <Tooltip 
      content={
        <div>
          <p>This tooltip is interactive. You can hover over it and click links.</p>
          <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Click me</a>
        </div>
      } 
      interactive
    >
      <Button>Interactive Tooltip</Button>
    </Tooltip>
  </div>
);

export const RichContent = () => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
    <Tooltip 
      content={
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Rich Content</h4>
          <p style={{ margin: '0 0 8px 0' }}>Tooltips can contain rich content including:</p>
          <ul style={{ margin: '0', paddingLeft: '16px' }}>
            <li>Formatted text</li>
            <li>Icons and images</li>
            <li>Custom components</li>
          </ul>
        </div>
      } 
      maxWidth={250}
      interactive
      size="lg"
    >
      <Button>Rich Content</Button>
    </Tooltip>
  </div>
);

export const WithIcons = () => (
  <Grid>
    <Tooltip content="Information">
      <span style={{ cursor: 'pointer' }}>
        <Icon name="Info" size="lg" />
      </span>
    </Tooltip>
    
    <Tooltip content="Help">
      <span style={{ cursor: 'pointer' }}>
        <Icon name="Info" size="lg" />
      </span>
    </Tooltip>
    
    <Tooltip content="Warning">
      <span style={{ cursor: 'pointer' }}>
        <Icon name="AlertTriangle" size="lg" />
      </span>
    </Tooltip>
  </Grid>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Tooltip' : 'Show Tooltip'}
      </Button>
      
      <Tooltip 
        content="This tooltip is controlled programmatically" 
        isOpen={isOpen}
        onOpen={() => console.log('Tooltip opened')}
        onClose={() => console.log('Tooltip closed')}
      >
        <Button variant="secondary">Controlled Tooltip</Button>
      </Tooltip>
    </div>
  );
};

// Styled components for the stories
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 50px;
  justify-content: center;
`;

const PlacementContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;
