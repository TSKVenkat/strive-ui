import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Badge, BadgeProps } from './Badge';
import { Box } from '../Box';

export default {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['solid', 'outline', 'subtle'] },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    color: {
      control: { type: 'select', options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'] },
    },
    rounded: {
      control: 'boolean',
    },
  },
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Badge',
  variant: 'solid',
  size: 'md',
  color: 'primary',
  rounded: false,
};

export const Solid = Template.bind({});
Solid.args = {
  children: 'Solid',
  variant: 'solid',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline',
  variant: 'outline',
};

export const Subtle = Template.bind({});
Subtle.args = {
  children: 'Subtle',
  variant: 'subtle',
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small',
  size: 'sm',
};

export const Medium = Template.bind({});
Medium.args = {
  children: 'Medium',
  size: 'md',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large',
  size: 'lg',
};

export const Rounded = Template.bind({});
Rounded.args = {
  children: 'Rounded',
  rounded: true,
};

export const Colors: Story = () => (
  <Box display="flex" flexWrap="wrap" gap={2}>
    <Badge color="primary">Primary</Badge>
    <Badge color="success">Success</Badge>
    <Badge color="warning">Warning</Badge>
    <Badge color="error">Error</Badge>
    <Badge color="info">Info</Badge>
    <Badge color="neutral">Neutral</Badge>
  </Box>
);

export const Variants: Story = () => (
  <Box display="flex" flexDirection="column" gap={3}>
    <Box display="flex" flexWrap="wrap" gap={2}>
      <Badge variant="solid" color="primary">Solid Primary</Badge>
      <Badge variant="solid" color="success">Solid Success</Badge>
      <Badge variant="solid" color="warning">Solid Warning</Badge>
      <Badge variant="solid" color="error">Solid Error</Badge>
      <Badge variant="solid" color="info">Solid Info</Badge>
      <Badge variant="solid" color="neutral">Solid Neutral</Badge>
    </Box>
    <Box display="flex" flexWrap="wrap" gap={2}>
      <Badge variant="outline" color="primary">Outline Primary</Badge>
      <Badge variant="outline" color="success">Outline Success</Badge>
      <Badge variant="outline" color="warning">Outline Warning</Badge>
      <Badge variant="outline" color="error">Outline Error</Badge>
      <Badge variant="outline" color="info">Outline Info</Badge>
      <Badge variant="outline" color="neutral">Outline Neutral</Badge>
    </Box>
    <Box display="flex" flexWrap="wrap" gap={2}>
      <Badge variant="subtle" color="primary">Subtle Primary</Badge>
      <Badge variant="subtle" color="success">Subtle Success</Badge>
      <Badge variant="subtle" color="warning">Subtle Warning</Badge>
      <Badge variant="subtle" color="error">Subtle Error</Badge>
      <Badge variant="subtle" color="info">Subtle Info</Badge>
      <Badge variant="subtle" color="neutral">Subtle Neutral</Badge>
    </Box>
  </Box>
);

export const WithIcons: Story = () => (
  <Box display="flex" flexWrap="wrap" gap={2}>
    <Badge color="success">
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Success
      </span>
    </Badge>
    <Badge color="warning">
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Warning
      </span>
    </Badge>
    <Badge color="error">
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Error
      </span>
    </Badge>
  </Box>
);
