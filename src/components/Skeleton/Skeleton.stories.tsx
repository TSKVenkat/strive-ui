import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Skeleton, SkeletonProps } from './Skeleton';
import styled from 'styled-components';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the skeleton',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton',
    },
    borderRadius: {
      control: 'text',
      description: 'Border radius of the skeleton',
    },
    animate: {
      control: 'boolean',
      description: 'Whether to animate the skeleton',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of lines to display (for text skeletons)',
    },
    lineGap: {
      control: 'text',
      description: 'Gap between lines (for text skeletons)',
    },
    variant: {
      control: { type: 'select', options: ['text', 'circular', 'rectangular'] },
      description: 'Variant of the skeleton',
    },
  },
} as Meta;

const Container = styled.div`
  max-width: 600px;
  padding: 20px;
`;

const Template: Story<SkeletonProps> = (args) => (
  <Container>
    <Skeleton {...args} />
  </Container>
);

export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  width: '100%',
  height: '20px',
  animate: true,
  lines: 1,
};

export const MultiLineText = Template.bind({});
MultiLineText.args = {
  variant: 'text',
  width: '100%',
  height: '20px',
  animate: true,
  lines: 3,
  lineGap: '0.75em',
};

export const Circular = Template.bind({});
Circular.args = {
  variant: 'circular',
  width: '60px',
  height: '60px',
  animate: true,
};

export const Rectangular = Template.bind({});
Rectangular.args = {
  variant: 'rectangular',
  width: '100%',
  height: '200px',
  borderRadius: '8px',
  animate: true,
};

export const CardSkeleton = () => (
  <Container>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Skeleton variant="rectangular" height="200px" />
      <Skeleton variant="text" width="70%" height="24px" />
      <Skeleton variant="text" width="100%" height="16px" lines={2} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <Skeleton variant="rectangular" width="80px" height="36px" />
        <Skeleton variant="circular" width="36px" height="36px" />
      </div>
    </div>
  </Container>
);

export const ProfileSkeleton = () => (
  <Container>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Skeleton variant="circular" width="80px" height="80px" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Skeleton variant="text" width="50%" height="24px" />
        <Skeleton variant="text" width="80%" height="16px" />
        <Skeleton variant="text" width="30%" height="16px" />
      </div>
    </div>
  </Container>
);
