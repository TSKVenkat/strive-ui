import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Avatar, AvatarProps } from './Avatar';
import styled from 'styled-components';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: 'Avatar component for displaying user profile images with fallback to initials.'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    },
    variant: {
      control: { type: 'select', options: ['circle', 'square', 'rounded'] },
    },
    status: {
      control: { type: 'select', options: ['none', 'online', 'offline', 'away', 'busy'] },
    },
    bgColor: {
      control: 'color',
    },
  }
} as Meta;

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const WithImage = Template.bind({});
WithImage.args = {
  src: 'https://i.pravatar.cc/300',
  alt: 'User Avatar',
  size: 'md',
  variant: 'circle',
};

export const WithInitials = Template.bind({});
WithInitials.args = {
  name: 'John Doe',
  size: 'md',
  variant: 'circle',
};

export const WithFallback = Template.bind({});
WithFallback.args = {
  src: 'https://invalid-image-url.com/avatar.jpg',
  size: 'md',
  variant: 'circle',
};

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar size="xs" name="XS" />
    <Avatar size="sm" name="SM" />
    <Avatar size="md" name="MD" />
    <Avatar size="lg" name="LG" />
    <Avatar size="xl" name="XL" />
    <Avatar size="2xl" name="2XL" />
  </div>
);

export const Variants = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar variant="circle" name="Circle" />
    <Avatar variant="square" name="Square" />
    <Avatar variant="rounded" name="Rounded" />
  </div>
);

export const StatusIndicators = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar status="online" name="Online" />
    <Avatar status="offline" name="Offline" />
    <Avatar status="away" name="Away" />
    <Avatar status="busy" name="Busy" />
  </div>
);

export const CustomColors = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar name="John Doe" bgColor="#1890FF" />
    <Avatar name="Jane Smith" bgColor="#52C41A" />
    <Avatar name="Bob Johnson" bgColor="#FAAD14" />
    <Avatar name="Alice Brown" bgColor="#F5222D" />
    <Avatar name="Tom Wilson" bgColor="#722ED1" />
  </div>
);

export const WithCustomContent = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Avatar>
      <span>JD</span>
    </Avatar>
    <Avatar bgColor="#1890FF">
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </Avatar>
    <Avatar bgColor="#52C41A">
      <span>👋</span>
    </Avatar>
  </div>
);

export const Clickable = () => (
  <Avatar 
    name="John Doe" 
    onClick={() => alert('Avatar clicked!')}
    size="lg"
  />
);

export const AvatarGroups = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Default Group</h3>
      <Avatar.Group>
        <Avatar src="https://i.pravatar.cc/300?img=1" name="User 1" />
        <Avatar src="https://i.pravatar.cc/300?img=2" name="User 2" />
        <Avatar src="https://i.pravatar.cc/300?img=3" name="User 3" />
        <Avatar src="https://i.pravatar.cc/300?img=4" name="User 4" />
      </Avatar.Group>
    </div>
    
    <div>
      <h3>With Max (max=3)</h3>
      <Avatar.Group max={3}>
        <Avatar src="https://i.pravatar.cc/300?img=1" name="User 1" />
        <Avatar src="https://i.pravatar.cc/300?img=2" name="User 2" />
        <Avatar src="https://i.pravatar.cc/300?img=3" name="User 3" />
        <Avatar src="https://i.pravatar.cc/300?img=4" name="User 4" />
        <Avatar src="https://i.pravatar.cc/300?img=5" name="User 5" />
      </Avatar.Group>
    </div>
    
    <div>
      <h3>With Custom Spacing</h3>
      <Avatar.Group spacing={-4}>
        <Avatar src="https://i.pravatar.cc/300?img=1" name="User 1" />
        <Avatar src="https://i.pravatar.cc/300?img=2" name="User 2" />
        <Avatar src="https://i.pravatar.cc/300?img=3" name="User 3" />
        <Avatar src="https://i.pravatar.cc/300?img=4" name="User 4" />
      </Avatar.Group>
    </div>
    
    <div>
      <h3>With Different Sizes</h3>
      <Avatar.Group>
        <Avatar size="lg" src="https://i.pravatar.cc/300?img=1" name="User 1" />
        <Avatar size="lg" src="https://i.pravatar.cc/300?img=2" name="User 2" />
        <Avatar size="lg" src="https://i.pravatar.cc/300?img=3" name="User 3" />
        <Avatar size="lg" src="https://i.pravatar.cc/300?img=4" name="User 4" />
      </Avatar.Group>
    </div>
    
    <div>
      <h3>With Initials</h3>
      <Avatar.Group>
        <Avatar name="John Doe" />
        <Avatar name="Jane Smith" />
        <Avatar name="Bob Johnson" />
        <Avatar name="Alice Brown" />
      </Avatar.Group>
    </div>
  </div>
);
