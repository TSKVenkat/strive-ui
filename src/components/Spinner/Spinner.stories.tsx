import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Spinner, SpinnerProps } from './Spinner';
import { Box } from '../Box';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    },
    color: {
      control: { type: 'select', options: ['primary', 'success', 'warning', 'error', 'info', 'neutral', 'current'] },
    },
    thickness: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
    speed: {
      control: { type: 'number', min: 0.1, max: 3, step: 0.1 },
    },
    withLabel: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
} as Meta;

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  color: 'primary',
  thickness: 2,
  speed: 0.75,
  withLabel: false,
  label: 'Loading...',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  size: 'md',
  color: 'primary',
  thickness: 2,
  speed: 0.75,
  withLabel: true,
  label: 'Loading...',
};

export const Sizes: Story = () => (
  <Box display="flex" alignItems="center" gap={4}>
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </Box>
);

export const Colors: Story = () => (
  <Box display="flex" alignItems="center" gap={4}>
    <Spinner color="primary" />
    <Spinner color="success" />
    <Spinner color="warning" />
    <Spinner color="error" />
    <Spinner color="info" />
    <Spinner color="neutral" />
  </Box>
);

export const Thicknesses: Story = () => (
  <Box display="flex" alignItems="center" gap={4}>
    <Spinner thickness={1} />
    <Spinner thickness={2} />
    <Spinner thickness={3} />
    <Spinner thickness={4} />
    <Spinner thickness={6} />
  </Box>
);

export const Speeds: Story = () => (
  <Box display="flex" alignItems="center" gap={4}>
    <Spinner speed={0.25} />
    <Spinner speed={0.5} />
    <Spinner speed={0.75} />
    <Spinner speed={1} />
    <Spinner speed={1.5} />
  </Box>
);

export const WithCustomLabel: Story = () => (
  <Box display="flex" flexDirection="column" gap={4}>
    <Spinner withLabel label="Please wait..." />
    <Spinner withLabel label="Fetching data..." color="info" />
    <Spinner withLabel label="Processing..." color="success" />
  </Box>
);

export const InContext: Story = () => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    padding={4}
    backgroundColor="#f5f5f5"
    borderRadius="lg"
    maxWidth="400px"
  >
    <Box as="h3" margin={0}>Loading Data</Box>
    <Box display="flex" justifyContent="center" padding={6}>
      <Spinner withLabel label="Fetching results..." />
    </Box>
    <Box display="flex" justifyContent="flex-end">
      <button
        style={{
          padding: '8px 16px',
          backgroundColor: '#e0e0e0',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </Box>
  </Box>
);
